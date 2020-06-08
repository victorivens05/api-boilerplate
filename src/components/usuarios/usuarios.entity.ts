import {
  Table,
  Column,
  Model,
  BelongsTo,
  AllowNull,
  Length,
  DataType,
  BelongsToMany,
  Unique,
  ForeignKey,
  IsIn,
  Is,
  HasMany,
  PrimaryKey,
  BeforeUpdate,
  BeforeCreate,
  BeforeBulkUpdate,
  BeforeBulkCreate,
} from 'sequelize-typescript'

@Table({
  name: {
    plural: 'usuarios',
    singular: 'usuario',
  },
  tableName: 'usuarios',
  paranoid: true,
})
export default class Usuario extends Model<Usuario> {

  //@AllowNull(false)
  //@Unique
  //@Column(DataType.STRING(14))
  //cpf: string

  //@Column
  //rg: string

  //@AllowNull(false)
  //@Column(DataType.STRING(80))
  //email: string

  //@AllowNull(false)
  //@Column(DataType.STRING(50))
  //nome: string

  //@Column(DataType.STRING(15))
  //telefone: string

  //@Column
  //avatar: string

  //@Column
  //senha: string

  //@Column(DataType.STRING(32))
  //token: string

  //@Column(DataType.STRING(20))
  //cor: string

  //@Column(DataType.STRING(30))
  //faceId: string
}

