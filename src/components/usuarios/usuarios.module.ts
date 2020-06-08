import { Module } from '@nestjs/common'
import { UsuariosController } from './usuarios.controller'
import { UsuariosService } from './usuarios.service'
import { DatabaseModule } from '../database/database.module'
import { DatabaseService } from '../database/database.service'

@Module({
  controllers: [UsuariosController],
  components: [UsuariosService, DatabaseService],
  imports: [DatabaseModule],
  exports: [UsuariosService],
})
export class UsuariosModule { }

