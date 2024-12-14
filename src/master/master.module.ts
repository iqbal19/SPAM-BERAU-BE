import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtConfig } from 'src/config/jwt.config'
import { MasterController } from './master.controller'
import { MasterService } from './master.service'
import { AppService } from 'src/app.service'


@Module({
	imports: [JwtModule.register(jwtConfig)],
	controllers: [MasterController],
	providers: [ MasterService, AppService]
})
export class MasterModule {}
