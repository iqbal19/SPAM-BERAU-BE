import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator'

export class PekerjaanDto {
  @IsNumber()
  spamId: number

  @IsNotEmpty()
  @IsNumber()
  lat: number
  
  @IsNotEmpty()
  @IsNumber()
  long: number

  @IsNotEmpty()
  @IsNumber()
  progress: number

  @IsString()
  alamat: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsArray()
  fotos: string[]
}