import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors({
    origin: ['http://localhost:5173', 'https://fe.luminos.my.id', 'https://fe.spamberau.id', 'https://spamberau.id'], // or the frontend URL
    methods: 'GET,POST,PUT,DELETE, PATCH',
  });
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  
	await app.listen(3000)
}
bootstrap()
