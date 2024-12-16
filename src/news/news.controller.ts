import { Body, Controller, Get, HttpStatus, Param, Post, Put, UseGuards, Res, Delete, Query } from '@nestjs/common'
import { NewsService } from './news.service'
import { NewsDto } from './dto/news.dto'
import { Response } from 'express'
import { JwtGuard } from 'src/guard/jwt.guard'
import { AppService } from 'src/app.service'

@Controller('v1/api/news')
export class NewsController {
	constructor(
		private newsService: NewsService,
		private readonly appService: AppService
	) {}
	
	@Get('/public')
	async newsPublic(@Res() res: Response) {
		try {
			const news = await this.newsService.findNewsPublic()
			if (!news) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, news);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}

	@UseGuards(JwtGuard)
	@Get()
	async news(@Res() res: Response) {
		try {
			const news = await this.newsService.findAllNews()
			if (!news) return this.appService.responseError(res, 400, 'data tidak ditemukan');
			return this.appService.responseSuccess(res, HttpStatus.OK, news);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}
	
	@UseGuards(JwtGuard)
	@Post() // cerate new user
	async newsCreate(@Body() newsDto: NewsDto, @Res() res: Response) {
		try {
			const errMsg = await this.newsService.createNews(newsDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil menambahkan data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}
	
	@UseGuards(JwtGuard)
	@Put('/:id')
	async newsUpdate(@Param('id') id: number, @Body() newsDto: NewsDto, @Res() res: Response) {
		try {
			const errMsg = await this.newsService.updateNews(id, newsDto)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil mengedit data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}
	
	@UseGuards(JwtGuard)
	@Delete('/:id')
	async newsDelete(@Param('id') id: number, @Res() res: Response) {
		try {
			const errMsg = await this.newsService.deleteNews(id)
			if (!errMsg) return this.appService.responseSuccess(res, HttpStatus.OK, 'Berhasil mengahapus data');
			return this.appService.responseError(res, 400, errMsg);
		} catch (error) {
			return this.appService.responseError(res, 400, error);
		}
	}
}
