import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class TaskNotificationService {

    httpOptions = {
        headers: new HttpHeaders({
            'isLive': 'true'
        })
    };
    constructor(
        private http: HttpClient
    ) { }

    getAllTaskByFilter(filterObj, pageNo, limit): Observable<any> {
        return this.http.post('/v30/message/?messageType=task&messageType=notification&pageNo=' + pageNo + '&limit=' + limit, filterObj, this.httpOptions);
    }

    getAllTaskByFilterByClient(filterObj, clientId, pageNo, limit): Observable<any> {
        return this.http.post('/v30/message/' + clientId + '/?messageType=task&messageType=notification&pageNo=' + pageNo + '&limit=' + limit, filterObj, this.httpOptions);
    }

    updateAllTask(messageObj): Observable<any> {
        return this.http.put('/v30/message/', messageObj, this.httpOptions);
    }

    addClientTask(clientId, messageObj) {
        return this.http.post('/v30/message/' + clientId + '/create', messageObj, this.httpOptions);
    }

    getMessageDetail(messageId): Observable<any> {
        return this.http.get('/v30/message/' + messageId, this.httpOptions).map(response => <any>(<any>response));
    }

    deleteTask(messageId): Observable<any> {
        return this.http.delete('/v30/message/' + messageId, this.httpOptions);
    }

    getTaskTypes(): Observable<any> {
        return this.http.get('/v30/message/taskType', this.httpOptions);
    }
}
