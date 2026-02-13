import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatGridListModule, MatIconModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Search Photos by Face</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <input type="file" (change)="onFileSelect($event)" accept="image/*">
        <button mat-raised-button color="primary" (click)="search()" [disabled]="!selectedFile">Search</button>
        
        <div *ngIf="previewUrl" style="margin-top: 20px;">
          <h3>Search Image:</h3>
          <img [src]="previewUrl" alt="Search" style="max-width: 200px;">
        </div>
        
        <div *ngIf="results.length > 0" style="margin-top: 30px;">
          <h3>Matching Photos ({{ results.length }}):</h3>
          <mat-grid-list cols="3" rowHeight="300px" gutterSize="10px">
            <mat-grid-tile *ngFor="let photo of results">
              <mat-card style="width: 100%; height: 100%;">
                <img mat-card-image [src]="photo.imageUrl" [alt]="photo.fileName" style="cursor: pointer;" (click)="openPreview(photo.imageUrl)">
                <mat-card-content>
                  <p>{{ photo.fileName }}</p>
                  <button mat-icon-button color="primary" (click)="downloadPhoto(photo.imageUrl, photo.fileName)">
                    <mat-icon>download</mat-icon>
                  </button>
                </mat-card-content>
              </mat-card>
            </mat-grid-tile>
          </mat-grid-list>
        </div>
        
        <p *ngIf="results.length === 0 && searched">No matching photos found.</p>
      </mat-card-content>
    </mat-card>

    <div *ngIf="previewImage" class="preview-overlay" (click)="closePreview()">
      <img [src]="previewImage" alt="Preview" style="max-width: 90%; max-height: 90vh;">
    </div>
  `,
  styles: [`
    mat-card { max-width: 1000px; margin: 20px auto; }
    input { margin: 20px 0; }
    button { margin-left: 10px; }
    mat-grid-tile mat-card { width: 100%; height: 100%; }
    mat-grid-tile img { max-width: 100%; max-height: 180px; object-fit: cover; }
    mat-grid-tile mat-card-content { font-size: 12px; }
    .preview-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      cursor: pointer;
    }
  `]
})
export class SearchComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  results: any[] = [];
  searched = false;
  previewImage: string | null = null;

  constructor(private photoService: PhotoService) {}

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  search() {
    if (this.selectedFile) {
      this.photoService.searchPhoto(this.selectedFile).subscribe({
        next: (data: any) => {
          this.results = data.matches;
          this.searched = true;
        },
        error: () => {
          this.results = [];
          this.searched = true;
        }
      });
    }
  }

  openPreview(imageUrl: string) {
    this.previewImage = imageUrl;
  }

  closePreview() {
    this.previewImage = null;
  }

  downloadPhoto(imageUrl: string, fileName: string) {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
  }
}
