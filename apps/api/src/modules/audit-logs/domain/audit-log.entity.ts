import type { AuditLog as AuditLogDto } from '@bankbridge/contracts';

export interface AuditLogProps {
  id: string;
  actorId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  ip: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

/** Append-only record of a sensitive platform action. */
export class AuditLog {
  constructor(private readonly props: AuditLogProps) {}

  toDto(): AuditLogDto {
    return {
      id: this.props.id,
      actorId: this.props.actorId,
      action: this.props.action,
      resourceType: this.props.resourceType,
      resourceId: this.props.resourceId,
      ip: this.props.ip,
      metadata: this.props.metadata,
      createdAt: this.props.createdAt.toISOString(),
    };
  }
}
