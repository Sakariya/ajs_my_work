import { Component, OnInit, ViewChild } from '@angular/core';
import { getIsAdvisorDocument, AppState, getAdvisorDocument } from '../../../shared/app.reducer';
import { Store } from '@ngrx/store';
import { AdvisorService } from '../../service/advisor.service';
import { SetAdvisorDocument } from '../../../shared/app.actions';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-documents-center-tile',
    templateUrl: './documents-center-tile.component.html',
    styleUrls: ['./documents-center-tile.component.css']
})
export class DocumentsCenterTileComponent implements OnInit {

    @ViewChild('review') public review: NgbTooltip;
    @ViewChild('inprogress') public inprogress: NgbTooltip;
    itemList;
    documentList;
    defaultSelected;
    pageSize = 10;
    pageNum = 2;
    TotalClients;

    constructor(private store: Store<AppState>,
        private advisorService: AdvisorService
    ) {
        this.itemList = [
            { id: 'MOSTRECENT', name: 'Most recent' },
            { id: 'IN_PROGRESS', name: 'In Progress' },
            { id: 'REVIEW', name: 'Under Review' },
            { id: 'COMPLETE', name: 'Completed' },
            { id: 'PENDING', name: 'Pending' },
            { id: 'VIEWED', name: 'Viewed' },
        ];
        this.defaultSelected = { id: 'MOSTRECENT', name: 'Most recent' };
    }

    ngOnInit() {
        this.store
            .select(getIsAdvisorDocument)
            .subscribe(loaded => {
                if (!loaded) {

                    this.getAdvisorDocuments(this.pageSize, this.pageNum);
                } else {
                    if (this.defaultSelected.id === 'MOSTRECENT') {
                        this.store
                            .select(getAdvisorDocument)
                            .subscribe(data => {
                                this.documentList = data;
                                this.TotalClients = data.totalRecords;
                            });
                    }
                }
            });
    }

    getAdvisorDocuments(pageSize, pageNum) {
        this.advisorService.getAdvisorDocument(this.defaultSelected.id, pageSize, pageNum).subscribe(result => {
            if (result) {
                this.documentList = result;
                this.TotalClients = result.totalRecords;
                // TODO  remove hard code client name
                this.documentList.results.forEach(function (value) {
                    value.Clientname = value.name;
                });
                if (this.defaultSelected.id === 'MOSTRECENT') {
                    this.store.dispatch(new SetAdvisorDocument(this.documentList));
                }
            }
        });
    }

    getFilterDocument(event) {

        this.defaultSelected.id = event.id;
        this.getAdvisorDocuments(this.pageSize, this.pageNum);
    }

    getPageFilterClient(event) {
        this.getAdvisorDocuments(this.pageSize, event.currentPage);
    }
}
