import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SentimentAnalysisService {

    constructor() {}

    
    private readonly apiUrl = 'https://api-inference.huggingface.co/models/'; // Replace with actual URL
    private readonly model1 = 'cardiffnlp/twitter-roberta-base-sentiment-latest';
    private readonly model2 = 'SamLowe/roberta-base-go_emotions';
    private readonly apiToken = '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'; // Replace with your token

    async analyzeSentiment(text: string): Promise<{ score1: number; score2: number }> {
        const headers = {
          'Authorization': `Bearer ${this.apiToken}`,
        };
    
        try {
          const response1 = await axios.post(`${this.apiUrl}${this.model1}`, { inputs: text }, { headers });
          const response2 = await axios.post(`${this.apiUrl}${this.model2}`, { inputs: text }, { headers });
    
          // Assuming the API response contains sentiment scores directly
          const score1 = response1.data[0].score;
          const score2 = response2.data[0].score;
    
          return { score1, score2 };
        } catch (error) {
          throw new Error('Failed to analyze sentiment');
        }
      }
}
