import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Ad {
  id: number;
  brand: string;
  model: string;
  location: string;
  price: number;
  description?: string;
  specs: {
    year: number;
    mileage: number;
    fuel_type: string;
    transmission?: string;
    color?: string;
    doors?: number;
    engine_size?: string;
    body_type?: string;
    images?: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = 'http://localhost:3000/api/ads';

  constructor(private http: HttpClient) { }

  getCars(params?: any): Observable<Ad[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key]) httpParams = httpParams.append(key, params[key]);
      });
    }
    return this.http.get<Ad[]>(this.apiUrl, { params: httpParams });
  }

  createCar(formData: FormData): Observable<Ad> {
    return this.http.post<Ad>(this.apiUrl, formData).pipe(
      catchError((error: HttpErrorResponse) => throwError(() => error))
    );
  }

  getCarById(id: number): Observable<Ad> {
    return this.http.get<Ad>(`${this.apiUrl}/${id}`);
  }
}