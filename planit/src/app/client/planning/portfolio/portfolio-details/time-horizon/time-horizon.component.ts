import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-time-horizon',
    templateUrl: './time-horizon.component.html',
    styleUrls: ['./time-horizon.component.css']
})
export class TimeHorizonComponent implements OnInit {
    @Input() public clientId;
    @Input() public portfolioId;
    @Input() public isEditableRoute;
    @Input() public timeHorizons;
    @Input() public selectedTimeHorizon;
    @Output() public timeHorizonChanged = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    changeTimeHorizon(timeHorizon) {
        this.timeHorizonChanged.emit(timeHorizon);

    }
}
