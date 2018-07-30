import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../../shared/animations';
import { SetClientDocumentCentre } from '../../../shared/app.actions';
import { DocumentService } from '../../service/document.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import {
    AppState,
    getIsClientDocumentCentrePayload,
    getClientDocumentCentrePayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-rename-document',
    templateUrl: './rename-document.component.html',
    styleUrls: ['./rename-document.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})

export class RenameDocumentComponent implements OnInit {

    public document: any;
    public doc = { 'new_document': '' };
    clientId;
    documentList;
    docId;
    docTypeId;
    docTypeIndex;
    docIndex;

    constructor(
        private route: ActivatedRoute,
        private _location: Location,
        private documentService: DocumentService,
        private store: Store<AppState>
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.docId = this.route.snapshot.params['docId'];
        this.docTypeId = this.route.snapshot.params['docTypeId'];
    }

    ngOnInit() {
        this.store
            .select(getIsClientDocumentCentrePayload)
            .subscribe(loaded => {
                if (!loaded) {
                    this.getClientDocuments();
                } else {
                    this.store
                        .select(getClientDocumentCentrePayload)
                        .subscribe(data => {
                            this.documentList = data;
                            this.getCurrentDocDetail(this.documentList);
                        });
                }
            });
    }

    private getClientDocuments() {
        this.documentService.
            getClientDocumentWithType(this.clientId).
            subscribe(result => {
                this.documentList = this.documentService.fetchDocumentList(result[0], result[1]);
                this.store.dispatch(new SetClientDocumentCentre(this.documentList));
                this.getCurrentDocDetail(this.documentList);
            });
    }

    getCurrentDocDetail(data) {
        this.docTypeIndex = data.findIndex(docType => docType.documentId === this.docTypeId);
        this.docIndex = data[this.docTypeIndex]['documents'].findIndex(doc => doc.id === this.docId);
        this.document = data[this.docTypeIndex]['documents'][this.docIndex];
    }

    back() {
        this._location.back();
    }

    renameDocument() {
        this.documentService.
            renameClientDocument(this.docId, this.doc.new_document).
            subscribe(response => {
                this.documentList[this.docTypeIndex]['documents'][this.docIndex]['name'] = response['name'];
                this.back();
            },
            (errorResponse) => {
                Swal('Oops...', errorResponse.error.errorMessage, 'error');
            });
    }

}
