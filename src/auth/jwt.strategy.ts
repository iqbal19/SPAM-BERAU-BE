import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { jwtConfig } from 'src/config/jwt.config'
import { UserService } from 'src/user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly userService: UserService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: jwtConfig.secret
		})
	}

	async validate(payload: any) {
		const user = await this.userService.findByUserId(payload.sub)
		if (!user) {
			throw new UnauthorizedException('User tidak ditemukan')
		}
		return user
	}
}
