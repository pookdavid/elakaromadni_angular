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
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

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
  searchForm!: FormGroup;
  carForm!: FormGroup;
  selectedFiles!: FileList;
  filteredAds: Ad[] = [];
  brands: any[] = [];
  allModels: any[] = [];
  filteredModels: any[] = [];
  fuelTypes = ['Benzin', 'Dízel', 'Elektromos', 'Hibrid'];
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private carService: CarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.initializeForms();
    this.loadBrands();
    this.loadAllModels();
    this.loadAds();
  }

  private initializeForms() {
    this.searchForm = this.fb.group({
      brand: [''],
      model: [''],
      minPrice: [null],
      maxPrice: [null],
      minYear: [null],
      maxMileage: [null],
      fuelType: ['']
    });

    this.carForm = this.fb.group({
      brand: [''],
      model: [''],
      year: [null],
      mileage: [null],
      price: [null],
      fuelType: [''],
      description: ['']
    });
  }

  private loadBrands(): void {
    this.carService.getBrands().subscribe({
      next: (brands) => this.brands = brands,
      error: (err) => console.error('Error loading brands:', err)
    });
  }

  private loadAllModels(): void {
    this.carService.getModels().subscribe({
      next: (models) => {
        this.allModels = models;
        this.filteredModels = [];
      },
      error: (err) => console.error('Error loading models:', err)
    });
  }

  onBrandSelected(): void {
    const brandId = this.searchForm.get('brand')?.value;
    this.filteredModels = this.allModels.filter(model => model.brandId === brandId);
    if (!brandId) this.searchForm.get('model')?.reset();
  }

  async loadAds() {
    this.isLoading = true;
    try {
      const ads = await this.carService.getCars(this.buildSearchParams()).toPromise() || [];
      
      this.filteredAds = ads.map(ad => ({
        ...ad,
        specs: {
          ...ad.specs,
          images: ad.specs?.images || [],
          year: ad.specs?.year,
          mileage: ad.specs?.mileage,
          fuel_type: ad.specs?.fuel_type
        }
      }));
      
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading = false;
    }
  }

  onSearch() {
    this.isLoading = true;
    const filters = this.buildSearchParams();
    
    this.carService.searchAds(filters).subscribe({
      next: (ads) => {
        this.filteredAds = ads;
        this.isLoading = false;
      },
      error: (err) => this.handleError(err)
    });
  }

  clearFilters() {
    this.searchForm.reset();
    this.loadAds();
  }

  private buildSearchParams(): any {
    return {
      brand: this.searchForm.value.brand,
      model: this.searchForm.value.model,
      minPrice: this.searchForm.value.minPrice,
      maxPrice: this.searchForm.value.maxPrice,
      minYear: this.searchForm.value.minYear,
      maxMileage: this.searchForm.value.maxMileage,
      fuelType: this.searchForm.value.fuelType
    };
  }

  private handleError(error: any): void {
    this.errorMessage = error instanceof HttpErrorResponse 
      ? error.error.message 
      : 'Error loading ads. Please try again later.';
    console.error('Error:', error);
    this.isLoading = false;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = input.files;
    }
  }

  onSubmit() {
    // Your existing form submission logic
  }
}