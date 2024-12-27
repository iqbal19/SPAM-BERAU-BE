import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { FileService } from 'src/file/file.service'
import { PekerjaanDto } from './dto/pekerjaan.dto';
import * as path from 'path';

@Injectable()
export class PekerjaanService {
	private readonly baseUrl: string;
	constructor(
		private readonly fileService: FileService,
		private dbService: PrismaService
	) {
		this.baseUrl = process.env.BASE_URL
	}

	async createPekerjaan(pekerjaanDto: PekerjaanDto): Promise<string> {
		const {alamat, lat, long, description, progress, spamId, fotos} = pekerjaanDto;
		const newPekerjaan = await this.dbService.pekerjaan.create({
			data: {
				spamId,
				alamat,
				lat,
				long,
				description,
				progress
			}
		})

		if (newPekerjaan) {
			const newFotoData = await Promise.all(
				fotos.map(async (m) => ({
					pekerjaanId: +newPekerjaan.id,
					foto: await this.createUrlFoto(m),
				})),
			);

			const newFoto = await this.dbService.fotoPekerjaan.createMany({
				data: newFotoData
			})
			if (!newFoto) return "gagal"
			return null
		} else {
			return "Gagal menambah pekerjaan"
		}
	}

	async createUrlFoto(foto: string): Promise<string> {
		let fileUrlFoto = ""
		if(foto) {
			const urlFoto = await this.fileService.uploadBase64File(foto, 'pekerjaan');
			fileUrlFoto = `${this.baseUrl}/uploads/${urlFoto}`;
		}
		return fileUrlFoto
	}

	async getPekerjaanById(id: number): Promise<object> {
		const pekerjaan = await this.dbService.pekerjaan.findFirst({
			where: {
				id: +id
			},
			include: {
				fotoPekerjaan: true
			}
		})

		const newReturnPekerjaan = {
			id: pekerjaan.id,
			lat: pekerjaan.lat,
			long: pekerjaan.long,
			alamat: pekerjaan.alamat,
			description: pekerjaan.description,
			fotos: pekerjaan.fotoPekerjaan.map(item => {
				return {
					fotoId: item.id,
					foto: item.foto
				}
			})
		}

		if (!pekerjaan) return null
		return newReturnPekerjaan
	}

	async getPekerjaanBySpamId(id: number): Promise<object> {
		const pekerjaan = await this.dbService.pekerjaan.findFirst({
			where: {
				spamId: +id
			},
			include: {
				fotoPekerjaan: true
			}
		})

		const newReturnPekerjaan = {
			id: pekerjaan.id,
			lat: pekerjaan.lat,
			long: pekerjaan.long,
			alamat: pekerjaan.alamat,
			description: pekerjaan.description,
			fotos: pekerjaan.fotoPekerjaan.map(item => {
				return {
					fotoId: item.id,
					foto: item.foto
				}
			})
		}

		if (!pekerjaan) return null
		return newReturnPekerjaan
	}

	normalizePath(url: string): string {
		return path.normalize(url.replace(/\\/g, '/'));
	}

	async updatePekerjaan(id: number, pekerjaanDto: PekerjaanDto): Promise<string> {
		const { alamat, lat, long, description, progress } = pekerjaanDto;
		// Update pekerjaan
		const uptPekerjaan = await this.dbService.pekerjaan.update({
			where: { spamId: +id },
			data: {
				alamat,
				lat,
				long,
				description,
				progress
			},
		});

		if (!uptPekerjaan) return "Gegal update pekerjaan"
		return null
	}

	async deletePekerjaan(id: number): Promise<string> {
		const fotoPekerjaan = await this.dbService.fotoPekerjaan.findMany({
			where: {
				pekerjaanId: +id
			},
			select: {
				foto: true
			}
		})
		const delFoto = await this.dbService.fotoPekerjaan.deleteMany({
			where: {
				pekerjaanId: +id
			}
		})
		if (delFoto) {
			fotoPekerjaan.forEach((item) => {
				this.fileService.deleteFile(item.foto)
			})
			const delPekerjaan = await this.dbService.pekerjaan.delete({
				where: {
					id: +id
				}
			})
			if (!delPekerjaan) return "gagal hapus pekerjaan"
			return null
		}
	}

	async deleteFoto(id: number): Promise<string> {
		const ft = await this.dbService.fotoPekerjaan.findUnique({
			where: {
				id: +id
			}
		})
		const delFoto = await this.dbService.fotoPekerjaan.delete({
			where: {
				id: +id
			}
		})
		if (!delFoto) {
			return 'Gagal menghapus data'
		} else {
			this.fileService.deleteFile(ft.foto)
			return null
		}
	}

	async createFotoPekerjaan(files: {pekerjaanId: number, foto: string}): Promise<string> {
		const newFoto = await this.dbService.fotoPekerjaan.create({
			data: {
				pekerjaanId: files.pekerjaanId,
				foto: await this.createUrlFoto(files.foto)
			}
		})

		if (!newFoto) return "Gagal nambah data"
		return null
	}

}
