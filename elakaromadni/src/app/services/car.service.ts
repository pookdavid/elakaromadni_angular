import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuelType?: string;
  images: string[];
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:3000/api/cars';
  private mockCars: Car[] = [
    {
      id: 1,
      brand: 'Suzuki',
      model: 'Swift',
      year: 2020,
      price: 3500000,
      mileage: 45000,
      images: ['https://via.placeholder.com/300x200.png?text=Car+Image']
    },
    {
      id: 2,
      brand: 'Toyota',
      model: 'Corolla',
      year: 2018,
      price: 5500000,
      mileage: 80000,
      images: ['https://via.placeholder.com/300x200.png?text=Car+Image']
    }
  ];

  constructor(private http: HttpClient) { }

  getCars(): Observable<Car[]> {
    return of(this.mockCars);
  }

  getCarById(id: number): Observable<Car> {
    const car = this.mockCars.find(c => c.id === id);
    if (!car) {
      throw new Error('Car not found');
    }
    return of(car);
  }

  createCar(formData: FormData): Observable<Car> {
    const newCar: Car = {
      id: this.mockCars.length + 1,
      brand: formData.get('brand') as string,
      model: formData.get('model') as string,
      year: Number(formData.get('year')),
      price: Number(formData.get('price')),
      mileage: Number(formData.get('mileage')) || undefined,
      fuelType: formData.get('fuelType') as string || undefined,
      description: formData.get('description') as string || undefined,
      images: []
    };

    const imageFiles = formData.getAll('images') as File[];
    newCar.images = imageFiles.map(file => URL.createObjectURL(file));

    this.mockCars.push(newCar);
    return of(newCar);
  }
}