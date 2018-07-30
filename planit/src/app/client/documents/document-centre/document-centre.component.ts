import { SetClientDocumentCentre } from '../../../shared/app.actions';
import { DocumentService } from '../../service';
import { fadeInAnimation } from '../../../shared/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    AppState,
    getIsClientDocumentCentrePayload,
    getClientDocumentCentrePayload
} from '../../../shared/app.reducer';
import * as $ from 'jquery';
import Swal from 'sweetalert2';
import { TokenStorage } from '../../../shared/token.storage';

@Component({
    selector: 'app-document-centre',
    templateUrl: './document-centre.component.html',
    styleUrls: ['./document-centre.component.css'],
    animations: [fadeInAnimation],
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@fadeInAnimation]': '' }
})
export class DocumentCentreComponent implements OnInit {
    public searchString = null;
    public documentList;
    public clientId;

    public filterBy = [
        { id: 'ALL', name: 'All' },
        { id: 'IN_PROGRESS', name: 'In Progress' },
        { id: 'REVIEW', name: 'Under Review' },
        { id: 'COMPLETE', name: 'Completed' },
        { id: 'PENDING', name: 'Shared - Pending' },
        { id: 'VIEWED', name: 'Shared - Viewed' },
    ];
    public selectedFilter = this.filterBy[0];

    public sortBy = [
        { id: 'MOSTRECENT', name: 'Most recent' },
        { id: 'TYPE', name: 'Type' }
    ];
    public selectedSort = this.sortBy[0];

    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private documentService: DocumentService
    ) {
        this.route.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
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
            });
    }

    private getDocumentListWithFilterOption() {
        const searchDoc = (this.searchString && this.searchString.length) > 3 ? this.searchString : '';
        this.documentService.
            getClientDocumentLists(searchDoc, this.selectedFilter.id, this.selectedSort.id, this.clientId).
            subscribe(result => {
                this.documentList = this.documentService.fetchDocumentList(this.documentList, result);
            });
    }

    public getFilterDocument(event) {
        this.selectedFilter = event;
        this.getDocumentListWithFilterOption();
    }

    public getSortDocument(event) {
        this.selectedSort = event;
        this.getDocumentListWithFilterOption();
    }

    serachDocument() {
        this.getDocumentListWithFilterOption();
    }

    public changeDocumentAction(index: number, jIndex: number) {
        if ($('#dropdownUpdateStatus_' + index + '_' + jIndex).is(':visible')) {
            $('.dropdown-status-action').hide();
            $('#dropdownDocumentAction_' + index + '_' + jIndex).hide();
        } else {
            if ($('#dropdownDocumentAction_' + index + '_' + jIndex).is(':visible')) {
                $('.dropdown-document-action').hide();
            } else {
                $('.dropdown-document-action').hide();
                $('#dropdownDocumentAction_' + index + '_' + jIndex).toggle();
            }
        }
    }

    public changeUpdateStatus(index: number, jIndex: number) {
        $('.dropdown-document-action').hide();
        $('#dropdownUpdateStatus_' + index + '_' + jIndex).toggle();
    }

    public downloadClientDocument(docId, docName) {
        this.documentService.
            downloadClientDocument(docId).
            subscribe(result => {
                this.documentService.downloadFile(result, docName);
            },
                (errorResponse) => {
                    Swal('Oops...', errorResponse.error.errorMessage, 'error');
                }
            );
    }

    shareClientDocument(docTypeId, docId) {
        this.documentService.
            shareClientDocument(docId).
            subscribe(result => {
                const docTypeIndex = this.documentList.findIndex(docType => docType.documentId === docTypeId);
                const docIndex = this.documentList[docTypeIndex]['documents'].findIndex(doc => doc.id === docId);
                this.documentList[docTypeIndex]['documents'][docIndex]['sharedDate'] = result ? result.sharedDate : new Date();
                Swal('Shared!', 'Document shared successfully.', 'success');
            },
                (errorResponse) => {
                    Swal('Oops...', errorResponse.error.errorMessage, 'error');
                }
            );
    }

    unshareClientDocument(docTypeId, docId) {
        this.documentService.
            unshareClientDocument(docId).
            subscribe(result => {
                const docTypeIndex = this.documentList.findIndex(docType => docType.documentId === docTypeId);
                const docIndex = this.documentList[docTypeIndex]['documents'].findIndex(doc => doc.id === docId);
                this.documentList[docTypeIndex]['documents'][docIndex]['sharedDate'] = null;
                Swal('Unshared!', 'Document unshared successfully.', 'success');
            },
                (errorResponse) => {
                    Swal('Oops...', errorResponse.error.errorMessage, 'error');
                }
            );
    }

    updateDocumentStatus(docTypeId, docId, status) {
        this.documentService.
            updateClientDocumentStatus(docId, status).
            subscribe(result => {
                const docTypeIndex = this.documentList.findIndex(docType => docType.documentId === docTypeId);
                const docIndex = this.documentList[docTypeIndex]['documents'].findIndex(doc => doc.id === docId);
                const rStatus = result ? result.status : status;
                this.documentList[docTypeIndex]['documents'][docIndex]['status'] = rStatus;
                this.documentList[docTypeIndex]['documents'][docIndex]['color'] = this.documentService.getColorByColumnKey(rStatus);
                this.documentList[docTypeIndex]['documents'][docIndex]['docStatus'] = this.documentService.getStatusByColumnKey(rStatus);
                Swal('Updated!', 'Document status updated successfully.', 'success');
            },
                (errorResponse) => {
                    Swal('Oops...', errorResponse.error.errorMessage, 'error');
                }
            );
    }

    deleteDocument(docTypeId, docId) {
        Swal({
            title: 'Are you sure want to delete the document?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                this.documentService.
                    deleteClientDocument(docId).
                    subscribe(response => {
                        const docTypeIndex = this.documentList.findIndex(docType => docType.documentId === docTypeId);
                        const docIndex = this.documentList[docTypeIndex]['documents'].findIndex(doc => doc.id === docId);
                        this.documentList[docTypeIndex]['documents'].splice(docIndex, 1);
                        Swal(
                            'Deleted!',
                            'Your document has been deleted.',
                            'success'
                        );
                    },
                        (errorResponse) => {
                            Swal('Oops...', errorResponse.error.errorMessage, 'error');
                        }
                    );
            }
        });
    }
}
