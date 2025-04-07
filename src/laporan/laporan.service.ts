import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { LaporanDto } from './dto/laporan.dto'
import { AdministrasiDto } from './dto/adminstrasi.dto'
import { News } from '@prisma/client'
import { FileService } from 'src/file/file.service'
import * as path from 'path';
import { StatusDto, TypeLaporan } from './dto/status.dto'

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

	async buatRekap(laporan: any[], kategoriFilter: string): Promise<{ bulan: number; baik: number; rusak: number }[]> {
		const rekap: Record<number, { bulan: number, baik: number, rusak: number }> = {};
		for (let i = 1; i <= 12; i++) {
		  rekap[i] = { bulan: i, baik: 0, rusak: 0 };
		}
		laporan.forEach(lap => {
		  const bulan = parseInt(lap.bulan.split("-")[1]); // Ambil angka bulan dari "YYYY-MM"
	  
		  if (lap[kategoriFilter]) { // Hanya cek kategori yang dipilih
			if (lap[kategoriFilter].includes("BAIK")) {
			  rekap[bulan].baik += 1;
			} else if (lap[kategoriFilter].includes("RUSAK")) {
			  rekap[bulan].rusak += 1;
			}
		  }
		});
		return Object.values(rekap);
	}

	async getTotalSr(tahun: string): Promise<{total_jumlah_sr: number, total_sr_aktif: number}> {
		const total = await this.dbService.laporan.aggregate({
			where: {
			  ...(tahun && { bulan: { startsWith: tahun } })
			},
			_sum: {
			  jumlah_sr: true,
			  sr_aktif: true
			}
		});
		return {
			total_jumlah_sr: Number(total._sum.jumlah_sr) || 0,
			total_sr_aktif: Number(total._sum.sr_aktif) || 0
		};
	}

	async findRekap(tahun?: string, kategori?: string): Promise<object> {
		const laporan = await this.dbService.laporan.findMany({
			where: {
				...(tahun && { bulan: { startsWith: tahun } })
			},
			include: {
				fileLaporan: true
			}
		})
		const mapRekap = await this.buatRekap(laporan, kategori)
		const totalSr = await this.getTotalSr(tahun)

		const totalSpam = await this.dbService.spam.count({
			where: {
			  deletedAt: null
			}
		});

		return {
			rekap: mapRekap,
			sr: totalSr,
			total_spam: totalSpam
		}
	}

	async findAllSpam(): Promise<object> {
		const laporan = await this.dbService.laporan.findMany({
			orderBy: {
				createdAt: 'asc'
			},
			include: {
				fileLaporan: true,
				riwayatStatus: true,
				spam: true
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

			// Mendapatkan tanggal perbaikan terakhir berdasarkan kategori dari TypeLaporan
			const lastRepairDates = Object.values(TypeLaporan).reduce<Record<string, string | null>>(
				(acc, category) => {
					  const lastEntry = lap.riwayatStatus
						.filter(status => status.type === category)
						.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
			  
					acc[`tgl_perbaiki_${category}`] = lastEntry ? new Date(lastEntry.createdAt).toISOString() : null;
					  return acc;
				},
				{} // Pastikan objek awal sesuai dengan tipe `Record<string, string | null>`
			);
		  
			return {
				spam: {
					id: lap.spam?.id,
					nama: lap.spam?.nama,
					lat: lap.spam?.lat,
					long: lap.spam?.long
				},
				laporan: {
					...lap,
					...groupedFiles, // Gabungkan hasil grouping file
					...lastRepairDates, // Gabungkan hasil tanggal perbaikan
					fileLaporan: undefined, // Hilangkan properti fileLaporan lama
					riwayatStatus: undefined, // Hilangkan properti riwayatStatus lama
					spam: undefined
				}
			};
		});

		if (!laporan) return null
		return laporanWithDirectFiles
	}

	async findAllLaporan(): Promise<object> {
		const laporan = await this.dbService.laporan.findMany({
			orderBy: {
				createdAt: 'asc'
			},
			include: {
				fileLaporan: true,
				riwayatStatus: true
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

			// Mendapatkan tanggal perbaikan terakhir berdasarkan kategori dari TypeLaporan
			const lastRepairDates = Object.values(TypeLaporan).reduce<Record<string, string | null>>(
				(acc, category) => {
					  const lastEntry = lap.riwayatStatus
						.filter(status => status.type === category)
						.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
			  
					acc[`tgl_perbaiki_${category}`] = lastEntry ? new Date(lastEntry.createdAt).toISOString() : null;
					  return acc;
				},
				{} // Pastikan objek awal sesuai dengan tipe `Record<string, string | null>`
			);
		  
			return {
				...lap,
				...groupedFiles, // Gabungkan hasil grouping file
				...lastRepairDates, // Gabungkan hasil tanggal perbaikan
				fileLaporan: undefined, // Hilangkan properti fileLaporan lama
				riwayatStatus: undefined // Hilangkan properti riwayatStatus lama
			};
		});

		if (!laporan) return null
		return laporanWithDirectFiles
	}

	async findLaporanBySpam(id: number, tahun?: string): Promise<object> {
		const laporan = await this.dbService.laporan.findMany({
		  where: {
			spamId: +id,
			...(tahun && { bulan: { startsWith: tahun } })
		  },
		  include: {
			fileLaporan: true,
			riwayatStatus: true
		  }
		});
	  
		if (!laporan) return null;
	  
		const laporanWithFilesAndDates = laporan.map(lap => {
		  // Grouping file berdasarkan kategori
		  const groupedFiles = lap.fileLaporan.reduce((acc, file) => {
			const key = `${file.type}_file`; // Ubah key menjadi "type_file"
			if (!acc[key]) {
			  acc[key] = [];
			}
			acc[key].push(file);
			return acc;
		  }, {} as Record<string, typeof lap.fileLaporan>);
	  
		  // Mendapatkan tanggal perbaikan terakhir berdasarkan kategori dari TypeLaporan
		  const lastRepairDates = Object.values(TypeLaporan).reduce<Record<string, string | null>>(
			(acc, category) => {
			  	const lastEntry = lap.riwayatStatus
					.filter(status => status.type === category)
					.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
		  
				acc[`tgl_perbaiki_${category}`] = lastEntry ? new Date(lastEntry.createdAt).toISOString() : null;
			  	return acc;
			},
			{} // Pastikan objek awal sesuai dengan tipe `Record<string, string | null>`
		  );
		  
	  
		  return {
			...lap,
			...groupedFiles, // Gabungkan hasil grouping file
			...lastRepairDates, // Gabungkan hasil tanggal perbaikan
			fileLaporan: undefined, // Hilangkan properti fileLaporan lama
			riwayatStatus: undefined // Hilangkan properti riwayatStatus lama
		  };
		});
	  
		return laporanWithFilesAndDates;
	}
	  

	async findLaporanById(id: number): Promise<object> {
		const laporan = await this.dbService.laporan.findUnique({
			where: {
				id: +id
			},
			include: {
				fileLaporan: true,
				riwayatStatus: true
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

		const lastRepairDates = Object.values(TypeLaporan).reduce<Record<string, string | null>>(
			(acc, category) => {
			  	const lastEntry = laporan.riwayatStatus
					.filter(status => status.type === category)
					.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
		  
				acc[`tgl_perbaiki_${category}`] = lastEntry ? new Date(lastEntry.createdAt).toISOString() : null;
			  	return acc;
			},
			{} // Pastikan objek awal sesuai dengan tipe `Record<string, string | null>`
		);
		
		if (!laporan) return null
		return {
			...laporan,
			...groupedFiles, // Gabungkan hasil grouping file
			...lastRepairDates, // Gabungkan hasil tanggal perbaikan
			fileLaporan: undefined, // Hilangkan properti fileLaporan lama
			riwayatStatus: undefined // Hilangkan properti riwayatStatus lama
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

	async editStatus(id: number, statusDto: StatusDto): Promise<string> {
		const { kategori, status } = statusDto
		const allowedKategori = [
			"intake", "wtp", "panel_intake", "panel_distribusi",
			"pompa_intake", "pompa_distribusi", "pipa_transmisi", "pipa_distribusi"
		];
	
		if (!allowedKategori.includes(kategori)) {
			return "Kategori tidak valid";
		}
	
		const dataToUpdate = {
			[kategori]: status
		};
		const updLaporan = await this.dbService.laporan.update({
			where: {
				id: +id
			},
			data: dataToUpdate
		});

		
		if (!updLaporan) return "Gagal mengedit data";
		await this.dbService.riwayatStatus.create({
			data: {
				type: kategori,
				laporanId: +id
			}
		})
		return null;
	}
	

	async deleteLaporan(id: number): Promise<string> {
		try {
		  await this.dbService.$transaction([
			this.dbService.fileLaporan.deleteMany({ where: { laporanId: +id } }), // Hapus file laporan terkait
			this.dbService.laporan.delete({ where: { id: +id } }) // Hapus laporan utama
		  ]);
		  	return null;
		} catch (error) {
		  	return 'Gagal menghapus data';
		}
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
