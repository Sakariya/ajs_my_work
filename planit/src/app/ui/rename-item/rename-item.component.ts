import Swal from 'sweetalert2';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PlanningService, DocumentService } from '../../client/service';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { slideInOutAnimation } from '../../shared/animations/slide-in-out.animation';

@Component({
    selector: 'app-rename-item',
    templateUrl: './rename-item.component.html',
    styleUrls: ['./rename-item.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})
export class RenameItemComponent implements OnInit {
    public clientId;
    public params;
    public itemId;
    public docTypeId;
    public item: any = {
        oldName: null,
        newName: null
    };
    public type;

    constructor(
        private _location: Location,
        private route: ActivatedRoute,
        private planningservice: PlanningService,
        private documentService: DocumentService,

    ) {
        this.route.parent.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
        this.route.params.subscribe(params => {
            if (params.hasOwnProperty('portfolioId')) {
                this.itemId = params['portfolioId'];
                this.type = 'portfolio';
            } else {
                this.route.parent.params.subscribe(subparams => {
                    if (subparams.hasOwnProperty('portfolioId')) {
                        this.itemId = subparams['portfolioId'];
                        this.type = 'portfolio';
                    } else {
                        this.itemId = params['docId'];
                        this.docTypeId = params['docTypeId'];
                        this.type = 'document';
                    }
                });
            }
        });
    }

    ngOnInit() {
        if (this.type === 'portfolio') {
            this.planningservice.getListOfPortfolios(this.clientId).subscribe(results => {
                this.item.oldName = results['portfolios'][results['portfolios'].findIndex(p => p.id === this.itemId)]['description'];
            });
        }
    }

    renameItem() {
        let renameDetails = {};
        if (this.type === 'portfolio') {
            renameDetails = {
                'description': this.item.newName
            };
            this.planningservice.updatePortfolioByID(this.clientId, this.itemId, renameDetails).subscribe(response => {
                Swal('Updated!', 'Portfolio has been renamed successfully.', 'success');
                this.back();
            },
                (errorResponse) => {
                    Swal('Oops...', errorResponse.error.errorMessage, 'error');
                });
        }
        // else {
        //     renameDetails = {
        //         'documentName': this.item.newName
        //     };
        //     this.documentService.renameClientDocument(this.itemId, renameDetails).subscribe(response => {
        //         console.log(response);
        //         Swal('Updated!', 'Documeny has been renamed successfully.', 'success');
        //     },
        //         (errorResponse) => {
        //             Swal('Oops...', errorResponse.error.errorMessage, 'error');
        //         });
        // }
    }
    back() {
        this._location.back();
    }

}
