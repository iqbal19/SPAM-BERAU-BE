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
				createdAt: 'asc',
				deletedAt: null
			}
		})
		if (!spam) return null
		return spam
	}

  async findAllSpamPeta(): Promise<object> {
    const spam = await this.dbService.spam.findMany({
			orderBy: {
				createdAt: 'asc',
				deletedAt: null
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
				SpamCakupan: {
					create: cakupan.map((m) => ({
						desaId: m, 
					})),
				},
			}
		})

		if(!newSpam) return "Gagal menambah data"
		return null
	}

	async findSpamById(id: number): Promise<object> {
    const titik = await this.dbService.spam.findUnique({
      where: {
				id: +id, 
				deletedAt: null 
			},
			include:{
				SpamCakupan: {
					include: { 
						desa: true
					}
				}
			}
    });

		const cakupans = titik?.SpamCakupan.map((item) => {
			return {
				idDesa: item?.desa?.id.toString(),
				namaDesa: item?.desa?.name
			}
		})

		const newTitik = {
			id: titik.id,
			lat: titik.lat,
			long: titik.long,
			nama: titik.nama,
			alamat: titik.alamat,
			kapasitas: titik.kapasitas,
			sr: titik.sr,
			pengelola: titik.pengelola,
			riwayat_aktivitas: titik.pengelola,
			createdAt: titik.createdAt,
			updatedAt: titik.updatedAt,
			cakupans
		}

		if (!titik) return null
		return newTitik
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
				SpamCakupan: {
					create: cakupan.map((m) => ({
						desaId: m, 
					})),
				},
			}
		})
		if (!updPengurus) 'Gagal mengedit data'
		return null
	}

	async deleteSpam(id: number): Promise<string> {
		const delPengurus = await this.dbService.spam.update({
			where: {
				id: +id
			},
			data: {
				deletedAt: new Date()
			}
		})
		if (!delPengurus) 'Gagal menghapus data'
    return null
	}
}
