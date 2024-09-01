import { Injectable } from '@nestjs/common';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Diary,User } from 'src/typeorm';
import { NotFoundException } from '@nestjs/common';
import { SentimentAnalysisService } from './sentiment.service';
import { log } from 'console';
@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(Diary) private readonly diaryRepository: Repository<Diary>,
    @InjectRepository(User) private userRepository: Repository<User>, 
    private readonly sentimentAnalysisService: SentimentAnalysisService, // Inject it here

  ) {}
  

  async create(createDiaryDto: CreateDiaryDto, userId:number) {
    const user =await this.userRepository.findOneBy({id:userId})
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const sentimentScores= await this.sentimentAnalysisService.analyzeSentiment(createDiaryDto.diaryEntry);
    console.log(sentimentScores);
    
    const diary= this.diaryRepository.create({...createDiaryDto,
      user:user,})
    return this.diaryRepository.save(diary);
  }
  

  async findAll(userId:number) {
    
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['diaries'],  // Load the diaries relation
    });
    
    console.log(user.diaries);  // This will print all diary entries associated with the user
    
    return user.diaries;
  }

  findOne(id: number) {
    return this.diaryRepository.findOneBy({id});
  }

  async update(id: number, updateDiaryDto: UpdateDiaryDto) {
    await this.diaryRepository.update(id, updateDiaryDto)

    return this.diaryRepository.findOneBy({id});  }

  async remove(id: number) {
    const diary = await this.diaryRepository.findOneBy({ id });
    if (!diary) {

        return 'diary not found'
    }
    await this.diaryRepository.delete(id);
    return diary; // Return the diary that was removed  }
}
}
