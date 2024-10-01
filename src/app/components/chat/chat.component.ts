import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../_services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements AfterViewInit {
    chats:any[] = [];
    replytext = '';
    @Input() apikey: string = '';
    @Input() section: string = '';
    @Input() commentby: string = '';
    @Input() orderno: string = '';
    @Input() viewer: string = '';
    @Input() height: number = 200;
    @Input() lastreply: any = {lastreply: '' };
    @Output() reply = new EventEmitter<string>();
    @ViewChild('chatbox') private chatBox: ElementRef | undefined;
    @ViewChild('chatInput') chatInputElement!: ElementRef;

    subs: Subscription[] = [];
    constructor( public dataserv: ApiService) {

    }

    ngAfterViewInit() {
        this.adjustTextareaHeight();
    }

    adjustTextareaHeight() {
        const textarea: HTMLTextAreaElement = this.chatInputElement.nativeElement;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    }

    ngOnInit(): void {
    
        this.chats = [{    id: 0, COMMENT_TEXT: this.dataserv.xtdbtoa(this.replytext), APIKEY: this.apikey, REFERENCE: this.orderno, COMMENT_AREA: this.section,  COMMENTBY: this.commentby, STATUS:'A', PARENT_ID: 0
    }] ;
    

    setTimeout(() => {
        this.getComments();
        this.subs.push(this.dataserv.chat$.subscribe((data) => {
        // this.chats = data;
        }))},500
    );  
    
    }
    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    } 

    createComment(  ) {
        if (this.replytext =='') {
            this.getComments();
            return null;
        }
        this.lastreply.lastreply = this.replytext;
        let reference = this.orderno == null ? '' : ('00000' + this.orderno).slice(-12);
        let lclobj = {
            id: 0, 
            COMMENT_TEXT: this.dataserv.xtdbtoa(this.replytext), 
            APIKEY: this.apikey, REFERENCE: reference, 
            COMMENT_AREA: this.section,  
            COMMENTBY: this.commentby, 
            STATUS:'A', 
            PARENT_ID: 0
        }
        this.dataserv.postGEN({ ORDERNO: reference, PUT_PARTNER: 'A' }, "PUT_CHAT", "KWIK").subscribe((data) => {
            this.getComments();
        });
        this.dataserv.postGEN(lclobj, "PUT_COMMENT", "COMMENTS").subscribe((data) => {
            let temp = data.RESULT;
        })
        this.replytext = '';
        return null;
    }
    getComments(): void {
        let reference = this.orderno == null ? '' : ('00000' + this.orderno).slice(-12);
        let tstr = this.dataserv.devprod.toUpperCase() == 'PROD' ? 'prod' : 'prod';
        let url = 'https://io.bidvestfm.co.za/BIDVESTFM_API_ZRFC3/request?sys=' + tstr;
        this.dataserv.postGEN({ ORDERNO: reference, GET_PARTNER: 'A' }, "GET_CHAT", "KWIK", url).subscribe((data) => {
        });
        this.dataserv.postGEN({ REFERENCE: reference, APIKEY:this.apikey, COMMENT_AREA: this.section, url }, "GET_CHAT", "COMMENTS").subscribe((data) => {
            let temp = JSON.parse(data.RESULT);
            let out = temp.map((item: { COMMENT_TEXT: string; REFERENCE: any; COMMENT_AREA: any; COMMENTBY: any; STATUS: any; DATEOF: string; TIMEOF: string; }) => {
                return   {
                    id: 0,MESSAGE: this.dataserv.xtdatob(item.COMMENT_TEXT), APIKEY: this.apikey, ORDERNO:item.REFERENCE, SECTION:item.COMMENT_AREA,
                    USER: item.COMMENTBY, STATUS:item.STATUS, TIMESTAMP: item.DATEOF + ' ' + item.TIMEOF
                }
            })
            this.chats = out;
            this.scrollToBottom();
        })
    
    }
    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    scrollToBottom(): void {
        try {
        if (this.chatBox)
        this.chatBox.nativeElement.scrollTop = this.chatBox?.nativeElement.scrollHeight;
        } catch (err) { }
    }
 
}
