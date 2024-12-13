import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtConfig } from 'src/config/jwt.config'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { AppService } from 'src/app.service'


@Module({
	imports: [JwtModule.register(jwtConfig)],
	controllers: [UserController],
	providers: [UserService, AppService]
})
export class UserModule {}
