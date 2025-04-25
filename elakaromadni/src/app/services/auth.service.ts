import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { email: string; password: string }) {
    return this.http.post<{ 
      token: string, 
      user: any 
    }>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        console.log('Server response:', response);
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('current_user', JSON.stringify(response.user));
      })
    );
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  getCurrentUser() {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
  }

  getCurrentUserId(): number | null {
    const token = this.getToken();
    return token ? JSON.parse(atob(token.split('.')[1]))?.userId : null;
  }

  getToken() {
    return localStorage.getItem('auth_token');
  }

  logout() {
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }
}