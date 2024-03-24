import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LayoutService } from '../services/layout.service';
import { Common } from '../classes/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends Common implements OnInit, AfterViewInit{
    sidebarVisible:boolean = false;
    model: any[] = [];

    constructor(private svc:LayoutService,route:Router){
        super(route)
    }

    ngAfterViewInit(): void {
        this.route.navigate([this.modulePath+'/dashboard']);
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
                    //{ label: 'Configurações', icon: 'pi pi-fw pi-settings icon-small', routerLink: [this.modulePath+'/configurations']},
                    { label: 'Entidades', icon: 'pi pi-fw pi-entities icon-small', routerLink: [this.modulePath+'/entities'] },
                    { label: 'Produtos', icon: 'pi pi-fw pi-products icon-small', routerLink: [this.modulePath+'/products'] },
                    { label: 'Usuários', icon: 'pi pi-fw pi-users icon-small', routerLink: [this.modulePath+'/users'] }
                ]
            },
            {
                label: 'B2B - Salesforce',
                items: [
                    //{ label: 'Configurações', icon: 'pi pi-fw pi-settings icon-small', routerLink: [this.modulePath+'/b2b/configurations'], queryParams: { place: this.modules.B2B } },
                    { label: 'Marcas', icon: 'pi pi-fw pi-marks icon-small', routerLink: [this.modulePath+'/b2b/brands'] },
                    { label: 'Categorias/Cordenados', icon: 'pi pi-fw pi-category icon-small', routerLink: [this.modulePath+'/b2b/categories'] },
                    { label: 'Coleções', icon: 'pi pi-fw pi-collection icon-small', routerLink: [this.modulePath+'/b2b/collections'] },
                    { label: 'Modelos', icon: 'pi pi-fw pi-models icon-small', routerLink: [this.modulePath+'/b2b/models'] },
                    { label: 'Tipos de Produtos', icon: 'pi pi-fw pi-prod-type icon-small', routerLink: [this.modulePath+'/b2b/product-types'] },
                    { label: 'Cond. de Pagamento',icon:'pi pi-fw pi-payment icon-small', routerLink: [this.modulePath+'/b2b/payment-condition']},
                    { separator : 'separator' },
                    { label: 'Grupos de clientes', icon: 'pi pi-fw pi-user-group icon-small', routerLink: [this.modulePath+'/b2b/customer-groups'] },
                    { label: 'Grades de Produtos', icon: 'pi pi-fw pi-prod-grid icon-small', routerLink: [this.modulePath+'/b2b/product-grids'] },
                    { label: 'Tabelas de Preços', icon: 'pi pi-fw pi-price-table icon-small', routerLink: [this.modulePath+'/b2b/table-prices'] },
                    { label: 'Tradução de Cores', icon: 'pi pi-fw pi-colors icon-small', routerLink: [this.modulePath+'/b2b/colors'] },
                    { label: 'Tradução de Tamanhos', icon: 'pi pi-fw pi-sizes icon-small', routerLink: [this.modulePath+'/b2b/sizes'] },
                    // { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
                ]
            },
            {
                label: 'CRM - Funis',
                items: [
                    // { label: 'Configurações', icon: 'pi pi-fw pi-settings icon-small', routerLink: [this.modulePath+'/crm/configurations'], queryParams: { place: this.modules.CRM }  },
                    { label: 'Cadastro de Funis', icon: 'pi pi-fw pi-funnel icon-small', routerLink: [this.modulePath+'/crm/funnels'] },
                    { label: 'Cadastro de Estágios', icon: 'pi pi-fw pi-stages icon-small', routerLink: [this.modulePath+'/crm/funnel-stages']},
                    // { label: 'Campos dinâmicos', icon: 'pi pi-fw pi-fields', routerLink: ['/uikit/misc'] }
                ]
            },
            {
                label: 'FPR - Devoluções',
                items: [
                    //{ label: 'Configurações', icon: 'pi pi-fw pi-settings icon-small', routerLink: [this.modulePath+'/fpr/configurations'], queryParams: { place: this.modules.FPR }  },
                    { label: 'Etapas', icon: 'pi pi-fw pi-steps icon-small', routerLink: [this.modulePath+'/fpr/steps'] },
                    { label: 'Motivos', icon: 'pi pi-fw pi-reasons icon-small', routerLink:[this.modulePath+'/fpr/reasons']}
                ]
            },
            { 
                label: 'SCM - Calendário',
                items:[
                    //{ label: 'Configurações', icon: 'pi pi-fw pi-settings icon-small', routerLink:[this.modulePath+'/scm/configurations'], queryParams: { place: this.modules.SCM }  },
                    { label: 'Tipos de Eventos', icon: 'pi pi-fw pi-events icon-small', routerLink:[this.modulePath+'/scm/event-types'] }
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
