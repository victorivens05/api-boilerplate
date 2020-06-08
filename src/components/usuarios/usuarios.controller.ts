import {
  Controller,
  Get,
  Req,
  Headers,
  Post,
  Body,
  Res,
  HttpCode,
  UseGuards,
  ForbiddenException,
  BadRequestException,
  Param,
  Delete,
  Query,
  Put
} from '@nestjs/common'
import Usuario from './usuarios.entity'
import { UsuariosService } from './usuarios.service'
import { format as formatCpf } from '@fnando/cpf'
import { User, UserId } from '../util/user.decorator'
//import UsuarioPermissao from './usuarios_permissoes.entity'
import UsuarioToken from './usuarios_tokens.entity'
import { Permissoes, ControleAcesso } from '../util/permissoes.decorator'
import { IQueryParams } from '../util/query-params.interface'
import * as bcrypt from 'bcrypt'
import * as _ from 'lodash'

const PLATFORMS = {
  PAINEL: 'PAINEL',
  APP: 'APP',
}

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly _usuariosService: UsuariosService) { }

  @Post('login')
  @ControleAcesso(['OPEN'])
  async login (@Body('email') email: string, @Body('senha') senha: string, @Headers('platform') platform: string) {
    const usuario = await Usuario.findOne({
      where: { email },
    })

    if (!usuario) throw new BadRequestException('Este e-mail não existe')
    const isPasswordCorret = await this._usuariosService.validaSenha(usuario.id, senha)
    if (!isPasswordCorret && process.env.NODE_ENV === 'production') throw new BadRequestException('Senha incorreta')

  }
}
