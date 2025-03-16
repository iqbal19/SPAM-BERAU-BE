import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { LaporanDto } from './dto/laporan.dto'
import { AdministrasiDto } from './dto/adminstrasi.dto'
import { News } from '@prisma/client'
import { FileService } from 'src/file/file.service'
import * as path from 'path';

@Injectable()
export class LaporanService {
	private readonly baseUrl: string;
	constructor(
		private readonly fileService: FileService,
		private dbService: PrismaService
	) {
		this.baseUrl = process.env.BASE_URL
	}

	async createUrlFoto(foto: string): Promise<string> {
		let fileUrlFoto = ""
		if(foto) {
			const urlFoto = await this.fileService.uploadBase64File(foto, 'laporan');
			fileUrlFoto = `${this.baseUrl}/uploads/${urlFoto}`;
		}
		return fileUrlFoto
	}

	normalizePath(url: string): string {
		return path.normalize(url.replace(/\\/g, '/'));
	}

	async findAllLaporan(): Promise<object> {
		const laporan = await this.dbService.laporan.findMany({
			orderBy: {
				createdAt: 'asc'
			}
		})
		if (!laporan) return null
		return laporan
	}

	async findLaporanBySpam(id: number): Promise<object> {
		const laporan = await this.dbService.laporan.findMany({
			where: {
				spamId: +id
			}
		})
		if (!laporan) return null
		return laporan
	}

	async findLaporanById(id: number): Promise<object> {
		const laporan = await this.dbService.laporan.findUnique({
			where: {
				id: +id
			}
		})
		if (!laporan) return null
		return laporan
	}

