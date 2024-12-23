import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards, Res, Delete } from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { Response } from 'express'
import { JwtGuard } from 'src/guard/jwt.guard'
import { RolesGuard } from 'src/guard/roles.guard'
import { UpdateUserDto } from './dto/update-user.dto'
import { AppService } from 'src/app.service'
import { Roles } from 'src/guard/roles.decorator'

@UseGuards(JwtGuard, RolesGuard)
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
	@Roles('ADMIN_APLIKASI')
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
	@Roles('ADMIN_APLIKASI')
	async userUpdate(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Res() res: Response) {
		try {
			const errMsg = await this.userService.updateUser(id, updateUserDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil mengedit data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}

	@Delete('/:id') // update user by id
	@Roles('ADMIN_APLIKASI')
	async userDelete(@Param('id') id: string, @Res() res: Response) {
		try {
			const errMsg = await this.userService.deleteUser(id)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil delete data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}
}
