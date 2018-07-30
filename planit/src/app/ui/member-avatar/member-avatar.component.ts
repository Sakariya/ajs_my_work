import { Relation } from '../../client/client-models/family-member';
import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-member-avatar',
    templateUrl: './member-avatar.component.html',
    styleUrls: ['./member-avatar.component.css']
})
export class MemberAvatarComponent implements OnInit {
    @Input() public avatarUrl: string;
    @Input() public firstName: string;
    @Input() public lastName: string;
    @Input() public relationClass: string;
    @Input() public avatarClass: string;

    constructor() { }

    ngOnInit() {
        this.avatarClass +=  ' ' + this.relationClass;
    }

}
