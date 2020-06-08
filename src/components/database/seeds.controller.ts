import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Res,
  HttpStatus,
  HttpCode,
  UseGuards,
  Inject,
  UseInterceptors,
  Param,
  Query,
  UseFilters
} from '@nestjs/common'

import Usuario from '../usuarios/usuarios.entity'
import { TestInterceptor } from './test.interceptor'
import { ControleAcesso } from '../util/permissoes.decorator'
import { Sequelize } from 'sequelize'
import { InitialSeed } from './initial.seed'

@UseInterceptors(TestInterceptor)
@Controller('seeds')
export class SeedsController {
  constructor(@Inject('SequelizeToken') private readonly sequelize: Sequelize) { }

  @Get('/resetaDb')
  @ControleAcesso(['OPEN'])
  async get () {
    await this.sequelize.sync({ force: true })
    await InitialSeed.startSeed()
    return true
  }
}
