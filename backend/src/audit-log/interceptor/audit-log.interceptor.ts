import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { AuditLogService } from '../audit-log.service';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;

    return next.handle().pipe(
      tap(async () => {
        if (user) {
          const action = `${req.method} ${req.originalUrl}`;
          const meta = {
            body: req.body,
            params: req.params,
            query: req.query,
          };
          await this.auditLogService.createLog(user.id, action, meta);
        }
      }),
    );
  }
}
