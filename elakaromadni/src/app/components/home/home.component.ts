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
      price: 1850000, 
      image: '/car1.jpg' 
    },{ 
      id: 2, 
      make: 'Honda', 
      model: 'Civic', 
      year: 2018, 
      mileage: 137000,
      price: 2750000, 
      image: '/car2.jpg' 
    },{ 
      id: 3, 
      make: 'BWM', 
      model: '340i', 
      year: 2017, 
      mileage: 88000,
      price: 5550000, 
      image: '/car3.jpg' 
    },{ 
      id: 4, 
      make: 'Audi', 
      model: 'A4', 
      year: 2019, 
      mileage: 54000,
      price: 14780000, 
      image: '/car4.jpg' 
    },{ 
      id: 5, 
      make: 'Mercedes-Benz', 
      model: 'C300', 
      year: 2017, 
      mileage: 179000,
      price: 14700000, 
      image: '/car5.jpg' 
    },
  ];

  categories = [
    { name: 'Sedan', icon: 'directions_car' },
    { name: 'Kombi', icon: 'directions_car' },
    { name: 'Hatchback', icon: 'directions_car' },
    { name: 'Coupe', icon: 'directions_car' },
    { name: 'Cabrio', icon: 'directions_car' },
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