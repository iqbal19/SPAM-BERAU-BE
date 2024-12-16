import { IsArray, IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer';

class FotoSpamDto {
	@IsNotEmpty()
	@IsString()
	foto_wtp: string

	@IsNotEmpty()
	@IsString()
	foto_intake: string

	@IsNotEmpty()
	@IsString()
	foto_roservoir: string

	@IsNotEmpty()
	@IsString()
	foto_rumah_dosing: string

	@IsNotEmpty()
	@IsString()
	foto_pompa_distibusi: string
}

class RasioSpam {
	@IsNotEmpty()
	@IsNumber()
	terlayani: number

	@IsNotEmpty()
	@IsNumber()
	tidak_terlayani: number

	@IsNotEmpty()
	@IsNumber()
	total_laki_laki: number

	@IsNotEmpty()
	@IsNumber()
	total_peempuan: number
}

class SpamTitik {
	@IsNotEmpty()
	@IsNumber()
	lat_intake: number

  @IsNotEmpty()
	@IsNumber()
	long_intake: number

	@IsNotEmpty()
	@IsNumber()
	lat_wtp: number

  @IsNotEmpty()
	@IsNumber()
	long_wtp: number

	@IsNotEmpty()
	@IsNumber()
	lat_roservoir: number

  @IsNotEmpty()
	@IsNumber()
	long_roservoir: number
}

export class SpamDto {
	@IsNotEmpty()
	@IsString()
	nama: string

	@IsNotEmpty()
	@IsString()
	alamat: string

	@IsNotEmpty()
	@IsNumber()
	kapasitas: number

	@IsNotEmpty()
	@IsNumber()
	kapasitas_intake: number

	@IsNotEmpty()
	@IsNumber()
	kapasitas_produksi: number

  @IsNotEmpty()
	@IsNumber()
	sr: number

  @IsNotEmpty()
	@IsNumber()
	lat: number

  @IsNotEmpty()
	@IsNumber()
	long: number

	@IsNotEmpty()
	@IsString()
	pengelola: string

  @IsNotEmpty()
	@IsString()
  riwayat_aktivitas: string

	@IsNotEmpty()
	@IsString()
	sumber_air: string

	@IsNotEmpty()
	@IsString()
	sumber_tenaga: string

	@IsArray()
	cakupan: number[]

	@IsObject()
  @ValidateNested()
  @Type(() => FotoSpamDto)
  foto_spam: FotoSpamDto;

  @IsObject()
  @ValidateNested()
  @Type(() => RasioSpam)
  rasio_spam: RasioSpam;

  @IsObject()
  @ValidateNested()
  @Type(() => SpamTitik)
  spam_titik: SpamTitik;
}