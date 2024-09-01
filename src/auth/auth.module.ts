import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
@Module({
  providers: [AuthService, AuthGuard],  
  imports: [
  TypeOrmModule.forFeature([User]), // Ensure Diary is included here,
  JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [AuthController],
  exports: [AuthGuard,AuthService], // Export AuthRepository


})
export class AuthModule {}
