import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt'

export const jwtConfig: JwtModuleOptions = {
	secret: process.env.JWT_ACCESS_SECRET || 'access_secret',
	signOptions: {
		expiresIn: 3600 * 12
	}
}

export const refreshTokenConfig: JwtSignOptions = {
	expiresIn: 3600 * 24 * 30 //30 hari
}
