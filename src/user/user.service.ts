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
				status: 'AKTIF',
				deletedAt: null
			},
			include: {
				spam: {
					select: {
						id: true,
						nama: true
					}
				}
			}
		})
		if (!users) return null
		return users
	}

	async findUserById(id: string): Promise<object> {
		const user = await this.findByUniq(id, 'id')
		if (!user) return null
		delete user.password
		return user
	}

	async createUser(createUserDto: CreateUserDto): Promise<User>  {
		const { nama, username, email, password, status, role, spamId } = createUserDto

		const salt = await bcrypt.genSalt()
		const newUser = await this.dbService.user.create({
			data: {
				nama,
				username,
				email,
				password: await bcrypt.hash(password, salt),
				status,
				role,
				spam: {
					connect: { id: spamId }, // Hubungkan ke Spam yang sudah ada
				},
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
		if (type === 'email') whereParams = {email: unique, status: 'AKTIF', deletedAt: null} 
		if (type === 'username') whereParams = { username: unique, status: 'AKTIF', deletedAt: null } 
		if (type === 'id') whereParams = { id: unique, status: 'AKTIF', deletedAt: null } 
		const user = await this.dbService.user.findUnique({
			where: whereParams,
			include: {
				spam: {
					select: {
						id: true,
						nama: true
					}
				}
			}
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
				id: id,
				deletedAt: null
			}
		})
		if (user) {
			return user
		}
		throw new NotFoundException('Data tidak ditemukan')
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<string> {
		const { nama, username, email, status, role, password, spamId } = updateUserDto
		const salt = await bcrypt.genSalt()

		const usr = await this.findByUniq(id, 'id')
		if(usr.email !== email) {
			const checkEmail = await this.findByUniq(email, 'email')
			if (checkEmail) return 'Email sudah digunakan'
		} 
		if (usr.username !== username) {
			const checkUsername = await this.findByUniq(username, 'username')
			if (checkUsername) return 'Username sudah digunakan'
		}
		const data = {
			nama,
			username,
			email,
			password: password ? await bcrypt.hash(password, salt) : "",
			status,
			role,
			spam: spamId
				? { connect: { id: spamId } } // Hubungkan ke Spam jika ada `spamId`
				: spamId === null
				? { disconnect: true } // Lepaskan hubungan jika `spamId` = null
				: undefined,
		}

		if (!password) {
			delete data.password
		}

		const updUser = await this.dbService.user.update({
			where: {
				id: id
			},
			data: data
		})
		if (!updUser) 'Gagal mengedit data'
		return null
	}

	async deleteUser(id: string): Promise<string> {
		const delSpam = await this.dbService.user.update({
			where: {
				id: id
			},
			data: {
				deletedAt: new Date()
			}
		})
		if (!delSpam) 'Gagal menghapus data'
    return null
	}
}
