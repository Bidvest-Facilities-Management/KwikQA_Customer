import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../_services/api.service';
import { AuthservService } from '../../_services/authserv.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule,FormsModule],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent {
    @Input() menulist: any[] = [];
    @Output() changePanel = new EventEmitter<any>();
    thetable='ZKEY_VALUE';
    username = '';
    isMobileMenuOpen = false;
    activeItem: string = '';
    
    constructor(public router: Router, private apiserv: ApiService, private authserv: AuthservService) {
    }
    
    ngOnInit() {
        this.username = this.authserv.currentUserBS.value.USERNAME;
    }
    
    goto(url: string) {
        this.router.navigate([url]);
    }

    goToPanel(configSection: string) {
        this.changePanel.emit(configSection);
        this.activeItem = configSection;
    }

    isActive(status: string): boolean {
        return this.activeItem === status;
    }
}
    