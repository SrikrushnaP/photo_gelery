import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatProgressBarModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Upload Photos</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <input type="file" (change)="onFileSelect($event)" accept="image/*" multiple>
        <button mat-raised-button color="primary" (click)="upload()" [disabled]="selectedFiles.length === 0 || uploading">
          Upload {{ selectedFiles.length }} Photo(s)
        </button>
        
        <mat-progress-bar *ngIf="uploading" mode="determinate" [value]="progress"></mat-progress-bar>
        
        <div *ngIf="previews.length > 0" style="margin-top: 20px;">
          <h3>Preview ({{ previews.length }} photos):</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px;">
            <img *ngFor="let preview of previews" [src]="preview" alt="Preview" style="width: 100%; height: 150px; object-fit: cover;">
          </div>
        </div>
        
        <p *ngIf="message" [style.color]="isSuccess ? 'green' : 'red'">{{ message }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card { max-width: 800px; margin: 20px auto; }
    input { margin: 20px 0; }
    button { margin-left: 10px; }
    mat-progress-bar { margin-top: 20px; }
  `]
})
export class UploadComponent {
  selectedFiles: File[] = [];
  previews: string[] = [];
  message = '';
  isSuccess = false;
  uploading = false;
  progress = 0;

  constructor(private photoService: PhotoService) {}

  onFileSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = files;
    this.previews = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => this.previews.push(reader.result as string);
      reader.readAsDataURL(file);
    });
  }

  upload() {
    if (this.selectedFiles.length === 0) return;
    
    this.uploading = true;
    this.progress = 0;
    let completed = 0;

    this.selectedFiles.forEach((file, index) => {
      this.photoService.uploadPhoto(file).subscribe({
        next: () => {
          completed++;
          this.progress = (completed / this.selectedFiles.length) * 100;
          
          if (completed === this.selectedFiles.length) {
            this.message = `Successfully uploaded ${completed} photo(s)!`;
            this.isSuccess = true;
            this.uploading = false;
            this.selectedFiles = [];
            this.previews = [];
          }
        },
        error: () => {
          completed++;
          this.progress = (completed / this.selectedFiles.length) * 100;
          
          if (completed === this.selectedFiles.length) {
            this.message = `Upload completed with some errors`;
            this.isSuccess = false;
            this.uploading = false;
          }
        }
      });
    });
  }
}
