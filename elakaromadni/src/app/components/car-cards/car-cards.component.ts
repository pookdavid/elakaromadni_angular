import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface Car {
  id: number;
  title: string;
  price: number;
  images: string[];
  specs: {
    brand: string;
    model: string;
    year: number;
    mileage?: number;
    fuel_type?: string;
  };
}

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.scss']
})
export class CarCardComponent {
  @Input() car!: Car;
}