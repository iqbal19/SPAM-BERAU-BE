import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtConfig } from 'src/config/jwt.config'
import { PekerjaanController } from './pekerjaan.controller'
import { PekerjaanService } from './pekerjaan.service'
import { AppService } from 'src/app.service'
import { FileService } from 'src/file/file.service'

@Module({
	imports: [JwtModule.register(jwtConfig)],
	controllers: [PekerjaanController],
	providers: [ PekerjaanService, AppService, FileService]
})
export class PekerjaanModule {}
