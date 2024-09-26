import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../_services/api.service';
import { AuthservService } from '../../_services/authserv.service';
import { MobilityService } from '../../_services/mobility.service';
import { VariablesStateService } from '../../_services/variables-state.service';

interface MenuItem {
    NAME: string;
    REQROLE?: string;
    METHOD?: string;
    CLASS?: string;
    EVENT?: string;
}

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
    menu: MenuItem[] = [
        { NAME: 'Confirmations', METHOD: 'GET_CONFIRMLIST', CLASS: 'KWIK' },
        { NAME: 'Vendor Finance', REQROLE: 'FINVIEW',  METHOD: 'GET_QALIST', CLASS: 'KWIK' },
        { NAME: 'BFM Finance', REQROLE: 'BFMFIN',  METHOD: 'GET_QALIST', CLASS: 'KWIK' },
    ];
    
    filteredMenu: MenuItem[] = [];
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
        this.filterMenu();
        if(this.mobileserv.configValues.length){
            this.menu = this.mobileserv.configValues
            this.filterMenu();
        }
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
            const data = { PERIOD: "60DAYS", FILTER: user.PARTNER || user.PARTNERS, EVENTTYPE: item.EVENT }
            this.apiserv.getConfirmationList(context, data);
            
        }else{
            const user = this.authserv.blankuser
            const context = { CLASS: item.CLASS, METHOD: item.METHOD, TOKEN: user.TOKEN }
            const data = { PERIOD: "60DAYS", WC: user.PARTNER || user.PARTNERS, FILTER: 'QCOM', EVENTTYPE: item.EVENT }
            this.apiserv.getConfirmationList(context, data);
        }
    }
    
    goto(url: string) {
        this.router.navigate([url]);
    }

    isActive(status: string): boolean {
        return this.activeItem === status;
    }
}
    