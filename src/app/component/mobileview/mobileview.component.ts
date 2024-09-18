import { Component, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { ChatComponent } from '../../components/chat/chat.component';
import { ApiService } from '../../_services/api.service';
import { MobilityService } from '../../_services/mobility.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthservService } from '../../_services/authserv.service';
import { LightboxModule, Lightbox } from 'ngx-lightbox';

@Component({
  selector: 'app-mobileview',
  standalone: true,
  imports: [ChatComponent, CommonModule, LightboxModule],
  templateUrl: './mobileview.component.html',
  styleUrl: './mobileview.component.css',
})
export class MobileviewComponent {
    // @Input() orderno = '000411935489'
    // @Input() token = '';
    // @Input() filter = 'ALL';
    // @Output() closer = new EventEmitter();
    token = this.authserv.currentuser.TOKEN
    filter="HCOM" 
    loadingBS = 0
    subs: Subscription[] = [];
    lastcomment = {lastreply: '' };
    orderno = '000411935489'
    @ViewChild('content', { static: false }) content!: ElementRef;

    constructor(private apiserv:ApiService,
      private authserv: AuthservService,
      public mobileserv:MobilityService,
      private route: ActivatedRoute,
      private router:Router,
      private lightbox: Lightbox
    ) { }
  
    
    ngOnInit(): void {
        this.route.params.subscribe((params: Params) => this.orderno = params['orderno']);
        this.mobileserv.getExistingView(this.orderno);
        this.subs.push(this.apiserv.loadingBS.subscribe(item => {
                this.loadingBS = item;
            })
        );
      
    }
    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    };
    closeDialog(){
        this.router.navigate(['/home']);
    }

    approveOrder(){ 
        this.apiserv.approveQAPOD(this.orderno, this.lastcomment.lastreply);
        this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
        this.closeDialog();
    }
    rejectOrder(){
        //Orderno / Reason / Comment
        this.apiserv.FailQAPOD(this.orderno, this.lastcomment.lastreply);
        this.apiserv.confListBS.next(this.apiserv.confListBS.value.filter((ele:any) => ele.ORDERNO != this.orderno));
        this.closeDialog();
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
}
  