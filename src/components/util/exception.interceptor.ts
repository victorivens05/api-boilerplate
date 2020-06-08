import { Interceptor, NestInterceptor, ExecutionContext, HttpStatus, HttpException } from '@nestjs/common'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/throw'

@Interceptor()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(dataOrRequest: any, context: ExecutionContext, stream$: Observable<any>): Observable<any> {
    return stream$.catch((err) => {
      let message = this.getMessage(err)
      const status = this.getStatus(err)
      if (err.name && ~err.name.indexOf('Sequelize')) {
        switch (err.name) {
          case 'SequelizeValidationError':
            message = this.getValidationErrorMessage(err.message)
            break
          case 'SequelizeUniqueConstraintError':
            message = this.getMessageErrorUnique(err)
            break
          default:
            message = 'Ocorreu um erro no banco de dados'
            // tslint:disable-next-line:no-console
            console.log(err)
            break
        }
        // debugger
      }
      return Observable.throw(
        new HttpException(message, status)
      )
    })
  }

  private getMessage(err: any) {
    if (!err) return 'Ocorreu um erro'
    if (err.response && err.response.message) return err.response.message
    if (err.message) return err.message
  }

  private getStatus(err: any) {
    if (!err) return HttpStatus.INTERNAL_SERVER_ERROR
    if (err.response && err.response.status) return err.response.status
    if (err.response && err.response.statusCode) return err.response.statusCode
    if (err.status) return err.status
    if (err.statusCode) return err.statusCode
    return HttpStatus.BAD_REQUEST
  }

  private getValidationErrorMessage(message: string) {

    const messages = message.split('\n').map(m => {
      if (~m.indexOf('notNull Violation')) {
        m = m.replace('notNull Violation: ', '').replace('cannot be null', 'deve ser informado')
      }

      if (~m.indexOf('Validation error:')) {
        m = m.replace('Validation error: ', '')
        if (~m.indexOf('Validation len on ')) m = m.replace('Validation len on ', '').replace('failed', 'não possui o tamanho correto')
      }
      return m
    })

    return messages.join('\n')
  }

  private getMessageErrorUnique(err: any) {
    if (err.fields.length > 1) {
      const lastField = err.fields.pop()
      return `Os campos ${err.fields.join(', ')} e ${lastField} não podem ser repetidos`
    } else {
      return `O campo ${Object.keys(err.fields).pop()} não pode ser repetido`
    }
  }
}

