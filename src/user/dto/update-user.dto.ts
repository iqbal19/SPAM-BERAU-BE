import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserDto {


	@IsNotEmpty()
	@IsString()
	nama: string

	@IsNotEmpty()
	username: string

	@IsEmail()
	email: string

	@IsNotEmpty()
	password: string

	@IsNotEmpty()
	@IsString()
	status: Status

	@IsNotEmpty()
	@IsString()
	role: Role
}

export enum Status {
  AKTIF= 'AKTIF',
  NON_AKTIF = 'NON_AKTIF'
}

enum Role {
  ADMIN_APLIKASI='ADMIN_APLIKASI',
  ADMIN='ADMIN'
}
