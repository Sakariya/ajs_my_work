import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-custom-slider',
    templateUrl: './custom-slider.component.html',
    styleUrls: ['./custom-slider.component.css']
})
export class CustomSliderComponent implements OnInit {
    @Input() public fromPoint;
    @Input() public ngcontent;
    @Input() public sliderValue;
    @Input() public judgementMatrix;
    @Input() public isEditableRoute;
    @Output() public fromPointChange = new EventEmitter();

    constructor() { }

    ngOnInit() {
        setTimeout(() => {
            this.changeSliderCSS();
        }, 300);
    }

    changeSliderCSS() {
        $('.irs:first').find('.irs').find('.irs-line').remove();
        let addDynamicBlock = '<div ' + this.ngcontent + ' class="slider-main">';
        this.sliderValue.forEach(val => {
            addDynamicBlock = addDynamicBlock + '<div ' + this.ngcontent + ' style="width: ' + val.percent + '%;background: ' + val.colour + ';"></div>';
        });
        addDynamicBlock = addDynamicBlock + '</div>';
        $('.irs:first').find('.irs').prepend(addDynamicBlock);
        $('.irs-slider').empty().prepend(this.fromPoint.toString());
    }

    myOnChange(event) {
        $('.irs-slider').empty().prepend(event.from);
        this.fromPointChange.emit(event);
    }
}
