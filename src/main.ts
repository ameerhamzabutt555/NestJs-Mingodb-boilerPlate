import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const mongoose = app.get('MongooseInstance');

    mongoose.connection.on('connected', async () => {
        console.log('Connected to the MongoDB database');
        const port = configService.getPortConfig();
        app.listen(await port).then(() => {
            console.log(`Application is running on port ${port}`);
        });
    });

    mongoose.connection.on('error', (err) => {
        console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB connection disconnected');
    });

    await mongoose.connect(configService.getMongoConfig(), {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

bootstrap();
