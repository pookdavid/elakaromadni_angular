import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private apiUrl = 'http://localhost:3000/api/messages';

  constructor(private http: HttpClient) {}

  getConversations(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }

  getMessages(senderId: number, receiverId: number, adId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/${senderId}/${receiverId}/${adId}`
    );
  }

  sendMessage(message: any): Observable<any> {
    return this.http.post(this.apiUrl, message);
  }
}