import { AppState, getDocumentPayloads } from '../../../shared/app.reducer';
import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-document-tile',
    templateUrl: './document-tile.component.html',
    styleUrls: ['./document-tile.component.css']
})
export class DocumentTileComponent implements OnInit {
    @Input() public clientId;
    public documents: any;

    constructor(
        private store: Store<AppState>
    ) {
    }

    ngOnInit() {
        this.store
            .select(getDocumentPayloads)
            .subscribe(data => (this.documents = data));
    }

}
