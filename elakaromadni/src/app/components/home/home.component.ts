import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  template: `
    <div class="p-8 text-center">
      <h1 class="text-4xl font-bold mb-4">Üdvözöljük az Elakaromadni.hu-n</h1>
      <p class="text-lg mb-8">Magyarország legnagyobb használtautó piaca</p>
      <button mat-raised-button color="primary" routerLink="/ads">
        Böngésszen hirdetéseinket
      </button>
    </div>
  `,
  styles: []
})
export class HomeComponent {}