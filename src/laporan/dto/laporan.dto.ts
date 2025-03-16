import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

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

	@IsString()
	@IsOptional()
	intake_foto: string

	@IsNotEmpty()
	@IsString()
	wtp: StatusLaporan

	@IsString()
	@IsOptional()
	wtp_ket: string

	@IsString()
	@IsOptional()
	wtp_foto: string

	@IsNotEmpty()
	@IsString()
	panel_intake: StatusLaporan

	@IsString()
	@IsOptional()
	panel_intake_ket: string

	@IsString()
	@IsOptional()
	panel_intake_foto: string

	@IsNotEmpty()
	@IsString()
	panel_distribusi: StatusLaporan

	@IsString()
	@IsOptional()
	panel_distribusi_ket: string

	@IsString()
	@IsOptional()
	panel_distribusi_foto: string

	@IsNotEmpty()
	@IsString()
	pompa_intake: StatusLaporan

	@IsString()
	@IsOptional()
	pompa_intake_ket: string

	@IsString()
	@IsOptional()
	pompa_intake_foto: string

	@IsNotEmpty()
	@IsString()
	pompa_distribusi: StatusLaporan

	@IsString()
	@IsOptional()
	pompa_distribusi_ket: string

	@IsString()
	@IsOptional()
	pompa_distribusi_foto: string

	@IsNotEmpty()
	@IsString()
	pipa_transmisi: StatusLaporan

	@IsString()
	@IsOptional()
	pipa_transmisi_ket: string

	@IsString()
	@IsOptional()
	pipa_transmisi_foto: string

	@IsNotEmpty()
	@IsString()
	pipa_distribusi: StatusLaporan

	@IsString()
	@IsOptional()
	pipa_distribusi_ket: string

	@IsString()
	@IsOptional()
	pipa_distribusi_foto: string

	@IsNotEmpty()
	@IsNumber()
	spamId: number
}

enum StatusLaporan {
	BAIK='BAIK',
	RUSAK='RUSAK',
	RUSAK_DIPERBAIKI='RUSAK_DIPERBAIKI'
}