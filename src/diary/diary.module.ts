import { Module } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { DiaryController } from './diary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary, User } from 'src/typeorm';
import { AuthGuard } from 'src/auth/auth.guard';
@Module({
  imports: [
    TypeOrmModule.forFeature([Diary, User]), // Ensure Diary is included here
    
  ],
  controllers: [DiaryController],
  providers: [DiaryService],
  exports: [DiaryService],
})
export class DiaryModule {}
