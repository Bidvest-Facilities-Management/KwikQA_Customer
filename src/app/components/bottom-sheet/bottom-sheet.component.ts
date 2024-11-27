import { Component, EventEmitter, ElementRef, ViewChild, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { ChatComponent } from '../../components/chat/chat.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ApiService } from '../../_services/api.service';
import { MobilityService } from '../../_services/mobility.service';
import { CommonModule } from '@angular/common';
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
export class BottomSheetComponent implements OnInit, OnChanges {
    
    @Input() orderno = ''
    @Output() closeSheet: EventEmitter<void> = new EventEmitter<void>();
    token = this.authserv.currentuser.TOKEN
    filter="HCOM" 
    loadingBS = 0
    subs: Subscription[] = [];
    lastcomment = {lastreply: '' };
    canAddMaterial: boolean = false;
    filteredMaterials: any [] = []
    activeItem: string = '';
    editingPrice: number | null = null;
    loading: boolean = false
    newMaterial: any = {
        material: '',
        description: '',
        quantity: 0,
        price: null
    };
    varSubscription: Subscription;
    @ViewChild('content', { static: false }) content!: ElementRef;

    toastMessage: string = '';
    toastType: 'success' | 'error' | 'info' = 'info';
    isToastVisible: boolean = false;
    isBottomSheetOpen: boolean = false
    showChecklistResponses = false;

    itemResponses:any = {}
    checklistItems:any = []

    constructor(
        private apiserv:ApiService,
        private authserv: AuthservService,
        public mobileserv:MobilityService,
        private lightbox: Lightbox,
        private varStateService: VariablesStateService
    ) { }
  
    
    ngOnInit(): void {
        
        this.varSubscription = this.varStateService.currentActiveMenuItem.subscribe(menuItem => {
            this.activeItem = menuItem
            this.canAddMaterial = menuItem === 'BFM Finance'
        });

        this.varSubscription = this.varStateService.loading.subscribe(value => {
            this.loading = value
        });

        
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['orderno'] && this.orderno) {
            this.mobileserv.getExistingView(this.orderno);        
        }
    }

    hasAnyRole(roles: string[]): boolean {
        const userRoles = this.authserv.blankuser.ROLELINKS.join(' ');
        return roles.some(role => userRoles.includes(role));
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    };

    closeDialog(){
        this.closeSheet.emit();
    }

    removeLeadingZeros(text: string) {
        return text.replace(/^0+/, "");
    }

    approveOrder(){ 

        if (this.activeItem === 'BFM Finance') {
            const context = { CLASS: 'KWIK_QA', METHOD: 'PUT_DECISION' }
            const data = { ORDERNO: this.orderno, TOKEN: this.token, CODE:"BFMFINDONE", REASON: this.lastcomment.lastreply }
            this.apiserv.approveQAPOD(context, data);
            this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
            this.closeDialog();
        }
        if (this.activeItem === 'Vendor Finance') {
            const context = { CLASS: 'KWIK_QA', METHOD: 'PUT_DECISION' }
            const data = { ORDERNO: this.orderno, CODE: "VENDFINDONE", TOKEN: this.token, REASON: this.lastcomment.lastreply }
            this.apiserv.approveQAPOD(context, data);
            this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
            this.closeDialog();
        }
        if (this.activeItem === 'ATC Approval') {
            const context = { CLASS: 'KWIK_QA', METHOD: 'PUT_DECISION' }
            const data = { ORDERNO: this.orderno, CODE: "ATCFINDONE", TOKEN: this.token, REASON: this.lastcomment.lastreply }
            this.apiserv.approveQAPOD(context, data);
            this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
            this.closeDialog();
        }
    }

    rejectOrder(){

        if (this.activeItem === 'BFM Finance') {
            const context = { CLASS: 'KWIK_QA', METHOD: 'PUT_DECISION' }
            const data = { ORDERNO: this.orderno, TOKEN: this.token, CODE: "BFMFINREJ" , REASON: this.lastcomment.lastreply }
            this.apiserv.rejectQAPOD(context, data);
            this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
            this.closeDialog();
        }
        if (this.activeItem === 'Vendor Finance') {
            const context = { CLASS: 'KWIK_QA', METHOD: 'PUT_DECISION' }
            const data = { ORDERNO: this.orderno, CODE: "VENDFINREJ", TOKEN: this.token, REASON: this.lastcomment.lastreply }
            this.apiserv.rejectQAPOD(context, data);
            this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
            this.closeDialog();
        }
        if (this.activeItem === 'ATC Approval') {
            const context = { CLASS: 'KWIK_QA', METHOD: 'PUT_DECISION' }
            const data = { ORDERNO: this.orderno, CODE: "ATCFINREJ", TOKEN: this.token, REASON: this.lastcomment.lastreply }
            this.apiserv.rejectQAPOD(context, data);
            this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
            this.closeDialog();
        }
    }

    toggleChecklistResponses() {
        this.showChecklistResponses = !this.showChecklistResponses;
    }

    open(index: number): void {
        const albums = this.mobileserv.photosloaded.map(photo => ({
            src: photo.image,
            caption: photo.name, 
            thumb: photo.image, 
        }));
        this.lightbox.open(albums, index);
    }

    open2(index: number): void {
        this.lightbox.open(this.transformData(this.itemResponses), index);
    }

    transformData = (data: any): any[] => {
        const albums = [];
        for (const key in data) {
            if (data[key].photos && data[key].photos.length > 0) {
                data[key].photos.forEach((photo: any) => {
                    for (const phKey in photo) {
                        if (phKey.startsWith("PH_")) {
                            albums.push({
                                src: photo[phKey], 
                                caption: photo.NAME,
                                thumb: photo[phKey], 
                            });
                        }
                    }
                });
            }
        }
        return albums;
    };
    
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
            const res = await axios.post(this.apiserv.apiUrl, {context, data}, {
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

    formatChecklist (rawData: any[]) {
      
        rawData.forEach((item) => {
            // Parse the DATA field which contains the JSON string
            const dataObj = JSON.parse(item.DATA);
        
            // Create checklist item
            const checklistItem: any = {
                operation: item.EVENTTYPE,
                description: item.EVENTTYPE,
                photos: Array(dataObj.photos?.length || 0).fill('Photo') // Placeholder text for photo labels
            };
        
            // Add to checklistItems if not already present
            if (!this.checklistItems.some(ci => ci.operation === item.EVENTTYPE)) {
                this.checklistItems.push(checklistItem);
            }
        
            // Create item response
            this.itemResponses[item.EVENTTYPE] = {
                action: dataObj.action || 'No action',
                photos: dataObj.photos || [],
                feedback: '' // Add feedback if you have it in your data
            };
        });
    }
}
