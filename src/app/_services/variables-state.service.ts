import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VariablesStateService {

    private activeMenuItemSource = new BehaviorSubject<string>('');
    private isLoading = new BehaviorSubject<boolean>(false);
    currentActiveMenuItem = this.activeMenuItemSource.asObservable();
    loading = this.isLoading.asObservable();

    constructor() { }
    
    changeActiveMenuItem(menuItem: string) {
        this.activeMenuItemSource.next(menuItem);
    }

    changeLoading(value: boolean) {
        this.isLoading.next(value);
    }
}
