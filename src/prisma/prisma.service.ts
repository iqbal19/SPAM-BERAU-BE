import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor() {
    super({
      log: ['error'],
    });
  }
	private _refreshToken: any
	public get refreshToken(): any {
		return this._refreshToken
	}
	public set refreshToken(value: any) {
		this._refreshToken = value
	}
	async onModuleInit() {
		await this.$connect()
	}
}
