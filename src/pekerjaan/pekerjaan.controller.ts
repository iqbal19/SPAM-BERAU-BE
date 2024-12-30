import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards, Res, Delete, Query } from '@nestjs/common'
import { PekerjaanService } from './pekerjaan.service'
import { Response } from 'express'
import { JwtGuard } from 'src/guard/jwt.guard'
import { AppService } from 'src/app.service'
import { PekerjaanDto } from './dto/pekerjaan.dto'

@Controller('v1/api/pekerjaan')
export class PekerjaanController {
	constructor(
		private pekerjaanService: PekerjaanService,
		private readonly appService: AppService
	) {}

	@Get('')
	async spamsPetaFind(@Res() res: Response) {
		try {
			const pekerjaans = await this.pekerjaanService.getPekerjaan()
			if (!pekerjaans) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, pekerjaans);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}

  @Post('')
	@UseGuards(JwtGuard)
	async createPekerjaan(@Body() pekerjaanDto: PekerjaanDto, @Res() res: Response) {
		try {
			const errMsg = await this.pekerjaanService.createPekerjaan(pekerjaanDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil menambah data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@Get('/:id') //byid pekerjaan id
	async getPekerjaanById(@Param('id') id: number, @Res() res: Response) {
		try {
			const pekerjaan = await this.pekerjaanService.getPekerjaanById(id)
			if (!pekerjaan) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, pekerjaan);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@Get('/spam/:id') //byid spam id
	@UseGuards(JwtGuard)
	async getPekerjaanBySpamId(@Param('id') id: number, @Res() res: Response) {
		try {
			const pekerjaan = await this.pekerjaanService.getPekerjaanBySpamId(id)
			if (!pekerjaan) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, pekerjaan);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@Put('/:id') //id pekerjaan
	@UseGuards(JwtGuard)
	async updatePekerjaan(@Param('id') id: number, @Body() pekerjaanDto: PekerjaanDto, @Res() res: Response) {
		try {
			const errMsg = await this.pekerjaanService.updatePekerjaan(id, pekerjaanDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil update data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@Delete('/:id') // pekerjaan ID
	async deletePekerjaan(@Param('id') id: number, @Res() res: Response) {
		try {
			const errMsg = await this.pekerjaanService.deletePekerjaan(id)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil delete data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@Delete('/foto/:id') // fotoID
	async deleteFoto(@Param('id') id: number, @Res() res: Response) {
		try {
			const errMsg = await this.pekerjaanService.deleteFoto(id)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil delete data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@Post('/foto')
	async createFoto(@Body() files: {pekerjaanId: number, foto: string}, @Res() res: Response) {
		try {
			const errMsg = await this.pekerjaanService.createFotoPekerjaan(files)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil menambah data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}
}
