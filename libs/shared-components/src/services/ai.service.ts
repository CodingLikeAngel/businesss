import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AIService {
  
  private openAiUrl = environment.openAiUrl;
  private geminiUrl = environment.geminiUrl;
  private openAiKey = environment.openAiKey;
  private geminiKey = environment.geminiKey;
  private mistralUrl = (environment as any).mistralUrl;
  private mistralKey = (environment as any).mistralKey;
  
  currentProvider: 'gemini' | 'openai' | 'mistral' = 'mistral'; 

  constructor(private http: HttpClient) {}

  /**
   * Sends a message to the currently active AI provider and returns a standardized response.
   * @returns Observable<{ text: string }>
   */
  sendMessage(messages: string[]): Observable<{ text: string }> {
    switch (this.currentProvider) {
      case 'openai': 
        return this.sendOpenAIMessage(messages).pipe(map(res => ({ text: res.choices[0].message.content })));
      case 'mistral': 
        return this.sendMistralMessage(messages).pipe(map(res => ({ text: res.choices[0].message.content })));
      default: 
        return this.sendGeminiMessage(messages).pipe(map(res => ({ text: res.candidates[0].content.parts[0].text })));
    }
  }
  
  private sendOpenAIMessage(messages: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.openAiKey}`
    });
  
    const body = {
      model: 'gpt-4o-mini-2024-07-18',
      messages: messages.map(content => ({ role: 'user', content }))
    };
  
    return this.http.post<any>(this.openAiUrl, body, { headers });
  }
  
  private sendGeminiMessage(messages: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    const body = {
      contents: [
        { parts: messages.map(text => ({ text })) }
      ]
    };
  
    return this.http.post<any>(`${this.geminiUrl}?key=${this.geminiKey}`, body, { headers });
  }

  private sendMistralMessage(messages: string[]): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.mistralKey}`
    });

    const body = {
      model: 'mistral-tiny', 
      messages: messages.map(content => ({ role: 'user', content }))
    };

    return this.http.post<any>(this.mistralUrl, body, { headers });
  }
}
