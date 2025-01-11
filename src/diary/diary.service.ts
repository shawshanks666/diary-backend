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
    console.log(currentDate, lastDate, daysDifference);

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


    // const {sentiment, mood}= await this.sentimentAnalysisService.analyzeSentiment(createDiaryDto.diaryEntry);
    // const weights = {
    //   positive: 1,
    //   neutral: 0,
    //   negative: -1
    // };
    
    // let weightedSum = 0;
    // let totalWeight = 0;
    


  async create(createDiaryDto: CreateDiaryDto, userId:number) {
    const user =await this.userRepository.findOneBy({id:userId})
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const ivBuffer = Buffer.from(createDiaryDto.iv, 'base64');  // Decode the Base64 string to a Buffer
    
    
    const encryptedBuffer = Buffer.from(createDiaryDto.diaryEntry, 'base64');  // Decode the encrypted text
    // console.log("iv lenghth ", ivBuffer.length, ivBuffer);

    // console.log("encrypted len", encryptedBuffer.length, encryptedBuffer);


    const diary= this.diaryRepository.create({...createDiaryDto,
      user:user,
      iv:ivBuffer, 
      diaryEntry: encryptedBuffer,
      })
      
      await this.updateUserStreak(userId, createDiaryDto.date);

    return this.diaryRepository.save(diary);
  }
  

  async findAll(userId:number) {
    
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['diaries'],  // Load the diaries relation
    });
    
    const diariesWithBase64 = user.diaries.map(diary => {
      // Log the original and transformed data for debugging
      console.log('Original IV Buffer:', diary.iv);
      console.log('Original Diary Entry Buffer:', diary.diaryEntry);
    
      const ivBase64 = diary.iv.toString('base64');
      const diaryEntryBase64 = diary.diaryEntry.toString('base64');
    
      console.log('Transformed IV Base64:', ivBase64);
      console.log('Transformed Diary Entry Base64:', diaryEntryBase64);
    
      // Return the transformed diary object
      return {
        ...diary,
        iv: ivBase64,  
        diaryEntry: diaryEntryBase64,
      };
    });
    
    return diariesWithBase64;  
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
