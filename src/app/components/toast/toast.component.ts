import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, CommonModule],
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.css']
})
export class ToastComponent {
    @Input() message: string = '';
    @Input() type: 'success' | 'error' | 'info' = 'info';
    @Input() isVisible: boolean = false;
    @Output() closed = new EventEmitter<void>();

    close() {
        this.isVisible = false;
        this.closed.emit();
    }
}