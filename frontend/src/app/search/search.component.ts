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
          <mat-grid-list cols="3" rowHeight="320px" gutterSize="10px">
            <mat-grid-tile *ngFor="let photo of results">
              <mat-card style="width: 100%; height: 100%;">
                <img mat-card-image [src]="photo.imageUrl" [alt]="photo.fileName" 
                     style="cursor: pointer; max-height: 200px; object-fit: cover;" 
                     (click)="openPreview(photo)">
                <mat-card-content>
                  <p style="font-size: 12px; margin: 8px 0;">{{ photo.fileName }}</p>
                  <button mat-raised-button color="accent" (click)="downloadPhoto(photo.imageUrl, photo.fileName)" style="width: 100%;">
                    <mat-icon>download</mat-icon>
                    Download
                  </button>
                </mat-card-content>
              </mat-card>
            </mat-grid-tile>
          </mat-grid-list>
        </div>
        
        <p *ngIf="results.length === 0 && searched">No matching photos found.</p>
      </mat-card-content>
    </mat-card>

    <div *ngIf="previewPhoto" class="preview-overlay" (click)="closePreview()">
      <div class="preview-container" (click)="$event.stopPropagation()">
        <button mat-icon-button class="close-btn" (click)="closePreview()">
          <mat-icon>close</mat-icon>
        </button>
        <img [src]="previewPhoto.imageUrl" [alt]="previewPhoto.fileName">
        <div class="preview-actions">
          <p>{{ previewPhoto.fileName }}</p>
          <button mat-raised-button color="primary" (click)="downloadPhoto(previewPhoto.imageUrl, previewPhoto.fileName)">
            <mat-icon>download</mat-icon>
            Download
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    mat-card { max-width: 1000px; margin: 20px auto; }
    input { margin: 20px 0; }
    button { margin-left: 10px; }
    mat-grid-tile mat-card { width: 100%; height: 100%; }
    
    .preview-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      cursor: pointer;
    }
    
    .preview-container {
      position: relative;
      max-width: 90%;
      max-height: 90vh;
      background: white;
      border-radius: 8px;
      padding: 20px;
      cursor: default;
    }
    
    .preview-container img {
      max-width: 100%;
      max-height: 70vh;
      display: block;
      margin: 0 auto;
    }
    
    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.5);
      color: white;
    }
    
    .preview-actions {
      margin-top: 20px;
      text-align: center;
    }
    
    .preview-actions p {
      margin-bottom: 10px;
      font-weight: 500;
    }
    
    .preview-actions button {
      width: 200px;
    }
  `]
})
export class SearchComponent {
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  results: any[] = [];
  searched = false;
  previewPhoto: any = null;

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

  openPreview(photo: any) {
    this.previewPhoto = photo;
  }

  closePreview() {
    this.previewPhoto = null;
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
      })
      .catch(err => {
        console.error('Download failed:', err);
        // Fallback: open in new tab
        window.open(imageUrl, '_blank');
      });
  }
}
