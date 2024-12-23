import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SpamDto } from './dto/spam.dto'
import { Spam } from '@prisma/client'
import { FileService } from 'src/file/file.service'
import * as shapefile from 'shapefile';
import * as fs from 'fs';
import * as path from 'path';
import * as AdmZip from 'adm-zip';

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

	normalizePath(url: string): string {
    return path.normalize(url.replace(/\\/g, '/'));
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
    if (this.normalizePath(fotoSpam?.foto_wtp) !== this.normalizePath(foto_wtp)) {
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
    if (this.normalizePath(fotoSpam?.foto_intake) !== this.normalizePath(foto_intake)) {
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
    if (this.normalizePath(fotoSpam?.foto_pompa_distibusi) !== this.normalizePath(foto_pompa_distibusi)) {
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
    if (this.normalizePath(fotoSpam?.foto_roservoir) !== this.normalizePath(foto_roservoir)) {
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
    if (this.normalizePath(fotoSpam?.foto_rumah_dosing) !== this.normalizePath(foto_rumah_dosing)) {
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
				SpamCakupan: {
					deleteMany: {},
					create: cakupan.map((m) => ({
						desaId: m, 
					})),
				},
			}
		})

		await this.dbService.fotoSpam.update({
			where: {
				spamId: +id
			},
			data: {
				foto_intake: fotoIntake,
				foto_wtp: fotoWtp,
				foto_pompa_distibusi: fotoPompa,
				foto_rumah_dosing: fotoDosing,
				foto_roservoir: fotoRoservoir
			}
		})

		if (!updPengurus) 'Gagal mengedit data'
		return null
	}

	async deleteSpam(id: number): Promise<string> {
		const delSpam = await this.dbService.spam.update({
			where: {
				id: +id
			},
			data: {
				deletedAt: new Date()
			}
		})
		if (!delSpam) 'Gagal menghapus data'
    return null
	}

	async createSpamShp(file: {fileBase64: string, nama_file: string, spam: number[]}): Promise<string> {
		const geojson = await this.convertBase64ToGeoJSON(file.fileBase64)
		const newFile = await this.dbService.shpFile.create({
			data: {
				nama_file: file.nama_file,
				geojson
			}
		})

		if (newFile) {
			const newSpamShp = await this.dbService.spmShp.createMany({
				data: file?.spam.map((m) => ({
					spamId: +m,
					shpFileId: newFile.id
				}))
			})
			if (!newSpamShp) return 'Gagal menambah data'
			return null
		} else {
			return 'Gagal menambah data'
		}
	}

	async updateSpamShp(id: number, spam: number[]): Promise<string> { //id = id file shp
		const delSpm = await this.dbService.spmShp.deleteMany({
			where: {
				shpFileId: +id
			}
		})

		if (delSpm) {
			const newSpamShp = await this.dbService.spmShp.createMany({
				data: spam.map((m) => ({
					spamId: +m,
					shpFileId: Number(id)
				}))
			})
			if (!newSpamShp) return 'Gagal mengubah data'
			return null
		} else {
			return 'Gagal mengubah data'
		}
	}

	async getFileShpbySpam(id: number): Promise<object> {
		const files = await this.dbService.spmShp.findMany({
			where: {
				spamId: +id
			},
			select: {
				id: true,
				spamId: true,
				shpFile: {
					select: {
						geojson: true
					}
				}
			}
		});
		if (!files || files.length === 0) {
			throw new Error("Gagal get data");
		}

// Strukturkan hasil untuk mengembalikan `geojson` sebagai array objek
		return {
			id: files[0].id,
			spamId: files[0].spamId,
			geojson: files.map(file => ({
				id: file.id,
				geojson: file.shpFile?.geojson
			}))
		};
	}

	async deleteFileShp(id: number): Promise<string> {
		const delSpm = await this.dbService.spmShp.deleteMany({
			where: {
				shpFileId: +id
			}
		})
		if (delSpm) {
			const delFile = await this.dbService.shpFile.delete({
				where: {
					id: +id
				}
			})
	
			if(!delFile) "Gagal delete data"
			return null
		}
	}

	async filesShpGeojson(): Promise<object[]> {
		const files = await this.dbService.shpFile.findMany({
			select: {
				geojson: true
			}
		})

		return files
	}

	async getFileShp(): Promise<object[]> {
		const files = await this.dbService.shpFile.findMany({
			select: {
				id: true,
				nama_file: true,
				spmShp: {
					select: {
						spam: true
					}
				}
			},
		})

		const newReturnFile = files.map((file) => {
			return {
				id: file.id,
				nama_file: file.nama_file,
				spam: file.spmShp.map((item) => {
					return {
						id: item.spam.id,
						nama: item.spam.nama
					}
				})
			}
		})

		if (files) {
			return newReturnFile
		}
	}


	async convertBase64ToGeoJSON(fileBase64: string): Promise<any> {
		try {
			// 1. Decode Base64 ke Buffer
			const buffer = Buffer.from(fileBase64, 'base64');

			// 2. Simpan buffer sebagai file sementara (ZIP atau SHP)
			// const tempPath = path.join(__dirname, 'src', 'uploads', 'temp_shapefile.zip');
			const tempPath = path.join(process.cwd(), 'uploads', 'temp_shapefile.zip');
			fs.writeFileSync(tempPath, buffer);

			// 3. Ekstrak file jika formatnya adalah ZIP
			// const extractedPath = path.join(__dirname, 'src', 'uploads', 'extracted');
			const extractedPath = path.join(process.cwd(), 'uploads', 'extracted');
			fs.mkdirSync(extractedPath, { recursive: true });

			const zip = new AdmZip(tempPath);
			zip.extractAllTo(extractedPath, true);

			// 4. Cari file SHP dan konversi ke GeoJSON
			const shpFiles = fs.readdirSync(extractedPath).filter(file => file.endsWith('.shp'));
			if (shpFiles.length === 0) {
				throw new Error('No .shp file found in the uploaded data');
			}

			const shpFilePath = path.join(extractedPath, shpFiles[0]);

			const geojsonFeatures = [];
			await shapefile.open(shpFilePath)
				.then(source =>
					source.read().then(function log(result) {
						if (result.done) return;
						geojsonFeatures.push(result.value);
						return source.read().then(log);
					})
				);

			// 5. Hapus file sementara
			fs.unlinkSync(tempPath);
			fs.rmSync(extractedPath, { recursive: true, force: true });

			// 6. Return data GeoJSON
			return {
				type: 'FeatureCollection',
				features: geojsonFeatures,
			};
		} catch (error) {
			console.error('Error processing Base64 Shapefile:', error.message);
			throw new Error('Failed to process Shapefile data');
		}
	}
}
