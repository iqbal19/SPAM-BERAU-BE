import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtConfig } from 'src/config/jwt.config'
import { SpamController } from './spam.controller'
import { SpamService } from './spam.service'
import { AppService } from 'src/app.service'
import { FileService } from 'src/file/file.service'


@Module({
	imports: [JwtModule.register(jwtConfig)],
	controllers: [SpamController],
	providers: [SpamService, AppService, FileService]
})
export class SpamModule {}
