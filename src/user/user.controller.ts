import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards, Res } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { Response } from 'express'
import { JwtGuard } from 'src/guard/jwt.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { AppService } from 'src/app.service'

// @UseGuards(JwtGuard)
@Controller('v1/api/user')
export class UserController {
	constructor(
		private userService: UserService,
		private readonly appService: AppService
	) {}

	@Get() // get all users
	async users(@Res() res: Response) {
		try {
			const users = await this.userService.findAllUser()
			if (!users) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, users);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}

	@Get('/:id') // get by id
	async userById(@Param('id') id: string, @Res() res: Response) {
		try {
			const user = await this.userService.findUserById(id)
			if (!user) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, user);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}
	
	@Post() // cerate new user
	async userCreate(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
		try {
			const errMsg = await this.userService.createUserCtrl(createUserDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil menambahkan data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}

	@Put('/:id') // update user by id
	async userUpdate(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
		try {
			const errMsg = await this.userService.updateUser(id, updateUserDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil mengedit data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}
}
