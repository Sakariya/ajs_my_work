import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../../../shared/animations';
@Component({
    selector: 'app-add-portfolio',
    templateUrl: './add-portfolio.component.html',
    styleUrls: ['./add-portfolio.component.css'],
    animations: [slideInOutAnimation],
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class AddPortfolioComponent implements OnInit {

    public clientId;
    public portfolio: any = {};

    constructor(
        private _location: Location,
        private route: ActivatedRoute
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {
    }

    addPortfolio() {
        console.log(this.portfolio);
    }

    back() {
        this._location.back();
    }

}
