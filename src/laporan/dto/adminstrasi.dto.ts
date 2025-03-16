import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class AdministrasiDto {
    @IsNotEmpty()
    @IsString()
    bulan: string

    @IsString()
    @IsNotEmpty()
	file_keuangan: string

    @IsString()
    @IsOptional()
	file_neraca: string

    @IsNotEmpty()
    @IsNumber()
    spamId: number
}