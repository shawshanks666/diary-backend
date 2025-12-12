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
import { SentimentAnalysisService } from './sentiment-analysis/sentiment-analysis.service';
@Module({
  imports: [    
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || undefined,  // used in production (Neon)
      host: process.env.DATABASE_URL ? undefined : process.env.DATABASE_HOST || 'localhost',
      port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_URL ? undefined : process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_URL ? undefined : process.env.DATABASE_PASSWORD || 'root',
      database: process.env.DATABASE_URL ? undefined : process.env.DATABASE_NAME || 'diaryDB',
    
      entities: [User, Diary],
    
      ssl: process.env.DATABASE_URL
        ? { rejectUnauthorized: false }  // Neon needs SSL
        : false,
    
      synchronize: process.env.NODE_ENV !== 'production', // false in production
    }),
    
  TypeOrmModule.forFeature([User, Diary]),
  DiaryModule,UserModule,AuthModule],
  controllers: [AppController],
  providers: [AppService, SentimentAnalysisService],
})
export class AppModule {}
