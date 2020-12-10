import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PendingTransaction } from '@shared/interface/transactions';
import Cropper from 'cropperjs';
import imageCompression from 'browser-image-compression';

const cropperOptions = {
  viewMode: 3,
  dragMode: 'move',
  aspectRatio: 300 / 400,
  autoCropArea: 1,
  restore: false,
  modal: false,
  guides: true,
  highlight: false,
  cropBoxMovable: false,
  cropBoxResizable: false,
  toggleDragModeOnDblclick: false,
};

@Component({
  selector: 'lukso-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageEditorComponent implements OnInit {
  @Input() pendingActions: PendingTransaction[] = [];
  @ViewChild('fileDropRef', { static: false }) fileDropEl: any;

  imageSource: string = '/assets/portrait-placeholder.png';
  compressedSize: number = 0;
  files: any[] = [];
  cropper: Cropper | undefined;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  fileBrowseHandler(files: any) {
    this.prepareFilesList(files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<File>) {
    var inputImage = document.getElementById('fileDropRef') as any;

    const file = files[0];

    if (/^image\/\w+/.test(file.type)) {
      const image = document.querySelector('#cropper') as HTMLImageElement;
      image.src = URL.createObjectURL(file);
      if (this.cropper) {
        this.cropper.destroy();
      }
      this.cropper = new Cropper(image, cropperOptions as any);
      inputImage.value = null;
    } else {
      window.alert('Please choose an image file.');
    }

    this.fileDropEl.nativeElement.value = '';
  }

  async handleImageUpload(canvas: HTMLCanvasElement) {
    const imageFile = await imageCompression.canvasToFile(canvas, 'image/jpg', 'portrait', 0);
    try {
      const compressedFile = await imageCompression(imageFile, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 600,
        useWebWorker: true,
      });
      this.cdref.markForCheck();
      return compressedFile;
    } catch (error) {
      console.log(error);
    }
  }

  next() {
    if (this.cropper) {
      this.handleImageUpload(this.cropper?.getCroppedCanvas() as HTMLCanvasElement).then(
        (compressedFile) => {
          console.warn('IPFS upload not yet implemented');
          console.log(compressedFile);
          this.router.navigate(['../profile'], { relativeTo: this.activatedRoute });
        }
      );
    } else {
      this.router.navigate(['../profile'], { relativeTo: this.activatedRoute });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
