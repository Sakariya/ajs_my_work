import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-professional-judgement',
    templateUrl: './professional-judgement.component.html',
    styleUrls: ['./professional-judgement.component.css']
})
export class ProfessionalJudgementComponent implements OnInit {
    @Input() public clientId;
    @Input() public portfolioId;
    @Input() public isEditableRoute;

    constructor() { }

    ngOnInit() {
    }

}
