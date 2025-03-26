import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <mat-toolbar color="primary">
      <a mat-button routerLink="/">
        <img src="assets/logo.png" alt="Logo" class="h-10">
      </a>
      <span class="flex-grow"></span>
      <nav class="flex gap-4">
        <a mat-button routerLink="/ads">Hirdetések</a>
        <a mat-button routerLink="/about">Rólunk</a>
        <a mat-button routerLink="/messages">Üzenetek</a>
      </nav>
    </mat-toolbar>
  `,
  styles: [`
    .flex-grow { flex: 1; }
  `]
})
export class NavbarComponent {}