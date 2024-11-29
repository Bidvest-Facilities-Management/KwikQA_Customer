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

    open2(operationIndex: number, photoIndex: number): void {
        const data = this.formatChecklist(this.mobileserv.checklist)
        const albums = data[operationIndex].photos.map( (photo:any) => {
            const photoKey = Object.keys(photo).find(key => key.startsWith('PH_'));
            return {
                src: photo[photoKey], 
                caption: photo.NAME,  
                thumb: photo[photoKey] 
            };
        });
        this.lightbox.open(albums, photoIndex);
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

    async exportToPDF(elementId: string, filename: string = 'download.pdf') {

        await new Promise(resolve => setTimeout(resolve, 0));

        const element = document.getElementById(elementId);
        if (!element) return;

        const processedHtml = this.prepareHtmlForPdf(element);
    
        // Create a proper HTML document
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    }
                    img {
                        max-width: 100%;
                        height: auto;
                        page-break-inside: avoid;
                    }
                    .no-print {
                        display: none !important;
                    }
                </style>
            </head>
            <body>
                ${processedHtml}
            </body>
            </html>
        `;
    
        const body = {
            url: '', // Leave empty when using content
            content: htmlContent,  // html-pdf-node expects 'content' not 'html'
            options: {
            format: 'A4',
            margin: {
                top: 20,    // Numbers instead of strings
                right: 20,
                bottom: 20,
                left: 20
            },
            printBackground: true,
            preferCSSPageSize: true
            }
        };
    
        const headers = {
            'Content-Type': 'application/json',
            'apikey': 'iAXTKUc6v0qU942mtGut51XzSsVo0p1532w9cCkaV661BzavI6'
        };
    
        try {
            this.loading = true
            const response = await axios.post('https://ag.bidvestfm.co.za/VENDORS/BFMFIN/generate-pdf', body, {
                headers,
                responseType: 'arraybuffer'  // Important for receiving binary data
            });
    
            // Create blob from array buffer
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
        
            // Cleanup
            window.URL.revokeObjectURL(url);
            this.loading = false
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.data) {
                    const decoder = new TextDecoder('utf-8');
                    const errorMessage = decoder.decode(error.response.data);
                    console.error('Server error:', errorMessage);
                }
            }
            console.error('Error generating PDF:', error);
            this.loading = false
            throw error;
        }
    }

    prepareHtmlForPdf(element: HTMLElement): string {
        const tempDiv = element.cloneNode(true) as HTMLElement;
        const inputs = tempDiv.getElementsByTagName('input');
        
        Array.from(inputs)
          .reverse()
          .forEach(input => {
            const span = document.createElement('span');
            span.textContent = input.value;
            input.parentNode?.replaceChild(span, input);
          });
          
        return tempDiv.innerHTML;
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

        return rawData.map(item => {
            const parsedData = JSON.parse(item.DATA);
    
            return {
                operation: item.EVENTTYPE,
                action: parsedData.action,
                feedback: parsedData.feedback, 
                photos: parsedData.photos 
            };
        });
    }
}
