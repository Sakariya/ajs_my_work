import { Component, OnInit } from '@angular/core';
import { AdvisorService } from '../../service/advisor.service';
import { Store } from '@ngrx/store';
import { AppState, getAdvisorClientPayLoad, getIsAdvisorClientLoaded } from '../../../shared/app.reducer';
import { ClientProfileService } from '../../../client/service';
import { SetAdvisorClient } from '../../../shared/app.actions';

@Component({
    selector: 'app-clients-tile',
    templateUrl: './clients-tile.component.html',
    styleUrls: ['./clients-tile.component.css']
})
export class ClientsTileComponent implements OnInit {
    selectedFilter;
    defaultSelected;
    itemList;
    clientList: any[];
    searchString = '';
    pageSize = 10;
    pageNum = 2;
    searchText;
    TotalClients;
    page = 1;
    constructor(private advisorService: AdvisorService,
        private store: Store<AppState>,
        private clientProfileService: ClientProfileService
    ) {
        this.pageSize = 10;
        this.pageNum = 2;
        this.itemList = [
            { id: 0, name: 'Most recent' },
            { id: 1, name: 'Family Name' },
        ];
        this.defaultSelected = { id: 0, name: 'Most recent' };
    }

    ngOnInit() {
        this.store
            .select(getIsAdvisorClientLoaded)
            .subscribe(loaded => {
                if (!loaded) {
                    this.getAdvisorClient(this.searchString, this.defaultSelected.id, this.pageSize, this.pageNum);
                } else {
                    if (this.defaultSelected.id === 0) {
                        this.store
                            .select(getAdvisorClientPayLoad)
                            .subscribe(data => {
                                this.clientList = data.results;
                                this.TotalClients = data.totalRecords;
                            });
                    } else {
                        this.getAdvisorClient(this.searchString, this.defaultSelected.id, this.pageSize, this.pageNum);
                    }
                }
            });
    }
    getAdvisorClient(searchString, viewBy, pageSize, pageNum) {
        this.advisorService.getClientList(searchString, viewBy, pageSize, pageNum).subscribe(result => {
            this.TotalClients = result.totalRecords;
            // TODO need remove when api change done
            result.results.forEach(function (value) {
                value.displayName = 'Client1 & Client2';
            });
            this.clientList = result.results;
            if (this.defaultSelected.id === 0) {
                this.store.dispatch(new SetAdvisorClient(result));
            }
        });
    }
    getFilterClient(item) {
        this.defaultSelected = item;
        this.getAdvisorClient(this.searchString, this.defaultSelected.id, this.pageSize, this.pageNum);
    }
    getPageFilterClient(event) {
        this.pageNum = event.currentPage;
        this.getAdvisorClient(this.searchString, this.defaultSelected.id, this.pageSize, event.currentPage);

    }
}
