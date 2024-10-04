import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../_services/api.service';
import { AuthservService } from '../../_services/authserv.service';
import { MobilityService } from '../../_services/mobility.service';
import { VariablesStateService } from '../../_services/variables-state.service';

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

    menu: any = []
    
    filteredMenu: any = [];
    userRoles: any = [];
    
    constructor(
        public router: Router, 
        private apiserv: ApiService, 
        private authserv: AuthservService,
        public mobileserv:MobilityService,
        private varStateService: VariablesStateService
    ) {}
    
    ngOnInit(): void {
        
        this.username = this.authserv.currentUserBS.value.USERNAME;
        this.userRoles = this.authserv.blankuser.ROLE;
        this.mobileserv.configValues.subscribe(values => {
            this.menu = values;
            this.filterMenu();
        });
    }

    filterMenu(): void {
        this.filteredMenu = this.menu.filter(item => {
            if (!item.REQROLE) {
                return true;
            }
            return this.userRoles.includes(item.REQROLE);
        });
    }

    getOrders(item: any) {
        this.activeItem = item.NAME;
        this.varStateService.changeActiveMenuItem(item.NAME);
       
        if (item.NAME === 'Confirmations') {
            const user = this.authserv.blankuser
            const context = { CLASS: item.CLASS, METHOD: item.METHOD, TOKEN: user.TOKEN }
            const data = { PERIOD: "60DAYS", FILTER: user.PARTNER || user.PARTNERS, EVENTTYPE: item.EVENT, VENDOR: "*" }
            this.apiserv.getConfirmationList(context, data);
            
        }else{
            const user = this.authserv.blankuser
            const context = { CLASS: item.CLASS, METHOD: item.METHOD, TOKEN: user.TOKEN }
            const data = { PERIOD: "60DAYS", VENDOR: user.PARTNER || user.PARTNERS, FILTER: item.FILTER, EVENTTYPE: item.EVENT, WC: item.WC }
            this.apiserv.getConfirmationList(context, data);
        }
    }
    
    goto(url: string) {
        if (this.apiserv.devprod === 'dev') {
            localStorage.removeItem('KwikPortaldev');
        } else {
            localStorage.removeItem('KwikPortalprod');
        }
        this.router.navigate([url]);
    }

    isActive(status: string): boolean {
        return this.activeItem === status;
    }
}
    