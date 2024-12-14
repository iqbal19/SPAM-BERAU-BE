import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SpamModule } from './spam/spam.module';
import { MasterModule } from './master/master.module';
import { AppService } from './app.service';

@Module({
	imports: [
		PrismaModule,
		AuthModule,
		UserModule,
		SpamModule,
		MasterModule
	],
	providers: [AppService],
  exports: [AppService]
})
export class AppModule {}
