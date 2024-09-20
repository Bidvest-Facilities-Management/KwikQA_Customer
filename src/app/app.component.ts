import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContentComponent } from "./components/content/content.component";
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { AuthservService } from './_services/authserv.service';
import { SearchpipePipe } from './_helpers/searchpipe';
import { ApiService } from './_services/api.service';
import { MobilityService } from './_services/mobility.service';
import { TestComponent } from "./components/test/test.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContentComponent, NavbarComponent, FooterComponent, LoginComponent, TestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'Kwik-QA';
    
    constructor(private authserv:AuthservService, private  apiserv: ApiService, private mobserv: MobilityService) {
        console.log(this.authserv.token);
    }

    ngOnInit() {
        this.apiserv.setEnvironment();
        this.authserv.setUser();
        this.mobserv.getBasics();
        this.mobserv.getConfigValues();
    }

}
