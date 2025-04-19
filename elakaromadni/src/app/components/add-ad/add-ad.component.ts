import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CarService } from '../../services/car.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-ad',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  template: `
    <div class="max-w-2xl mx-auto my-8 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6">Új hirdetés feladása</h2>
      <form [formGroup]="carForm" (ngSubmit)="onSubmit()">
        <!-- Brand Input -->
        <mat-form-field class="w-full mb-4">
          <input matInput placeholder="Márka" formControlName="brand" required>
          <mat-error *ngIf="carForm.get('brand')?.hasError('required')">
            Kötelező mező
          </mat-error>
        </mat-form-field>

        <!-- Model Input -->
        <mat-form-field class="w-full mb-4">
          <input matInput placeholder="Modell" formControlName="model" required>
          <mat-error *ngIf="carForm.get('model')?.hasError('required')">
            Kötelező mező
          </mat-error>
        </mat-form-field>

        <!-- Year Input -->
        <mat-form-field class="w-full mb-4">
          <input matInput type="number" placeholder="Évjárat" 
                 formControlName="year" min="1900" required>
          <mat-error *ngIf="carForm.get('year')?.hasError('required')">
            Kötelező mező
          </mat-error>
          <mat-error *ngIf="carForm.get('year')?.hasError('min')">
            Érvénytelen évjárat
          </mat-error>
        </mat-form-field>

        <!-- Price Input -->
        <mat-form-field class="w-full mb-4">
          <input matInput type="number" placeholder="Ár (HUF)" 
                 formControlName="price" required>
          <span matTextPrefix>HUF&nbsp;</span>
          <mat-error *ngIf="carForm.get('price')?.hasError('required')">
            Kötelező mező
          </mat-error>
        </mat-form-field>

        <!-- Mileage Input -->
        <mat-form-field class="w-full mb-4">
          <input matInput type="number" placeholder="Kilométeróra állás (km)" 
                 formControlName="mileage">
        </mat-form-field>

        <!-- Fuel Type Select -->
        <mat-form-field class="w-full mb-4">
          <mat-label>Üzemanyag típus</mat-label>
          <mat-select formControlName="fuelType">
            <mat-option value="Benzin">Benzin</mat-option>
            <mat-option value="Dízel">Dízel</mat-option>
            <mat-option value="Elektromos">Elektromos</mat-option>
            <mat-option value="Hibrid">Hibrid</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Description Input -->
        <mat-form-field class="w-full mb-4">
          <textarea matInput placeholder="Leírás" 
                    formControlName="description" rows="4"></textarea>
        </mat-form-field>

        <!-- Image Upload -->
        <div class="mb-6">
          <label class="block text-gray-700 mb-2">Képek feltöltése</label>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input type="file" multiple (change)="onFileSelect($event)" 
                   class="hidden" #fileInput accept="image/*">
            <button mat-raised-button type="button" (click)="fileInput.click()">
              <mat-icon>upload</mat-icon>
              Képek kiválasztása
            </button>
            
            <!-- Preview Images -->
            <div class="mt-4 grid grid-cols-3 gap-2">
              <div *ngFor="let preview of imagePreviews" class="relative image-preview-container">
                <img [src]="preview" class="h-32 w-full object-cover rounded">
                <button mat-icon-button class="absolute top-0 right-0 text-red-500 remove-image-btn" 
                        (click)="removeImage(preview)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button mat-raised-button color="primary" type="submit" 
                [disabled]="!carForm.valid || selectedFiles.length === 0">
          Hirdetés közzététele
        </button>
      </form>
    </div>
  `,
  styles: []
})
export class AddAdComponent {
  private fb = inject(FormBuilder);
  private carService = inject(CarService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  carForm = this.fb.group({
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: [null, [Validators.required, Validators.min(1900)]],
    price: [null, Validators.required],
    mileage: [null],
    fuelType: [''],
    description: ['']
  });

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  isSubmitting = false;

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles = Array.from(input.files);
      this.generatePreviews();
    }
  }

  private generatePreviews() {
    this.imagePreviews = [];
    for (const file of this.selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(preview: string) {
    const index = this.imagePreviews.indexOf(preview);
    if (index > -1) {
      this.imagePreviews.splice(index, 1);
      this.selectedFiles.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.carForm.valid && this.selectedFiles.length > 0 && !this.isSubmitting) {
      this.isSubmitting = true;
      
      const formData = new FormData();
      const carData = {
        title: `${this.carForm.value.brand} ${this.carForm.value.model}`,
        price: this.carForm.value.price,
        specs: {
          brand: this.carForm.value.brand,
          model: this.carForm.value.model,
          year: this.carForm.value.year,
          mileage: this.carForm.value.mileage,
          fuel_type: this.carForm.value.fuelType
        },
        description: this.carForm.value.description || ''
      };

      formData.append('data', JSON.stringify(carData));
      
      this.selectedFiles.forEach((file, index) => {
        formData.append('images', file, `image-${index}`);
      });

      this.carService.createCar(formData).subscribe({
        next: () => {
          this.snackBar.open('Hirdetés sikeresen közzétéve!', 'Bezár', {
            duration: 3000
          });
          this.router.navigate(['/ads']);
        },
        error: (err) => {
          console.error('Hiba a hirdetés feladásakor:', err);
          this.snackBar.open('Hiba történt a hirdetés feladása közben!', 'Bezár', {
            duration: 5000
          });
          this.isSubmitting = false;
        },
        complete: () => this.isSubmitting = false
      });
    }
  }
}