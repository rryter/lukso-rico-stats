import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
  selector: 'lukso-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageCropperComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor() {}

  ngOnInit(): void {}

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded(image: HTMLImageElement) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
