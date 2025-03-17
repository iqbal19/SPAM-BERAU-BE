import { IsNotEmpty, IsNumber, ValidateNested, IsArray, IsOptional, IsString, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer';


export class LaporanDto {
	@IsNotEmpty()
	@IsString()
	bulan: string

	@IsNotEmpty()
	@IsNumber()
	jumlah_sr: number	

	@IsNotEmpty()
	@IsNumber()
	sr_aktif: number	

	@IsNotEmpty()
	@IsString()
	intake: StatusLaporan

	@IsString()
	@IsOptional()
	intake_ket: string

	@IsNotEmpty()
	@IsString()
	wtp: StatusLaporan

	@IsString()
	@IsOptional()
	wtp_ket: string

	@IsNotEmpty()
	@IsString()
	panel_intake: StatusLaporan

	@IsString()
	@IsOptional()
	panel_intake_ket: string

	@IsNotEmpty()
	@IsString()
	panel_distribusi: StatusLaporan

	@IsString()
	@IsOptional()
	panel_distribusi_ket: string

	@IsNotEmpty()
	@IsString()
	pompa_intake: StatusLaporan

	@IsString()
	@IsOptional()
	pompa_intake_ket: string

	@IsNotEmpty()
	@IsString()
	pompa_distribusi: StatusLaporan

	@IsString()
	@IsOptional()
	pompa_distribusi_ket: string

	@IsNotEmpty()
	@IsString()
	pipa_transmisi: StatusLaporan

	@IsString()
	@IsOptional()
	pipa_transmisi_ket: string

	@IsNotEmpty()
	@IsString()
	pipa_distribusi: StatusLaporan

	@IsString()
	@IsOptional()
	pipa_distribusi_ket: string

	@IsNotEmpty()
	@IsNumber()
	spamId: number

	@IsArray() // ✅ Pastikan ini adalah array
  	@ValidateNested({ each: true }) // ✅ Validasi setiap elemen dalam array
  	@Type(() => FileLaporanDto) // ✅ Konversi setiap elemen ke FileLaporanDto
  	@IsOptional() // ✅ Opsional, bisa dikosongkan
	fileLaporan: FileLaporanDto[]
}

export class FileLaporanDto {
	@IsOptional()
	@IsNumber()
	id: number

	@IsNotEmpty()
	@IsString()
	type: TypeLaporan

	@IsString()
	@IsNotEmpty()
	file: string
}

enum StatusLaporan {
	BAIK='BAIK',
	RUSAK='RUSAK',
	RUSAK_DIPERBAIKI='RUSAK_DIPERBAIKI'
}

enum TypeLaporan {
	intake="intake",
	wtp="wtp",
	panel_intake="panel_intake",
	panel_distribusi="panel_distribusi",
	pompa_intake="pompa_intake",
	pompa_distribusi="pompa_distribusi",
	pipa_distribusi="pipa_distribusi",
	pipa_transmisi="pipa_transmisi"
}