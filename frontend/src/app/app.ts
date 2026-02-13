import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, CommonModule, MatToolbarModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <mat-toolbar color="primary">
      <span>Photo Search App</span>
      <span style="flex: 1;"></span>
      <button mat-button routerLink="/gallery">Gallery</button>
      <button mat-button routerLink="/upload">Upload</button>
      <button mat-button routerLink="/search">Search</button>
    </mat-toolbar>
    
    <div *ngIf="loadingService.loading$ | async" class="loading-overlay">
      <mat-spinner></mat-spinner>
    </div>
    
    <router-outlet />
  `,
  styles: [`
    mat-toolbar { margin-bottom: 20px; }
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
  `]
})
export class App {
  constructor(public loadingService: LoadingService) {}
}

