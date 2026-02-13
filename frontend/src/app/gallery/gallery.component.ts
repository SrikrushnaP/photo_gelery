import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatGridListModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Photo Gallery ({{ photos.length }})</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-grid-list cols="4" rowHeight="250px" gutterSize="10px">
          <mat-grid-tile *ngFor="let photo of photos">
            <mat-card>
              <img mat-card-image [src]="photo.imageUrl" [alt]="photo.fileName" loading="lazy">
              <mat-card-content>
                <p>{{ photo.fileName }}</p>
                <small>{{ photo.uploadDate | date:'short' }}</small>
              </mat-card-content>
            </mat-card>
          </mat-grid-tile>
        </mat-grid-list>
        <p *ngIf="photos.length === 0">No photos uploaded yet.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card { max-width: 1200px; margin: 20px auto; }
    mat-grid-tile mat-card { width: 100%; height: 100%; }
    mat-grid-tile img { max-width: 100%; max-height: 150px; object-fit: cover; }
    mat-grid-tile mat-card-content { font-size: 12px; }
    @media (max-width: 1024px) { mat-grid-list { cols: 3 !important; } }
    @media (max-width: 768px) { mat-grid-list { cols: 2 !important; } }
    @media (max-width: 480px) { mat-grid-list { cols: 1 !important; } }
  `]
})
export class GalleryComponent implements OnInit {
  photos: any[] = [];

  constructor(private photoService: PhotoService) {}

  ngOnInit() {
    this.photoService.getAllPhotos().subscribe({
      next: (data: any) => this.photos = data,
      error: () => this.photos = []
    });
  }
}
