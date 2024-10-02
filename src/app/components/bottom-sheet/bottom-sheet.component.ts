import { Component, EventEmitter, ElementRef, ViewChild, Input, OnInit } from '@angular/core';
import { ChatComponent } from '../../components/chat/chat.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ApiService } from '../../_services/api.service';
import { MobilityService } from '../../_services/mobility.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthservService } from '../../_services/authserv.service';
import { LightboxModule, Lightbox } from 'ngx-lightbox';
import { VariablesStateService } from '../../_services/variables-state.service';
import { ToastComponent } from '../toast/toast.component';
import axios from 'axios';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bottom-sheet',
  standalone: true,
  imports: [ChatComponent, CommonModule, LightboxModule, FormsModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.css'
})
export class BottomSheetComponent implements OnInit {
    
    @Input() orderno: string = ''
    isBottomSheetOpen: boolean = false
    loadingBS = 0
    canAddMaterial: boolean = false;
    filteredMaterials: any [] = []
    activeItem: string = '';
    subs: Subscription[] = [];
    editingPrice: number | null = null;
    loading: boolean = false
    newMaterial: any = {
        material: '',
        description: '',
        quantity: 0,
        price: null
    };
    @ViewChild('content', { static: false }) content!: ElementRef;

    toastMessage: string = '';
    toastType: 'success' | 'error' | 'info' = 'info';
    isToastVisible: boolean = false;

    token = this.authserv.currentuser.TOKEN
    lastcomment = {lastreply: '' };

    constructor(
        private authserv: AuthservService,
        public mobileserv:MobilityService,
        private apiserv:ApiService,
        private router:Router,
        private lightbox: Lightbox,
        private varStateService: VariablesStateService
    ){}

    ngOnInit(): void {

        if (this.isBottomSheetOpen) {
            console.log(this.orderno)
        }
        this.subs.push(this.apiserv.loadingBS.subscribe(item => {
                this.loadingBS = item;
            })
        );
    
        this.varStateService.bottomSheetOpen.subscribe(value => {
            if (value && this.orderno) {
                console.log(this.orderno)
                this.mobileserv.getExistingView(this.orderno);
            }
            this.isBottomSheetOpen = value
        });
    }
    
    closeBottomSheet() {
        this.varStateService.changeBottomSheet(false)
    }

    hasAnyRole(roles: string[]): boolean {
        const userRoles = this.authserv.blankuser.ROLELINKS.join(' ');
        return roles.some(role => userRoles.includes(role));
    }


    closeDialog(){
        this.router.navigate(['/home']);
    }

    removeLeadingZeros(text: string) {
        return text.replace(/^0+/, "");
    }

    approveOrder(){ 
        if (this.activeItem === 'BFM Finance') {
            const context = { CLASS: 'KWIK_ACTIONS', METHOD: 'SEND_TO_ATCFIN' }
            const data = { ORDERNO: this.orderno, TOKEN: this.token, ACTION:"BFMFINAPP", REASON: this.lastcomment.lastreply }
            this.apiserv.approveQAPOD(context, data);
            this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
            this.closeDialog();
        }
        if (this.activeItem === 'Vendor Finance') {
            const context = { CLASS: 'KWIK', METHOD: 'FINVIEW_QA' }
            const data = { ORDERNO: this.orderno, ACTION:"VENDFINDONE", TOKEN: this.token, REASON: this.lastcomment.lastreply }
            this.apiserv.approveQAPOD(context, data);
            this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
            this.closeDialog();
        }
    }
    rejectOrder(){

        if (this.activeItem === 'BFM Finance') {
            const context = { CLASS: 'KWIK', METHOD: 'FINVIEW_QA' }
            const data = { ORDERNO: this.orderno, TOKEN: this.token, ACTION: "BFMFINREJ" , REASON: this.lastcomment.lastreply }
            this.apiserv.rejectQAPOD(context, data);
            this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
            this.closeDialog();
        }
        if (this.activeItem === 'Vendor Finance') {
            const context = { CLASS: 'KWIK', METHOD: 'FINVIEW_QA' }
            const data = { ORDERNO: this.orderno, ACTION:"VENDFINDONE", TOKEN: this.token, REASON: this.lastcomment.lastreply }
            this.apiserv.rejectQAPOD(context, data);
            this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
            this.closeDialog();
        }
    }

    open(index: number): void {
        const albums = this.mobileserv.photosloaded.map(photo => ({
            src: photo.image,
            caption: photo.name, 
            thumb: photo.image, 
        }));
        this.lightbox.open(albums, index);
    }
    
    close(): void {
        // Close the lightbox
        this.lightbox.close();
    }

    exportToPDF(): void {
        window.print();
    }

    removeMaterial(index: number) {
        this.mobileserv.materialsused.splice(index, 1);
    }

    getMaterialDescription(materialId: string): string {
        const material = this.mobileserv.materials.find(m => m.MATNR === materialId);
        return material ? material.MAKTX : null;
    }
    
    addMaterial() {
        this.mobileserv.materialsused.push({
            material: '',
            description: '',
            quantity: '',
            price: ''
        });
    }

    onDescriptionChange(material: any, index: number) {
        const selectedMaterial = this.mobileserv.materials.find(m => m.description === material.description);
        if (selectedMaterial) {
            material.material = this.removeLeadingZeros(selectedMaterial.material);
            material.price = selectedMaterial.price
            // You might want to update other fields like price if needed
        }
    }

    getFilteredMaterials(currentDescription: string): any[] {
        return this.mobileserv.materials.filter(m => m.description !== currentDescription);
    }

    startEditingPrice(index: number) {
        this.editingPrice = index;
    }

    stopEditingPrice(index: number) {
        // Stop editing only if the value is valid (optional)
        this.editingPrice = null;
    }

    showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
        this.toastMessage = message;
        this.toastType = type;
        this.isToastVisible = true;
  
        setTimeout(() => {
            this.isToastVisible = false;
        }, 3000);
    }
    
    onToastClosed() {
        this.isToastVisible = false;
    }

    async save() {
        const context = { CLASS: 'KWIK', METHOD: 'SAVE_KWIKMATERIALS' }
        const data = { ORDERNO: this.orderno, MATUSED: JSON.stringify(this.mobileserv.materialsused) }

        try {
            const res = await axios.post('https://data.bidvestfm.co.za/ZRFC3/request?sys=prod', {context, data}, {
                headers: {
                    token: 'BK175mqMN0',
                }
            })
            if (res.data.ERROR == '') {
                this.showToast('Materials saved', 'success');
            }else{
                let errorMessage = "The following errors occurred:\n\n";
                res.data.ERROR.forEach((error:any, index: number) => {
                    errorMessage += `${index + 1}. ${error.CATEGORY}: ${error.MESSAGE}\n`;
                });
                this.showToast(errorMessage, 'error');
            }
        } catch (error) {
            console.log(error)
        }

    }

}
