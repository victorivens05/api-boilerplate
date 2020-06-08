import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  IsIn,
  Model,
  Table
} from 'sequelize-typescript'

import Usuario from './usuarios.entity'

@Table({
  name: {
    plural: 'usuarios_tokens',
    singular: 'usuario_token',
  },
  tableName: 'usuarios_tokens',
  paranoid: true,
  updatedAt: false,
})
export default class UsuarioToken extends Model<UsuarioToken> {

  @AllowNull(false)
  @ForeignKey(() => Usuario)
  @Column
  usuarioId: number

  @BelongsTo(() => Usuario)
  usuario: Usuario

  @IsIn([['RENEW', 'RECOVERY_PASSWORD']])
  @Column({
    type: DataType.STRING(25),
    defaultValue: 'RENEW',
  })
  tipo: string

  @Column
  token: string
}

