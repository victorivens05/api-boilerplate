import { ReflectMetadata, createRouteParamDecorator } from '@nestjs/common'

export const ControleAcesso = (permissoes: string[]) => ReflectMetadata('permissoes', permissoes)

export const Permissoes = createRouteParamDecorator((data, req) => {
  return req.user.permissoes
})

