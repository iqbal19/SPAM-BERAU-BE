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
			},
			include: {
				fileLaporan: true
			}
		})

		const laporanWithDirectFiles = laporan.map(lap => {
			const groupedFiles = lap.fileLaporan.reduce((acc, file) => {
				const key = `${file.type}_file`; // Ubah key menjadi "type_file"  
				if (!acc[key]) {
				  acc[key] = []; // Buat array baru jika belum ada
				}
				acc[key].push(file); // Simpan objek file lengkap
				return acc;
			}, {} as Record<string, typeof lap.fileLaporan>);
		  
			return {
			  ...lap,
			  ...groupedFiles, // Gabungkan hasil grouping ke dalam objek laporan langsung
			  fileLaporan: undefined // Hilangkan properti fileLaporan lama
			};
		});

		if (!laporan) return null
		return laporanWithDirectFiles
	}

	async findLaporanBySpam(id: number): Promise<object> {
		const laporan = await this.dbService.laporan.findMany({
			where: {
				spamId: +id
			},
			include: {
				fileLaporan: true
			}
		})

		const laporanWithDirectFiles = laporan.map(lap => {
			const groupedFiles = lap.fileLaporan.reduce((acc, file) => {
				const key = `${file.type}_file`; // Ubah key menjadi "type_file"  
				if (!acc[key]) {
				  acc[key] = []; // Buat array baru jika belum ada
				}
				acc[key].push(file); // Simpan objek file lengkap
				return acc;
			}, {} as Record<string, typeof lap.fileLaporan>);
		  
			return {
			  ...lap,
			  ...groupedFiles, // Gabungkan hasil grouping ke dalam objek laporan langsung
			  fileLaporan: undefined // Hilangkan properti fileLaporan lama
			};
		});

		if (!laporan) return null
		return laporanWithDirectFiles
	}

	async findLaporanById(id: number): Promise<object> {
		const laporan = await this.dbService.laporan.findUnique({
			where: {
				id: +id
			},
			include: {
				fileLaporan: true
			}
		})

		const groupedFiles = laporan.fileLaporan.reduce((acc, file) => {
			const key = `${file.type}_file`; // Ubah key menjadi "type_file"  
			if (!acc[key]) {
			  acc[key] = []; // Buat array baru jika belum ada
			}
			acc[key].push(file); // Simpan objek file lengkap
			return acc;
		}, {} as Record<string, typeof laporan.fileLaporan>);
		
		if (!laporan) return null
		return {
			...laporan,
			...groupedFiles, // Gabungkan hasil grouping
			fileLaporan: undefined // Hilangkan properti lama agar lebih rapi
		};
	}

	async createLaporan(laporanDto: LaporanDto): Promise<string>  {
		const { bulan, jumlah_sr, sr_aktif, intake, intake_ket, wtp, wtp_ket, panel_intake, 
			panel_intake_ket, panel_distribusi, panel_distribusi_ket, pompa_intake, pompa_intake_ket, 
			pompa_distribusi, pompa_distribusi_ket, pipa_transmisi, pipa_transmisi_ket, pipa_distribusi, 
			pipa_distribusi_ket, spamId, fileLaporan  } = laporanDto
		
		const fileLaporanData = await Promise.all(
			fileLaporan.map(async (fl) => ({
				type: fl.type,
				file: await this.createUrlFoto(fl.file) // ✅ `await` berjalan dengan `Promise.all()`
			}))
		);

		const newLaporan = await this.dbService.laporan.create({
			data: {
				bulan,
        		jumlah_sr,
				sr_aktif,
				intake,
				intake_ket,
				wtp,
				wtp_ket,
				panel_intake,
				panel_intake_ket,
				panel_distribusi,
				panel_distribusi_ket,
				pompa_intake,
				pompa_intake_ket,
				pompa_distribusi,
				pompa_distribusi_ket,
				pipa_transmisi,
				pipa_transmisi_ket,
				pipa_distribusi,
				pipa_distribusi_ket,
				spamId,
				fileLaporan: { create: fileLaporanData } 
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
		const { bulan, jumlah_sr, sr_aktif, intake, intake_ket, wtp, wtp_ket, panel_intake, panel_intake_ket, 
			panel_distribusi, panel_distribusi_ket, pompa_intake, pompa_intake_ket, pompa_distribusi,
			pompa_distribusi_ket, pipa_transmisi, pipa_transmisi_ket, pipa_distribusi, pipa_distribusi_ket, 
			spamId, fileLaporan} = laporanDto

		const fileLaporanData = fileLaporan
			? await Promise.all(
				fileLaporan.map(async (fl) => ({
				  where: { id: fl.id ?? 0 }, // Jika ID ada, update; jika tidak, buat baru
				  update: fl.file
					? { type: fl.type, file: await this.createUrlFoto(fl.file) } // 🔥 Simpan file baru jika Base64 dikirim
					: {},
				  create: { type: fl.type, file: await this.createUrlFoto(fl.file) }
				}))
			  )
			: undefined;

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
				wtp,
				wtp_ket,
				panel_intake,
				panel_intake_ket,
				panel_distribusi,
				panel_distribusi_ket,
				pompa_intake,
				pompa_intake_ket,
				pompa_distribusi,
				pompa_distribusi_ket,
				pipa_transmisi,
				pipa_transmisi_ket,
				pipa_distribusi,
				pipa_distribusi_ket,
				spamId,
				fileLaporan: fileLaporanData ? { upsert: fileLaporanData } : undefined
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
