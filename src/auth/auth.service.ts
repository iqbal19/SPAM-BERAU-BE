import { Injectable, UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthDto } from './dto/auth.dto'
import { UserService } from 'src/user/user.service'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { refreshTokenConfig } from 'src/config/jwt.config'
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto'
import { TokenExpiredError } from 'jsonwebtoken'

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private readonly jwtService: JwtService
	) {}

	async login(authDto: AuthDto): Promise<object> {
		const { email, password } = authDto
		const user = await this.userService.validateUser(email, password)
		if (!user) {
			return {}
		}
		const userPayload = {
			id: user.id,
			email: user.email,
			userName: user.username,
			nama: user.nama,
			role: user.role
		}
		const access_token = await this.createAccessToken(userPayload)
		const refresh_token = await this.createRefreshToken(user)
		return { access_token, refresh_token }
	}

	async refreshAccessToken(refreshTokenDto: RefreshAccessTokenDto): Promise<{ access_token: string }> {
		const { refresh_token } = refreshTokenDto
		const user = await this.decodeToken(refresh_token)

		const payload = {
			id: user.id,
			email: user.email,
			userName: user.username,
			nama: user.nama,
			role: user.role
		}

    const access_token = await this.createAccessToken(payload);
    return  { access_token };
	}

	async decodeToken(token: string): Promise<any> {
		try {
			return await this.jwtService.verifyAsync(token)
		} catch (error) {
			if (error instanceof TokenExpiredError) {
				throw new UnauthorizedException('Refresh token is expired')
			} else {
				throw new InternalServerErrorException('Failed to decode token')
			}
		}
	}

	async createAccessToken(user: object): Promise<string> {
		const access_token = await this.jwtService.signAsync(user)
		return access_token
	}

	async createRefreshToken(user: User): Promise<string> {
		try {
			const expiredAt = new Date()
			expiredAt.setTime(expiredAt.getTime() + +refreshTokenConfig.expiresIn)
			const payload = {
				id: user.id,
				email: user.email,
				userName: user.username,
				nama: user.nama,
				role: user.role
			}
			const refresh_token = await this.jwtService.signAsync(payload, refreshTokenConfig)
			return refresh_token
		} catch (error) {
			console.log(error)
		}
	}
}
