import { APIService } from '../../api.service';
import { UserAuthService } from '../user-auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    public username: string;
    public password: string;

    constructor(
        private userService: UserAuthService,
        private router: Router
    ) { }

    ngOnInit() { }

    public onLogin() {
        this.userService.login(this.username, this.password).subscribe(
            (response) => {
                this.router.navigate(['./advisor', 'dashboard']);
            },
            (errorResponse) => {
                Swal('Oops...', errorResponse.error.errorMessage, 'error');
            }
        );
    }

    needHelp() {
        Swal({
            title: 'Need help?',
            html: '<div class="need_help">' +
            '<p class="desc_txt">If you require technical support, please contact Client Services:</p>' +
            '<ul><li><i class="ion-ios-telephone"></i><span>(800) 601-1762</span></li>' +
            '<li><i class="ion-android-mail"></i><span><a class="" href="mailto:support@planplus.com">support@planplus.com</a></span></li></ul></div>',
            confirmButtonText: 'Close',
            confirmButtonColor: '#8899aa',
            focusConfirm: false
        });
    }
}
