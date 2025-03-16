import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtConfig } from 'src/config/jwt.config'
import { LaporanController } from './laporan.controller'
import { LaporanService } from './laporan.service'
import { AppService } from 'src/app.service'
import { FileService } from 'src/file/file.service'

@Module({
	imports: [JwtModule.register(jwtConfig)],
	controllers: [LaporanController],
	providers: [LaporanService, AppService, FileService]
})
export class LaporanModule {}
