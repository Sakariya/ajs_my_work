import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-portfolio-suitability',
    templateUrl: './portfolio-suitability.component.html',
    styleUrls: ['./portfolio-suitability.component.css']
})
export class PortfolioSuitabilityComponent implements OnInit {
    @Input() public clientId;
    @Input() public portfolioId;
    @Input() public isEditableRoute;
    @Output() public suitabilityScoreChanged = new EventEmitter();
    public sliderValue = [
        {
            name: 'All income',
            colour: '#D8F4FA',
            percent: 23
        },
        {
            name: 'Income',
            colour: '#95E3F3',
            percent: 10
        },
        {
            name: 'Income and growth',
            colour: '#35CFEB',
            percent: 10
        },
        {
            name: 'Balanced',
            colour: '#00ACD3',
            percent: 20
        },
        {
            name: 'Growth and Income',
            colour: '#008AAB',
            percent: 10
        },
        {
            name: 'Growth',
            colour: '#005C73',
            percent: 7
        },
        {
            name: 'All Equity',
            colour: '#003642',
            percent: 20
        }
    ];
    public fromPoint = 54;
    public ngcontent = '_ngcontent-c14';
    public judgementMatrix = 50;
    public changedFromPoint = 54;

    constructor() { }

    ngOnInit() {
        this.suitabilityScoreChanged.emit(this.fromPoint);
    }

    fromPointChange(event) {
        this.changedFromPoint = event.from;
        this.suitabilityScoreChanged.emit(event.from);
    }

}
