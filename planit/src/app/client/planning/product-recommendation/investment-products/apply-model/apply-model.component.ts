import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../../../../shared/animations';

@Component({
    selector: 'app-apply-model',
    templateUrl: './apply-model.component.html',
    styleUrls: ['./apply-model.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class ApplyModelComponent implements OnInit {

    public numberMask = {
        prefix: '$',
        thousands: ',',
        decimal: '.'
    };

    portfolioModels = [
        { id: 1, description: 'All Income' },
        { id: 2, description: 'Income' },
        { id: 3, description: 'Income and Growth' },
        { id: 4, description: 'Balanced' },
        { id: 5, description: 'Growth and Income' },
        { id: 6, description: 'Growth' },
        { id: 7, description: 'All Equity' },
        { id: 8, description: 'Current' },
        { id: 9, description: 'Custom' }
    ];
    accountModel = {
        amount: '',
        chooseModel: this.portfolioModels[0]
    };

    constructor(
        private _location: Location
    ) { }

    ngOnInit() {
    }

    back() {
        this._location.back();
    }

    applyModel() {
        console.log(' applyModel ---->>> ', this.accountModel);
        this._location.back();
    }
}
