import { IsOptional } from 'class-validator';

export class UpdateDiaryDto {

  @IsOptional()
  diaryEntry?: string;

  @IsOptional()
  mood: string;




}
