import { Interceptor, NestInterceptor, ExecutionContext } from '@nestjs/common'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/do'
import 'rxjs/add/observable/of'

@Interceptor()
export class TestInterceptor implements NestInterceptor {
  intercept(dataOrRequest: any, context: ExecutionContext, stream$: Observable<any>): Observable<any> {
    if (process.env.NODE_ENV !== 'test') return Observable.of(false)
    return stream$
  }
}
