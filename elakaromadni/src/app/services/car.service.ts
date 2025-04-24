import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Ad {
  id: number;
  title: string;
  description?: string;
  price: number;
  specs: {
    brand: string;
    model: string;
    year: number;
    mileage: number;
    fuel_type: string;
    images: string[];
  };
  images?: string[]; 
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.apiUrl}/ads`;

  constructor(private http: HttpClient) { }

  getCars(params?: any): Observable<Ad[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }
    return this.http.get<Ad[]>('http://localhost:3000/api/ads', { params: httpParams });
  }

  createCar(formData: FormData): Observable<Ad> {
    return this.http.post<Ad>(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error creating ad:', error);
        return throwError(() => new Error('Failed to create ad'));
      })
    );
  }

  getCarById(id: number): Observable<Ad> {
    return this.http.get<Ad>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error fetching car:', error);
        return throwError(() => new Error('Failed to fetch car details'));
      })
    );
  }
}