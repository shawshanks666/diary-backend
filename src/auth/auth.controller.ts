import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Request,
    UseGuards
  } from '@nestjs/common';
  import { AuthGuard } from './auth.guard';
  import { AuthService } from './auth.service';
  import { SignUpDto } from '../user/dto/user.dto';

  
  @Controller('auth')
  export class AuthController {
      constructor(private authService: AuthService) {}
  
      @HttpCode(HttpStatus.OK)
      @Post('login')
      signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
      }
  
      @HttpCode(HttpStatus.OK)
      @Post('signup')
      signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto);
      }
  
      @UseGuards(AuthGuard)
      @Get('profile')
      getProfile(@Request() req:Request) {
        return req['user']
        }
  
      @HttpCode(HttpStatus.OK)
      @Get(':id')
      getUserById(@Param('id') id:number){
        return this.authService.getUserById(id)
      }
        
  }
  