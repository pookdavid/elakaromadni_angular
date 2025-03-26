import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Regisztráció</h2>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <mat-form-field class="w-full mb-4">
          <input matInput placeholder="Teljes név" formControlName="name">
        </mat-form-field>
        
        <mat-form-field class="w-full mb-4">
          <input matInput placeholder="Email" formControlName="email">
        </mat-form-field>

        <mat-form-field class="w-full mb-4">
          <input matInput type="password" placeholder="Jelszó" formControlName="password">
        </mat-form-field>

        <button mat-raised-button color="primary" class="w-full" type="submit">
          Regisztráció
        </button>
      </form>
    </div>
  `,
  styles: []
})
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err: any) => console.error(err)
      });
    }
  }
}