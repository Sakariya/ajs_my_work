import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, getIsAdvisorDemographicLoaded, getAdvisorDemographicPayload } from '../../../shared/app.reducer';
import { AdvisorService } from '../../service/advisor.service';

@Component({
    selector: 'app-demographics-tile',
    templateUrl: './demographics-tile.component.html',
    styleUrls: ['./demographics-tile.component.css']
})
export class DemographicsTileComponent implements OnInit {
    demograpghicsData = [];
    TotalClients = 0;
    math = Math;
    constructor(private store: Store<AppState>,
        private advisorService: AdvisorService
    ) { }
    ngOnInit() {
        this.store
            .select(getIsAdvisorDemographicLoaded)
            .subscribe((loaded: boolean) => {
                if (!loaded) {
                    this.advisorService.getAdvisorDemographics().subscribe(data => {
                        this.setDemographicData(data);
                    });
                } else {
                    this.store
                        .select(getAdvisorDemographicPayload)
                        .subscribe(data => {
                            this.setDemographicData(data);
                        });
                }
            });

    }
    setDemographicData(data) {
        let total = 0;
        this.demograpghicsData = data.ageBands;
        if (data) {
            this.demograpghicsData.forEach(function (value) {
                total = total + value.numberOfClients;
            });
            this.TotalClients = total;
        }
    }
}


