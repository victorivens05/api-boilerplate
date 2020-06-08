import { Module } from '@nestjs/common'
import { databaseProviders } from './database.providers'
import { SeedsController } from './seeds.controller'
import { DatabaseService } from './database.service'

@Module({
 controllers: [SeedsController],
 components: [...databaseProviders, DatabaseService],
 exports: [...databaseProviders, DatabaseService],
})
export class DatabaseModule { }

