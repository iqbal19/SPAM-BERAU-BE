import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as bodyParser from 'body-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.enableCors({
    origin: ['http://localhost:5173', 'https://fe.luminos.my.id'], // or the frontend URL
    methods: 'GET,POST,PUT,DELETE, PATCH',
  });
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  
	await app.listen(3000)
}
bootstrap()
