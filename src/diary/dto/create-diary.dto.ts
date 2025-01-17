import { IsNotEmpty, IsInt, IsDateString, IsBIC } from 'class-validator';

export class CreateDiaryDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  diaryEntry: string;

  mood: string;

  @IsInt()
  rating: number;

  @IsNotEmpty()
  iv: string;


  // @IsNotEmpty()
  // @IsInt()
  // user: number; // This links the diary entry to a specific user
}
