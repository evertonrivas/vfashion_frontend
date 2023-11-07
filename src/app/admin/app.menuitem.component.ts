import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: '[app-menuitem]',
    template: `<ng-container>
        <div *ngIf="root && item.visible !== false" class="layout-menuitem-root-text">{{item.label}}</div>
        <a *ngIf="(!item.routerLink || item.items) && item.visible !== false" [attr.href]="item.url" (click)="itemClick($event)"
        [ngClass]="item.class" [attr.target]="item.target" tabindex="0" pRipple>
            <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{item.label}}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
        </a>
        <a *ngIf="(item.routerLink && !item.items) && item.visible !== false &&item.separator==undefined" (click)="itemClick($event)" [ngClass]="item.class" 
        [routerLink]="item.routerLink" routerLinkActive="active-route" [routerLinkActiveOptions]="item.routerLinkActiveOptions||{ paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }"
        [fragment]="item.fragment" [queryParamsHandling]="item.queryParamsHandling" [preserveFragment]="item.preserveFragment" 
        [skipLocationChange]="item.skipLocationChange" [replaceUrl]="item.replaceUrl" [state]="item.state" [queryParams]="item.queryParams"
        [attr.target]="item.target" tabindex="0" pRipple>
            <i [ngClass]="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{item.label}}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" *ngIf="item.items"></i>
        </a>

        <ul *ngIf="item.items && item.visible !== false" [@children]="submenuAnimation">
            <ng-template ngFor let-child let-i="index" [ngForOf]="item.items">
                <li *ngIf="child.separator==undefined" app-menuitem [item]="child" [index]="i" [parentKey]="key" [class]="child.badgeClass"></li>
                <li *ngIf="child.separator!=undefined"><hr size="1"></li>
            </ng-template>
        </ul>
    </ng-container>`,
    animations: [
        trigger('children', [
            state('collapsed', style({
                height: '0'
            })),
            state('expanded', style({
                height: '*'
            })),
            transition('collapsed <=> expanded', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
        ])
    ]
})
export class AppMenuitemComponent implements OnInit{
    @Input() item:any;

    @Input() index!: number;
    @Input() @HostBinding('class.layout-root-menuitem') root!: boolean;
    @Input() parentKey!: string;
    key: string = "";
    active:boolean = false;

    constructor(private cd: ChangeDetectorRef, public router: Router){
        
    }

    ngOnInit(): void {
        this.key = this.parentKey ? this.parentKey + '-' + this.index : String(this.index);

        if (this.item.routerLink) {
            this.updateActiveStateFromRoute();
        }
        this.cd.detectChanges();
    }

    updateActiveStateFromRoute() {
        let activeRoute = this.router.isActive(this.item.routerLink[0], { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' });
    }

    itemClick(event: Event) {
        // avoid processing disabled items
        if (this.item.disabled) {
            event.preventDefault();
            return;
        }

        // execute command
        if (this.item.command) {
            this.item.command({ originalEvent: event, item: this.item });
        }

        // toggle active state
        if (this.item.items) {
            this.active = !this.active;
        }
    }

    get submenuAnimation() {
        return this.root ? 'expanded' : (this.active ? 'expanded' : 'collapsed');
    }
    
}