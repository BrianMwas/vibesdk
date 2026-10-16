import { AssetManifest, CloudflareApiError, CloudflareApiResponse, CloudflareCustomHostname, UploadAssetSession, WorkerMetadata } from '../types';
import { getMimeType } from '../utils/index';

/** The API's error envelope, or nothing when the body is not JSON (a gateway error page, say), so the raw text is reported instead. */
function parseApiError(body: string): { errors?: { code?: number; message?: string }[] } {
	try {
		return JSON.parse(body) as { errors?: { code?: number; message?: string }[] };
	} catch {
		return {};
	}
}

/**
 * Cloudflare API client for Worker deployment operations
 */
export class CloudflareAPI {
	private readonly accountId: string;
	private readonly apiToken: string;
	private readonly zoneId?: string;
	private readonly baseUrl = 'https://api.cloudflare.com/client/v4';

	constructor(accountId: string, apiToken: string, zoneId?: string) {
		this.accountId = accountId;
		this.apiToken = apiToken;
		this.zoneId = zoneId;
	}

	/** Guards Custom Hostname operations, which require a zone id the caller didn't set up for plain Worker deploys. */
	private requireZoneId(): string {
		if (!this.zoneId) {
			throw new Error('CloudflareAPI: zoneId is required for Custom Hostname operations');
		}
		return this.zoneId;
	}

	/**
	 * Generate request headers with authorization
	 */
	private getHeaders(contentType?: string): Record<string, string> {
		const headers: Record<string, string> = {
			Authorization: `Bearer ${this.apiToken}`,
		};
		if (contentType) {
			headers['Content-Type'] = contentType;
		}
		return headers;
	}

