import { Module } from '@nestjs/common'
import { UsuariosModule } from './components/usuarios/usuarios.module'

@Module({
  imports: [
    UsuariosModule,
  ],
  controllers: [
    
  ]
})
export class ApplicationModule { }
