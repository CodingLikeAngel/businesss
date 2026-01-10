import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environments/environment';



@Injectable({
  providedIn: 'root'
})
export class AIService {
  
  private openAiUrl = environment.openAiUrl;
  private geminiUrl = environment.geminiUrl;
  private openAiKey = environment.openAiKey;
  private geminiKey = environment.geminiKey;
  useGemini = true; // Cambia a `false` para usar OpenAI

  constructor(private http: HttpClient) {}

  sendMessage(messages: string[]): Observable<any> {
    return this.useGemini ? this.sendGeminiMessage(messages) : this.sendOpenAIMessage(messages);
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
  
}
