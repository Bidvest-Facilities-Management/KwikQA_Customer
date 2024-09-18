import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ContentComponent } from "../content/content.component";

import { FormsModule } from '@angular/forms';
import { ApiService } from '../../_services/api.service';
import { GmpComponent } from "../gmp/gmp.component";
import { QalistComponent } from "../qalist/qalist.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ContentComponent,  FormsModule, GmpComponent, QalistComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  panel = 200;
  thetable = 'ZKEY_VALUE';
  menulist = [
 
    { name: 'Awaiting Approval', icon: 'person', link:200, status:'HCOM' },
    { name: 'In Correction', icon: 'person', link:300, status:'HCOM' },
    { name: 'Approved (60 days)', icon: 'person', link:400, status:'HCOM' },
    { name: 'Approved  History', icon: 'person', link:800 , status:'HCOM'},
    // { name: 'GMP', icon: 'person', link:110 },
    // { name: 'Excusable', icon: 'person', link:'content' },
    // { name: 'Track_Changes', icon: 'person', link:'content' },
    // { name: 'PDF', icon: 'person', link: 'content' },
  ]

  searchlistnew = [
    {SECTION: 'Confirmation Fields',MESSAGE: 'Documents',DATEOF:'20240817',TIMEOF:'12:00:00',USER: 'John Doe',STATUS: 'New'},
    {SECTION: 'Confirmation Photos',MESSAGE: 'Documents',DATEOF:'20240817',TIMEOF:'12:00:00',USER: 'John Doe',STATUS: 'New'},
    {SECTION: 'Actitivy Codes',MESSAGE: 'Documents',DATEOF:'20240817',TIMEOF:'12:00:00',USER: 'John Doe',STATUS: 'New'},
    {SECTION: 'Activity Codes to Fields',MESSAGE: 'Documents',DATEOF:'20240817',TIMEOF:'12:00:00',USER: 'John Doe',STATUS: 'New'},
    {SECTION: 'Materials to Fields',MESSAGE: 'Documents',DATEOF:'20240817',TIMEOF:'12:00:00',USER: 'John Doe',STATUS: 'New'},
  ]
constructor(private apiserv:ApiService) {
}
  doConfig(configSection:any = {}){
    console.log('configSection',configSection)
  }
  changePanel(panel:any){
    this.panel = 0;
    this.thetable = this.apiserv.tablename;
    this.panel = panel;
    let status = this.menulist.find((ele:any) => ele.link == panel)?.status;
    this.apiserv.getConfirms(30, status);
    
  }
}
