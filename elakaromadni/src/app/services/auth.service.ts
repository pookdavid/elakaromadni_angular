import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) { }

  register(userData: RegisterData) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.router.navigate(['/']);
      })
    );
  }

  login(credentials: LoginCredentials) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('auth_token', response.token);
        this.router.navigate(['/ads']);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userId || null;
    }
    return null;
  }
}