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
import { ClientOptions } from 'ipfs-http-client/src/lib/core';
import { map, pluck } from 'rxjs/operators';
import { Contracts } from '@shared/interface/contracts';
import { Observable } from 'rxjs';

import ipfsClient from 'ipfs-http-client';

const cropperOptions = {
  viewMode: 3,
  dragMode: 'move',
  aspectRatio: 250 / 300,
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
export class ImageEditorComponent {
  @Input() pendingActions: PendingTransaction[] = [];
  @ViewChild('fileDropRef', { static: false }) fileDropEl: any;

  ipfs: any;
  file: File | undefined;
  cropper: Cropper | undefined;

  contracts$: Observable<Contracts>;
  imageSource$: Observable<string>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdref: ChangeDetectorRef
  ) {
    this.ipfs = ipfsClient({ protocol: 'https', host: 'ipfs.infura.io', port: 5001 });
    this.contracts$ = this.activatedRoute.parent?.data.pipe(
      pluck('contracts')
    ) as Observable<Contracts>;
    this.imageSource$ = this.contracts$.pipe(
      map(({ accountData }) => {
        if (accountData.image) {
          return 'https://ipfs.io/ipfs/' + accountData.image;
        } else {
          return '/assets/portrait-placeholder.png';
        }
      })
    );
  }

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
    const inputImage = document.getElementById('fileDropRef') as any;
    this.file = files[0];

    if (/^image\/\w+/.test(this.file.type)) {
      const image = document.querySelector('#cropper') as HTMLImageElement;
      image.src = URL.createObjectURL(this.file);

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
    const compressedFile = await imageCompression(imageFile, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 600,
      useWebWorker: true,
    });
    this.cdref.markForCheck();
    return compressedFile;
  }

  next() {
    if (this.cropper) {
      this.handleImageUpload(this.cropper.getCroppedCanvas() as HTMLCanvasElement)
        .then((compressedFile: Blob) => {
          return this.ipfs.add(compressedFile, {
            progress: (prog: any) => console.log(`received: ${prog}`),
          });
        })
        .then((file: any) => {
          this.router.navigate(['../profile'], {
            relativeTo: this.activatedRoute,
            state: { imagePath: file.path },
          });

          return file;
        });
    } else {
      this.router.navigate(['../profile'], { relativeTo: this.activatedRoute });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
