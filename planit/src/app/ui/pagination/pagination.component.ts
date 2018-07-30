import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { PagerService } from '../../shared/pager.service';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {
    @Input() TotalItem: number;
    @Input() PageSize: number;
    @Output() OnPageChange = new EventEmitter();
    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];
    constructor(private pagerService: PagerService) {
        // this.OnPageChange.emit(this.pager);
    }

    ngOnInit() {
        this.setPageInit(1);
    }
    setPageInit(page) {
        this.pager = this.pagerService.getPager(this.TotalItem, page, this.PageSize);
    }
    setPage(page) {
        // get pager object from service
        this.pager = this.pagerService.getPager(this.TotalItem, page, this.PageSize);
        this.OnPageChange.emit(this.pager);
    }
}
