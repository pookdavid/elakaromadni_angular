import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CarService, Ad } from '../../services/car.service';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-ads',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './my-ads.component.html',
  styleUrls: ['./my-ads.component.scss']
})
export class MyAdsComponent implements OnInit {
  myAds: Ad[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private carService: CarService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadMyAds();
  }

  private loadMyAds(): void {
    this.isLoading = true;
    const userId = this.authService.getCurrentUserId();
    
    if (!userId) {
      this.errorMessage = 'You must be logged in to view your ads';
      this.isLoading = false;
      return;
    }

    this.carService.getMyAds(userId).subscribe({
      next: (ads) => {
        this.myAds = ads;
        this.isLoading = false;
      },
      error: (err) => {
        this.handleError(err);
        this.isLoading = false;
      }
    });
  }

  private handleError(error: any): void {
    this.errorMessage = error instanceof HttpErrorResponse 
      ? error.error.message 
      : 'Error loading your ads. Please try again later.';
    console.error('Error:', error);
  }
}