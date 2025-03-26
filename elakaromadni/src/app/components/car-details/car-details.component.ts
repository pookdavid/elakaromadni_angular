import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CarService, Car } from '../../services/car.service';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-8 max-w-4xl mx-auto">
      <mat-card>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div *ngFor="let image of car?.images">
            <img [src]="image" class="w-full h-64 object-cover">
          </div>
        </div>
        
        <mat-card-content class="mt-6">
          <h1 class="text-3xl font-bold">{{car?.brand}} {{car?.model}}</h1>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p class="text-gray-600">Évjárat</p>
              <p class="text-lg">{{car?.year}}</p>
            </div>
            <div>
              <p class="text-gray-600">Ár</p>
              <p class="text-2xl font-bold text-primary">{{car?.price | number}} HUF</p>
            </div>
            <div>
              <p class="text-gray-600">Kilométeróra állás</p>
              <p class="text-lg">{{car?.mileage | number}} km</p>
            </div>
            <div>
              <p class="text-gray-600">Üzemanyag típus</p>
              <p class="text-lg">{{car?.fuelType || 'N/A'}}</p>
            </div>
          </div>
          
          <div class="mt-6">
            <h2 class="text-xl font-bold mb-2">Leírás</h2>
            <p class="text-gray-700 whitespace-pre-wrap">{{car?.description || 'Nincs leírás'}}</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: []
})
export class CarDetailsComponent implements OnInit {
  car?: Car;

  constructor(
    private route: ActivatedRoute,
    private carService: CarService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.carService.getCarById(+id).subscribe(car => {
      this.car = car;
    });
  }
}