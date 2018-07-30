import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { PlanningService } from '../../../service';
import { riskScoreBadge } from '../../../client-models';

@Component({
    selector: 'app-objectives',
    templateUrl: './objectives.component.html',
    styleUrls: ['../../../profile/risk-tolerance-kyc/risk-tolerance-kyc.component.css', './objectives.component.css']
})
export class ObjectivesComponent implements OnInit {

    public clientId;
    public portfolioId;
    allowEdit = false;
    expandToggled = false;
    expandAll = false;
    timeHorizon;
    chekmarkDisable = false;
    check = false;
    portfoliosAll = [];
    portfolioData = [];
    defaultport = [];
    defaultName;
    portfolioDetails;
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private portfolioService: PlanningService
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.portfolioId = params['portfolioId'];
            this.timeHorizon = [
                { 'id': 1, 'name': '7 to 9 years' },
                { 'id': 2, 'name': '7 to 9 years' },
                { 'id': 3, 'name': '7 to 9 years' }
            ];
            this.portfolioService.getListOfPortfolios(this.clientId).subscribe(data => {
                if (data.hasOwnProperty('portfolios')) {
                    this.portfoliosAll.push(data['portfolios']);
                    if (this.portfoliosAll[0]) {
                        this.portfoliosAll[0].forEach(element => {
                            this.defaultport.push({
                                'id': element.id, 'description': element.description,
                                'defaultPortfolio': element.defaultPortfolio
                            });
                        });
                    }
                    this.portfolioData = this.portfoliosAll[0].filter(result => result.id === this.portfolioId);
                    this.defaultName = this.defaultport.filter(action => action.defaultPortfolio === true)[0];
                }
            });
            this.portfolioService.getPortfoliosDetails(this.clientId, this.portfolioId).subscribe(result => {
                this.portfolioDetails = result[0];
            });
        });
    }

    toggleEdit() {
        this.allowEdit = !this.allowEdit;
        if (this.check === true) {
            this.check = false;
        }
    }

    toggleExpand() {
        this.expandToggled = true;
        this.expandAll = !this.expandAll;
    }

    checkMark() {
        this.check = !this.check;
    }
    getRiskBadge(score) {
        return riskScoreBadge(score);
    }
    portfolioSwitch(portfolioId) {
        this.router.navigate(['/client/' + this.clientId + '/planning/portfolios/' + portfolioId + '/objectives']);
    }
}
