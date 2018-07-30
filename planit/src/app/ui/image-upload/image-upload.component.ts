import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadService } from '../services/file-upload-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-image-upload',
    templateUrl: './image-upload.component.html',
    styleUrls: ['./image-upload.component.css']
})
export class ImageUploadComponent implements OnInit {

    closeResult: string;

    @ViewChild('fileInput') fileInput: ElementRef;
    @ViewChild('cropImageTemplate') cropImageTemplate: NgbModalRef;
    errors: Array<string> = [];
    @Input() maxFiles = 1;
    @Input() maxSize = 5; // 5MB
    @Output() fileSelected = new EventEmitter();
    @Input() iconClass = 'ion-android-upload';
    @Input() dropHereLabel;
    dragAreaClass = 'dragarea';
    isFileselected: Boolean;
    imageChangedEvent: any;
    croppedImage: any;

    constructor(
        private modalService: NgbModal,
        public translate: TranslateService,
        private fileUploadService: FileUploadService
    ) {
        this.isFileselected = false;
    }

    ngOnInit() {
        this.fileUploadService.getExitFile().subscribe(file => {
            if (file) {
                this.croppedImage = file;
                this.isFileselected = true;
            }
        });
    }

    getBase64(file) {
        const myReader: FileReader = new FileReader();
        myReader.readAsDataURL(file);
        myReader.onloadend = (e) => {
            this.croppedImage = myReader.result;
        };
    }

    removeSelected() {
        this.croppedImage = null;
        this.isFileselected = false;
        this.fileSelected.emit();
        this.fileInput.nativeElement.value = '';
    }

    browseFile() {
        const el: HTMLElement = this.fileInput.nativeElement as HTMLElement;
        el.click();
    }

    private isValidFiles(files) {
        // Check Number of files
        if (files.length > this.maxFiles) {
            this.translate.get('FILEUPLOAD.ERROR.MAX_FILE', { value: this.maxFiles }).subscribe((res: string) => {
                this.errors.push(res);
                return false;
            });
        }
        if (this.errors.length === 0) {
            this.isValidFileSize(files);
        }
        return this.errors.length === 0;
    }

    private isValidFileSize(file) {
        const fileSizeinMB = file.size / (1024 * 1000);
        const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize) {
            this.translate.get('FILEUPLOAD.ERROR.FILE_SIZE', { value: this.maxSize })
                .subscribe((res: string) => {
                    this.errors.push(res);
                });
        }
    }

    fileChangeEvent(fileInput: any): void {
        this.errors = [];
        if (fileInput.target.files && fileInput.target.files[0]) {
            if (this.isValidFiles(fileInput.target.files)) {
                this.isFileselected = true;
                this.imageChangedEvent = fileInput;
                this.openModal(this.cropImageTemplate);
                this.fileSelected.emit(fileInput.target.files[0]);
            } else {
                this.croppedImage = null;
                this.isFileselected = false;
            }
        }
    }

    imageCropped(image: string) {
        this.croppedImage = image;
    }

    openModal(content) {
        this.modalService.open(content, { backdrop: 'static' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
            if (result === 'Save click') {
                this.fileSelected.emit(this.croppedImage.split('base64,')[1]);
            }
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }
}
