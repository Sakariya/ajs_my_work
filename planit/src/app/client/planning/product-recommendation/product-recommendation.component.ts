import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-product-recommendation',
    templateUrl: './product-recommendation.component.html',
    styleUrls: ['./product-recommendation.component.css']
})
export class ProductRecommendationComponent implements OnInit {
    clientId;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {
    }

}
