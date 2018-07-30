import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '../../../shared/animations';
import { Location } from '@angular/common';
import { DocumentService } from '../../service';
import { Store } from '@ngrx/store';

import {
    AppState,
    getIsClientDocumentCentrePayload,
    getClientDocumentCentrePayload,
    getIsClientPortfolioListLoaded,
    getClientPortfolioListPayload,
    getIsTemplateListLoaded,
    getTemplateListLoaded
} from '../../../shared/app.reducer';
import { SetClientDocumentCentre, SetClientPortfolioList, SetTemplateList } from '../../../shared/app.actions';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
@Component({
    selector: 'app-generate-document',
    templateUrl: './generate-document.component.html',
    styleUrls: ['./generate-document.component.css'],
    animations: [slideInOutAnimation],
    // attach the slide in/out animation to the host (root) element of this component
    // tslint:disable-next-line:use-host-property-decorator
    host: { '[@slideInOutAnimation]': '' }
})

export class GenerateDocumentComponent implements OnInit {
    loading = false;
    model: any = {};
    documentCategory;
    uploadedImage;
    itemList = [];
    defaultSelected;
    documentList;
    searchString = '';
    clientId;
    selectedDocument;
    hasPortfolio;
    portfolioList;
    templatePagesList;
    templateList;
    isPageSelected = false;
    constructor(private _location: Location,
        private documentService: DocumentService,
        private store: Store<AppState>,
        private route: ActivatedRoute,
        public translate: TranslateService
    ) {
        this.route.parent.parent.params.subscribe(params => {
            this.clientId = params['clientId'];
        });
    }

    ngOnInit() {
        this.getDocumentCategory();
    }
    back() {
        this._location.back();
    }
    getDocumentCategory() {
        this.defaultSelected = { id: 'DEFAULT', name: 'Default' };
        this.store
            .select(getIsClientDocumentCentrePayload)
            .subscribe(loaded => {
                if (!loaded) {
                    this.documentService.
                        getClientDocumentWithType(this.clientId).
                        subscribe(result => {

                            const data = this.documentService.fetchDocumentList(result[0], result[1]);
                            this.store.dispatch(new SetClientDocumentCentre(data));
                            this.documentCategory = data.map(x => Object.assign([], x));
                        });
                } else {
                    this.store
                        .select(getClientDocumentCentrePayload)
                        .subscribe(data => {
                            this.documentCategory = data.map(x => Object.assign([], x));
                        });
                }
            });
    }

    filterDocument() {
        this.selectedDocument = null;
        this.getDocumentCategory();
        this.documentList = this.model.fileUnderType.documents.filter(x => x.newDocument === true);
        this.hasPortfolio = this.model.fileUnderType.hasPortfolio;
        this.templatePagesList = this.model.fileUnderType.documentSections.map(x => Object.assign({}, x));
        this.getTemplateList();
        if (this.model.fileUnderType.hasPortfolio) {
            this.getPortfolio();
        }
    }

    getTemplateList() {
        this.store
            .select(getIsTemplateListLoaded)
            .subscribe(loaded => {
                if (!loaded) {
                    this.getTemplates();
                } else {
                    this.store
                        .select(getTemplateListLoaded)
                        .subscribe(data => {
                            this.templateList = data;
                            this.fillTemplateList();
                        });
                }
            });
    }

    fillTemplateList() {
        this.itemList = [
            { id: 'DEFAULT', name: 'Default' },
            { id: 'NONE', name: 'None' },
        ];
        if (this.templateList) {
            this.templateList.forEach(element => {
                this.itemList.push({ id: element.id, name: element.description });
            });
        }
    }

    getPortfolio() {
        this.store
            .select(getIsClientPortfolioListLoaded)
            .subscribe(loaded => {
                if (!loaded) {
                    this.documentService.getPortfoliosList(this.clientId).subscribe(portfolio => {
                        this.portfolioList = portfolio.portfolios;
                        this.store.dispatch(new SetClientPortfolioList(portfolio));
                    });
                } else {
                    this.store
                        .select(getClientPortfolioListPayload)
                        .subscribe(data => {
                            this.portfolioList = data.portfolios;
                        });
                }
            });
    }

    documentCheck(activeItem) {
        this.selectedDocument = activeItem;
    }

