import { Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../typeorm/user.entity';
import { SignUpDto, SignInDto } from '../user/dto/user.dto';
import { hash,compare } from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {

    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private jwtService: JwtService
        ){}
    async findUserByName(username:string):Promise<User|undefined> {
      return this.userRepository.findOneBy({username});
    }
    async findUserByEmail(email:string):Promise<User|undefined> {
      return this.userRepository.findOne({
        where: {
          email_address: email  // Use 'email' because the entity's column is 'email_address'
        }
      });    }

    async signUp(signUpDto: SignUpDto){

      const acc= await this.findUserByEmail(signUpDto.email);
      const protectedPassword= await this.hashPassword(signUpDto.password);
      const salt =  crypto.randomBytes(16);
      if(acc){
        throw new HttpException('Email is already registered',400);
      }

      return this.userRepository.save({...signUpDto, password:protectedPassword, salt:salt});

    }


    async signIn(props:SignInDto): Promise<{ access_token: string, salt:string }> {
      const { username, password, email } = props;
      let user;
      // console.log(`Attempting to sign in with username: ${username} and email: ${email}`);
      if (!email){
        user= await this.findUserByName(username);
        // console.log(`User found by email: ${JSON.stringify(user)}`);

      }
      else{
        user = await this.findUserByEmail(email);
        // console.log(`User found by username: ${JSON.stringify(user)}`);

      }
  
      
        if (!user){
          throw new HttpException('Invalid credentials username',400);

        }
        const validPassword = await compare(password, user.password);
        // console.log(`Password valid: ${validPassword}`);

        if (!validPassword) {

          throw new HttpException(`Invalid credentials pword ${user.username}`,400);

        }

        const payload = { sub: user.id, username: user.username, role:user.role };
        return {
          access_token: await this.jwtService.signAsync(payload),
          salt: user.salt,
        };
      }
      
    async getUserById(id:number){
      return this.userRepository.findOneBy({id});
    }
    
    private hashPassword(password: string): Promise<string> {
      return hash(password, 10);
    }
}
