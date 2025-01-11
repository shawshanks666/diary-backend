import { IsOptional } from 'class-validator';

export class UpdateDiaryDto {

  @IsOptional()
  diaryEntry?: Buffer;

  @IsOptional()
  mood: number;




}
