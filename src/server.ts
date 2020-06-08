import * as bodyParser from 'body-parser'
import { NestFactory, Reflector } from '@nestjs/core'
import { ApplicationModule } from './app.module'
import { PermissoesGuard } from './components/util/permissoes.guard'
import { ExceptionInterceptor } from './components/util/exception.interceptor'
import * as compression from 'compression'
import * as express from 'express'
import * as path from 'path'

(async function bootstrap() {
  // const port = process.env.NODE_ENV === 'production' ? 81 : 3500
  const port = 3500

  const server = express()

  // server.use(bodyParser.json({ limit: '50mb' }))
  server.use(express.json({ limit: '50mb' }))
  server.use(express.urlencoded({ limit: '50mb' }))
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Platform')
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
    next()
  })
  server.use(compression())
  if (process.env.NODE_ENV === 'production') {
    server.use('/app', express.static(path.join(__dirname, '../app')))
    server.use('/', express.static(path.join(__dirname, '../painel')))
  } else {
    server.use('/app', express.static(path.join(__dirname, '../../app/www')))
    server.use('/', express.static(path.join(__dirname, '../../painel/dist')))
  }
  server.use('/files', express.static(path.join(__dirname, '../../files')))

  const app = await NestFactory.create(ApplicationModule, server)

  //app.useGlobalGuards(new PermissoesGuard(new Reflector()))
  //app.useGlobalInterceptors(new ExceptionInterceptor())
  app.setGlobalPrefix('/api')

  await app.listen(port)
  console.log('listening to port: ' + port)
})()

