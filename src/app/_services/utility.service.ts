import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { 
 // const formCode = this.generateFormControls(formObject);
 // console.log(formCode);
  }
generateFormControls(object: any): string {
    let formControls = '';
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const config = object[key];
        let control = `${key}: new FormControl('', [`;
  
        if (config.required) {
          control += 'Validators.required, ';
        }
        if (config.minLength) {
          control += `Validators.minLength(${config.minLength}), `;
        }
        if (config.maxLength) {
          control += `Validators.maxLength(${config.maxLength}), `;
        }
        if (config.min) {
          control += `Validators.min(${config.min}), `;
        }
        if (config.max) {
          control += `Validators.max(${config.max}), `;
        }
        if (config.email) {
          control += 'Validators.email, ';
        }
  
        control = control.replace(/, $/, ''); // Remove trailing comma
        control += ']),\n';
  
        formControls += control;
      }
    }
    return `form = this.fb.group({\n${formControls}});`;
  }
  
}
