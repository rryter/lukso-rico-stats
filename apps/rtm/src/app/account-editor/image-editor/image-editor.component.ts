import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contracts } from '@shared/interface/contracts';
import { PendingTransaction, PendingTransactionType } from '@shared/interface/transactions';
import { ContractService } from '@shared/services/contract.service';
import { LoadingIndicatorService } from '@shared/services/loading-indicator.service';
import imageCompression from 'browser-image-compression';
import Cropper from 'cropperjs';
import ipfsClient from 'ipfs-http-client';
import { Observable } from 'rxjs';
import { map, pluck, switchMap } from 'rxjs/operators';

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
  uploading = false;
  contracts$: Observable<Contracts>;
  imageSource$: Observable<string>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingIndicator: LoadingIndicatorService,
    private contractService: ContractService,
    private cdref: ChangeDetectorRef
  ) {
    this.ipfs = ipfsClient({ protocol: 'https', host: 'ipfs.infura.io', port: 5001 });
    if (!this.activatedRoute.parent) {
      throw Error('Data is missing');
    }
    this.contracts$ = this.activatedRoute.parent?.params.pipe(
      pluck('address'),
      switchMap((address) => {
        return this.contractService.getContractsAndData(address);
      })
    );
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
      this.uploading = true;
      this.loadingIndicator
        .addPromise({
          promise: this.handleImageUpload(
            this.cropper.getCroppedCanvas() as HTMLCanvasElement
          ).then((compressedFile: Blob) => {
            console.log(compressedFile);

            return this.ipfs.add(compressedFile, {
              progress: (prog: any) => console.log(`received: ${prog}`),
            });
          }),
          action: 'Uploading compressed image...',
          type: PendingTransactionType.All,
        })
        .then((file: any) => {
          console.log('LOADING::::DONE');
          this.uploading = false;
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
