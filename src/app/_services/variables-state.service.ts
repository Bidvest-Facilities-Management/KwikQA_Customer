import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class VariablesStateService {

    private activeMenuItemSource = new BehaviorSubject<string>('');
    currentActiveMenuItem = this.activeMenuItemSource.asObservable();
    private isLoading = new BehaviorSubject<boolean>(false);
    loading = this.isLoading.asObservable();
    private isBottomSheetOpen = new BehaviorSubject<boolean>(false);
    bottomSheetOpen = this.isBottomSheetOpen.asObservable();

    constructor() { }
    
    changeActiveMenuItem(menuItem: string) {
        this.activeMenuItemSource.next(menuItem);
    }

    changeLoading(value: boolean) {
        this.isLoading.next(value);
    }

    changeBottomSheet(value:boolean) {
        this.isBottomSheetOpen.next(value)
    }
}
