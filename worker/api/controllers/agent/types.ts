import type { PreviewType } from "../../../services/sandbox/sandboxTypes";
import type { EmbedderContext } from '../../../agents/core/embedder-context';
import type { ImageAttachment } from '../../../types/image-attachment';
import type { BehaviorType, ProjectType } from '../../../agents/core/types';
import type { CredentialsPayload } from '../../../agents/inferutils/config.types';

export const MAX_AGENT_QUERY_LENGTH = 20_000;

export interface CodeGenArgs {
    query: string;
    language?: string;
    frameworks?: string[];
    selectedTemplate?: string;
    behaviorType?: BehaviorType;
    projectType?: ProjectType;
    images?: ImageAttachment[];
    /** Instructions, skills, seed files and a deployment name from an embedding platform. Think behavior only. */
    embedderContext?: EmbedderContext;

    /** Optional ephemeral credentials (BYOK / gateway override) for sdk */
    credentials?: CredentialsPayload;
}

/**
 * Data structure for connectToExistingAgent response
 */
/** A request from an embedding platform was taken; what follows reaches its callback. */
export interface AgentRequestAccepted {
    agentId: string;
    accepted: true;
}

export interface AgentConnectionData {
    websocketUrl: string;
    agentId: string;
}

export type AgentPreviewResponse = PreviewType;