    pageSelect(templeteId) {
        this.model.templateName = '';
        let tempTemplatePagesList = this.templatePagesList.map(x => Object.assign([], x));
        if (templeteId.id === 'DEFAULT') {
            tempTemplatePagesList = [];
            if (this.model.fileUnderType) {
                const pageData = this.documentCategory.filter(x => x.categoryId === this.model.fileUnderType['categoryId']);
                tempTemplatePagesList = pageData[0].documentSections;
            }
        } else {
            const template = this.templateList.filter(x => x.id === templeteId.id);
            if (template.length > 0 && template[0].hasOwnProperty('selectedSection')) {
                tempTemplatePagesList.forEach(element => {
                    if (template[0]['selectedSection'].hasOwnProperty(element.id.trim())) {
                        element.selected = template[0]['selectedSection'][element.id.trim()];
                    } else {
                        element.selected = false;
                    }
                });
            }
        }
        if (templeteId.id === 'NONE') {
            this.model.templateName = '';
        }
        this.templatePagesList = tempTemplatePagesList;
        this.defaultSelected = templeteId;
    }

    SaveTemplate() {
        const existTemplate = this.itemList.filter(x => x.name.toLowerCase() === this.model.templateName.toLowerCase());
        const selectedSection = {};
        let confirmMessage = [];
        let count = 0;
        this.templatePagesList.forEach(item => {
            selectedSection[item.id.trim()] = item.selected;
            if (item.selected) {
                count++;
            }
        });
        if (count <= 0) {
            this.translate.get(['ALERT_MESSAGE.ERROR_TITLE', 'DOCUMENT.GENERATE_DOCUMENT.PAGE_NOT_SELECT_MESSAGE'])
                .subscribe((res: string) => {
                    Swal(res['ALERT_MESSAGE.ERROR_TITLE'], res['DOCUMENT.GENERATE_DOCUMENT.PAGE_NOT_SELECT_MESSAGE'], 'error');
                });
            return;
        }
        const template = {
            'id': 'ID' + (this.itemList.length + 1),
            'description': this.model.templateName,
            'selectedSection': selectedSection
        };
        if (existTemplate.length > 0) {
            if (existTemplate[0].id === 'NONE' || existTemplate[0].id === 'DEFAULT') {
                this.translate.get(['ALERT_MESSAGE.ERROR_TITLE', 'DOCUMENT.GENERATE_DOCUMENT.SELECT_EXIST_TEMPLATE_ERROR'])
                    .subscribe((res) => {
                        Swal(res['ALERT_MESSAGE.ERROR_TITLE'], res['DOCUMENT.GENERATE_DOCUMENT.SELECT_EXIST_TEMPLATE_ERROR'], 'error');
                    });
                return;
            }
            this.translate.get(['DOCUMENT.GENERATE_DOCUMENT.TEMPLATE_CONFIRM.TITLE',
                'DOCUMENT.GENERATE_DOCUMENT.TEMPLATE_CONFIRM.TEXT', 'DOCUMENT.GENERATE_DOCUMENT.TEMPLATE_CONFIRM.CONFIRMBUTTONTEXT'])
                .subscribe((res) => {
                    confirmMessage = res;
                });
            Swal({
                title: confirmMessage['DOCUMENT.GENERATE_DOCUMENT.TEMPLATE_CONFIRM.TITLE'],
                text: confirmMessage['DOCUMENT.GENERATE_DOCUMENT.TEMPLATE_CONFIRM.TEXT'],
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: confirmMessage['DOCUMENT.GENERATE_DOCUMENT.TEMPLATE_CONFIRM.CONFIRMBUTTONTEXT'],
            }).then((result) => {
                if (result.value) {
                    // if (!this.hasPortfolio) {
                    //      this.saveDocument();
                    // }
                    this.documentService.updateTemplate(template, this.defaultSelected.id).subscribe(response => {
                        // if (response) {
                        this.translate.get(['ALERT_MESSAGE.SUCCESS_TITLE', 'DOCUMENT.GENERATE_DOCUMENT.TEMPLATE_UPDATED_MESSAGE'])
                            .subscribe((res: string) => {
                                Swal(res['ALERT_MESSAGE.SUCCESS_TITLE'], res['DOCUMENT.GENERATE_DOCUMENT.TEMPLATE_UPDATED_MESSAGE'],
                                    'success');
                            });
                        this.defaultSelected = existTemplate[0];
                        // this.getTemplates();
                        // }
                    });
                }
                return result;
            });
        } else {
            this.documentService.saveTemplate(template).subscribe(response => {
                if (response) {
                    this.itemList.push({ id: 'ID' + (this.itemList.length + 1), name: this.model.templateName });
                    this.defaultSelected = { id: 'ID' + (this.itemList.length + 1), name: this.model.templateName };
                    // this.saveDocument();
                    this.templateList.push(template);
                    this.store.dispatch(new SetTemplateList(this.templateList));
                    this.translate.get(['ALERT_MESSAGE.SUCCESS_TITLE', 'DOCUMENT.GENERATE_DOCUMENT.TEMPLATE_SAVE_MESSAGE'])
                        .subscribe((res: string) => {
                            Swal(res['ALERT_MESSAGE.SUCCESS_TITLE'], res['DOCUMENT.GENERATE_DOCUMENT.TEMPLATE_SAVE_MESSAGE'], 'success');
                        });
                    // this.getTemplates();
                }
            });
        }
    }

