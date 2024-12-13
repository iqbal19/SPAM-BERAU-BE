import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

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

	@IsArray()
	cakupan: number[]
}
