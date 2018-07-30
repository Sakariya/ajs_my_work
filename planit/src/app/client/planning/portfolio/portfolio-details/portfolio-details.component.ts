import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanningService } from '../../../service/planning.service';
import { ClientProfileService } from '../../../service/profile.service';
import { AppState, getFamilyMemberPayload } from '../../../../shared/app.reducer';

@Component({
    selector: 'app-portfolio-details',
    templateUrl: './portfolio-details.component.html',
    styleUrls: ['./portfolio-details.component.css']
})

export class PortfolioDetailsComponent implements OnInit {

    public clientId;
    public portfolioId;
    public familyMembers;
    public isEditableRoute;
    public currentCashPercent;
    public allocationResponse;
    public portfolioDetailResponse;
    public timeHorizons = [
        {
            id: '1',
            description: '2 to 5 years'
        },
        {
            id: '2',
            description: '5 to 7 years'
        },
        {
            id: '3',
            description: '7 to 9 years'
        },
        {
            id: '4',
            description: '9 to 11 years'
        }
    ];
    public selectedTimeHorizon = this.timeHorizons[2];

    public portfolioDetail = {
        documentation: null,
        timeHorizon: this.selectedTimeHorizon,
        suitabilityScore: null,
        decisionMaker: null
    };

    constructor(
        private router: Router,
        private _location: Location,
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private planningService: PlanningService,
        private profileService: ClientProfileService
    ) {
        this.isEditableRoute = this.router.url.includes('/details/edit') ? true : false;
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.portfolioId = this.route.snapshot.params['portfolioId'];
        this.getAllocationChartDetails(this.portfolioId);

        this.store
            .select(getFamilyMemberPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    this.familyMembers = data;
                    this.getPortfolioById(this.portfolioId);
                } else {
                    this.profileService.getFamilyMembers(this.clientId).subscribe(result => {
                    });
                }
            });
    }

    ngOnInit() {
    }

    switchPortfolio(portfolioId) {
        this.portfolioId = portfolioId;
        this.getAllocationChartDetails(portfolioId);
        this.getPortfolioById(portfolioId);
        if (this.isEditableRoute) {
            this.router.navigate(['/client', this.clientId, 'planning', 'portfolios', portfolioId, 'details', 'edit']);
        } else {
            this.router.navigate(['/client', this.clientId, 'planning', 'portfolios', portfolioId, 'details']);
        }
    }

    getAllocationChartDetails(portfolioId) {
        this.planningService.getAllocationDetails(this.clientId, portfolioId).subscribe(response => {
            this.allocationResponse = response;
            this.getCashPercent(response);
        });
    }

    getCashPercent(allocation) {
        const cashIndex = allocation.allocations.findIndex(a => a.id === 'ASSCAT1');
        this.currentCashPercent = allocation.allocations[cashIndex].standardDeviation;
    }

    getPortfolioById(portfolioId) {
        if (this.familyMembers) {
            this.planningService.getPortfolioById(this.clientId, portfolioId).subscribe(response => {
                response.ownership.forEach((ownership, key) => {
                    const splitData = ownership.person.split('/');
                    const familyIndex = this.familyMembers['idMapping'][splitData[splitData.length - 1]];
                    response.ownership[key]['investor'] = this.familyMembers['familyMembers'][familyIndex];
                });
                this.portfolioDetailResponse = response;
            });
        }
    }

    changeTimeHorizon(event) {
        this.portfolioDetail.timeHorizon = event;
    }

    changeSuitabilityScore(event) {
        this.portfolioDetail.suitabilityScore = event;
    }

    ChangeDecisionMaker(event) {
        this.portfolioDetail.decisionMaker = event;
    }

    updatePortfolioDetail(isValid) {
        if (isValid) {
            const portfolioDetail = {
                ownership: [
                    {
                        isDescisionMaker: (this.portfolioDetail.decisionMaker === 'CLIENT') ? true : false
                    }
                ],
                portfolioRiskLevel: {
                    riskScore: this.portfolioDetail.suitabilityScore
                },
                constraints: this.portfolioDetail.documentation,
                timeHorizon: this.portfolioDetail.timeHorizon.description
            };
            this.planningService.updatePortfolioByID(this.clientId, this.portfolioId, portfolioDetail).subscribe(
                (response) => {
                    Swal('Updated', 'Portfolio detail updated!', 'success');
                    this.router.navigate(['/client', this.clientId, 'planning', 'portfolios']);
                },
                (errorResponse) => {
                    Swal('Oops...', errorResponse.error.errorMessage, 'error');
                });
        } else {
            Swal('Oops...', 'Please fill all required field', 'error');
        }
    }

    cancelChanges() {
        Swal({
            title: 'Are you sure want to cancel your changes?',
            text: 'You won\'t be able to revert this!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then(result => {
            if (result.value) {
                this._location.back();
            }
        });
    }
}
