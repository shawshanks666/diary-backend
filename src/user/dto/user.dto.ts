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
  @IsNotEmpty() // Mark as optional
  @MinLength(3)
  username?: string; // Use optional chaining

  @IsNotEmpty()
  @MinLength(8)
  password?: string; // Use optional chaining

  @IsNotEmpty() // Mark as optional
  @IsEmail()
  email?: string; // Use optional chaining
}