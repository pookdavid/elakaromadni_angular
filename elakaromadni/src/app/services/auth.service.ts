import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

interface UserData {
  name: string;
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient) {}

  register(userData: UserData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, {
      username: userData.name,
      email: userData.email,
      password: userData.password
    }).pipe(
      tap(response => this.storeAuthData(response))
    );
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => this.storeAuthData(response))
    );
  }

  private storeAuthData(response: AuthResponse): void {
    if (response.token) {
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('current_user', JSON.stringify(response.user));
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUser() {
    const userData = localStorage.getItem('current_user') || 'null';
    return JSON.parse(userData);
  }

  getCurrentUserId(): number | null {
    const user = this.getCurrentUser();
    return user?.id || null;
  }
}