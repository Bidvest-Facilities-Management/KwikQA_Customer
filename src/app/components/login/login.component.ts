import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthservService } from '../../_services/authserv.service';
import { Subscription, take } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  formlogin:FormGroup
  formOTP:FormGroup
norequest = true;
message = '';
subs: Subscription[] = [];
constructor(private fb: FormBuilder,private authserv: AuthservService, private router: Router) {
  this.formlogin = this.fb.group({email: '', cellno: ''}, { validators: this.atleastonerequired});  
  this.formOTP = this.fb.group({otp: '',required: true});
}
ngOnInit(){
  this.subs.push( this.authserv.okloginBS.subscribe((data) => {
    if (data != ''){
    if (data =='failed') {
      this.norequest = true;
      this.formlogin.reset();
      this.message = 'Invalid Email or cell Number';
      setTimeout(() => {
        this.message = '';
      },2000);

    } else {
      this.norequest = false;
     
    }
  }
     
}))
}
ngOnDestroy(){
this.subs.forEach(sub=> sub.unsubscribe())
}

atleastonerequired(group : FormGroup) : ValidationErrors | null {
  if (group) {
    if(group.controls['email'].value || group.controls['cellno'].value) {
      return null;
    }
  }
  return {'error': true};
}
onSubmitOTP() {
 
    if (this.formOTP.value['otp'] == '' ) {
    
      return;
    }
    this.authserv.confirmOTP(this.formOTP.value['otp'] ) 
//     this.authserv.okloginBS.pipe(take(1)).subscribe((data) => {
//       if (data != "ERROR") {
//       this.redirect(data.split('-')[0] + 't=' + data.split('-')[1] );
    
//       } else {
//         this.norequest = true;
//         this.formlogin.reset();
//         this.message = 'Invalid Email or cell Number';
//         setTimeout(() => {
//           this.message = '';
//         },2000);
//         this.norequest = true;
//       }
       
// })
  }
redirect(url: string) {
  setTimeout(function(){ window.location.href = url;
    return false;
  },500);
 
  return false;
}
  onSubmit() {
    if (this.formlogin.value['email'] == '' && this.formlogin.value['cellno'] == '') {
      return;
    }

    this.authserv.getOTP(this.formlogin.value['email'],this.formlogin.value['cellno']) 

  }
}
