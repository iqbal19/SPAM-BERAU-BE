import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtConfig } from 'src/config/jwt.config'
import { NewsController } from './news.controller'
import { NewsService } from './news.service'
import { AppService } from 'src/app.service'


@Module({
	imports: [JwtModule.register(jwtConfig)],
	controllers: [NewsController],
	providers: [NewsService, AppService]
})
export class NewsModule {}
