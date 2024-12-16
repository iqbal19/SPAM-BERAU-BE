import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SpamDto } from './dto/spam.dto'
import { Spam } from '@prisma/client'
import { FileService } from 'src/file/file.service'

@Injectable()
export class SpamService {
	private readonly baseUrl: string;
	constructor(
		private readonly fileService: FileService,
		private dbService: PrismaService
	) {
		this.baseUrl = process.env.BASE_URL
	}

	async findAllSpam(): Promise<object> {
		const spam = await this.dbService.spam.findMany({
			where: {
				deletedAt: null
			},
			orderBy: {
				createdAt: 'asc'
			},
			include: {
				spamTitik: true,
				fotoSpam: true,
				rasioSpam: true
			}
		})
		if (!spam) return null
		return spam
	}

  async findAllSpamPeta(): Promise<object> {
    const spam = await this.dbService.spam.findMany({
			where: {
				deletedAt: null
			},
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

	async createUrlFoto(foto: string): Promise<string> {
		let fileUrlFoto = ""
		if(foto) {
			const urlFoto = await this.fileService.uploadBase64File(foto, 'spam');
			fileUrlFoto = `${this.baseUrl}/uploads/${urlFoto}`;
		}
		return fileUrlFoto
	}

	async createSpam(spamDto: SpamDto): Promise<string>  {
		const { nama, alamat, lat, long, kapasitas, kapasitas_intake, kapasitas_produksi, sumber_air, sumber_tenaga, pengelola, sr, riwayat_aktivitas, cakupan, rasio_spam, spam_titik, foto_spam } = spamDto
		const { foto_intake, foto_roservoir, foto_pompa_distibusi, foto_rumah_dosing, foto_wtp} = foto_spam

		const newSpam = await this.dbService.spam.create({
			data: {
				nama,
        alamat,
				lat,
				long,
				kapasitas,
				kapasitas_intake,
				kapasitas_produksi,
				sumber_air,
				sumber_tenaga,
        pengelola,
        sr,
        riwayat_aktivitas,
				// fotoSpam: {
				// 	create: {
				// 		foto_intake: await this.createUrlFoto(foto_intake),
				// 		foto_pompa_distibusi: await this.createUrlFoto(foto_pompa_distibusi),
				// 		foto_roservoir: await this.createUrlFoto(foto_roservoir),
				// 		foto_rumah_dosing: await this.createUrlFoto(foto_rumah_dosing),
				// 		foto_wtp: await this.createUrlFoto(foto_wtp),
				// 	}
				// },
				rasioSpam: {
					create: rasio_spam
				},
				spamTitik: {
					create: spam_titik
				},
				SpamCakupan: {
					create: cakupan.map((m) => ({
						desaId: m, 
					})),
				},
			}
		})

		if (newSpam) {
			await this.dbService.fotoSpam.create({
				data: {
					spamId: newSpam.id,
					foto_intake: await this.createUrlFoto(foto_intake),
					foto_pompa_distibusi: await this.createUrlFoto(foto_pompa_distibusi),
					foto_roservoir: await this.createUrlFoto(foto_roservoir),
					foto_rumah_dosing: await this.createUrlFoto(foto_rumah_dosing),
					foto_wtp: await this.createUrlFoto(foto_wtp),
				}
			})
			return null
		}

		if(!newSpam) return "Gagal menambah data"
	}

	async findSpamById(id: number): Promise<object> {
    const titik = await this.dbService.spam.findUnique({
      where: {
				id: +id, 
				deletedAt: null 
			},
			include:{
				spamTitik: true,
				fotoSpam: true,
				rasioSpam: true,
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
			kapasitas_intake: titik.kapasitas_intake,
			kapasitas_produksi: titik.kapasitas_produksi,
			sr: titik.sr,
			sumber_air: titik.sumber_air,
			sumber_tenaga: titik.sumber_tenaga,
			pengelola: titik.pengelola,
			riwayat_aktivitas: titik.pengelola,
			fotoSpam: titik.fotoSpam,
			rasioSpam: titik.rasioSpam,
			spamTitik: titik.spamTitik,
			createdAt: titik.createdAt,
			updatedAt: titik.updatedAt,
			cakupans
		}

		if (!titik) return null
		return newTitik
	}

	async updateSpam(id: number, spamDto: SpamDto): Promise<string> {
		const { nama, alamat, lat, long, kapasitas, kapasitas_intake, kapasitas_produksi, sumber_air, sumber_tenaga, pengelola, sr, riwayat_aktivitas, cakupan, rasio_spam, spam_titik, foto_spam } = spamDto
		const { foto_intake, foto_roservoir, foto_pompa_distibusi, foto_rumah_dosing, foto_wtp} = foto_spam

		const fotoSpam = await this.dbService.fotoSpam.findUnique({
			where: {
				spamId: +id
			}
		})
		
		let fotoWtp = ""
    if (fotoSpam?.foto_wtp !== foto_wtp) {
			if (fotoSpam?.foto_wtp) {
				const url = await this.fileService.updateFile(fotoSpam.foto_wtp, foto_wtp, "spam")
				fotoWtp = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoWtp = await this.createUrlFoto(foto_wtp)
			}
    } else {
			fotoWtp = foto_wtp
    }

    let fotoIntake = ""
    if (fotoSpam?.foto_intake !== foto_intake) {
			if (fotoSpam?.foto_intake) {
				const url = await this.fileService.updateFile(fotoSpam.foto_intake, foto_intake, "spam")
				fotoIntake = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoIntake = await this.createUrlFoto(foto_intake)
			}
    } else {
      fotoIntake = foto_intake
    }

		let fotoPompa = ""
    if (fotoSpam?.foto_pompa_distibusi !== foto_pompa_distibusi) {
			if (fotoSpam?.foto_pompa_distibusi) {
				const url = await this.fileService.updateFile(fotoSpam.foto_pompa_distibusi, foto_pompa_distibusi, "spam")
				fotoPompa = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoPompa = await this.createUrlFoto(foto_pompa_distibusi)
			}
    } else {
			fotoPompa = foto_pompa_distibusi
    }
		
		let fotoRoservoir = ""
    if (fotoSpam?.foto_roservoir !== foto_roservoir) {
			if (fotoSpam?.foto_roservoir) {
				const url = await this.fileService.updateFile(fotoSpam.foto_roservoir, foto_roservoir, "spam")
				fotoRoservoir = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoRoservoir = await this.createUrlFoto(foto_roservoir)
			}
    } else {
			fotoRoservoir = foto_roservoir
    }
		
		let fotoDosing = ""
    if (fotoSpam?.foto_rumah_dosing !== foto_rumah_dosing) {
			if (fotoSpam?.foto_rumah_dosing) {
				const url = await this.fileService.updateFile(fotoSpam.foto_rumah_dosing, foto_rumah_dosing, "spam")
				fotoDosing = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoDosing = await this.createUrlFoto(foto_rumah_dosing)
			}
    } else {
      fotoDosing = foto_rumah_dosing
    }

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
				kapasitas_intake,
				kapasitas_produksi,
				sumber_air,
				sumber_tenaga,
        pengelola,
        sr,
        riwayat_aktivitas,
				rasioSpam: {
					upsert: {
						create: rasio_spam,
						update: rasio_spam
					}
				},
				spamTitik: {
					upsert: {
						create: spam_titik,
						update: spam_titik
					}
				},
				fotoSpam: {
					upsert: {
						create: {
							foto_intake: fotoIntake,
							foto_wtp: fotoWtp,
							foto_pompa_distibusi: fotoPompa,
							foto_rumah_dosing: fotoDosing,
							foto_roservoir: fotoRoservoir
						},
						update: {
							foto_intake: fotoIntake,
							foto_wtp: fotoWtp,
							foto_pompa_distibusi: fotoPompa,
							foto_rumah_dosing: fotoDosing,
							foto_roservoir: fotoRoservoir
						}
					}
				},
				SpamCakupan: {
					deleteMany: {},
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
