import { Injectable, HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../typeorm/user.entity';
import { SignUpDto } from '../user/dto/user.dto';
import { hash,compare } from 'bcrypt';
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
      return this.userRepository.findOneBy({email});
    }

    async signUp(signUpDto: SignUpDto){

      const acc= await this.findUserByEmail(signUpDto.email);
      const protectedPassword= await this.hashPassword(signUpDto.password);

      if(acc){
        throw new HttpException('Email is already registered',400);
      }

      return this.userRepository.save({...signUpDto, password:protectedPassword});

    }


    async signIn(
        username: string,
        pass: string,
      ): Promise<{ access_token: string }> {
        const user = await this.findUserByName(username);
        if (!user){
          throw new HttpException('Invalid credentials username',400);

        }
        const validPassword = await compare(pass, user.password);
        if (!validPassword) {
          throw new HttpException('Invalid credentials pword',400);
        }

        const payload = { sub: user.id, username: user.username, role:user.role };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
      
    async getUserById(id:number){
      return this.userRepository.findOneBy({id});
    }
    
    private hashPassword(password: string): Promise<string> {
      return hash(password, 10);
    }
}
