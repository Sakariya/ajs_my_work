import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import {
    AppState,
    getIsClientDocumentCentrePayload,
    getIsClientDocumentTypeLoaded,
    getFamilyMemberPayload
} from '../../shared/app.reducer';

import {
    SetClientDocumentCentre,
    SetClientDocumentType
} from '../../shared/app.actions';


@Injectable()
export class DocumentService {

    constructor(
        private http: HttpClient,
        private store: Store<AppState>
    ) { }

    getClientDocumentWithType(clientId): Observable<any> {
        return Observable.forkJoin(
            this.http.get('/document/types').map(response => <any>(<any>response)),
            this.http.get('/document/' + clientId + '/lists').map(response => <any>(<any>response))
        );
    }

    getClientDocumentLists(searchString, filterBy, sortBy, clientId): Observable<any> {
        const searchDocParam = (searchString !== '') ? '&searchString=' + searchString : '';
        return this.http
            .get('/document/' + clientId + '/lists?filterBy=' + filterBy + '&sortBy=' + sortBy + searchDocParam)
            .map(response => <any>(<any>response));
    }

    fetchDocumentList(typeResult, DocResult): any {
        // tslint:disable-next-line:prefer-const
        let familyMembers: any;
        this.store
            .select(getFamilyMemberPayload)
            .subscribe(data => {
                if (data.hasOwnProperty('familyMembers') && data['familyMembers'].length > 0) {
                    familyMembers = data;
                }
            });
        typeResult.forEach((type, key) => {
            typeResult[key]['documents'] = [];
            if (DocResult) {
                DocResult.forEach(doc => {
                    if (type.documentId === doc.type) {
                        if (doc.sharedDate !== null) {
                            const splitData = doc.viewedBy.split('/');
                            const mIndex = familyMembers['idMapping'][splitData[splitData.length - 1]];
                            doc['viewedByMember'] = familyMembers['familyMembers'][mIndex];
                        }
                        doc['color'] = this.getColorByColumnKey(doc.status);
                        doc['docStatus'] = this.getStatusByColumnKey(doc.status);
                        typeResult[key]['documents'].push(doc);
                    }
                });
            }
        });
        return typeResult;
    }

    getColorByColumnKey(key: string): string {
        switch (key) {
            case 'IN_PROGRESS':
                return 'mauve';
            case 'REVIEW':
                return 'violet';
            case 'COMPLETE':
                return 'blue';
            case 'PENDING':
                return 'orange';
            case 'VIEWED':
                return 'green';
        }
    }

    getStatusByColumnKey(key: string): string {
        switch (key) {
            case 'IN_PROGRESS':
                return 'In Progress';
            case 'REVIEW':
                return 'Under Review';
            case 'COMPLETE':
                return 'Completed';
            case 'PENDING':
                return 'Shared - Pending';
            case 'VIEWED':
                return 'Shared - Viewed';
        }
    }

    uploadDocument(document: any): Observable<String> {
        return this.http.post('/document', document)
            .map((response: Response) => {
                return response;
            })
            .catch(error => Observable.throw(error));
    }

    getClientDocumentType(): Observable<any> {
        return this.http
            .get('/document/types', {})
            .map((response: any[]) => {
                this.store.dispatch(new SetClientDocumentType(response));
                return response;
            })
            .catch(error => Observable.throw(error));
    }

    getPortfoliosList(familyId: string): Observable<any> {
        return this.http.get('/client/' + familyId + '/portfolio').map(response => {
            return response;
        });
    }
    renameClientDocument(docId: string, documentName: string): Observable<String> {
        return this.http.post('/document/' + docId + '/rename', documentName)
            .map((response => <any>(<any>response)))
            .catch(error => Observable.throw(error));
    }

    shareClientDocument(docId: string) {
        return this.http.post('/document/' + docId + '/share', {})
            .map((response => <any>(<any>response)))
            .catch(error => Observable.throw(error));

    }

    unshareClientDocument(docId: string) {
        return this.http.post('/document/' + docId + '/unshare', {})
            .map((response => <any>(<any>response)))
            .catch(error => Observable.throw(error));
    }

    updateClientDocumentStatus(docId: string, status: string) {
        return this.http.post('/document/' + docId + '/status', status)
            .map((response => <any>(<any>response)))
            .catch(error => Observable.throw(error));
    }

    deleteClientDocument(docId: string) {
        return this.http.delete('/document/' + docId)
            .map((response => <any>(<any>response)))
            .catch(error => Observable.throw(error));
    }

    downloadClientDocument(docId: string) {
        return this.http.get('/document/' + docId + '/download', { responseType: 'blob' })
            .map(response => response)
            .catch(error => Observable.throw(error));
    }

    downloadFile(blob, fileName: string) {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }
    getTemplateList(): Observable<any> {
        return this.http.get('/document/template').map(response => {
            return response;
        });
    }
    saveTemplate(template: any): Observable<any> {
        return this.http.post('/document/template', template)
            .map(response => {
                return response;
            })
            .catch(error => Observable.throw(error));
    }
    updateTemplate(template: any, templateId: any): Observable<any> {
        return this.http.put('/document/template/' + templateId, template).map(response => {
            return response;
        });
    }
    saveGenerateDocument(generateDocument: any): Observable<any> {
        return this.http.post('/document/generate', generateDocument).map(response => {
            return response;
        });
    }
}