	/**
	 * Create an asset upload session with Cloudflare
	 * Returns JWT token and list of files that need uploading
	 */
	async createAssetUploadSession(
		scriptName: string,
		manifest: AssetManifest,
		dispatchNamespace?: string,
	): Promise<UploadAssetSession> {
		const url = dispatchNamespace
			? `${this.baseUrl}/accounts/${this.accountId}/workers/dispatch/namespaces/${dispatchNamespace}/scripts/${scriptName}/assets-upload-session`
			: `${this.baseUrl}/accounts/${this.accountId}/workers/scripts/${scriptName}/assets-upload-session`;

		const response = await fetch(url, {
			method: 'POST',
			headers: this.getHeaders('application/json'),
			body: JSON.stringify({ manifest }),
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(
				`Failed to create asset upload session: ${response.status} - ${error}`,
			);
		}

		const data = (await response.json()) as any;
		return data.result;
	}

	/**
	 * Upload a batch of assets to Cloudflare
	 * Returns completion token if this is the last batch
	 */
	async uploadAssetBatch(
		uploadToken: string,
		fileHashesToUpload: string[],
		fileContents: Map<string, Buffer>,
		hashToPath: Map<string, string>,
	): Promise<string | null> {
		const url = `${this.baseUrl}/accounts/${this.accountId}/workers/assets/upload?base64=true`;

		const formData = new FormData();

		// Add each file as base64 string with proper MIME type
		for (const hash of fileHashesToUpload) {
			const content = fileContents.get(hash);
			if (!content) {
				throw new Error(`Content not found for hash: ${hash}`);
			}
			const base64Content = content.toString('base64');

			// Get MIME type based on file path
			const filePath = hashToPath.get(hash);
			const mimeType = filePath
				? getMimeType(filePath)
				: 'application/octet-stream';

			// Create a Blob with the base64 string and proper MIME type
			// This ensures Content-Type is preserved when serving assets
			const blob = new Blob([base64Content], { type: mimeType });
			formData.append(hash, blob, hash);
		}

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${uploadToken}`,
			},
			body: formData,
		});

		if (!response.ok) {
			const error = await response.text();
			throw new Error(
				`Failed to upload assets: ${response.status} - ${error}`,
			);
		}

		// Status 201 indicates all files uploaded, returns completion token
		if (response.status === 201) {
			const data = (await response.json()) as any;
			return data.result?.jwt || null;
		}

		return null;
	}

	/**
	 * Deploy a Worker script to Cloudflare
	 * Includes metadata, bindings, and assets configuration
	 */
	async deployWorker(
		scriptName: string,
		metadata: WorkerMetadata,
		workerContent: string,
		dispatchNamespace?: string,
		additionalModules?: Map<string, string>,
		durableObjectClasses?: string[],
	): Promise<void> {
		const url = dispatchNamespace
			? `${this.baseUrl}/accounts/${this.accountId}/workers/dispatch/namespaces/${dispatchNamespace}/scripts/${scriptName}`
			: `${this.baseUrl}/accounts/${this.accountId}/workers/scripts/${scriptName}`;

		const formData = new FormData();

		// Build complete metadata with Durable Object exports
		const metadataWithExports = { ...metadata };
		if (durableObjectClasses && durableObjectClasses.length > 0) {
			metadataWithExports.exported_handlers = durableObjectClasses;
		}

		// Don't modify worker content - Vite builds already include exports
		// The exported_handlers in metadata is sufficient for the API
		const finalWorkerContent = workerContent;

		formData.append('metadata', JSON.stringify(metadataWithExports));

		// Add main worker script as ES module with DO exports
		const workerBlob = new Blob([finalWorkerContent], {
			type: 'application/javascript+module',
		});
		formData.append('index.js', workerBlob, 'index.js');

		// Add any additional modules (e.g., from Vite build)
		if (additionalModules) {
			for (const [
				moduleName,
				moduleContent,
			] of additionalModules.entries()) {
				const moduleBlob = new Blob([moduleContent], {
					type: 'application/javascript+module',
				});
				formData.append(moduleName, moduleBlob, moduleName);
			}
		}

		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${this.apiToken}`,
			},
			body: formData,
		});

		if (!response.ok) {
			const error = await response.text();
			const errorObj = parseApiError(error);

			// Check if error is about migrations for existing DO classes
			if (errorObj.errors?.[0]?.code === 10074) {
				const errorMessage = errorObj.errors[0].message ?? '';
				const existingClassMatch =
					errorMessage.match(/class '([^']+)'/);
				const existingClass = existingClassMatch
					? existingClassMatch[1]
					: null;

				console.log(
					`\n⚠️  Durable Object class '${existingClass}' already exists`,
				);

				// Filter out the existing class from migrations
				if (metadataWithExports.migrations && existingClass) {
					const migrations = metadataWithExports.migrations;

					// Remove the existing class from new_classes and new_sqlite_classes
					if (migrations.new_classes) {
						migrations.new_classes = migrations.new_classes.filter(
							(c: string) => c !== existingClass,
						);
						if (migrations.new_classes.length === 0)
							delete migrations.new_classes;
					}
					if (migrations.new_sqlite_classes) {
						migrations.new_sqlite_classes =
							migrations.new_sqlite_classes.filter(
								(c: string) => c !== existingClass,
							);
						if (migrations.new_sqlite_classes.length === 0)
							delete migrations.new_sqlite_classes;
					}

					// If no migrations left, remove the field entirely
					if (
						!migrations.new_classes &&
						!migrations.new_sqlite_classes &&
						!migrations.renamed_classes &&
						!migrations.deleted_classes
					) {
						delete metadataWithExports.migrations;
						console.log(
							'📝 All Durable Objects already exist, deploying without migrations',
						);
					} else {
						console.log(
							`📝 Retrying with migrations for new classes only`,
						);
					}
				}

				// Retry deployment with filtered migrations
				const retryFormData = new FormData();
				retryFormData.append(
					'metadata',
					JSON.stringify(metadataWithExports),
				);
				retryFormData.append('index.js', workerBlob, 'index.js');

				if (additionalModules) {
					for (const [
						moduleName,
						moduleContent,
					] of additionalModules.entries()) {
						const moduleBlob = new Blob([moduleContent], {
							type: 'application/javascript+module',
						});
						retryFormData.append(
							moduleName,
							moduleBlob,
							moduleName,
						);
					}
				}

				const retryResponse = await fetch(url, {
					method: 'PUT',
					headers: {
						Authorization: `Bearer ${this.apiToken}`,
					},
					body: retryFormData,
				});

				if (!retryResponse.ok) {
					const retryError = await retryResponse.text();
					const retryErrorObj = parseApiError(retryError);

					// If still failing with same error, recursively handle it
					if (retryErrorObj.errors?.[0]?.code === 10074) {
						// Recursive call to handle multiple existing classes
						return this.deployWorker(
							scriptName,
							metadataWithExports,
							finalWorkerContent,
							dispatchNamespace,
							additionalModules,
							durableObjectClasses,
						);
					}

					throw new Error(
						`Failed to deploy worker: ${retryResponse.status} - ${retryError}`,
					);
				}

				console.log('✅ Successfully deployed');
				return;
			}

			throw new Error(
				`Failed to deploy worker: ${response.status} - ${error}`,
			);
		}

		console.log(`✅ Worker deployed successfully: ${scriptName}`);
	}

	async enableWorkersDev(scriptName: string): Promise<void> {
		const response = await fetch(
			`${this.baseUrl}/accounts/${this.accountId}/workers/scripts/${encodeURIComponent(scriptName)}/subdomain`,
			{
				method: 'POST',
				headers: this.getHeaders('application/json'),
				body: JSON.stringify({ enabled: true }),
			},
		);
		if (!response.ok) {
			throw new Error(`Failed to enable public workers.dev URL: ${response.status} - ${await response.text()}`);
		}
	}

	async getWorkersDevSubdomain(): Promise<string> {
		const response = await fetch(
			`${this.baseUrl}/accounts/${this.accountId}/workers/subdomain`,
			{ headers: this.getHeaders() },
		);
		if (!response.ok) {
			throw new Error(`Failed to resolve workers.dev subdomain: ${response.status} - ${await response.text()}`);
		}
		const data = (await response.json()) as {
			success: boolean;
			result?: { subdomain?: string };
		};
		const subdomain = data.result?.subdomain;
		if (!data.success || !subdomain) {
			throw new Error('workers.dev is not enabled for the selected Cloudflare account');
		}
		return subdomain;
	}

	/**
	 * Test a deployed Worker by making a request to its endpoint
	 */
	async testWorkerEndpoint(workerUrl: string): Promise<void> {
		try {
			const response = await fetch(workerUrl);
			const text = await response.text();
			console.log(`\n📡 Worker Response (${response.status}):`);
			console.log(
				text.substring(0, 200) + (text.length > 200 ? '...' : ''),
			);
		} catch (error) {
			console.error('❌ Failed to test worker endpoint:', error);
		}
	}

	/**
	 * Register a Custom Hostname (Cloudflare for SaaS) on the platform's zone,
	 * with automatic HTTP-validated DV SSL. The hostname becomes verifiable
	 * once its owner points a CNAME at the zone's configured fallback origin.
	 */
	async createCustomHostname(hostname: string): Promise<CloudflareCustomHostname> {
		const zoneId = this.requireZoneId();
		const response = await fetch(`${this.baseUrl}/zones/${zoneId}/custom_hostnames`, {
			method: 'POST',
			headers: this.getHeaders('application/json'),
			body: JSON.stringify({
				hostname,
				ssl: { method: 'http', type: 'dv' },
			}),
		});
		const data = (await response.json()) as CloudflareApiResponse<CloudflareCustomHostname>;
		if (!response.ok || !data.success) {
			throw new CloudflareApiError(
				`Failed to create custom hostname '${hostname}': ${response.status} - ${JSON.stringify(data.errors)}`,
				data.errors,
			);
		}
		return data.result;
	}

	/**
	 * Fetch the live status of a Custom Hostname — the source of truth for
	 * verification/SSL issuance progress.
	 */
	async getCustomHostname(customHostnameId: string): Promise<CloudflareCustomHostname> {
		const zoneId = this.requireZoneId();
		const response = await fetch(
			`${this.baseUrl}/zones/${zoneId}/custom_hostnames/${encodeURIComponent(customHostnameId)}`,
			{ headers: this.getHeaders() },
		);
		const data = (await response.json()) as CloudflareApiResponse<CloudflareCustomHostname>;
		if (!response.ok || !data.success) {
			throw new CloudflareApiError(
				`Failed to fetch custom hostname '${customHostnameId}': ${response.status} - ${JSON.stringify(data.errors)}`,
				data.errors,
			);
		}
		return data.result;
	}

	/**
	 * Delete a Custom Hostname. Idempotent: a 404 (already gone) is treated as
	 * success so detach flows never get stuck on a stale reference.
	 */
	async deleteCustomHostname(customHostnameId: string): Promise<void> {
		const zoneId = this.requireZoneId();
		const response = await fetch(
			`${this.baseUrl}/zones/${zoneId}/custom_hostnames/${encodeURIComponent(customHostnameId)}`,
			{ method: 'DELETE', headers: this.getHeaders() },
		);
		if (!response.ok && response.status !== 404) {
			throw new Error(`Failed to delete custom hostname '${customHostnameId}': ${response.status} - ${await response.text()}`);
		}
	}
}
