import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PendingTransaction, PendingTransactionType } from '@shared/interface/transactions';
import Cropper from 'cropperjs';
import imageCompression from 'browser-image-compression';
import ipfsClient from 'ipfs-http-client';
import { ClientOptions } from 'ipfs-http-client/src/lib/core';
import { pluck } from 'rxjs/operators';
import { Contracts } from '@shared/interface/contracts';
import { Observable } from 'rxjs';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';

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
export class ImageEditorComponent implements OnInit {
  @Input() pendingActions: PendingTransaction[] = [];
  @ViewChild('fileDropRef', { static: false }) fileDropEl: any;

  ipfs: any;
  imageSource: string = '/assets/portrait-placeholder.png';
  compressedSize: number = 0;
  files: any[] = [];
  cropper: Cropper | undefined;
  contracts$: Observable<Contracts>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cdref: ChangeDetectorRef,
    private loadingIndicatorService: LoadingIndicatorService
  ) {
    const options: ClientOptions = {
      url: '/ip4/127.0.0.1/tcp/5001',
    };
    this.ipfs = ipfsClient(options);
    this.contracts$ = this.activatedRoute.parent!.data.pipe(pluck('contracts'));
  }

  ngOnInit(): void {
    this.contracts$.subscribe(({ accountData }) => {
      if (accountData.image) {
        this.imageSource = 'https://ipfs.io/ipfs/' + accountData.image;
      } else {
        this.imageSource = '/assets/portrait-placeholder.png';
      }
    });
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
          window.localStorage.setItem('image', file.path);
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
