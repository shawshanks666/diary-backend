import { IsEmail, IsNotEmpty, MinLength, IsOptional} from "class-validator";

export class SignUpDto {
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SignInDto {
  @IsOptional() // Mark as optional
  @MinLength(3)
  username?: string; // Use optional chaining

  @IsOptional() // Mark as optional
  @MinLength(8)
  password?: string; // Use optional chaining

  @IsOptional() // Mark as optional
  @IsEmail()
  email?: string; // Use optional chaining
}