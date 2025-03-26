import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CarService } from '../../services/car.service';
import { RouterModule } from '@angular/router';
import { Car } from '../../services/car.service';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <mat-card *ngFor="let car of cars" class="relative">
        <img mat-card-image [src]="car.images[0]" alt="{{car.brand}} {{car.model}}">
        <mat-card-content>
          <h2 class="text-xl font-bold">{{car.brand}} {{car.model}}</h2>
          <p class="text-gray-600">{{car.year}} • {{car.mileage | number}} km</p>
          <p class="text-2xl font-bold text-primary mt-4">{{car.price | number}} HUF</p>
        </mat-card-content>
        <mat-card-actions>
          <button mat-button [routerLink]="['/cars', car.id]">Részletek</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: []
})
export class AdsComponent implements OnInit {
  cars: Car[] = [];

  constructor(private carService: CarService) {}

  ngOnInit() {
    this.carService.getCars().subscribe((cars: Car[]) => {
      this.cars = cars;
    });
  }
}