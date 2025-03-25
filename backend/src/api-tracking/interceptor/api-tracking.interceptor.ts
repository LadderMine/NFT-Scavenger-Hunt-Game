import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiTrackingService } from '../api-tracking.service';

@Injectable()
export class ApiTrackingInterceptor implements NestInterceptor {
  constructor(private readonly apiTrackingService: ApiTrackingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const responseTime = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.apiTrackingService.logRequest({ method, url, statusCode, responseTime });
      }),
    );
  }
}
