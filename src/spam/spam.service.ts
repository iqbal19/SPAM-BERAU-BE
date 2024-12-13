import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SpamDto } from './dto/spam.dto'
import { Spam } from '@prisma/client'

@Injectable()
export class SpamService {
	private readonly baseUrl: string;
	constructor(
		private dbService: PrismaService
	) {
		this.baseUrl = process.env.BASE_URL
	}

	async findAllSpam(): Promise<object> {
		const spam = await this.dbService.spam.findMany({
			orderBy: {
				createdAt: 'asc'
			}
		})
		if (!spam) return null
		return spam
	}

  async findAllSpamPeta(): Promise<object> {
    const spam = await this.dbService.spam.findMany({
			orderBy: {
				createdAt: 'asc'
			}
		})
    const spamPeta = spam.map((item) => {
      return {
        id: item.id,
        nama: item.nama,
        latLong: [item.lat, item.long]
      }
    })
		if (!spam) return null
		return spamPeta
  }

	async createSpam(spamDto: SpamDto): Promise<string>  {
		const { nama, alamat, lat, long, kapasitas, pengelola, sr, riwayat_aktivitas, cakupan } = spamDto

		const newSpam = await this.dbService.spam.create({
			data: {
				nama,
        alamat,
				lat,
				long,
				kapasitas,
        pengelola,
        sr,
        riwayat_aktivitas,
        cakupan
			}
		})
		if (!newSpam) "Gagal menambah data"
		return null
	}

	async findSpamById(id: number): Promise<object> {
    let desaCakupan = []
    const titik = await this.dbService.spam.findUnique({
      where: { id: +id },
    });
    if (titik?.cakupan) {
      const desaIds = titik.cakupan as number[]; 
      desaCakupan = await this.dbService.desa.findMany({
        where: {
          id: { in: desaIds },
        },
      });
    }

    const titikWithCakupan = {
      ...titik,
      cakupan: desaCakupan, 
    };
		if (!titik) return null
		return titikWithCakupan
	}

	async updateSpam(id: number, spamDto: SpamDto): Promise<string> {
		const { nama, alamat, lat, long, kapasitas, pengelola, sr, riwayat_aktivitas, cakupan } = spamDto
		
    const updPengurus = await this.dbService.spam.update({
			where: {
				id: +id
			},
			data: {
				nama,
        alamat,
				lat,
				long,
				kapasitas,
        pengelola,
        sr,
        riwayat_aktivitas,
        cakupan
			}
		})
		if (!updPengurus) 'Gagal mengedit data'
		return null
	}

	async deleteSpam(id: number): Promise<string> {
		const delPengurus = await this.dbService.spam.delete({
			where: {
				id: id
			}
		})
		if (!delPengurus) 'Gagal menghapus data'
    return null
	}
}
