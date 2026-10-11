import { AppService } from '../../../database/services/AppService';
import type { AppSortOption, SortOrder, TimePeriod, Visibility } from '../../../database/types';
import { formatRelativeTime } from '../../../utils/timeFormatter';
import { BaseController } from '../baseController';
import { ApiResponse, ControllerResponse } from '../types';
import type { RouteContext } from '../../types/route-context';
import {
    AppsListData,
    PublicAppsData,
    SingleAppData,
    FavoriteToggleData,
    UpdateAppVisibilityData,
    AppDeleteData,
    UpdateAppCustomDomainData,
    AppCustomDomainStatusData,
    DeleteAppCustomDomainData
} from './types';
import { getFallbackOriginHostname } from '../../../services/customDomain/cloudflareSaas';
import { toPublicAppListItem } from './publicAppDto';
import { parsePublicAppsQuery } from './publicAppsQuery';
// import { withCache } from '../../../services/cache/wrapper';
import { createLogger } from '../../../logger';
import { RateLimitService } from '../../../services/rate-limit/rateLimits';
import { RateLimitExceededError } from 'shared/types/errors';

export class AppController extends BaseController {
    static logger = createLogger('AppController');

    // Get all apps for the current user
    static async getUserApps(_request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<AppsListData>>> {
        try {
            const user = context.user!;
            
            const appService = new AppService(env);
            const userApps = await appService.getUserAppsWithFavorites(user.id);

            const responseData: AppsListData = {
                apps: userApps
            };

            return AppController.createSuccessResponse(responseData);
        } catch (error) {
            this.logger.error('Error fetching user apps:', error);
            return AppController.createErrorResponse<AppsListData>('Failed to fetch apps', 500);
        }
    }

    // Get recent apps (last 10)
    static async getRecentApps(_request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<AppsListData>>> {
        try {
            const user = context.user!;

            const appService = new AppService(env);
            const recentApps = await appService.getRecentAppsWithFavorites(user.id, 10);

            const responseData: AppsListData = {
                apps: recentApps
            };

            return AppController.createSuccessResponse(responseData);
        } catch (error) {
            this.logger.error('Error fetching recent apps:', error);
            return AppController.createErrorResponse<AppsListData>('Failed to fetch recent apps', 500);
        }
    }

    // Get favorite apps - NO CACHE (user-specific, real-time)
    static async getFavoriteApps(_request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<AppsListData>>> {
        try {
            const user = context.user!;

            const appService = new AppService(env);
            const favoriteApps = await appService.getFavoriteAppsOnly(user.id);

            const responseData: AppsListData = {
                apps: favoriteApps
            };

            return AppController.createSuccessResponse(responseData);
        } catch (error) {
            this.logger.error('Error fetching favorite apps:', error);
            return AppController.createErrorResponse<AppsListData>('Failed to fetch favorite apps', 500);
        }
    }


    // Toggle favorite status
    static async toggleFavorite(_request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<FavoriteToggleData>>> {
        try {
            const user = context.user!;

            const appService = new AppService(env);
            const appId = context.pathParams.id;
            if (!appId) {
                return AppController.createErrorResponse<FavoriteToggleData>('App ID is required', 400);
            }

            // Check if app exists and get ownership/visibility info
            const ownershipResult = await appService.checkAppOwnership(appId, user.id);

            if (!ownershipResult.exists) {
                return AppController.createErrorResponse<FavoriteToggleData>('App not found', 404);
            }

            // Authorization: only allow favorite if user owns the app OR app is public
            if (!ownershipResult.isOwner && ownershipResult.visibility !== 'public') {
                return AppController.createErrorResponse<FavoriteToggleData>('App not found', 404);
            }

            const result = await appService.toggleAppFavorite(user.id, appId);
            const responseData: FavoriteToggleData = result;
                
            return AppController.createSuccessResponse(responseData);
        } catch (error) {
            this.logger.error('Error toggling favorite:', error);
            return AppController.createErrorResponse<FavoriteToggleData>('Failed to toggle favorite', 500);
        }
    }

    // Get public apps feed (like a global board)
   static getPublicApps = async function(this: AppController, request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<PublicAppsData>>> {
        try {
            const user = await AppController.getOptionalUser(request, env);
            try {
                await RateLimitService.enforcePublicAppsRateLimit(env, context.config.security.rateLimit, user ?? null, request);
            } catch (error) {
                if (error instanceof RateLimitExceededError) {
                    return AppController.createErrorResponse<PublicAppsData>('Too many requests', 429);
                }
                throw error;
            }

            const url = new URL(request.url);

            // Validate + bound attacker-controlled pagination/search params.
            const parsed = parsePublicAppsQuery(url.searchParams);
            if (!parsed.ok) {
                return AppController.createErrorResponse<PublicAppsData>(parsed.error, 400);
            }
            const { limit, offset, search } = parsed.value;
            const sort = (url.searchParams.get('sort') || 'recent') as AppSortOption;
            const order = (url.searchParams.get('order') || 'desc') as SortOrder;
            const period = (url.searchParams.get('period') || 'all') as TimePeriod;
            const framework = url.searchParams.get('framework') || undefined;

            const userId = user?.id;
            
            // Get apps
            const appService = new AppService(env);
            const result = await appService.getPublicApps({
                limit,
                offset,
                sort,
                order,
                period,
                framework,
                search,
                userId
            });
            
            // Format response with relative timestamps.
            // Whitelist each row through the safe public projection before it
            // leaves the worker (drops prompts, deploymentId, userId, etc.).
            const responseData: PublicAppsData = {
                apps: result.data.map(app => {
                    const safeApp = toPublicAppListItem(app);
                    return {
                        ...safeApp,
                        userName: safeApp.userName || 'Anonymous User',
                        userAvatar: safeApp.userAvatar || null,
                        updatedAtFormatted: formatRelativeTime(safeApp.updatedAt),
                        createdAtFormatted: safeApp.createdAt ? formatRelativeTime(safeApp.createdAt) : ''
                    };
                }),
                pagination: result.pagination
            };
            
            return AppController.createSuccessResponse(responseData);
        } catch (error) {
            AppController.logger.error('Error fetching public apps:', error);
            return AppController.createErrorResponse<PublicAppsData>('Failed to fetch public apps', 500);
        }
    }

    // Get single app
    static async getApp(_request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<SingleAppData>>> {
        try {
            const user = context.user!;

            const appId = context.pathParams.id;
            if (!appId) {
                return AppController.createErrorResponse<SingleAppData>('App ID is required', 400);
            }
            
            const appService = new AppService(env);
            const app = await appService.getSingleAppWithFavoriteStatus(appId, user.id);

            if (!app) {
                return AppController.createErrorResponse<SingleAppData>('App not found', 404);
            }

            const responseData: SingleAppData = { app };
            return AppController.createSuccessResponse(responseData);
        } catch (error) {
            this.logger.error('Error fetching app:', error);
            return AppController.createErrorResponse<SingleAppData>('Failed to fetch app', 500);
        }
    }

    // Update app visibility
    static async updateAppVisibility(request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<UpdateAppVisibilityData>>> {
        try {
            const user = context.user!;

            const appId = context.pathParams.id;
            if (!appId) {
                return AppController.createErrorResponse<UpdateAppVisibilityData>('App ID is required', 400);
            }

            const bodyResult = await AppController.parseJsonBody(request);
            if (!bodyResult.success) {
                return bodyResult.response! as ControllerResponse<ApiResponse<UpdateAppVisibilityData>>;
            }
            
            const visibility = (bodyResult.data as { visibility?: string })?.visibility;

            // Validate visibility value
            if (!visibility || !['private', 'public'].includes(visibility)) {
                return AppController.createErrorResponse<UpdateAppVisibilityData>('Visibility must be either "private" or "public"', 400);
            }

            const validVisibility = visibility as Visibility;
            
            const appService = new AppService(env);
            const result = await appService.updateAppVisibility(appId, user.id, validVisibility);

            if (!result.success) {
                const statusCode = result.error === 'App not found' ? 404 : 
                                 result.error?.includes('only change visibility of your own apps') ? 403 : 500;
                return AppController.createErrorResponse<UpdateAppVisibilityData>(result.error || 'Failed to update app visibility', statusCode);
            }

            const responseData: UpdateAppVisibilityData = { 
                app: {
                    ...result.app!,
                    visibility: result.app!.visibility
                },
                message: `App visibility updated to ${validVisibility}`
            };
            return AppController.createSuccessResponse(responseData);
        } catch (error) {
            this.logger.error('Error updating app visibility:', error);
            return AppController.createErrorResponse<UpdateAppVisibilityData>('Failed to update app visibility', 500);
        }
    }

    // Attach/replace a custom domain on an app
    static async updateAppCustomDomain(request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<UpdateAppCustomDomainData>>> {
        try {
            const user = context.user!;

            const appId = context.pathParams.id;
            if (!appId) {
                return AppController.createErrorResponse<UpdateAppCustomDomainData>('App ID is required', 400);
            }

            const bodyResult = await AppController.parseJsonBody(request);
            if (!bodyResult.success) {
                return bodyResult.response! as ControllerResponse<ApiResponse<UpdateAppCustomDomainData>>;
            }

            const domain = (bodyResult.data as { domain?: string })?.domain?.trim();
            if (!domain) {
                return AppController.createErrorResponse<UpdateAppCustomDomainData>('Domain is required', 400);
            }

            const appService = new AppService(env);
            const result = await appService.updateAppCustomDomain(appId, user.id, domain);

            if (!result.success) {
                const statusCode = result.errorCode === 'not_found' ? 404
                    : result.errorCode === 'forbidden' ? 403
                    : result.errorCode === 'domain_taken' || result.errorCode === 'invalid_domain' ? 409
                    : 502;
                return AppController.createErrorResponse<UpdateAppCustomDomainData>(result.error || 'Failed to attach domain', statusCode);
            }

            const responseData: UpdateAppCustomDomainData = {
                app: result.app!,
                message: 'Domain registered. Add the DNS record below to verify it.',
                dnsInstructions: { type: 'CNAME', name: result.app!.customDomain!, target: getFallbackOriginHostname(env) },
            };
            return AppController.createSuccessResponse(responseData);
        } catch (error) {
            this.logger.error('Error updating custom domain:', error);
            return AppController.createErrorResponse<UpdateAppCustomDomainData>('Failed to update custom domain', 500);
        }
    }

    // Live custom-domain verification status (polled by the owner)
    static async getAppCustomDomainStatus(_request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<AppCustomDomainStatusData>>> {
        try {
            const user = context.user!;

            const appId = context.pathParams.id;
            if (!appId) {
                return AppController.createErrorResponse<AppCustomDomainStatusData>('App ID is required', 400);
            }

            const appService = new AppService(env);
            const result = await appService.getAppCustomDomainStatus(appId, user.id);

            if (!result.success) {
                const statusCode = result.errorCode === 'not_found' ? 404 : result.errorCode === 'forbidden' ? 403 : 500;
                return AppController.createErrorResponse<AppCustomDomainStatusData>(result.error || 'Failed to fetch domain status', statusCode);
            }

            const responseData: AppCustomDomainStatusData = {
                app: result.app!,
                message: '',
                ...(result.app!.customDomain && result.app!.customDomainStatus === 'pending'
                    ? { dnsInstructions: { type: 'CNAME' as const, name: result.app!.customDomain, target: getFallbackOriginHostname(env) } }
                    : {}),
            };
            return AppController.createSuccessResponse(responseData);
        } catch (error) {
            this.logger.error('Error fetching custom domain status:', error);
            return AppController.createErrorResponse<AppCustomDomainStatusData>('Failed to fetch domain status', 500);
        }
    }

    // Detach a custom domain from an app
    static async deleteAppCustomDomain(_request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<DeleteAppCustomDomainData>>> {
        try {
            const user = context.user!;

            const appId = context.pathParams.id;
            if (!appId) {
                return AppController.createErrorResponse<DeleteAppCustomDomainData>('App ID is required', 400);
            }

            const appService = new AppService(env);
            const result = await appService.deleteAppCustomDomain(appId, user.id);

            if (!result.success) {
                const statusCode = result.errorCode === 'not_found' ? 404 : result.errorCode === 'forbidden' ? 403 : 500;
                return AppController.createErrorResponse<DeleteAppCustomDomainData>(result.error || 'Failed to remove domain', statusCode);
            }

            return AppController.createSuccessResponse({ message: 'Custom domain removed' });
        } catch (error) {
            this.logger.error('Error deleting custom domain:', error);
            return AppController.createErrorResponse<DeleteAppCustomDomainData>('Failed to remove custom domain', 500);
        }
    }

    // Delete app
    static async deleteApp(_request: Request, env: Env, _ctx: ExecutionContext, context: RouteContext): Promise<ControllerResponse<ApiResponse<AppDeleteData>>> {
        try {
            const user = context.user!;

            const appId = context.pathParams.id;
            if (!appId) {
                return AppController.createErrorResponse<AppDeleteData>('App ID is required', 400);
            }
        
            const appService = new AppService(env);
            const result = await appService.deleteApp(appId, user.id);

            if (!result.success) {
                const statusCode = result.error === 'App not found' ? 404 : 
                                 result.error?.includes('only delete your own apps') ? 403 : 500;
                return AppController.createErrorResponse<AppDeleteData>(result.error || 'Failed to delete app', statusCode);
            }

            const responseData: AppDeleteData = {
                success: true,
                message: 'App deleted successfully'
            };
            return AppController.createSuccessResponse(responseData);
        } catch (error) {
            this.logger.error('Error deleting app:', error);
            return AppController.createErrorResponse<AppDeleteData>('Failed to delete app', 500);
        }
    }
}