    selectPage(isSelect: boolean) {
        this.templatePagesList.forEach(element => {
            element.selected = isSelect;
        });
    }
    // get template form api if update or add new
    getTemplates() {
        this.documentService.getTemplateList().subscribe(data => {
            this.templateList = data;
            this.fillTemplateList();
            this.store.dispatch(new SetTemplateList(data));
        });
    }
    changeTemplateNone() {
        if (this.defaultSelected.id === 'DEFAULT') {
            this.defaultSelected = { id: 'NONE', name: 'None' };
        } else if (this.defaultSelected.id === 'NONE') {
            this.model.templateName = '';
        } else {
            this.model.templateName = this.defaultSelected.name;
        }
    }

    // saveGenerateDocument() {
    //     if (!this.hasPortfolio && this.model.templateName !== '' && this.model.templateName) {
    //         // Save template and Generate document both
    //         this.SaveTemplate();
    //     } else {
    //         // Save only generate document
    //         this.saveDocument();
    //     }
    // }

    saveDocument() {
        const includeSection = {};
        let count = 0;
        this.templatePagesList.forEach(item => {
            includeSection[item.id.trim()] = item.selected;
            if (item.selected) {
                count++;
            }
        });
        if (count <= 0) {
            this.translate.get(['ALERT_MESSAGE.ERROR_TITLE', 'DOCUMENT.GENERATE_DOCUMENT.PAGE_NOT_SELECT_MESSAGE'])
                .subscribe((res: string) => {
                    Swal(res['ALERT_MESSAGE.ERROR_TITLE'], res['DOCUMENT.GENERATE_DOCUMENT.PAGE_NOT_SELECT_MESSAGE'], 'error');
                });
            return;
        }
        let portfolioId = '';
        if (this.model.portfolio) {
            portfolioId = this.model.portfolio.id;
        }
        const generateDocument = {
            familyId: this.clientId,
            documentType: this.model.fileUnderType['categoryId'],
            portfolioId: portfolioId,
            includeSection: includeSection,
            documentId: 'DOC1' // this.selectedDocument
        };
        this.documentService.saveGenerateDocument(generateDocument).subscribe(response => {
            // if (response) {
            const category = this.documentCategory.filter(x => x.categoryId === this.model.fileUnderType.categoryId);
            const document = category[0].documents.filter(x => x.id === this.selectedDocument);
            if (document.length > 0) {
                document[0].newDocument = false;
            }
            this.translate.get(['ALERT_MESSAGE.SUCCESS_TITLE', 'DOCUMENT.GENERATE_DOCUMENT.DUCUMENT_GENERATED_MESSAGE'])
                .subscribe((res: string) => {
                    Swal(res['ALERT_MESSAGE.SUCCESS_TITLE'], res['DOCUMENT.GENERATE_DOCUMENT.DUCUMENT_GENERATED_MESSAGE'], 'success');
                });
            this.model = {};
            this.templatePagesList = null;
            this.hasPortfolio = false;
            this.portfolioList = null;
            this.templatePagesList = null;
            this.templateList = null;
            this.documentList = null;
            this.selectedDocument = null;
            this.model.portfolio = null;
            // }
        });
    }

}


