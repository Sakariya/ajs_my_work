import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../../shared/animations';
import { Location } from '@angular/common';
import { DocumentService } from '../../service';
import Swal from 'sweetalert2';
import { AppState, getClientDocumentCentrePayload, getIsClientDocumentCentrePayload } from '../../../shared/app.reducer';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { SetClientDocumentCentre } from '../../../shared/app.actions';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
@Component({
    selector: 'app-upload-document',
    templateUrl: './upload-document.component.html',
    styleUrls: ['./upload-document.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class UploadDocumentComponent implements OnInit {
    loading = false;
    model: any = {};
    fileUnderList;
    uploadedImage;
    isDocumentUploaded = false;
    imageUrl = './assets/images/loader.gif';
    clientId;
    constructor(private _location: Location,
        private documentService: DocumentService,
        private store: Store<AppState>,
        public translate: TranslateService,
        private route: ActivatedRoute
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {

        this.store
            .select(getIsClientDocumentCentrePayload)
            .subscribe(loaded => {
                if (!loaded) {
                    this.documentService.
                        getClientDocumentWithType(this.clientId).
                        subscribe(result => {
                            const data = this.documentService.fetchDocumentList(result[0], result[1]);
                            this.store.dispatch(new SetClientDocumentCentre(data));
                            this.fileUnderList = data;
                        });
                } else {
                    this.store
                        .select(getClientDocumentCentrePayload)
                        .subscribe(data => {
                            this.fileUnderList = data;
                        });
                }
            });
    }
    uploadeImage(event) {
        this.uploadedImage = event;
    }
    uploadDocument() {
        if (!this.uploadedImage) {
            this.translate.get(['ALERT_MESSAGE.ERROR_TITLE', 'DOCUMENT.DOCUMENT_UPLOAD.ERROR_FILE_NOT_SELECT']).subscribe((res: string) => {
                Swal(res['ALERT_MESSAGE.ERROR_TITLE'], res['DOCUMENT.DOCUMENT_UPLOAD.ERROR_FILE_NOT_SELECT'], 'error');
            });
            return;
        }
        const category = this.fileUnderList.filter(x => x.categoryId === this.model.fileUnderType.categoryId);
        if (category) {
            const existeDocument = category[0].documents.filter(x => x.name.toLowerCase() === this.model.documentName.toLowerCase());
            if (existeDocument.length > 0) {
                this.translate.get(['ALERT_MESSAGE.ERROR_TITLE', 'DOCUMENT.DOCUMENT_UPLOAD.ERROR_FILE_EXIST']).subscribe((res: string) => {
                    Swal(res['ALERT_MESSAGE.ERROR_TITLE'], res['DOCUMENT.DOCUMENT_UPLOAD.ERROR_FILE_EXIST'], 'error');
                });
                return;
            }
        }
        const formData = new FormData();
        formData.append('file', this.uploadedImage);
        formData.append('family', 'CLIENT');
        // TODO need to remove on api done
        formData.append('documentType', this.model.fileUnderType.documentId);
        if (this.model.fileUnderType.documentId === 'DOCTYPE1') {
            formData.append('documentName', 'My document');
        } else if (this.model.fileUnderType.documentId === 'DOCTYPE2') {
            formData.append('documentName', 'second document');
        } else if (this.model.fileUnderType.documentId === 'DOCTYPE3') {
            formData.append('documentName', 'Investment Plan');
        } else {
            formData.append('documentType', 'DOCTYPE2');
            formData.append('documentName', 'second document');
        }
        this.loading = true;
        this.documentService.uploadDocument(formData).subscribe(result => {
            //  Swal('Success', 'Document uploaded successful.', 'success');
            // this.model = {};
            category[0].documents.push(
                {
                    addedDate: new Date(),
                    color: 'violet',
                    docStatus: 'In Progress',
                    downloadLink: '/rest/v30/document/DOC2/download',
                    family: '/rest/v30/client/CLIENT',
                    id: 'DOC' + category[0].documents.length + 1,
                    name: this.model.documentName,
                    newDocument: true,
                    sharedDate: new Date(),
                    status: 'IN_PROGRESS',
                    type: 'DOCTYPE2',
                    viewedBy: '/rest/v30/client/CLIENT/familymember/CLIENT'
                }
            );
            this.store.dispatch(new SetClientDocumentCentre(this.fileUnderList));
            this.isDocumentUploaded = true;
            this.uploadedImage = null;
            this.loading = false;
            this.model = {};
        });
    }
    back() {
        this._location.back();
    }
    uploadNew() {
        this.isDocumentUploaded = false;
    }
    cancel() {
        this.isDocumentUploaded = false;
        this.loading = false;
    }
}
