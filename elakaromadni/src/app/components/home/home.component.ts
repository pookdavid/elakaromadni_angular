import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MessageBubbleComponent } from '../messages/message-bubble/message-bubble.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    MessageBubbleComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  @ViewChild('carList') carList!: ElementRef;

  featuredCars = [
    { 
      id: 1, 
      make: 'Toyota', 
      model: 'Corolla', 
      year: 2020, 
      mileage: 45000,
      price: 18500, 
      image: '/car1.jpg' 
    }
  ];

  categories = [
    { name: 'Sedans', icon: 'directions_car' }
  ];

  scrollCarList(direction: number): void {
    this.carList.nativeElement.scrollBy({
      left: 300 * direction,
      behavior: 'smooth'
    });
  }

  openChat(): void {
    console.log('Chat opened');
  }
}