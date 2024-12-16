import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { NewsDto } from './dto/news.dto'
import { News } from '@prisma/client'

@Injectable()
export class NewsService {
	constructor(
		private dbService: PrismaService
	) {
	}

	async findNewsPublic(): Promise<object> {
		const news = await this.dbService.news.findMany({
			orderBy: {
				createdAt: 'asc'
			}
		})
		const newsPublic = news.map((dt) => dt.description)
		if (!news) return null
		return newsPublic
	}

	async findAllNews(): Promise<object> {
		const news = await this.dbService.news.findMany({
			orderBy: {
				createdAt: 'asc'
			}
		})
		if (!news) return null
		return news
	}

	async createNews(newsDto: NewsDto): Promise<string>  {
		const { title, description } = newsDto

		const newNews = await this.dbService.news.create({
			data: {
				title,
        description
			}
		})
		if (!newNews) "Gagal menambah data"
		return null
	}

	async findNewsById(id: number): Promise<News> {
    const news = await this.dbService.news.findUnique({
			where: {
				id: +id
			}
		})
		if (!news) return null
		return news
	}

	async updateNews(id: number, newsDto: NewsDto): Promise<string> {
		const { title, description } = newsDto
		let fotoUpdate = ""

		const updNews = await this.dbService.news.update({
			where: {
				id: +id
			},
			data: {
				title,
				description
			}
		})
		if (!updNews) 'Gagal mengedit data'
		return null
	}

	async deleteNews(id: number): Promise<string> {
		const delNews = await this.dbService.news.delete({
			where: {
				id: +id
			}
		})
		if (!delNews) 'Gagal menghapus data'
		return null
	}
}
