import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) { }

    ngOnInit() { }
}
