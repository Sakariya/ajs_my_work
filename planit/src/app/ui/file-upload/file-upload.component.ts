import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadService } from '../services/file-upload-service';

@Component({
    selector: 'app-file-upload',
    templateUrl: './file-upload.component.html',
    styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {


    @ViewChild('fileInput') fileInput: ElementRef;
    errors: Array<string> = [];
    @Input() fileExt = 'JPG, GIF, PNG';
    @Input() maxFiles = 1;
    @Input() existFile;
    @Input() maxSize = 5; // 5MB
    @Output() fileSelected = new EventEmitter();
    @Input() iconClass = 'ion-android-upload';
    @Input() isBase64 = true;
    @Input() isFileNamePreview = false;
    @Input() dropHereLabel;
    base64Image: string;
    dragAreaClass = 'dragarea';
    isFileselected: Boolean;
    fileName;
    isFilePreview = true;
    ImageExtention = ['JPG', 'GIF', 'PNG'];
    constructor( public translate: TranslateService,
        private fileUploadService: FileUploadService
    ) {
        this.isFileselected = false;
    }
    ngOnInit() {
        this.fileUploadService.getExitFile().subscribe(file => {
            if (file) {
                this.base64Image = file;
                this.isFileselected = true;
            }
        });
    }
    // showExist() {
    //     if (this.existFile && this.existFile !== undefined && this.existFile !== null) {
    //         if (this.isValidFiles(this.existFile)) {
    //             this.readThis(this.existFile);
    //             this.isFileselected = true;
    //            // this.fileSelected.emit(this.base64Image);
    //         }
    //     }
    // }
    @HostListener('drop', ['$event']) onDrop(event) {
        this.errors = [];
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
        event.stopPropagation();
        if (this.isValidFiles(event.dataTransfer.files)) {
            this.readThis(event.dataTransfer.files[0]);
            this.isFileselected = true;
            // this.fileSelected.emit(this.base64Image);
        } else {
            this.base64Image = '';
            this.isFileselected = false;
        }
    }

    readThis(inputValue: any): void {
        const file: File = inputValue;
        this.fileName = inputValue.name;
        if (this.isFilePreview) {
            const myReader: FileReader = new FileReader();
            myReader.onloadend = (e) => {
                if (this.isBase64) {
                    this.fileSelected.emit(myReader.result);
                } else { this.fileSelected.emit(file); }
                this.base64Image = myReader.result;
            };
            myReader.readAsDataURL(file);
        } else { this.fileSelected.emit(file); }
    }

    @HostListener('dragover', ['$event']) onDragOver(event) {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
    }
    @HostListener('dragenter', ['$event']) onDragEnter(event) {
        this.dragAreaClass = 'droparea';
        event.preventDefault();
    }

    @HostListener('dragend', ['$event']) onDragEnd(event) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
    }

    @HostListener('dragleave', ['$event']) onDragLeave(event) {
        this.dragAreaClass = 'dragarea';
        event.preventDefault();
    }
    showFilelected(fileInput: any) {
        this.errors = [];
        if (fileInput.target.files && fileInput.target.files[0]) {
            if (this.isValidFiles(fileInput.target.files)) {
                this.isFileselected = true;
                this.readThis(fileInput.target.files[0]);
            } else {
                this.base64Image = '';
                this.isFileselected = false;
            }
        }
    }

    removeSelected() {
        this.isFileselected = false;
        this.isFilePreview = true;
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
            this.isValidFileExtension(files);
        }
        return this.errors.length === 0;
    }

    private isValidFileExtension(files) {
        this.isFilePreview = true;
        // Make array of file extensions
        const extensions = (this.fileExt.split(','))
            .map(function (x) { return x.toLocaleUpperCase().trim(); });

        for (let i = 0; i < files.length; i++) {
            // Get file extension
            const ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
            // Check the extension exists
            if (!this.ImageExtention.includes(ext)) {
                this.isFilePreview = false;
            }
            const exists = extensions.includes(ext);
            if (!exists) {
                this.translate.get('FILEUPLOAD.ERROR.INVALID_FILE', { value: this.maxFiles }).subscribe((res: string) => {
                    this.errors.push(res);
                });
            }
            if (this.errors.length > 0) {
                return;
            }
            // Check file size
            this.isValidFileSize(files[i]);
        }
    }

    private isValidFileSize(file) {
        const fileSizeinMB = file.size / (1024 * 1000);
        const size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
        if (size > this.maxSize) {
            this.translate.get('FILEUPLOAD.ERROR.FILE_SIZE', { value: this.maxSize }).subscribe((res: string) => {
                this.errors.push(res);
            });
        }
    }
}
