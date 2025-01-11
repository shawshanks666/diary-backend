import { IsNotEmpty, IsInt, IsDateString, IsBIC } from 'class-validator';

export class CreateDiaryDto {
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  diaryEntry: string;

  @IsInt()
  mood: number;

  @IsInt()
  rating: number;

  @IsNotEmpty()
  iv: string;

  @IsInt()
  count: number;


  // @IsNotEmpty()
  // @IsInt()
  // user: number; // This links the diary entry to a specific user
}
