import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ContentComponent } from "../content/content.component";

import { FormsModule } from '@angular/forms';
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
    
    quota: number | undefined;
    usage: number | undefined;
    usagePercentage: number | undefined;

    constructor(
    ) { }

    ngOnInit(): void {
        if (navigator.storage && navigator.storage.estimate) {
            navigator.storage.estimate().then(estimate => {
                this.quota = estimate.quota;
                this.usage = estimate.usage;
        
                if (this.quota && this.usage) {
                    this.usagePercentage = (this.usage / this.quota) * 100;
                    console.log(this.usagePercentage.toFixed(2))
                }
            }).catch(error => {
                console.error('Error checking storage:', error);
            });
        } else {
            console.warn('Storage API not supported');
        }   
    }
}
