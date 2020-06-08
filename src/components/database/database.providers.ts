import { Sequelize, ISequelizeConfig, BeforeBulkDelete } from 'sequelize-typescript'
import { InitialSeed } from './initial.seed'
import { join } from 'path'
import * as prompts from 'prompts'

export const databaseProviders = [
  {
    provide: 'SequelizeToken',
    useFactory: async () => {
      const {
        NODE_ENV: nodeEnv,
        DB_USERNAME: userName,
        DB_PASSWORD: password,
        DB_HOST: host,
      } = process.env

      const sequelizeOptions: ISequelizeConfig = {
        database: 'NEW_DRIVER_DEV',
        modelPaths: [join(__dirname, '..', '**', '*.entity.*')],
        define: {
          freezeTableName: true,
          timestamps: true,
          paranoid: true,
        },
        dialectOptions: {
          useUTC: false,
          dateStrings: true,
        },
        username: null,
        password: null,
      }

      switch (nodeEnv) {
        case 'dev':
          sequelizeOptions.dialect = 'sqlite'
          sequelizeOptions.storage = './sqlite'
          break

        case 'test':
          sequelizeOptions.dialect = 'sqlite'
          break

        case 'production':
          sequelizeOptions.dialect = 'mssql'
          sequelizeOptions.logging = false
          sequelizeOptions.dialectOptions['encrypt'] = true

          sequelizeOptions.username = userName
          sequelizeOptions.password = password
          sequelizeOptions.host = host
          break

        default:
          break
      }

      const sequelize = new Sequelize(sequelizeOptions)

      sequelize.addHook('beforeBulkDestroy', (context) => {
        if (context.model.options.paranoid && context.model.attributes.userDeletionId && context.userId && context.where) {
          context.model.update({ userDeletionId: context.userId }, { where: context.where })
        }
      })

      const reseed = await promptReseedDb()
      if (reseed) {
        await sequelize.sync({ force: true })
        InitialSeed.startSeed()
      }

      return sequelize
    },
  },
]

const promptReseedDb = async () => {
  const nodeEnv = process.env.NODE_ENV
  if (nodeEnv === 'production' || nodeEnv === 'prod') return false
  if (nodeEnv === 'test') return true

  if ('' + process.env.IGNORE_RESEED === 'true') return false

  if (nodeEnv === 'dev') {
    return new Promise(resolve => {
      let resolved = false
      prompts({
        type: 'confirm',
        name: 'value',
        message: 'Deseja resetar o banco de dados?',
        initial: false,
      }).then(response => {
        resolved = true
        resolve(response.value)
      })

      setTimeout(() => {
        if (!resolved) resolve(false)
      }, 5000)
    })
  }

  return false
}

