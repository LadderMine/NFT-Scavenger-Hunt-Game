/* eslint-disable prettier/prettier */
export class CreateAuditLogDto {
  eventType: string;
  userId?: string;
  username?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
  resource?: string;
  resourceId?: string;
  action?: string;
  status?: string;
}
