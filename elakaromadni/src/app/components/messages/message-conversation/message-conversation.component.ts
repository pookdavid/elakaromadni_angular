import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../services/message.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-message-conversation',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './message-conversation.component.html',
  styleUrls: ['./message-conversation.component.scss']
})
export class MessageConversationComponent implements OnInit {
  messages: any[] = [];
  newMessage = '';
  adId = 0;
  receiverId = 0;
  currentUserId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.route.params.subscribe(params => {
      this.receiverId = +params['receiverId'];
      this.adId = +params['adId'];
      this.loadMessages();
    });
  }

  loadMessages(): void {
    if (this.currentUserId) {
      this.messageService.getMessages(this.currentUserId, this.receiverId, this.adId)
        .subscribe((messages: any[]) => {
          this.messages = messages;
        });
    }
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.currentUserId) {
      const message = {
        sender_id: this.currentUserId,
        receiver_id: this.receiverId,
        ad_id: this.adId,
        content: this.newMessage
      };

      this.messageService.sendMessage(message).subscribe(() => {
        this.newMessage = '';
        this.loadMessages();
      });
    }
  }
}