import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VariablesStateService } from './variables-state.service';
import { BehaviorSubject, map, } from 'rxjs';
import { GlobalConstants } from '../globalconstants';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    devprod = 'DEV';
    environment = '';
    apikey = 'KWIKPORTAL';
    apiUrl = 'https://data.bidvestfm.co.za/ZRFC3/request?sys='
    doc = window.location.href;
    currentuser = {TOKEN:''};
    public loadingBS = new BehaviorSubject(0);

    confListBS = new BehaviorSubject<any[]>([]);
    confList$ = this.confListBS.asObservable();
    chats: any[] = [];
    chat$ = new BehaviorSubject<any>(this.chats);

    private callback = new BehaviorSubject<any[]>([]);
    callback$ = this.callback.asObservable();

    tablename = 'ZKEY_VALUE';
    constructor(private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private varStateService: VariablesStateService
    
    ) {
        this.setEnvironment();
    }

    /***************************************************** */
    setEnvironment() {
        if ( this.environment == '') {
            this.devprod = (this.doc.toUpperCase().includes('DEV') || this.doc.toUpperCase().includes('LOCAL')) ? 'dev' : 'prod';
            this.environment = GlobalConstants.environment + this.devprod;  " key to the LocalStorage Items";
            this.apikey = GlobalConstants.apikey;
            this.apiUrl = 'https://data.bidvestfm.co.za/ZRFC3/request?sys=' + this.devprod
        }
    }
    /*******postJSGen** Return non-array***************************************************** */
    postGEN(lclobj: any, methodname: string, classname: string = "KWIK", dest = this.devprod) {
        let url = this.apiUrl + dest
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                token: 'BK175mqMN0',
            })
        };
        const call2 = {
            context: {
                CLASS: classname,
                TOKEN: 'BK175mqMN0',
                METHOD: methodname
            },
            data: lclobj
        };

        let mypost = this.http.post(this.apiUrl,call2, httpOptions);

        return mypost.pipe(
            map(data => {
                let represult = (data && data['d' as keyof typeof data] && data['d' as keyof typeof data]['exResult' as keyof typeof data]) ?
                JSON.parse(JSON.parse(data['d' as keyof typeof data]['exResult' as keyof typeof data].toString().replace(/[^\x00-\x7F]/g, ""))) : data
                return represult

        }))

    }
    getUsers(username: string = '', apikey: string = '', email: string = '', cellno: string = '') {
        let lclobj = { USERNAME: username, APIKEY: apikey, EMAIL: email, CELLNO: cellno };
        let tstr = this.devprod.toUpperCase() == 'PROD' ? 'prod' : 'dev';

        return this.postGEN(lclobj, 'RFC_USERLIST', 'USER', tstr);
    }
    getRoles(username: string = 'ROLES', apikey: string = '', email: string = '', cellno: string = '') {
        let lclobj = { USERNAME: username, APIKEY: apikey, EMAIL: email, CELLNO: cellno };

        return this.postGEN(lclobj, 'RFC_USERLIST', 'USER');
    }
    getAPIKEYS() {
        let lclobj = { APIKEY: 'ALL' };

        return this.postGEN(lclobj, 'GET_APIKEYS', 'USER');
    }
    getTable(tablename: string = '') {
        let lclobj = { PERIOD: '60DAYS', FILTER: 'HCOM' }
        let tstr = this.devprod == 'PROD' ? 'prod' : 'prod';
        let url = this.apiUrl + tstr;

        return tablename != '60DAYS' ? this.postGEN(lclobj, 'GET_QALIST', 'KWIK', this.apiUrl) : this.postGEN(lclobj, 'GET_GMP', 'CONFIG', this.apiUrl);
    }
    getGMPTable(tablename: string = '', filter1 = '', filter2 = '') {
        let lclobj = { TABLENAME: tablename, FILTER1: filter1, FILTER2: filter2 }
        return this.postGEN(lclobj, 'GET_GMP', 'CONFIG');
    }
    /***************************************************** */

    getConfirms(period = 30, filter = '') {
    
        let callobj = { PERIOD: period, STATUS: filter }

        //  this.authserv.currentuser.TOKEN == ''
        this.loadingBS.next(this.loadingBS.value + 1);
        this.postGEN(callobj, "GET_QALIST", "KWIK_QA").subscribe(reply => {
            if (!reply || reply.RESULT.length == 0) {
                return
            }
            console.log(reply.RESULT)
            this.confListBS.next(reply.RESULT);
            this.loadingBS.next(this.loadingBS.value - 1);
        })
    }

    getConfirmationList(context: any, data: any) {
        this.varStateService.changeLoading(true);
        this.loadingBS.next(this.loadingBS.value + 1);
        this.postGEN(data, context.METHOD, context.CLASS).subscribe(reply => {
            // if (!reply || reply.RESULT.length == 0) {
            //     return
            // }
            this.confListBS.next(reply.RESULT);
            this.loadingBS.next(this.loadingBS.value - 1);
            this.varStateService.changeLoading(false);
        })
    }

    saveMaterials(context: any, data: any) {
        this.postGEN(data, context.METHOD, context.CLASS).subscribe(reply => {
            this.callback.next(reply.RESULT);
        })
    }

    rejectQAPOD(context: any, data: any) {
      
        this.postGEN(data, context.METHOD, context.CLASS).subscribe(reply => {
            if (!reply || reply.RESULT.length == 0) {
                return
            }
            //this.ordersBS.next(reply.RESULT);
        })
    }

    approveQAPOD(context: any, data: any) {

        this.postGEN(data, context.METHOD, context.CLASS).subscribe(reply => {
            if (!reply || reply.RESULT.length == 0) {
                return
            }
            //this.ordersBS.next(reply.RESULT);
        })
    }

    xtdbtoa(instring: string) {
        if (instring && instring.length > 0) {
            try {
                return btoa(encodeURIComponent(instring))
            } catch (err) {
                //   this.messagesBS.next('Conversion Failed' + instring)
            }
            return '';
        } else {
            return '';
        }
    }

    xtdatob(instring: string, idno = '0') {
        if (instring && instring.length > 0) {
            try {
                //console.log(idno + '-' + instring)
                return atob(decodeURIComponent(instring))
            } catch (err) {
                //      this.messagesBS.next('Conversion Failed' + instring)
            }
            return '';
        } else {
            return '';
        }
    }
}
