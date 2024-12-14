import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards, Res, Delete, Query } from '@nestjs/common'
import { MasterService } from './master.service'
import { Response } from 'express'
// import { JwtGuard } from 'src/guard/jwt.guard'
import { AppService } from 'src/app.service'

@Controller('v1/api/master')
export class MasterController {
	constructor(
		private masterService: MasterService,
		private readonly appService: AppService
	) {}

  @Get('/desa')
	async getDesa(@Res() res: Response) {
		try {
			const desa = await this.masterService.findAllDesa()
			if (!desa) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, desa);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

}
