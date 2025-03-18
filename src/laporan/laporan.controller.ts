import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards, Res, Delete, Query } from '@nestjs/common'
import { LaporanService } from './laporan.service'
import { LaporanDto } from './dto/laporan.dto'
import { AdministrasiDto } from './dto/adminstrasi.dto'
import { Response } from 'express'
import { JwtGuard } from 'src/guard/jwt.guard'
import { AppService } from 'src/app.service'
import { StatusDto } from './dto/status.dto'

@Controller('v1/api/laporan')
export class LaporanController {
	constructor(
		private laporanService: LaporanService,
		private readonly appService: AppService
	) {}

	@UseGuards(JwtGuard)
	@Get()
	async laporans(@Res() res: Response) {
		try {
			const news = await this.laporanService.findAllLaporan()
			if (!news) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, news);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@UseGuards(JwtGuard)
	@Get('/rekap')
	async Rekap(@Query('tahun') tahun: string, @Query('kategori') kategori: string, @Res() res: Response) {
		try {
			const news = await this.laporanService.findRekap(tahun, kategori)
			if (!news) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, news);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@UseGuards(JwtGuard)
	@Get('/spam/:id')
	async laporanBySpam(@Param('id') id: number, @Query('tahun') tahun: string, @Res() res: Response) {
		try {
			const news = await this.laporanService.findLaporanBySpam(id, tahun)
			if (!news) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, news);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@UseGuards(JwtGuard)
	@Get('/:id')
	async laporanById(@Param('id') id: number, @Res() res: Response) {
		try {
			const news = await this.laporanService.findLaporanById(id)
			if (!news) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, news);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@UseGuards(JwtGuard)
	@Post() // cerate new user
	async laporanCreate(@Body() laporanDto: LaporanDto, @Res() res: Response) {
		try {
			const errMsg = await this.laporanService.createLaporan(laporanDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil menambahkan data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}
	
	@UseGuards(JwtGuard)
	@Put('/:id')
	async laporanUpdate(@Param('id') id: number, @Body() laporanDto: LaporanDto, @Res() res: Response) {
		try {
			const errMsg = await this.laporanService.updateLaporan(id, laporanDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil mengedit data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@UseGuards(JwtGuard)
	@Put('/:id/status')
	async editStatusLaporan(@Param('id') id: number, @Body() statusDto: StatusDto, @Res() res: Response) {
		try {
			const errMsg = await this.laporanService.editStatus(id, statusDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil mengedit data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}
	
	@UseGuards(JwtGuard)
	@Delete('/:id')
	async laporanDelete(@Param('id') id: number, @Res() res: Response) {
		try {
			const errMsg = await this.laporanService.deleteLaporan(id)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil mengahapus data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@UseGuards(JwtGuard)
	@Get('/administrasi')
	async laporanAdministrasi(@Res() res: Response) {
		try {
			const news = await this.laporanService.findAllLaporanAdministrasi()
			if (!news) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, news);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@UseGuards(JwtGuard)
	@Get('/administrasi/spam/:id')
	async laporanAdministrasiBySpam(@Param('id') id: number, @Res() res: Response) {
		try {
			const news = await this.laporanService.findLaporanAdministrasiBySpam(id)
			if (!news) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, news);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@UseGuards(JwtGuard)
	@Get('/administrasi/:id')
	async laporanAdministrasiById(@Param('id') id: number, @Res() res: Response) {
		try {
			const news = await this.laporanService.findLaporanAdministrasiById(id)
			if (!news) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, news);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@UseGuards(JwtGuard)
	@Post('/administrasi') // cerate new user
	async laporanAdministrasiCreate(@Body() laporanDto: AdministrasiDto, @Res() res: Response) {
		try {
			const errMsg = await this.laporanService.createLaporanAdministrasi(laporanDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil menambahkan data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}
	
	@UseGuards(JwtGuard)
	@Put('/administrasi/:id')
	async laporanAdministrasiUpdate(@Param('id') id: number, @Body() laporanDto: AdministrasiDto, @Res() res: Response) {
		try {
			const errMsg = await this.laporanService.updateLaporanAdministrasi(id, laporanDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil mengedit data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}
	
	@UseGuards(JwtGuard)
	@Delete('/administrasi/:id')
	async laporanAdministrasiDelete(@Param('id') id: number, @Res() res: Response) {
		try {
			const errMsg = await this.laporanService.deleteLaporanAdministrasi(id)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil mengahapus data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}
}
