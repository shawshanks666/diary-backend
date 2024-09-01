import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SentimentAnalysisService {

    constructor() {}

    
    private readonly apiUrl = 'https://api-inference.huggingface.co/models/'; // Replace with actual URL
    private readonly model1 = 'cardiffnlp/twitter-roberta-base-sentiment-latest';
    private readonly model2 = 'SamLowe/roberta-base-go_emotions';
    private readonly apiToken = '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'; // Replace with your token

    async analyzeSentiment(text: string) {
        const headers = {
          'Authorization': `Bearer ${this.apiToken}`,
        };
    
        try {
          const response1 = await axios.post(`${this.apiUrl}${this.model1}`, { inputs: text }, { headers });
          const response2 = await axios.post(`${this.apiUrl}${this.model2}`, { inputs: text }, { headers });
    
          // Assuming the API response contains sentiment scores directly
          const sentiment = response1.data[0];
          const mood = response2.data[0];
    
          return { sentiment,mood };
        } catch (error) {
          throw new Error('Failed to analyze sentiment');
        }
      }
}
