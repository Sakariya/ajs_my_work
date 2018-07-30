import { SetAdvisorCollaboration } from '../../../shared/app.actions';
import { AdvisorService } from '../../service/advisor.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as $ from 'jquery';
import {
    AppState,
    getIsAdvisorCollaborationPayload,
    getAdvisorCollaborationPayload
} from '../../../shared/app.reducer';

@Component({
    selector: 'app-collaboration-center-tile',
    templateUrl: './collaboration-center-tile.component.html',
    styleUrls: ['./collaboration-center-tile.component.css']
})
export class CollaborationCenterTileComponent implements OnInit {

    @ViewChild('pending') public pending: NgbTooltip;
    @ViewChild('inconsistent') public inconsistent: NgbTooltip;
    public familyId = 'FAMILYID';
    public collaboration: any;
    public filterOptions = [
        { id: 1, item: 'MOSTRECENT', name: 'Most recent' },
        { id: 2, item: 'INCONSISTENT', name: 'Inconsistent Results' },
        { id: 3, item: 'PENDING', name: 'Pending' },
    ];
    public selectedFilter = this.filterOptions[0];
    public selectedFilterOption = 'All';
    public pageSize = 10;
    public pageNum = 2;
    public page = 1;

    constructor(
        private store: Store<AppState>,
        private advisorService: AdvisorService
    ) { }

    ngOnInit() {
        this.store
            .select(getIsAdvisorCollaborationPayload)
            .subscribe((loaded: boolean) => {
                if (!loaded) {
                    this.getAdvisorCollaboration(true);
                } else {
                    this.store
                        .select(getAdvisorCollaborationPayload)
                        .subscribe(response => {
                            this.collaboration = response;
                        });
                }
            });
    }

    private getAdvisorCollaboration(isSave: boolean) {
        this.advisorService.getAdvisorCollaboration(
            this.familyId,
            'DOC',
            this.selectedFilter.item,
            this.pageSize,
            this.pageNum
        ).subscribe(response => {
            this.collaboration = response;
            if (isSave) {
                this.store.dispatch(new SetAdvisorCollaboration(response));
            }
        });
    }

    public getFilterCollaboration(event) {
        this.selectedFilter = event;
        if (event.item === 'MOSTRECENT') {
            this.selectedFilterOption = 'All';
        } else if (event.item === 'INCONSISTENT') {
            this.selectedFilterOption = 'INVITED';
        } else if (event.item === 'PENDING') {
            this.selectedFilterOption = 'INPROGRESS';
        }
        this.getAdvisorCollaboration(false);
    }

    public getPageFilterCollaboration(event) {
        this.pageNum = event.currentPage;
        this.getAdvisorCollaboration(false);
    }

    public changeCollaborationAction(index: number) {
        if ($('#dropdownCollaborationAction' + index).is(':visible')) {
            $('.dropdown-collaboration-action').hide();
        } else {
            $('.dropdown-collaboration-action').hide();
            $('#dropdownCollaborationAction' + index).toggle();
        }
    }


}
