import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User,Diary } from './typeorm';
import { DiaryController } from './diary/diary.controller';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { DiaryModule } from './diary/diary.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { SentimentAnalysisService } from './sentiment-analysis/sentiment-analysis.service';
@Module({
  imports: [    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'root',
      database: process.env.DATABASE_NAME || 'diaryDB',
      entities: [User, Diary],
      synchronize: true, // Set to false in production
    }),
    
  TypeOrmModule.forFeature([User, Diary]),
  DiaryModule,UserModule,AuthModule],
  controllers: [AppController],
  providers: [AppService, SentimentAnalysisService],
})
export class AppModule {}
