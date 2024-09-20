import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ContentComponent } from "../content/content.component";

import { FormsModule } from '@angular/forms';
import { ApiService } from '../../_services/api.service';
import { MobilityService } from '../../_services/mobility.service';
import { AuthservService } from '../../_services/authserv.service';
import { GmpComponent } from "../gmp/gmp.component";
import { QalistComponent } from "../qalist/qalist.component";


@Component({
    selector: 'app-home',
    standalone: true,
    imports: [NavbarComponent, CommonModule, ContentComponent,  FormsModule, GmpComponent, QalistComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    panel = 200;
    thetable = 'ZKEY_VALUE';
    menulist: any = [
        { name: 'Awaiting Approval', icon: 'person', link:200, status:'HCOM' },
        //{ name: 'In Correction', icon: 'person', link:300, status:'HCOM' },
        //{ name: 'Approved (60 days)', icon: 'person', link:400, status:'HCOM' },
        //{ name: 'Approved  History', icon: 'person', link:800 , status:'HCOM'},
    ]

    searchlistnew = [
        {SECTION: 'Confirmation Fields',MESSAGE: 'Documents',DATEOF:'20240817',TIMEOF:'12:00:00',USER: 'John Doe',STATUS: 'New'},
        {SECTION: 'Confirmation Photos',MESSAGE: 'Documents',DATEOF:'20240817',TIMEOF:'12:00:00',USER: 'John Doe',STATUS: 'New'},
        {SECTION: 'Actitivy Codes',MESSAGE: 'Documents',DATEOF:'20240817',TIMEOF:'12:00:00',USER: 'John Doe',STATUS: 'New'},
        {SECTION: 'Activity Codes to Fields',MESSAGE: 'Documents',DATEOF:'20240817',TIMEOF:'12:00:00',USER: 'John Doe',STATUS: 'New'},
        {SECTION: 'Materials to Fields',MESSAGE: 'Documents',DATEOF:'20240817',TIMEOF:'12:00:00',USER: 'John Doe',STATUS: 'New'},
    ]

    constructor(
        private apiserv:ApiService,
        public mobileserv:MobilityService,
        public authserv:AuthservService,
    ) { }

    ngOnInit(): void {

        this.mobileserv.configValues.forEach((item: any, index: any) => {
            const roleLinksString = this.authserv.blankuser.ROLELINKS.join(' ');
            if (roleLinksString.includes(item.NODEKEY.split('+')[0])) {
                this.menulist.push( {
                    name: item.VALUE,
                    icon: 'person',
                    link: 200 + (index * 100),
                    status: item.EXTRA
                })
            }
        })
    }

    doConfig(configSection:any = {}){
        console.log('configSection',configSection)
    }

    changePanel(panel:any){
        this.panel = 0;
        this.thetable = this.apiserv.tablename;
        this.panel = panel;
        this.apiserv.getConfirms(30, panel);
        
    }
}
