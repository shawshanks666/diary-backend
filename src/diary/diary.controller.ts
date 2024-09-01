import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards, Request } from '@nestjs/common';
import { DiaryService } from './diary.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { AuthGuard } from '../auth/auth.guard';
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDiaryDto: CreateDiaryDto, @Request()request: Request) {
    const diary= request['user']
    const userId=diary.sub
    return this.diaryService.create(createDiaryDto,userId);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@Request()request: Request) {
    const diary= request['user']
    const userId=diary.sub
    return this.diaryService.findAll(userId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.diaryService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDiaryDto: UpdateDiaryDto) {
  //   return this.diaryService.update(+id, updateDiaryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.diaryService.remove(+id);
  // }
}
