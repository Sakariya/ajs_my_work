import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { PlanningService } from '../../../service';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-portfolio-header',
    templateUrl: './portfolio-header.component.html',
    styleUrls: ['./portfolio-header.component.css']
})
export class PortfolioHeaderComponent implements OnInit {
    @Output() public switchPortfolio = new EventEmitter();
    @Input() public clientId;
    @Input() public portfolioId;
    @Input() public isEditableRoute;
    @Input() currentPage;
    public portfolioData;
    public portfolioName: string;

    constructor(
        private planningService: PlanningService,
        private _location: Location
    ) { }

    ngOnInit() {
        this.planningService.getListOfPortfolios(this.clientId).subscribe(results => {
            this.portfolioData = results['portfolios'];
            this.portfolioName = this.portfolioData[this.portfolioData.findIndex(p => p.id === this.portfolioId)]['description'];
        });
    }

    changePortfolio(portfolioId) {
        this.portfolioId = portfolioId;
        this.portfolioName = this.portfolioData[this.portfolioData.findIndex(p => p.id === portfolioId)]['description'];
        this.switchPortfolio.emit(portfolioId);
    }

    deletePortfolio() {
        Swal({
            title: 'Are you sure want to delete this portfolio?',
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
