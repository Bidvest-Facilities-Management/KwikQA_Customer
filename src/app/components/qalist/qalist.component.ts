import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ApiService } from '../../_services/api.service';
import { SearchpipePipe } from '../../_helpers/searchpipe';
import * as XLSX from 'xlsx';
import { MobileviewComponent } from '../../component/mobileview/mobileview.component';
import { AuthservService } from '../../_services/authserv.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-qalist',
  standalone: true,
  imports: [FormsModule, CommonModule, SearchpipePipe, MobileviewComponent],
  templateUrl: './qalist.component.html',
  styleUrl: './qalist.component.css'
})
export class QalistComponent {
  @Input() status = 'HCOM';
  subscriptions: Subscription[] = [];
  searchlist:any[] = [];
  searchlistnew :any[] = [];
  searchlistbase :any[] = [];
  statelevel = 0;
  sortorder = 'QMNUM';
  fileName = 'Notifs-list.xlsx';
  searchbox = '';
  currentorderno = '000407091452';
hideDetail = false
  
  constructor(public apiserv:ApiService, public authserv:AuthservService, private router:Router) { }
  ngOnInit(): void {
    
    this.subscriptions.push(
      this.apiserv.confList$.subscribe((reply) => {
         this.searchlist = [];
         if (reply) {
          let tempreply = [...reply]
          tempreply.forEach((ele: any) => {
            let element = JSON.parse(JSON.stringify(ele))
          
            element['ORDERNO'] = element['ORDERNO'].replaceAll(/^0+/g, "")
            element['tag'] = Object.values(element).join('-');
            this.searchlist.push(JSON.parse(JSON.stringify(element)));
           
          
       
          });
        }

        this.searchlistnew = this.searchlist;

      }));
  }
  ngOnDestroy(): void {
    
  }

showmobile(orderview: any = {}){
  this.currentorderno = ('000000000000' + orderview.ORDERNO).slice(-12);
  this.router.navigate(['pod', this.currentorderno]);
}
exportexcel(): void {
  /* pass the table id */
  let element = document.getElementById('doclist');
  const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, { raw: true });

  /* generate workbook and add the worksheet */
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '-Notifs-list');

  /* save to file */
  XLSX.writeFile(wb, this.fileName);

}
sortBy(attribute= 'ORDERNO'){
  if ( this.sortorder != attribute ) {
    this.searchlistnew.sort((a, b)=> {
      if (a[attribute] < b[attribute]) {
        return -1;
      }
      if (a[attribute] > b[attribute]) {
        return 1;
      }
      return 0;
    })
    this.sortorder = attribute;
  } else {
    this.searchlistnew.sort((a, b)=> {
      if (a[attribute] > b[attribute]) {
        return -1;
      }
      if (a[attribute] < b[attribute]) {
        return 1;
      }
      return 0;
    })
    this.sortorder = '';
  }
  
  }
closeDetail(){
  this.hideDetail = true;
}

} 