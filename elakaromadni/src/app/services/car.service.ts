import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Ad {
  id: number;
  brand: string;
  model: string;
  location: string;
  price: number;
  description?: string;
  specs?: {
    year?: number;
    mileage?: number;
    fuel_type?: string;
    transmission?: string;
    color?: string;
    doors?: number;
    engine_size?: string;
    body_type?: string;
    images?: string[];
  };
}

@Injectable({providedIn: 'root'})
export class CarService {
  private apiUrl = 'http://localhost:3000/api/ads';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      })
    };
  }

  getCars(params?: any): Observable<Ad[]> {
    return this.http.get<Ad[]>(this.apiUrl, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        return throwError(() => new Error('Failed to load ads'));
      })
    );
  }

  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/brands`);
  }

  getModels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/models`);
  }

  searchAds(filters: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/ads/search`, filters);
  }

  createCar(formData: FormData): Observable<any> {
    return this.http.post(`${environment.apiUrl}/ads`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
  }

  getCarById(id: number): Observable<Ad> {
    return this.http.get<Ad>(`${this.apiUrl}/${id}`);
  }
  
  getMyAds(userId: number): Observable<Ad[]> {
    return this.http.get<Ad[]>(`${this.apiUrl}/ads?userId=${userId}`);
  }
}