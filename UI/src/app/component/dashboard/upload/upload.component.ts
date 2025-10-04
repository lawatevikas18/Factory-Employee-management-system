import { Component } from '@angular/core';
import { UploadService } from 'src/app/core/services/upload-service.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
 selectedFile: File | null = null;
  images: any[] = [];

  constructor(private uploadService: UploadService) {}

  ngOnInit(): void {
    this.loadImages();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      this.uploadService.upload(this.selectedFile).subscribe({
        next: (res) => {
          this.images.push(res);
          this.selectedFile = null;
        },
        error: (err) => console.error(err)
      });
    }
  }

  loadImages() {
    this.uploadService.getAll().subscribe({
      next: (res) => this.images = res,
      error: (err) => console.error(err)
    });
  }

  deleteImage(id: number) {
    this.uploadService.delete(id).subscribe({
      next: () => {
        this.images = this.images.filter(img => img.id !== id);
      },
      error: (err) => console.error(err)
    });
  }
}
