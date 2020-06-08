import { Component, BadRequestException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

import { DatabaseService } from '../database/database.service'
import { IQueryParams } from '../util/query-params.interface'
import { UtilService } from '../util/util.service'
import Usuario from './usuarios.entity'
import UsuarioToken from './usuarios_tokens.entity'
import * as fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

@Component()
export class UsuariosService {

  constructor(private _databaseService: DatabaseService) { }
  
  public async createOrUpdateUsuario (usuario: Usuario): Promise<any> {
    const user = await Usuario.findOne({ where: { cpf: usuario.cpf } })
    if (!user) {
      const token = this.generateToken()
      const novoUsuario = await Usuario.create({ ...usuario, token })
      // await this.sendEmailNovoCadastro(novoUsuario.email, token)
      return novoUsuario
    }
    await user.update(usuario)
    return user
  }

  /** Cria o token JWT com duração de 24 horas e os registros: Id e Nome
   * @param usuario
   */
  public generateJwt (usuario: Usuario): string {
    return jwt.sign(
      usuario,
      process.env.SECRET || 'secret',
      {
        expiresIn: 60 * 60 * 24,
      }
    )
  }

  public decodeJwtUsuario (token: String): Usuario {
    return jwt.verify(token, process.env.SECRET || 'secret', { ignoreExpiration: true })
  }

  public async generateRenewTokenJwt (usuario: Usuario): Promise<string> {
    const rtoken = jwt.sign(
      usuario,
      process.env.SECRET || 'secret',
      {
        expiresIn: 60 * 60 * 24 * 15,
      }
    )

    UsuarioToken.create({
      usuarioId: usuario.id,
      token: rtoken,
      tipo: 'RENEW',
    })

    return rtoken
  }

  async updateFotoPerfilIfNeeded (usuarioId, foto) {
    const usuario = await Usuario.findById(usuarioId)
    if (usuario.avatar) return false

    const avatarName = `${uuidv4()}.jpg`
    fs.writeFileSync('../files/' + avatarName, foto, 'base64')
    await usuario.update({ avatar: avatarName })
    return true
  }

  public sendEmailRecuperaSenha (email: string, token: string) {
    const frontendBaseUrl = process.env.NODE_ENV.startsWith('prod') ? 'https://newdriver.com.br/' : 'http://localhost:3000/'
    const link = `${frontendBaseUrl}app-react/mudar-senha/${token}`
    return UtilService.enviaEmail(email, 'Recuperação de Senha - Agendamento', `
    <p>Se você não solicitou a mudança de senha no sistema Hyperpay, por favor ignore esse e-mail.</p>

    <p>Para mudar sua senha acesse o seguinte endereço</p>

    <p><a href="${link}">${link}</a>
    `, `Se você não solicitou a mudança de senha no sistema Hyperpay, por favor ignore esse e-mail.

    Para mudar sua senha acesse o seguinte endereço

    ${link}
    `)
  }

  public sendEmailNovoCadastro (email: string, token: string) {
    const frontendBaseUrl = process.env.NODE_ENV.startsWith('prod') ? 'https://newdriver.com.br/' : 'http://localhost:3000/'
    const link = `${frontendBaseUrl}mudar-senha/${token}`
    return UtilService.enviaEmail(email, 'Bem vindo ao Sistema de Agendamento', `
    <p>Você foi cadastrado no sistema de Agendamento, use o seguinte link para criar sua senha</p>

    <p><a href="${link}">${link}</a>
    `, `Você foi cadastrado no sistema de Agendamento, use o seguinte link para criar sua senha

    ${link}
    `)
  }

  public async hashSenha(senha): Promise<string> {
    return bcrypt.hash(senha, 10)
  }

  public async validaSenha(usuarioId, senha): Promise<boolean> {
    const usuario = await Usuario.findOne({ where: { id: usuarioId } })
    return bcrypt.compare(senha, usuario.senha)
  }

  public async updateSenha(usuarioId, senha): Promise<boolean> {
    const hashedPassword = await this.hashSenha(senha)
    const [updatedUsuario] = await Usuario.update({ senha: hashedPassword }, { where: { id: usuarioId } })
    if(!updatedUsuario) throw new BadRequestException('Usuário não encontrado')
    return true
  }

  public async updateToken(usuarioId, token): Promise<string> {
    const usuario = await Usuario.findOne({where: { id: usuarioId }})
    if(!usuario) throw new BadRequestException('Usuário não encontrado')
    await usuario.update({token})
    return usuario.token
  }

  public generateToken () {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return Array(32).fill(null).map(() => chars.charAt(Math.round(Math.random() * chars.length))).join('')
  }
}

