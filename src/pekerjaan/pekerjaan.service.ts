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

	async getPekerjaan(): Promise<object> {
		const pekerjaans = await this.dbService.pekerjaan.findMany({
			select: {
				id: true,
				lat: true,
				long: true,
				alamat: true,
				description: true,
				fotoPekerjaan: true
			}
		})
		if (!pekerjaans) return null
		return pekerjaans
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
			progress: pekerjaan.progress,
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
		const pekerjaan = await this.dbService.pekerjaan.findMany({
			where: {
				spamId: +id
			},
			include: {
				fotoPekerjaan: true
			}
		})

		const newReturnPekerjaan = pekerjaan.map((item) => {
			return {
				id: item.id,
				lat: item.lat,
				long: item.long,
				alamat: item.alamat,
				description: item.description,
				progress: item.progress,
				fotos: item.fotoPekerjaan.map(item => {
					return {
						fotoId: item.id,
						foto: item.foto
					}
				})
			}
		})

		if (!pekerjaan) return null
		return newReturnPekerjaan
	}

	normalizePath(url: string): string {
		return path.normalize(url.replace(/\\/g, '/'));
	}

	async updatePekerjaan(id: number, pekerjaanDto: PekerjaanDto): Promise<string> {
		const { alamat, lat, long, description, progress, fotos } = pekerjaanDto;

		const existingFotos = await this.dbService.fotoPekerjaan.findMany({
			where: { pekerjaanId: +id },
		});
		
		const fotoUrls: string[] = [];
		
		for (const foto of fotos) {
			if (foto.startsWith('data:image/')) {
				fotoUrls.push(await this.createUrlFoto(foto))
			} else {
				fotoUrls.push(foto)
			}
		}
		
		const result = await this.dbService.$transaction(async (tx) => {
			// Update data pekerjaan
			const pekerjaan = await tx.pekerjaan.update({
				where: { id: +id },
				data: {
					alamat,
					lat,
					long,
					description,
					progress
				},
			});
			
			// Hapus semua foto lama dari database
			await tx.fotoPekerjaan.deleteMany({
				where: { pekerjaanId: +id },
			});
			
			// Hapus file lama dari folder (hanya file lokal)
			const normalizeFoto = fotoUrls.map(it => this.normalizePath(it))
			for (const foto of existingFotos) {
				if (!normalizeFoto.includes(this.normalizePath(foto.foto))) {
					this.fileService.deleteFile(foto.foto)
				}
			}
	
			// Tambahkan foto baru ke database
			for (const fotoUrl of fotoUrls) {
				await tx.fotoPekerjaan.create({
					data: {
						pekerjaanId: pekerjaan.id,
						foto: fotoUrl,
					},
				});
			}
		});

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
