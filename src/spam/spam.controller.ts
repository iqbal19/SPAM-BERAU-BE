import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards, Res, Delete, Query } from '@nestjs/common'
import { SpamService } from './spam.service'
import { SpamDto } from './dto/spam.dto'
import { Response } from 'express'
import { JwtGuard } from 'src/guard/jwt.guard'
import { AppService } from 'src/app.service'

@Controller('v1/api/spam')
export class SpamController {
	constructor(
		private spamService: SpamService,
		private readonly appService: AppService
	) {}

  @Get()
	async spamsPetaFind(@Res() res: Response) {
		try {
			const spams = await this.spamService.findAllSpamPeta()
			if (!spams) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, spams);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}

  @UseGuards(JwtGuard)
	@Get()
	async spamsFind(@Res() res: Response) {
		try {
			const spams = await this.spamService.findAllSpam()
			if (!spams) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, spams);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}
	
  @UseGuards(JwtGuard)
	@Post() // cerate new
	async spamCreate(@Body() spamDto: SpamDto, @Res() res: Response) {
		try {
			const errMsg = await this.spamService.createSpam(spamDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil menambahkan data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

  @UseGuards(JwtGuard)
  @Get('/:id')
  async getDetailSpam(@Param('id') id: number, @Res() res: Response) {
    try {
			const spam = await this.spamService.findSpamById(id)
			if (!spam) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, spam);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
  }

  @UseGuards(JwtGuard)
	@Put('/:id') 
	async spamUpdate(@Param('id') id: number, @Body() spamDto: SpamDto, @Res() res: Response) {
		try {
			const errMsg = await this.spamService.updateSpam(id, spamDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil mengedit data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			console.log(error)
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}

  @UseGuards(JwtGuard)
	@Delete('/:id')
	async spamDelete(@Param('id') id: number, @Res() res: Response) {
		try {
			const errMsg = await this.spamService.deleteSpam(id)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil mengahapus data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, 'terjadi kesalahan');
		}
	}
}
