import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateUserDto {


	@IsNotEmpty()
	@IsString()
	nama: string

	@IsNotEmpty()
	username: string

	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	password: string

	@IsString()
	status: Status

	@IsString()
	role: Role

	@IsNumber()
	spamId: number
}

export enum Status {
  AKTIF= 'AKTIF',
  NON_AKTIF = 'NON_AKTIF'
}

enum Role {
  ADMIN_APLIKASI='ADMIN_APLIKASI',
  ADMIN_ASKAB='ADMIN'
}
