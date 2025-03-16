import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SpamModule } from './spam/spam.module';
import { MasterModule } from './master/master.module';
import { AppService } from './app.service';
import { FileModule } from './file/file.module';
import { NewsModule } from './news/news.module';
import { PekerjaanModule } from './pekerjaan/pekerjaan.module';
import { LaporanModule } from './laporan/laporan.module';

@Module({
	imports: [
		ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Direktori file upload
      serveRoot: '/uploads', // URL akses ke folder uploads
    }),
		FileModule,
		PrismaModule,
		AuthModule,
		UserModule,
		SpamModule,
		MasterModule,
		NewsModule,
		PekerjaanModule,
		LaporanModule
	],
	providers: [AppService],
  exports: [AppService]
})
export class AppModule {}
