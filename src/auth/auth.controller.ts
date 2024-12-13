import { Body, Controller, Get, HttpStatus, Patch, Post, Res, UseGuards, Request } from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { AuthDto } from './dto/auth.dto'
import { AppService } from 'src/app.service'
import { RefreshAccessTokenDto } from './dto/refresh-access-token.dto'
import { JwtGuard } from 'src/guard/jwt.guard'
import { UserService } from 'src/user/user.service'

@Controller('v1/api/auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
		private readonly appService: AppService
	) {}

	@Post('login')
	async login(@Body() authDto: AuthDto, @Res() res: Response) {
		try {
			const data = await this.authService.login(authDto)
			if (Object.keys(data).length > 0) return this.appService.responseSuccess(res, HttpStatus.OK, data)
			return this.appService.responseError(res, 400, 'Email atau password salah')
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan')
		}
	}

	@Post('refresh-token')
	async refreshToken(@Body() refreshTokenDto: RefreshAccessTokenDto): Promise<{ access_token: string }> {
		return this.authService.refreshAccessToken(refreshTokenDto)
	}

	@UseGuards(JwtGuard)
	@Get('me')
	async getMe(@Request() req, @Res() res: Response) {
		try {
			const user = await this.userService.findUserById(req.user.id)
			if (!user) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, user);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}
}
