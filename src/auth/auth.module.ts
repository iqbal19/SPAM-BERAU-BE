import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { jwtConfig } from 'src/config/jwt.config'
import { JwtStrategy } from './jwt.strategy'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserService } from 'src/user/user.service'
import { AppService } from 'src/app.service'

@Module({
	imports: [JwtModule.register(jwtConfig)],
	providers: [AuthService, UserService, JwtStrategy, AppService],
	controllers: [AuthController]
})
export class AuthModule {}
