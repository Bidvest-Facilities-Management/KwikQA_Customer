import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthservService } from '../../_services/authserv.service';
import { Subscription, take } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
    formlogin: FormGroup;
    formOTP: FormGroup;
    norequest = true;
    message = '';
    isLoading: boolean = false
    subs: Subscription[] = [];
    constructor(
        private fb: FormBuilder,
        private authserv: AuthservService,
        private router: Router
    ) {
        this.formlogin = this.fb.group(
            { email: '', cellno: '' },
            { validators: this.atleastonerequired }
        );
        this.formOTP = this.fb.group({ otp: '', required: true });
    }
    ngOnInit() {
        this.subs.push(
            this.authserv.okloginBS.subscribe((data) => {
                if (data != '') {
                    if (data == 'failed') {
                        this.norequest = true;
                        this.formlogin.reset();
                        this.message = 'Invalid Email or cell Number';
                        setTimeout(() => {
                        this.message = '';
                        }, 3000);
                    } else {
                        this.norequest = false;
                    }
                }
            })
        );

        this.authserv.loading$.subscribe((value)=> this.isLoading = value)
    }
    ngOnDestroy() {
        this.subs.forEach((sub) => sub.unsubscribe());
    }

    atleastonerequired(group: FormGroup): ValidationErrors | null {
        if (group) {
            if (group.controls['email'].value || group.controls['cellno'].value) {
                return null;
            }
        }
        return { error: true };
    }

    onSubmitOTP() {
        if (this.formOTP.value['otp'] == '') {
            return;
        }
        this.authserv.confirmOTP(this.formOTP.value['otp']);
    }

    redirect(url: string) {
        setTimeout(function () {
            window.location.href = url;
            return false;
        }, 500);
        return false;
    }
    onSubmit() {
        if ( this.formlogin.value['email'] == '' && this.formlogin.value['cellno'] == '' ) {
            return;
        }
        this.authserv.getOTP( this.formlogin.value['email'], this.formlogin.value['cellno'] );
    }
}
