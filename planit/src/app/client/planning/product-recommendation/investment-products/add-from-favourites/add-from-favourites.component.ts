import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../../../../shared/animations';
import { PlanningService } from '../../../../service';

@Component({
    selector: 'app-add-from-favourites',
    templateUrl: './add-from-favourites.component.html',
    styleUrls: ['./add-from-favourites.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class AddFromFavouritesComponent implements OnInit {
    public productList;
    public productsSearch;
    public favouritesList;
    public favProduct = {
        favourite: null
    };

    constructor(
        private _location: Location,
        private planningService: PlanningService
    ) { }

    ngOnInit() {
        this.planningService.getFavouriteList().subscribe(response => {
            this.favProduct.favourite = response[0];
            this.favouritesList = response;
        });
    }

    saveData() {
        this.back();
    }

    getProductSearch() {
        this.planningService.getProductSearch(this.productsSearch).subscribe(result => {
            this.productList = result;
        });
    }

    back() {
        this._location.back();
    }

}
