import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CarService, Ad } from '../../services/car.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {
  searchForm: FormGroup;
  carForm!: FormGroup;
  selectedFiles!: FileList;
  filteredAds: Ad[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      brand: [''],
      model: [''],
      minPrice: [null],
      maxPrice: [null],
      minYear: [null],
      maxMileage: [null],
      fuelType: ['']
    });
  }

  ngOnInit() {
    this.loadAds();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = input.files;
    }
  }

  async loadAds() {
    this.isLoading = true;
    try {
      this.filteredAds = await this.carService.getCars(this.buildSearchParams()).toPromise() || [];
    } catch (error) {
      this.errorMessage = 'Error loading ads. Please try again later.';
      console.error('Error loading ads:', error);
    } finally {
      this.isLoading = false;
    }
  }

  onSearch() {
    this.loadAds();
  }

  clearFilters() {
    this.searchForm.reset();
    this.loadAds();
  }

  private buildSearchParams() {
    const formValue = this.searchForm.value;
    const params: {[key: string]: any} = {};
    if (formValue['brand']) params['brand'] = formValue['brand'];
    if (formValue['model']) params['model'] = formValue['model'];
    if (formValue['minPrice']) params['minPrice'] = formValue['minPrice'];
    if (formValue['maxPrice']) params['maxPrice'] = formValue['maxPrice'];
    if (formValue['minYear']) params['year'] = formValue['minYear'];
    if (formValue['maxMileage']) params['mileage'] = formValue['maxMileage'];
    if (formValue['fuelType']) params['fuelType'] = formValue['fuelType'];
    return params;
  }

  onSubmit() {
    if (this.carForm.valid && this.selectedFiles.length > 0) {
      const formData = new FormData();
      
      Object.entries(this.carForm.value).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });
  
      Array.from(this.selectedFiles).forEach((file: File, index: number) => {
        formData.append(`images`, file, `image-${index}.${file.name.split('.').pop()}`);
      });
  
      this.carService.createCar(formData).subscribe({
        next: () => {
          this.router.navigate(['/ads']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error submitting ad:', err);
          this.errorMessage = 'Error submitting ad. Please try again.';
        }
      });
    }
  }
}