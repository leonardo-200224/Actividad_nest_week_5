import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // antes de que se ejecute el controller
    console.log('[Interceptor] antes');

    return next.handle().pipe(
      // despues de que el controller respondio
      tap(() => console.log('[Interceptor] después')),
      map((data: unknown) => ({
        success: true,
        data: data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
