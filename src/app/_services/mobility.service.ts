import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BehaviorSubject, map, take } from 'rxjs';
import { VariablesStateService } from './variables-state.service';

@Injectable({
  providedIn: 'root'
})
export class MobilityService {
    techactivitycodes: any[]= [];
    filteredActivityCodes:any[] = [];
    filteredPhotoCodes:any[] = [];
    materialsList:any[] = [];
    loadedview: any = {};
    siteview: any[] = [];
    materialsused:any[] = [];
    materials:any[] = [];
    photosloaded:any[] = [];
    configValues: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    prooftype = '';
    devprod = 'dev';
    sitedetail = {caseid:'', location:''};

    constructor(
        private apiserv: ApiService,  
        private varStateService: VariablesStateService
    ) {}

    getBasics(token = '') {
        this.devprod = this.apiserv.devprod == 'dev' ? 'dev' : 'prod';
        this.apiserv.postGEN({ GROUPING: 'ZKWIKMOBILE' }, "GET_TECHACTIVITIES", "KWIK",this.devprod).subscribe(reply => {
        this.apiserv.loadingBS.next(this.apiserv.loadingBS.value - 1);
        if (!reply || reply.RESULT.length == 0) {
            return
        }
            this.techactivitycodes = reply.RESULT;
        })
        
    } 
    /******************************************************* */
    filterActivityCodes(activitytype = '') {
        this.filteredActivityCodes = this.techactivitycodes.filter((ele) => ele.ACTIVITYCODE == activitytype && ele.FIELDNAME.slice(0, 2) != 'PH');
        this.filteredPhotoCodes = this.techactivitycodes.filter((ele) => ele.ACTIVITYCODE == activitytype && ele.FIELDNAME.slice(0, 2) == 'PH');
    }
    /***************************************************** */
    getExistingView(orderno = '') {
        this.varStateService.changeLoading(true);
        this.photosloaded = [];
        this.materialsused = [];
        this.loadedview = {};
        this.siteview = [];
        this.sitedetail = {caseid:'', location:''};
        let lclobj = { ORDERNO: orderno };

        this.apiserv.postGEN(lclobj, 'GET_SITEDETAIL', 'KWIK',this.devprod).subscribe((data: any) => {
            if (data.ERROR != '') {
                return;
            } 
            this.siteview = data.RESULT;
            this.sitedetail.caseid = this.siteview.find(item=>  item.CH == 'Case ID').CV;
            this.sitedetail.location = this.siteview.find(item=>  item.CH == 'Location').CV;
        });
        this.apiserv.postGEN({ ORDERNO: orderno,  "LOOKUP": "X"}, 'GET_KWIKMATERIALS', 'KWIK',this.devprod).subscribe((data: any) => {
            if (data.ERROR != '') {
                return;
            } 
            this.materials = data.RESULT.map((item)=> ({
                "material": item.MATNR,
                "quantity": "",
                "description": item.MAKTX,
                "price": item.NETWR || "",
                "noprice": "",
            }));
        });
        this.apiserv.postGEN(lclobj, 'VIEW_TECHCONFIRM', 'KWIK',this.devprod).subscribe((data: any) => {
        //  this.apiserv.postGEN(lclobj, 'GET_DETAIL', 'KWIK_QA',this.devprod).subscribe((data: any) => {
            if (data.RESULT.ORDERNO != orderno) {
                return;
            }
            this.loadedview = data.RESULT;
            this.materialsused = data.RESULT.MATUSED ? JSON.parse(data.RESULT.MATUSED) : [];
            if (this.materialsused[0]['material'] ==''){
                this.materialsused = [];
            } else {
                this.materialsused.forEach((element: any) => {
                    element.material = element.material.toString().replace(/^0+/g, "");
                });
                this.materialsused = this.materialsused.filter((ele) => ele.material != '');
            }
            if (data.RESULT.PHOTOS.indexOf('image') > -1) {
                this.prooftype = 'photo';
                this.photosloaded = data.RESULT.PHOTOS ? JSON.parse(data.RESULT.PHOTOS) : [];
            }
            else {
                this.prooftype = 'document';
            }
            this.filterActivityCodes(data.RESULT.ACTIVITY_TYPE);
            this.varStateService.changeLoading(false);
        });
    }
    /***************************************************** */
    getMaterialsList() {
        this.apiserv.postGEN({ GROUPING: 'ZKWIKMOBILE' }, "GET_MATERIALS", "KWIK", this.devprod).subscribe(reply => {
            this.apiserv.loadingBS.next(this.apiserv.loadingBS.value - 1);
            if (!reply || reply.RESULT.length == 0) {
                return
            }
            this.materialsList = reply.RESULT;
        })
    }

    getConfigValues() {
        this.apiserv.postGEN({ FILTER: "ATCKWIKQACONFIGPORTAL" }, "GET_CONFIG", "KWIK_QA", this.devprod).subscribe(reply => {
            this.apiserv.loadingBS.next(this.apiserv.loadingBS.value - 1);
            if (!reply || reply.RESULT.length == 0) {
                return
            }
            this.configValues.next(reply.RESULT);
        })
    }
}