	async createLaporan(laporanDto: LaporanDto): Promise<string>  {
		const { bulan, jumlah_sr, sr_aktif, intake, intake_ket, intake_foto, wtp, wtp_ket, wtp_foto, panel_intake, panel_intake_ket, panel_intake_foto, panel_distribusi, panel_distribusi_ket, panel_distribusi_foto, pompa_intake, pompa_intake_ket, pompa_intake_foto, pompa_distribusi, pompa_distribusi_ket, pompa_distribusi_foto, pipa_transmisi, pipa_transmisi_ket, pipa_transmisi_foto, pipa_distribusi, pipa_distribusi_ket, pipa_distribusi_foto, spamId  } = laporanDto

		const newLaporan = await this.dbService.laporan.create({
			data: {
				bulan,
        		jumlah_sr,
				sr_aktif,
				intake,
				intake_ket,
				intake_foto: await this.createUrlFoto(intake_foto),
				wtp,
				wtp_ket,
				wtp_foto: await this.createUrlFoto(wtp_foto),
				panel_intake,
				panel_intake_ket,
				panel_intake_foto: await this.createUrlFoto(panel_intake_foto),
				panel_distribusi,
				panel_distribusi_ket,
				panel_distribusi_foto: await this.createUrlFoto(panel_distribusi_foto),
				pompa_intake,
				pompa_intake_ket,
				pompa_intake_foto: await this.createUrlFoto(pompa_intake_foto),
				pompa_distribusi,
				pompa_distribusi_ket,
				pompa_distribusi_foto: await this.createUrlFoto(pompa_distribusi_foto),
				pipa_transmisi,
				pipa_transmisi_ket,
				pipa_transmisi_foto: await this.createUrlFoto(pipa_transmisi_foto),
				pipa_distribusi,
				pipa_distribusi_ket,
				pipa_distribusi_foto: await this.createUrlFoto(pipa_distribusi_foto),
				spamId
			}
		})
		if (!newLaporan) "Gagal menambah data"
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

	async updateLaporan(id: number, laporanDto: LaporanDto): Promise<string> {
		const { bulan, jumlah_sr, sr_aktif, intake, intake_ket, intake_foto, wtp, wtp_ket, wtp_foto, panel_intake, panel_intake_ket, panel_intake_foto, panel_distribusi, panel_distribusi_ket, panel_distribusi_foto, pompa_intake, pompa_intake_ket, pompa_intake_foto, pompa_distribusi, pompa_distribusi_ket, pompa_distribusi_foto, pipa_transmisi, pipa_transmisi_ket, pipa_transmisi_foto, pipa_distribusi, pipa_distribusi_ket, pipa_distribusi_foto, spamId  } = laporanDto

		const lpr = await this.dbService.laporan.findUnique({
			where: {
				id: +id
			}
		})

		let fotoIntake = ""
		if (this.normalizePath(lpr.intake_foto) !== this.normalizePath(intake_foto)) {
			if (lpr.intake_foto) {
				const url = await this.fileService.updateFile(lpr.intake_foto, intake_foto, "laporan")
				fotoIntake = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoIntake = await this.createUrlFoto(intake_foto)
			}
		} else {
			fotoIntake = intake_foto
		}

		let fotoWtp = ""
		if (this.normalizePath(lpr.wtp_foto) !== this.normalizePath(wtp_foto)) {
			if (lpr.wtp_foto) {
				const url = await this.fileService.updateFile(lpr.wtp_foto, wtp_foto, "laporan")
				fotoWtp = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoWtp = await this.createUrlFoto(wtp_foto)
			}
		} else {
			fotoWtp = wtp_foto
		}

		let fotoPanelIntake = ""
		if (this.normalizePath(lpr.panel_intake_foto) !== this.normalizePath(panel_intake_foto)) {
			if (lpr.panel_intake_foto) {
				const url = await this.fileService.updateFile(lpr.panel_intake_foto, panel_intake_foto, "laporan")
				fotoPanelIntake = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoPanelIntake = await this.createUrlFoto(panel_intake_foto)
			}
		} else {
			fotoPanelIntake = panel_intake_foto
		}

		let fotoPanelDistribusi = ""
		if (this.normalizePath(lpr.panel_distribusi_foto) !== this.normalizePath(panel_distribusi_foto)) {
			if (lpr.panel_distribusi_foto) {
				const url = await this.fileService.updateFile(lpr.panel_distribusi_foto, panel_distribusi_foto, "laporan")
				fotoPanelDistribusi = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoPanelDistribusi = await this.createUrlFoto(panel_distribusi_foto)
			}
		} else {
			fotoPanelDistribusi = panel_distribusi_foto
		}

		let fotoPompaIntake = ""
		if (this.normalizePath(lpr.pompa_intake_foto) !== this.normalizePath(pompa_intake_foto)) {
			if (lpr.pompa_intake_foto) {
				const url = await this.fileService.updateFile(lpr.pompa_intake_foto, pompa_intake_foto, "laporan")
				fotoPompaIntake = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoPompaIntake = await this.createUrlFoto(pompa_intake_foto)
			}
		} else {
			fotoPompaIntake = pompa_intake_foto
		}

		let fotoPompaDistribusi = ""
		if (this.normalizePath(lpr.pompa_distribusi_foto) !== this.normalizePath(pompa_distribusi_foto)) {
			if (lpr.pompa_distribusi_foto) {
				const url = await this.fileService.updateFile(lpr.pompa_distribusi_foto, pompa_distribusi_foto, "laporan")
				fotoPompaDistribusi = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoPompaDistribusi = await this.createUrlFoto(pompa_distribusi_foto)
			}
		} else {
			fotoPompaDistribusi = pompa_distribusi_foto
		}

		let fotoPipaTransmisi = ""
		if (this.normalizePath(lpr.pipa_transmisi_foto) !== this.normalizePath(pipa_transmisi_foto)) {
			if (lpr.pipa_transmisi_foto) {
				const url = await this.fileService.updateFile(lpr.pipa_transmisi_foto, pipa_transmisi_foto, "laporan")
				fotoPipaTransmisi = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoPipaTransmisi = await this.createUrlFoto(pipa_transmisi_foto)
			}
		} else {
			fotoPipaTransmisi = pipa_transmisi_foto
		}

		let fotoPipaDistribusi = ""
		if (this.normalizePath(lpr.pipa_distribusi_foto) !== this.normalizePath(pipa_distribusi_foto)) {
			if (lpr.pipa_distribusi_foto) {
				const url = await this.fileService.updateFile(lpr.pipa_distribusi_foto, pipa_distribusi_foto, "laporan")
				fotoPipaDistribusi = `${this.baseUrl}/uploads/${url}`;
			} else {
				fotoPipaDistribusi = await this.createUrlFoto(pipa_distribusi_foto)
			}
		} else {
			fotoPipaDistribusi = pipa_distribusi_foto
		}

		const updLaporan = await this.dbService.laporan.update({
			where: {
				id: +id
			},
			data: {
				bulan,
        		jumlah_sr,
				sr_aktif,
				intake,
				intake_ket,
				intake_foto: fotoIntake,
				wtp,
				wtp_ket,
				wtp_foto: fotoWtp,
				panel_intake,
				panel_intake_ket,
				panel_intake_foto: fotoPanelIntake,
				panel_distribusi,
				panel_distribusi_ket,
				panel_distribusi_foto: fotoPanelDistribusi,
				pompa_intake,
				pompa_intake_ket,
				pompa_intake_foto: fotoPompaIntake,
				pompa_distribusi,
				pompa_distribusi_ket,
				pompa_distribusi_foto: fotoPompaDistribusi,
				pipa_transmisi,
				pipa_transmisi_ket,
				pipa_transmisi_foto: fotoPipaTransmisi,
				pipa_distribusi,
				pipa_distribusi_ket,
				pipa_distribusi_foto: fotoPipaDistribusi,
				spamId
			}
		})
		if (!updLaporan) 'Gagal mengedit data'
		return null
	}

	async deleteLaporan(id: number): Promise<string> {
		const delLaporan = await this.dbService.laporan.delete({
			where: {
				id: +id
			}
		})
		if (!delLaporan) 'Gagal menghapus data'
		return null
	}

	async createLaporanAdministrasi(administrasiDto: AdministrasiDto): Promise<string>  {
		const { bulan, file_keuangan, file_neraca, spamId  } = administrasiDto

		const newLaporan = await this.dbService.laporanAdministrasi.create({
			data: {
				bulan,
				file_keuangan: await this.createUrlFoto(file_keuangan),
				file_neraca: await this.createUrlFoto(file_neraca),
				spamId
			}
		})
		if (!newLaporan) "Gagal menambah data"
		return null
	}

	async findAllLaporanAdministrasi(): Promise<object> {
		const laporan = await this.dbService.laporanAdministrasi.findMany({
			orderBy: {
				createdAt: 'asc'
			}
		})
		if (!laporan) return null
		return laporan
	}

	async findLaporanAdministrasiBySpam(id: number): Promise<object> {
		const laporan = await this.dbService.laporanAdministrasi.findMany({
			where: {
				spamId: +id
			}
		})
		if (!laporan) return null
		return laporan
	}

	async findLaporanAdministrasiById(id: number): Promise<object> {
		const laporan = await this.dbService.laporanAdministrasi.findUnique({
			where: {
				id: +id
			}
		})
		if (!laporan) return null
		return laporan
	}

	async updateLaporanAdministrasi(id: number, administrasiDto: AdministrasiDto): Promise<string> {
		const { bulan, file_keuangan, file_neraca, spamId  } = administrasiDto

		const lpr = await this.dbService.laporanAdministrasi.findUnique({
			where: {
				id: +id
			}
		})

		let fileKeuangan = ""
		if (this.normalizePath(lpr.file_keuangan) !== this.normalizePath(file_keuangan)) {
			if (lpr.file_keuangan) {
				const url = await this.fileService.updateFile(lpr.file_keuangan, file_keuangan, "laporan")
				fileKeuangan = `${this.baseUrl}/uploads/${url}`;
			} else {
				fileKeuangan = await this.createUrlFoto(file_keuangan)
			}
		} else {
			fileKeuangan = file_keuangan
		}

		let fileNeraca = ""
		if (this.normalizePath(lpr.file_neraca) !== this.normalizePath(file_neraca)) {
			if (lpr.file_neraca) {
				const url = await this.fileService.updateFile(lpr.file_neraca, file_neraca, "laporan")
				fileNeraca = `${this.baseUrl}/uploads/${url}`;
			} else {
				fileNeraca = await this.createUrlFoto(file_neraca)
			}
		} else {
			fileNeraca = file_neraca
		}

		const updLaporan = await this.dbService.laporanAdministrasi.update({
			where: {
				id: +id
			},
			data: {
				bulan,
				file_keuangan: fileKeuangan,
				file_neraca: fileNeraca,
				spamId
			}
		})
		if (!updLaporan) 'Gagal mengedit data'
		return null
	}

	async deleteLaporanAdministrasi(id: number): Promise<string> {
		const delLaporan = await this.dbService.laporanAdministrasi.delete({
			where: {
				id: +id
			}
		})
		if (!delLaporan) 'Gagal menghapus data'
		return null
	}
}
