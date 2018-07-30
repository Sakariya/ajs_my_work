import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-detailed-recommendation',
    templateUrl: './detailed-recommendation.component.html',
    styleUrls: ['./detailed-recommendation.component.css']
})
export class DetailedRecommendationComponent implements OnInit {
    value = 5000;
    constructor() { }

    ngOnInit() {
    }

    currencyValue(val) {
        console.log('val ---->>>> ', val);
    }

}
