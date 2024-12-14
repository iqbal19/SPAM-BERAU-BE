import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { Spam } from '@prisma/client'

@Injectable()
export class MasterService {
	private readonly baseUrl: string;
	constructor(
		private dbService: PrismaService
	) {
		this.baseUrl = process.env.BASE_URL
	}

	async findAllDesa(): Promise<object> {
		const desa = await this.dbService.desa.findMany({
			orderBy: {
				id: 'asc'
			}
		})

		const newDesa = desa.map((ds) => {
			return {
				id: ds.id.toString(),
				name: ds.name
			}
		})
		if (!desa) return null
		return newDesa
	}
}
