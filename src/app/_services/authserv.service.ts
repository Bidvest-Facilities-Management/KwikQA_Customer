import { LocationStrategy } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConditionalExpr } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { BehaviorSubject, map, take } from 'rxjs';
import { ApiService } from './api.service';
import { GlobalConstants } from '../globalconstants';

export interface USER {
    ROLE: any;
    ADDEDROLEDATA: any;
    EMAIL: string;
    CELLNO: string;
    TOKEN: string;
    PARTNER: string;
    PARTNERS: string;
    NAME: string;
    USERNAME: string;
    ROLELINKS: any[];
}
@Injectable({
    providedIn: 'root',
})
export class AuthservService {
    apikey: string = GlobalConstants.apikey;
    token: string = '';
    role: string = GlobalConstants.role;
    blankuser: USER = this.getBlankuser();
    callback: string = '';
    okloginBS = new BehaviorSubject<string>('');
    doc = window.location.href;
    devprod = 'DEV';
    currentuser: any = {};
    public currentUserBS = new BehaviorSubject<USER>(this.blankuser);
    public currentUser$ = this.currentUserBS.asObservable();
    private loggedinBS = new BehaviorSubject<boolean>(false);
    public loggedin$ = this.loggedinBS.asObservable();
    public loading = new BehaviorSubject<boolean>(false);
    public loading$ = this.loading.asObservable();

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private apiserv: ApiService,
        private router: Router,
        private location: LocationStrategy
    ) {}

    setUser() {
        //  this.devprod = (this.doc.toUpperCase().includes('DEV') || this.doc.toUpperCase().includes('LOCAL')) ? 'DEV' : 'DEV';
        // Is this a new link?
        let apikey2 = this.findGetParameter('a')
        ? this.findGetParameter('a')
        : this.apikey;

        if (apikey2 == this.apikey) {
            this.role = this.findGetParameter('r')
                ? this.findGetParameter('r')
                : this.role;
            this.token = this.findGetParameter('t')
                ? this.findGetParameter('t')
                : this.token;
            //console.log('apikey' + this.apikey);
            //console.log('token' + this.token);
            //console.log('role' + this.role);
        }
        this.location.replaceState('', '', this.router.url.split('?')[0], '');
        let cu = localStorage.getItem(this.apiserv.environment) || '';

        if (cu && JSON.parse(cu).TOKEN?.length > 5) {
            this.validateLSToken();
        } else {
            if (this.token && this.token.length > 5) {
                this.validateLinkToken(this.token, this.role);
            } else {
                this.logOut();
            }
        }
    }

    /*******findGetParameter** Return non-array************************************************/
    findGetParameter(parameterName: string) {
        let result = '';
        let tmp = [];
        tmp = location.href.split('?');
        if (tmp && tmp.length > 1) {
            let tempparams = tmp[1].split('&');

            tempparams.forEach((item) => {
                tmp = item.split('=');
                if (tmp[0] === parameterName) {
                    result = decodeURIComponent(tmp[1]);
                }
            });
        }
        return result;
    }

    /*******postJSGen** Return non-array***************************************************** */
    postGEN(
        lclobj: any,
        methodname: string,
        classname: string = 'DIESEL',
        url = ''
    ) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                token: 'BK175mqMN0',
            }),
        };
        const call2 = {
            context: {
                CLASS: classname,
                TOKEN: 'BK175mqMN0',
                METHOD: methodname,
            },
            data: lclobj,
        };

        let mypost = this.http.post(url, call2, httpOptions);

        return mypost.pipe(
            map((data) => {
                let represult =
                data &&
                data['d' as keyof typeof data] &&
                data['d' as keyof typeof data]['exResult' as keyof typeof data]
                    ? JSON.parse(
                        JSON.parse(
                        data['d' as keyof typeof data][
                            'exResult' as keyof typeof data
                        ]
                            .toString()
                            .replace(/[^\x00-\x7F]/g, '')
                        )
                    )
                    : data;
                return represult;
            })
        );
    }
    /*******postJSGen** Return non-array***************************************************** */
    postJSGEN(lclobj: any, methodname: string, classname: string = 'USER') {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                token: 'BK175mqMN0',
            }),
        };
        const call2 = {
            context: {
                CLASS: classname,
                TOKEN: 'BK175mqMN0',
                METHOD: methodname,
            },
            data: lclobj,
        };
        let url = 'https://data.bidvestfm.co.za/ZRFC3/request?sys=' + (this.apiserv.devprod.toUpperCase() == 'PROD' ? 'prod' : 'dev');
        let mypost = this.http.post(url, call2, httpOptions);

        return mypost.pipe(
            map((data) => {
                this.apiserv.loadingBS.next(this.apiserv.loadingBS.value - 1);

                let represult = data && data['d' as keyof typeof data] && data['d' as keyof typeof data]['exResult' as keyof typeof data]
                    ? JSON.parse(
                        JSON.parse(
                        data['d' as keyof typeof data][
                            'exResult' as keyof typeof data
                        ]
                            .toString()
                            .replace(/[^\x00-\x7F]/g, '')
                        )
                    )
                    : data;
                return represult;
            })
        );
    }

    getOTP(email = '', sms = '') {
        // this.blankuser.SAPUSER = email;
        if (email == '' && sms == '') {
            return;
        }
        let lclobj = {
            EMAIL: email,
            CELLNO: sms,
            APIKEY: this.apikey,
            ROLE: this.role,
        };
        this.currentuser = {
            EMAIL: email,
            CELLNO: sms,
            APIKEY: this.apikey,
            TOKEN: '',
        };
        let tstr = this.apiserv.devprod;
        let url = 'https://data.bidvestfm.co.za/ZRFC3/request?sys=' + tstr;
        this.loading.next(true)
        this.postGEN(lclobj, 'SENDRFCOTP', 'USER', url).pipe(take(1)).subscribe((tokenin) => {
            if (tokenin.RESULT.VERIFIED_BY_USER_GUID == 'ERROR') {
                this.okloginBS.next('failed');
                this.loading.next(false)
            } else {
                this.okloginBS.next(tokenin.RESULT.VERIFIED_BY_USER_GUID);
                this.currentuser.TOKEN = tokenin.RESULT.VERIFIED_BY_USER_GUID;
                this.loading.next(false)
            }
        });
    }

    confirmOTP(otp = '', guid = '') {
        let lclobj = {
            EMAIL: this.currentuser.EMAIL,
            CELLNO: this.currentuser.CELLNO,
            OTP: otp,
            APIKEY: this.apikey,
            TOKEN: this.currentuser.TOKEN,
        };
        let tstr = this.apiserv.devprod;
        let url = 'https://data.bidvestfm.co.za/ZRFC3/request?sys=' + tstr;
        this.loading.next(true)
        this.postGEN(lclobj, 'VALIDRFCOTP', 'USER', url).subscribe((tokenin) => {
            let token = tokenin.RESULT;
            this.okloginBS.next('');
            if (token.VERIFIED_BY_USER_GUID == 'ERROR') {
                this.okloginBS.next('failed');
                this.loading.next(false)
            } else {
                this.currentuser.TOKEN = tokenin.RESULT.VERIFIED_BY_USER_GUID;
                localStorage.setItem(this.apiserv.environment,JSON.stringify(this.currentuser));
                this.validateLSToken();
                this.loading.next(false)
            }
        });
    }
    validateToken() {}

    validateLinkToken(token: string, role = 'PORTAL') {
        this.postJSGEN({ LINK: token, ROLE: role },'CONFIRM_LINK','USER').subscribe((reply) => {
            if (reply.RESULT.indexOf('Error') > 2) {
                this.apiserv.loadingBS.next(this.apiserv.loadingBS.value - 1);
                this.router.navigate(['error']);
            } else {
                this.currentUserBS.next(JSON.parse(reply.RESULT));
                let token = JSON.parse(reply.RESULT);
                this.blankuser.EMAIL = token.EMAIL;
                this.blankuser.TOKEN = token.TOKEN;
                this.blankuser.CELLNO = token.CELL;
                this.blankuser.NAME = token.NAME;
                this.blankuser.USERNAME = token.USERNAME;
                this.blankuser.ROLE = token.ROLE;
                this.blankuser.ADDEDROLEDATA = token.ADDEDROLEDATA;
                this.blankuser.PARTNER = token.VENDOR;
                this.blankuser.PARTNERS = token.VENDORS;
                this.blankuser.ROLELINKS = token.ROLELINKS ? JSON.parse(token.ROLELINKS): [];
                this.currentuser = { ...this.blankuser };
                this.apiserv.currentuser.TOKEN = token.TOKEN;
                this.currentUserBS.next(JSON.parse(JSON.stringify(this.blankuser)));
                localStorage.setItem(this.apiserv.environment,JSON.stringify(this.currentUserBS.value));

                this.loggedinBS.next(true);
                this.router.navigate(['home']);
            }
        });
    }

    logOut() {
        localStorage.removeItem(this.apiserv.environment);
        this.currentUserBS.next(this.getBlankuser());
        this.currentuser = this.getBlankuser();
        this.loggedinBS.next(false);
        this.apiserv.loadingBS.next(0);
        this.apiserv.currentuser.TOKEN = '';
        this.router.navigate(['login']);
    }

    validateLSToken() {
        let cu = localStorage.getItem(this.apiserv.environment || 'BaseApp');
        if (cu && JSON.parse(cu).TOKEN?.length > 5) {
        this.postJSGEN({ TOKEN: JSON.parse(cu).TOKEN, ROLE: this.role, APIKEY: this.apikey },'VALIDATETOKEN','USER').subscribe((reply) => {
            if (reply.RESULT.indexOf('Error') > 2) {
                if (this.token && this.token.length > 5) {
                    this.validateLinkToken(this.token, this.role);
                } else {
                    this.logOut();
                }
            } else {
                let token = JSON.parse(reply.RESULT);
                this.blankuser.EMAIL = token.EMAIL;
                this.blankuser.TOKEN = token.TOKEN;
                this.blankuser.CELLNO = token.CELL;
                this.blankuser.NAME = token.NAME;
                this.blankuser.USERNAME = token.USERNAME;
                this.blankuser.ROLE = token.ROLE;
                this.blankuser.ADDEDROLEDATA = token.ADDEDROLEDATA;
                this.blankuser.PARTNER = token.VENDOR;
                this.blankuser.PARTNERS = token.VENDORS;

                try {
                    this.blankuser.ROLELINKS = token.ROLELINKS ? JSON.parse(token.ROLELINKS): [];
                } catch (error) {
                    this.blankuser.ROLELINKS = [token.ROLELINKS];
                }

                this.currentuser = { ...this.blankuser };
                this.apiserv.currentuser.TOKEN = token.TOKEN;
                this.currentUserBS.next(JSON.parse(JSON.stringify(this.blankuser)));
                localStorage.setItem(this.apiserv.environment, JSON.stringify(this.currentUserBS.value)
                );
                this.loggedinBS.next(true);
                this.router.navigate(['home']);
            }
        });
        } // No Token
        else {
        this.logOut();
        }
    }

    getBlankuser() {
        return {
            EMAIL: '',
            CELLNO: '',
            PARTNER: '',
            NAME: '',
            TOKEN: '',
            USERNAME: '',
            PARTNERS: '',
            ROLE: '',
            ADDEDROLEDATA: '',
            ROLELINKS: [{ ROLE: '', ROLELINKS: '' }],
        };
    }
}
