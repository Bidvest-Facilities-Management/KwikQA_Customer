import { KeyValuePipe } from "@angular/common";
import { FooterComponent } from "../footer/footer.component";
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from "../../_services/api.service";

@Component({
  selector: 'app-gmp',
  standalone: true,
  imports: [FooterComponent, ReactiveFormsModule, KeyValuePipe, CommonModule, FormsModule],
  templateUrl: './gmp.component.html',
  styleUrl: './gmp.component.css'
})

export class GmpComponent {
@Input() ztable = 'ZSDBILLING';
  items: any[] = [];
  defarray:any[] = [];
  form: FormGroup;
  editIndex: number | null = null;
filter1 = '';
filter2 = '';
servicelines = [' Cleaning Services - Cleaning Consumables ',
' Cleaning Services - Cleaning equipment ',
' Cleaning Services - Fem Hygiene Consumables ',
' Cleaning Services - Fem Hygiene Equiment ',
' Cleaning Services - Hygiene Consumables ',
' Cleaning Services - Hygiene Equiment ',
' Cleaning Services - Labour ',
' Cleaning Services - Pest Control ',
' Cleaning Services - Reactive ',
' Cleaning Services - Uniform Cost ',
' Confidential Waste Management - Planned ',
' Confidential Waste Management - Reactive ',
' Critical Engineering - Planned ',
' Electrical Engineering - Planned ',
' Electrical Engineering - Reactive ',
' Environmental - Planned ',
' Fabric Services - Planned ',
' Fabric Services - Reactive ',
' Field Operators - Planned ',
' Floor Management Services - Planned ',
' Front of House, Reception and Switchboard Services - Planned ',
' Health and Safety - Planned ',
' Landscaping Services - Planned ',
' Landscaping Services - Reactive ',
' Maintenance of First Aid Boxes - Planned ',
' Maintenance of First Aid Boxes - Reactive ',
' Mechanical Engineering - Planned ',
' Mechanical Engineering - Reactive ',
' Meeting Room Logistics - Planned ',
' Meeting Room Logistics - Reactive ',
' Shuttle Services - Planned ',
' Waste Management - Planned ',
' Waste Management - Reactive ',
]
  constructor(private fb: FormBuilder, private apiserv: ApiService) {
    this.form = this.fb.group({});
   
  }

  ngOnInit() {
   // this.loadItems();

  }

  fetchDatal(){
    this.apiserv.getGMPTable(this.ztable,this.filter1, this.filter2).subscribe(data => {
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
  onChange(serviceline: string){
    this.filter2 = serviceline;
   
}
}
