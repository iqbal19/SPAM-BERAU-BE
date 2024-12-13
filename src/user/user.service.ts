import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import * as bcrypt from 'bcrypt'
import { compare } from 'bcrypt'
import { User } from '@prisma/client'

@Injectable()
export class UserService {
	constructor(
		private dbService: PrismaService
	) {}

	async findAllUser(): Promise<object> {
		const users = await this.dbService.user.findMany({
			where: {
				status: 'AKTIF'
			}
		})
		if (!users) return null
		return users
	}

	async findUserById(id: string): Promise<object> {
		const user = await this.findByUniq(id, 'id')
		if (!user) return null
		return user
	}

	async createUser(createUserDto: CreateUserDto): Promise<User>  {
		const { nama, username, email, password, status, role } = createUserDto

		const salt = await bcrypt.genSalt()
		const newUser = await this.dbService.user.create({
			data: {
				nama,
				username,
				email,
				password: await bcrypt.hash(password, salt),
				status,
				role
			}
		})
		return newUser
	}

	async createUserCtrl(createUserDto: CreateUserDto): Promise<string>  {
		const { username, email } = createUserDto

		const checkEmail = await this.findByUniq(email, 'email')
		if (checkEmail) return 'Email sudah digunakan'
		const checkUsername = await this.findByUniq(username, 'username')
		if (checkUsername) return 'Username sudah digunakan'
		
		const newUser = await this.createUser(createUserDto)
		if (!newUser) "Gagal menambah data"
		return null
	}

	async findByUniq(unique: string, type?: string) {
		let whereParams: any 
		if (type === 'email') whereParams = {email: unique} 
		if (type === 'username') whereParams = { username: unique } 
		if (type === 'id') whereParams = { id: unique } 
		const user = await this.dbService.user.findUnique({
			where: whereParams
		})
		return user
	}

	async validateUser(email: string, password: string) {
		const user = await this.dbService.user.findUnique({
			where: {
				email
			}
		})
		if (user && (await compare(password, user.password))) {
			return user
		}
		return null
	}

	async findByUserId(id: string): Promise<User> {
		const user = await this.dbService.user.findUnique({
			where: {
				id: id
			}
		})
		if (user) {
			return user
		}
		throw new NotFoundException('Data tidak ditemukan')
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<string> {
		const { nama, username, email, status, role } = updateUserDto

		const usr = await this.findByUniq(id, 'id')
		if(usr.email !== email) {
			const checkEmail = await this.findByUniq(email, 'email')
			if (checkEmail) return 'Email sudah digunakan'
		} 
		if (usr.username !== username) {
			const checkUsername = await this.findByUniq(username, 'username')
			if (checkUsername) return 'Username sudah digunakan'
		}

		const updUser = await this.dbService.user.update({
			where: {
				id: id
			},
			data: {
				nama,
				username,
				email,
				status,
				role
			}
		})
		if (!updUser) 'Gagal mengedit data'
		return null
	}
}
