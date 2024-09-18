import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ContentComponent } from './components/content/content.component';
import { TestComponent } from './components/test/test.component';

import { MobileviewComponent } from './component/mobileview/mobileview.component';

export const routes: Routes = [

    {path:'' , component: HomeComponent},
    {path:'content' , component: ContentComponent},
    {path:'home' , component: HomeComponent},
    {path:'login' , component: LoginComponent},
    {path:'pod/:orderno' , component: MobileviewComponent},
    {path:'test' , component: TestComponent},

    { path: '**', redirectTo: 'content' }
];
