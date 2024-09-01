import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diary, User } from 'src/typeorm';

@Module({
  providers: [UserService],
  controllers: [UserController],  
  imports: [
    TypeOrmModule.forFeature([Diary, User]) // Ensure Diary is included here
  ],
  exports: [UserService],
})
export class UserModule {}
