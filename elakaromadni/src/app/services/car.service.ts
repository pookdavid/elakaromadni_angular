import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Car {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  specs: {
    brand: string;
    model: string;
    year: number;
    mileage?: number;
    fuel_type?: string;
  };
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class CarService {
  private apiUrl = 'http://localhost:3000/api/ads';

  constructor(private http: HttpClient) { }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }

  getCarById(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }

  createCar(formData: FormData): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, formData);
  }
}