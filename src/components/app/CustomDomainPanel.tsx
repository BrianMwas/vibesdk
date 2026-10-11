import { useState } from 'react';
import {
	Badge,
	Button,
	DeleteResource,
	useKumoToastManager,
} from '@cloudflare/kumo';
import { Globe, TrashIcon } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import {
	useAppCustomDomainStatus,
	useDeleteAppCustomDomain,
	useUpdateAppCustomDomain,
} from '@/hooks/use-app';
import type { AppDetailsData } from '@/api-types';

function DnsField({ label, value }: { label: string; value: string }) {
	const { copied, copy } = useCopyToClipboard();
	return (
		<div className="flex items-center justify-between gap-3">
			<div className="min-w-0">
				<p className="text-xs text-kumo-subtle">{label}</p>
				<p className="text-sm font-mono truncate">{value}</p>
			</div>
			<Button
				variant="secondary"
				size="sm"
				onClick={() => void copy(value)}
			>
				{copied ? 'Copied' : 'Copy'}
			</Button>
		</div>
	);
}

interface CustomDomainPanelProps {
	appId: string;
	customDomain: AppDetailsData['customDomain'];
	customDomainStatus: AppDetailsData['customDomainStatus'];
}

export function CustomDomainPanel({
	appId,
	customDomain,
	customDomainStatus,
}: CustomDomainPanelProps) {
	const toast = useKumoToastManager();
	const [domainInput, setDomainInput] = useState('');
	const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
	const [removeError, setRemoveError] = useState<string | undefined>();

	const hasDomain = !!customDomain;

	const { mutateAsync: attachDomain, isPending: isAttaching } =
		useUpdateAppCustomDomain(appId);
	const { data: statusData, isLoading: isStatusLoading } =
		useAppCustomDomainStatus(appId, hasDomain);
	const { mutateAsync: removeDomain, isPending: isRemoving } =
		useDeleteAppCustomDomain(appId);

	const liveApp = statusData?.app;
	const domain = liveApp?.customDomain ?? customDomain;
	const status = liveApp?.customDomainStatus ?? customDomainStatus;
	const error = liveApp?.customDomainError ?? null;
	const dnsInstructions = statusData?.dnsInstructions;

	const handleAttach = async () => {
		const trimmed = domainInput.trim();
		if (!trimmed) return;
		try {
			await attachDomain(trimmed);
			toast.add({
				title: 'Domain registered. Add the DNS record below to verify it.',
				variant: 'success',
			});
			setDomainInput('');
		} catch (err) {
			toast.add({
				title: err instanceof Error ? err.message : 'Failed to attach domain',
				variant: 'error',
			});
		}
	};

	const handleRetry = async () => {
		if (!domain) return;
		try {
			await attachDomain(domain);
			toast.add({ title: 'Retrying domain verification', variant: 'success' });
		} catch (err) {
			toast.add({
				title: err instanceof Error ? err.message : 'Failed to retry',
				variant: 'error',
			});
		}
	};

	const handleRemove = async () => {
		setRemoveError(undefined);
		try {
			await removeDomain();
			toast.add({ title: 'Custom domain removed', variant: 'success' });
			setIsRemoveDialogOpen(false);
		} catch (err) {
			setRemoveError(
				err instanceof Error ? err.message : 'Failed to remove domain',
			);
		}
	};

	if (!domain) {
		return (
			<div className="flex-1 min-h-0 flex items-center justify-center p-6 sm:p-10">
				<div className="w-full max-w-lg grid gap-4">
					<div className="grid gap-1">
						<div className="flex items-center gap-2">
							<span className="h-lh flex items-center shrink-0">
								<span className="rounded-md bg-brand/10 p-1.5">
									<Globe
										className="size-3.5 text-kumo-brand"
										weight="duotone"
									/>
								</span>
							</span>
							<h2 className="text-base font-semibold text-text-primary">
								Custom domain
							</h2>
						</div>
						<p className="text-sm text-kumo-subtle pl-9">
							Point your own domain at this app. Subdomains only
							(e.g. app.example.com) — root/apex domains aren't
							supported yet.
						</p>
					</div>
					<div className="flex gap-2">
						<Input
							placeholder="app.example.com"
							value={domainInput}
							onChange={(e) => setDomainInput(e.target.value)}
						/>
						<Button
							variant="primary"
							onClick={() => void handleAttach()}
							loading={isAttaching}
							disabled={!domainInput.trim()}
						>
							Attach domain
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex-1 min-h-0 overflow-y-auto p-6 sm:p-10">
			<div className="w-full max-w-lg mx-auto grid gap-5">
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 min-w-0">
						{status === 'active' ? (
							<a
								href={`https://${domain}`}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm font-medium text-kumo-brand truncate hover:underline"
							>
								{domain}
							</a>
						) : (
							<span className="text-sm font-medium text-text-primary truncate">
								{domain}
							</span>
						)}
						<Badge
							variant={
								status === 'active'
									? 'success'
									: status === 'failed'
										? 'error'
										: 'warning'
							}
						>
							{status === 'active'
								? 'Verified'
								: status === 'failed'
									? 'Verification failed'
									: 'Verifying'}
						</Badge>
					</div>
					<Button
						variant="secondary"
						size="sm"
						icon={<TrashIcon className="size-3.5" />}
						onClick={() => setIsRemoveDialogOpen(true)}
					>
						Remove
					</Button>
				</div>

				{status === 'failed' && error && (
					<div className="rounded-lg bg-kumo-danger-tint px-4 py-3 text-sm text-kumo-danger">
						{error}
					</div>
				)}

				{status !== 'active' && (
					<div className="grid gap-2">
						<p className="text-sm text-kumo-subtle">
							Add this CNAME record in your domain&apos;s DNS
							settings. It may take a few minutes after the
							record is added for your SSL certificate to be
							issued.
						</p>
						{dnsInstructions ? (
							<div className="grid gap-3 rounded-lg ring ring-kumo-line p-4">
								<DnsField label="Type" value={dnsInstructions.type} />
								<DnsField label="Name" value={dnsInstructions.name} />
								<DnsField
									label="Target"
									value={dnsInstructions.target}
								/>
							</div>
						) : (
							<p className="text-sm text-kumo-subtle">
								Loading DNS instructions…
							</p>
						)}
					</div>
				)}

				{status === 'failed' && (
					<Button
						variant="secondary"
						onClick={() => void handleRetry()}
						loading={isAttaching}
					>
						Retry verification
					</Button>
				)}

				{isStatusLoading && status === 'pending' && (
					<p className="text-xs text-kumo-subtle">
						Checking verification status…
					</p>
				)}
			</div>

			<DeleteResource
				open={isRemoveDialogOpen}
				onOpenChange={setIsRemoveDialogOpen}
				resourceType="Custom domain"
				resourceName={domain}
				onDelete={handleRemove}
				isDeleting={isRemoving}
				errorMessage={removeError}
			/>
		</div>
	);
}
