
import { KeyValuePipe } from "@angular/common";
import { FooterComponent } from "../footer/footer.component";
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from "../../_services/api.service";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule, KeyValuePipe, CommonModule, FormsModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {
@Input() ztable = 'ZSDBILLING';
  items: any[] = [];
  defarray:any[] = [];
  form: FormGroup;
  editIndex: number | null = null;

  constructor(private fb: FormBuilder, private apiserv: ApiService) {
    this.form = this.fb.group({});
   
  }

  ngOnInit() {
   // this.loadItems();
   this.apiserv.getTable(this.ztable).subscribe(data => {
    if (data && data['RESULT']) {
      this.items = data['RESULT'];
      this.initForm();
    }
  })
  }


  openModal(){

  }
  hasError(controlName: string, errorName: string): boolean {
    return this.form.get(controlName)?.hasError(errorName) || false;
  }
  shoutout(textin: any = {key:'uk', value:'United Kingdom'}) {
    alert(textin.key + ' ' + textin.value);
  }
  loadItems() {
    // Simulating API call
    const apiResponse = {
      RESULT:[{"LIFNR":"0506411","AUART":"ATWO","ILART":"","TRADE":"B","MATNR":"0071371","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":21.0,"MEINS":"EA","MWSKZ":"V1"},
        {"LIFNR":"0506411","AUART":"ATWO","ILART":"","TRADE":"B","MATNR":"0079921","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":100.0,"MEINS":"EA","MWSKZ":"V1"},  
        {"LIFNR":"0506411","AUART":"ATWO","ILART":"","TRADE":"B","MATNR":"0079941","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":0,"MEINS":"EA","MWSKZ":"V1"},  
        {"LIFNR":"0506411","AUART":"ATWO","ILART":"","TRADE":"B","MATNR":"0079942","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":150.0,"MEINS":"EA","MWSKZ":"V1"},  
        {"LIFNR":"0506411","AUART":"ATWO","ILART":"","TRADE":"B","MATNR":"0079943","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":125.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"","TRADE":"B","MATNR":"0079944","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":300.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"","TRADE":"B","MATNR":"0079978","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":350.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"","TRADE":"B","MATNR":"0079979","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":400.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"","TRADE":"B","MATNR":"0079980","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":450.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"","TRADE":"B","MATNR":"0080002","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":600.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"A00","TRADE":"B","MATNR":"000601040","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":2750.21,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"API","TRADE":"B","MATNR":"000601042","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":1457.98,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"CAR","TRADE":"B","MATNR":"000601035","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":1387.92,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"CAS","TRADE":"B","MATNR":"000601036","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":2415.18,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"CCL","TRADE":"B","MATNR":"000601037","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":2415.18,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"CDL","TRADE":"B","MATNR":"000601038","SEQ":0,"VALID_FROM":"2024-07-01","VALID_TO":"9999-12-31","KM_FROM":1,"KM_TO":100,"NETWR":2500.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"CDL","TRADE":"B","MATNR":"000601038","SEQ":0,"VALID_FROM":"2024-07-02","VALID_TO":"9999-12-31","KM_FROM":101,"KM_TO":9999,"NETWR":25.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"CRL","TRADE":"B","MATNR":"000601039","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":935.7,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"MAR","TRADE":"B","MATNR":"000401861","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":101,"KM_TO":999999,"NETWR":7.8,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"MAR","TRADE":"B","MATNR":"000601030","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":100,"NETWR":780.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"MAS","TRADE":"B","MATNR":"000407861","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":101,"KM_TO":999999,"NETWR":7.8,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"MAS","TRADE":"B","MATNR":"000601031","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":100,"NETWR":780.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"MCL","TRADE":"B","MATNR":"000401861","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":101,"KM_TO":999999,"NETWR":7.8,"MEINS":"KM","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"MCL","TRADE":"B","MATNR":"000601032","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":100,"NETWR":780.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"MDL","TRADE":"B","MATNR":"000401861","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":101,"KM_TO":999999,"NETWR":7.8,"MEINS":"KM","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"MDL","TRADE":"B","MATNR":"000601033","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":100,"NETWR":780.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"MRL","TRADE":"B","MATNR":"000401861","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":101,"KM_TO":999999,"NETWR":7.8,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"MRL","TRADE":"B","MATNR":"000601034","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":100,"NETWR":780.0,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"RMS","TRADE":"B","MATNR":"000601043","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":2750.21,"MEINS":"EA","MWSKZ":"V1"},
  {"LIFNR":"0506411","AUART":"ATWO","ILART":"TBI","TRADE":"B","MATNR":"000601041","SEQ":0,"VALID_FROM":"2024-05-01","VALID_TO":"9999-12-31","KM_FROM":0,"KM_TO":0,"NETWR":2750.21,"MEINS":"EA","MWSKZ":"V1"}]
  }
      this.items = apiResponse.RESULT;
    this.initForm();
  }

  initForm() {
    if (this.items.length > 0) {
      const item = this.items[0];
      this.defarray = [];
      Object.keys(item).forEach(key => {
        this.defarray.push({field:key, displayname:key.toLowerCase(), type: isNaN(item[key])?'string':'number', required: true, minLength: 3 })
        this.form.addControl(key, this.fb.control('', [
          Validators.required,
          Validators.maxLength(80)
        ]));
      });
      console.log(this.defarray) 
    }
  }
getDisplayName(key:any=''){
  return this.defarray.find(line=>line.field==key).displayname ;
}
  onSubmit() {
    if (this.editIndex !== null) {
      this.items[this.editIndex] = this.form.value;
      this.editIndex = null;
    } else {
      this.items.push(this.form.value);
    }
    this.form.reset();
  }

  editItem(index: number) {
    this.editIndex = index;
    this.form.patchValue(this.items[index]);
  }

  deleteItem(index: number) {
    this.items.splice(index, 1);
  }
  saveDef(){
    console.log(JSON.stringify(this.defarray))
  }
}
