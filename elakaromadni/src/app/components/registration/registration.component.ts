import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = false;
  errorMessage: string | null = null;

  registerForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, { 
    validators: this.passwordMatchValidator 
  });

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      
      this.authService.register({ 
        name: name!, 
        email: email!, 
        password: password! 
      }).subscribe({
        error: (registerError: any) => {
          console.error('Registration failed:', registerError);
          this.errorMessage = registerError.error?.message || 'Registration failed';
        }
      });
    }
  }
}