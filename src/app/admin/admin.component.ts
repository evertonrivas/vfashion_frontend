import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { Common } from '../classes/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends Common implements OnInit{
    sidebarVisible:boolean = false;
    model: any[] = [];

    constructor(private svc:LayoutService,route:Router){
        super(route)
    }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-dashboard icon-small', routerLink: [this.modulePath+'/dashboard'] }
                ]
            },
            {
                label: 'Sistema',
                items: [
                    { label: 'Configurações', icon: 'pi pi-fw pi-settings icon-small', routerLink: [this.modulePath+'/configurations'] },
                    { label: 'Entidades', icon: 'pi pi-fw pi-entities icon-small', routerLink: [this.modulePath+'/entities'] },
                    { label: 'Produtos', icon: 'pi pi-fw pi-products icon-small', routerLink: [this.modulePath+'/products'] },
                    { label: 'Usuários', icon: 'pi pi-fw pi-users icon-small', routerLink: [this.modulePath+'/users'] }
                ]
            },
            {
                label: 'B2B - Salesforce',
                items: [
                    { label: 'Configurações', icon: 'pi pi-fw pi-settings icon-small', routerLink: ['/b2b/configurations'] },
                    { label: 'Grupos de clientes', icon: 'pi pi-fw pi-user-group icon-small', routerLink: ['/b2b/customer-group'] },
                    { label: 'Marcas', icon: 'pi pi-fw pi-marks icon-small', routerLink: ['/b2b/brands'] },
                    { label: 'Categorias/Cordenados', icon: 'pi pi-fw pi-category icon-small', routerLink: ['/bwb/category'] },
                    { label: 'Coleções', icon: 'pi pi-fw pi-collection icon-small', routerLink: ['/b2b/collection'] },
                    { label: 'Modelos', icon: 'pi pi-fw pi-models icon-small', routerLink: ['/b2b/models'] },
                    { label: 'Tipos de Produtos', icon: 'pi pi-fw pi-prod-type icon-small', routerLink: ['/b2b/product-type'] },
                    { separator : 'separator' },
                    { label: 'Grades de Produtos', icon: 'pi pi-fw pi-prod-grid icon-small', routerLink: ['/b2b/product-grid'] },
                    { label: 'Tabelas de Preços', icon: 'pi pi-fw pi-price-table icon-small', routerLink: ['/b2b/table-price'] },
                    { label: 'Tradução de Cores', icon: 'pi pi-fw pi-colors icon-small', routerLink: ['/b2b/colors'] },
                    { label: 'Tradução de Tamanhos', icon: 'pi pi-fw pi-sizes icon-small', routerLink: ['/b2b/sizes'] },
                    // { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                ]
            },
            {
                label: 'CRM - Funis',
                items: [
                    { label: 'Configurações', icon: 'pi pi-fw pi-settings icon-small', routerLink: ['/crm/configurations'] },
                    { label: 'Cadastro de Funis', icon: 'pi pi-fw pi-funnel icon-small', routerLink: ['/crm/funnels'] },
                    { label: 'Cadastro de Estágios', icon: 'pi pi-fw pi-stages icon-small', routerLik: ['crm/funnel-stages']},
                    // { label: 'Campos dinâmicos', icon: 'pi pi-fw pi-fields', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'FPR - Devoluções',
                items: [
                    { label: 'Configurações', icon: 'pi pi-fw pi-settings icon-small', routerLink: ['/fpr/configurations'] },
                    { label: 'Etapas', icon: 'pi pi-fw pi-steps icon-small', routerLink: ['/fpr/steps'] }
                ]
            },
            { 
                label: 'SCM - Calendário',
                items:[
                    { label: 'Configurações', icon: 'pi pi-fw pi-settings icon-small', routerLink:['/scm/configurations'] },
                    { label: 'Tipos de Eventos', icon: 'pi pi-fw pi-events icon-small', routerLink:['/scm/event-types'] }
                ]
            },
            // NÃO APAGAR, ISSO SERAH UTILIZADO NO FUTURO
            // {
            //     label: 'MPG - Marketing',
            //     items:[
            //         { label: 'Configurações', icon: 'pi pi-fw pi-settings icon-small', routerLink:['/mpg/configurations'] },
            //         { label: 'Fornecedores', icon: 'pi pi-fw pi-supplier icon-small', routerLink:['/mpg/suppliers'] }
            //     ]
            // }


            // {
            //     label: 'SCM - Calendário',
            //     icon: 'pi pi-fw pi-briefcase',
            //     items: [
            //         {
            //             label: 'Landing',
            //             icon: 'pi pi-fw pi-globe',
            //             routerLink: ['/landing']
            //         },
            //         {
            //             label: 'Auth',
            //             icon: 'pi pi-fw pi-user',
            //             items: [
            //                 {
            //                     label: 'Login',
            //                     icon: 'pi pi-fw pi-sign-in',
            //                     routerLink: ['/auth/login']
            //                 },
            //                 {
            //                     label: 'Error',
            //                     icon: 'pi pi-fw pi-times-circle',
            //                     routerLink: ['/auth/error']
            //                 },
            //                 {
            //                     label: 'Access Denied',
            //                     icon: 'pi pi-fw pi-lock',
            //                     routerLink: ['/auth/access']
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Crud',
            //             icon: 'pi pi-fw pi-pencil',
            //             routerLink: ['/pages/crud']
            //         },
            //         {
            //             label: 'Timeline',
            //             icon: 'pi pi-fw pi-calendar',
            //             routerLink: ['/pages/timeline']
            //         },
            //         {
            //             label: 'Not Found',
            //             icon: 'pi pi-fw pi-exclamation-circle',
            //             routerLink: ['/notfound']
            //         },
            //         {
            //             label: 'Empty',
            //             icon: 'pi pi-fw pi-circle-off',
            //             routerLink: ['/pages/empty']
            //         },
            //     ]
            // },
            // {
            //     label: 'Hierarchy',
            //     items: [
            //         {
            //             label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //             ]
            //         }
            //     ]
            // },
            // {
            //     label: 'Get Started',
            //     items: [
            //         {
            //             label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
            //         },
            //         {
            //             label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
            //         }
            //     ]
            // }
        ];

        this.svc.menuOpen$.subscribe({
            next: () =>{
                this.sidebarVisible = !this.sidebarVisible;
            }
        });
    }
}
