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
  

  async updateUserStreak(id: number, lastEntryDate: string): Promise<void> {
    const user = await this.userRepository.findOneBy({id});
    console.log(user);
    
    if (!user) {
      throw new Error('User not found');
    }

    const currentDate = new Date();
    const lastDate = user.lastEntryDate?new Date(user.lastEntryDate):currentDate;
    
    const daysDifference = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    console.log(currentDate, lastDate,daysDifference);

    let newStreak = 0;
    if (daysDifference === 1) {
      newStreak = user.streak + 1; // Increment streak if yesterday's entry exists
      console.log("difference = 1");
      
    } else if (daysDifference > 1) {
      console.log("difference more than 1");

      newStreak = 1; // Reset streak if last entry was more than one day ago
    }

    user.streak = newStreak;
    user.lastEntryDate = lastEntryDate;

    await this.userRepository.save(user);
  }

  async create(createDiaryDto: CreateDiaryDto, userId:number) {
    const user =await this.userRepository.findOneBy({id:userId})
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const {sentiment, mood}= await this.sentimentAnalysisService.analyzeSentiment(createDiaryDto.diaryEntry);
    const weights = {
      positive: 1,
      neutral: 0,
      negative: -1
    };
    
    let weightedSum = 0;
    let totalWeight = 0;
    
    sentiment.forEach(({ label, score }) => {
      weightedSum += weights[label] * score;
      totalWeight += Math.abs(weights[label]) * score;
    });
    
    const sentimentScore = (weightedSum / totalWeight) * 10;
    const intScore=  Math.floor(sentimentScore);

    const diary= this.diaryRepository.create({...createDiaryDto,
      user:user,
      rating:intScore})

      await this.updateUserStreak(userId, createDiaryDto.date);

    return this.diaryRepository.save(diary);
  }
  

  async findAll(userId:number) {
    
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['diaries'],  // Load the diaries relation
    });
      
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
