import { Guard, CanActivate, ExecutionContext, Request, HttpStatus } from '@nestjs/common'
import { HttpException, Reflector } from '@nestjs/core'
import { Observable } from 'rxjs/Observable'
import * as jwt from 'jsonwebtoken'

import Usuario from '../usuarios/usuarios.entity'
import UsuarioPermissao from '../usuarios/usuarios_permissoes.entity'

@Guard()
export class PermissoesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(req: any, context: ExecutionContext): boolean {
    const { parent, handler } = context
    const permissoes = this.reflector.get<string[]>('permissoes', handler)

    if (this.isOpen(permissoes)) {
      return true
    }

    const user = this.getUserFromJwt(req.headers.authorization)
    req.user = user

    if (!user) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED)
    }

    if (permissoes) {
      if (!user.permissoes || !user.permissoes.length) return false
      req.user.permissoes = user.permissoes.filter(p => (
          permissoes.map(per => per.toUpperCase()).includes(p.perfil)
        ))
      if (!req.user.permissoes.length) return false
    }

    return true
  }

  isOpen(permissoes: string[]): boolean {
    return permissoes && !!permissoes.some(x => x.toUpperCase() === 'OPEN')
  }

  getUserFromJwt (authorization: string) {
    if (!authorization) return null
    const token = authorization.replace('Bearer ', '')
    try {
      return jwt.verify(token, process.env.SECRET || 'secret')
    } catch (e) {
      return null
    }
  }
}

