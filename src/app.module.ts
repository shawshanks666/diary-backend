import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, Diary } from './typeorm';
import { DiaryController } from './diary/diary.controller';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { DiaryModule } from './diary/diary.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { SentimentAnalysisService } from './sentiment-analysis/sentiment-analysis.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // Add this line to enable the ConfigModule
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST') || 'localhost',
        port: configService.get('DATABASE_PORT') || 5432,
        username: configService.get('DATABASE_USER') || 'postgres',
        password: configService.get('DATABASE_PASSWORD') || 'root',
        database: configService.get('DATABASE_NAME') || 'diaryDB',
        entities: [User, Diary],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService], // Inject the ConfigService
    }),
    TypeOrmModule.forFeature([User, Diary]),
    DiaryModule, UserModule, AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, SentimentAnalysisService],
})
export class AppModule {}