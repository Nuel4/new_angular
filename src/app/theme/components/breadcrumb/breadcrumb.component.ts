import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { ActivatedRoute, Router, ActivatedRouteSnapshot, UrlSegment, NavigationEnd } from "@angular/router";
import { Title } from '@angular/platform-browser';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { NavbarService } from '../../../services/navbar.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConsultationTemplateComponent } from '../../../../app/pages/chart/progressnote/consultation-template/consultation-template.component';

@Component({
    selector: 'app-breadcrumb',
    styleUrls: ['./breadcrumb.component.scss'],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './breadcrumb.component.html',
    providers: [MenuService]
})
export class BreadcrumbComponent {
    workSpaceList: any;
    schedulingList: any;
    billinglist: any;
    @HostListener('window:resize', ['$event'])
    onResize(){
        this.width = window.innerWidth;
        this.height = window.innerHeight;
    }
    public settings: Settings;
    public pageTitle: string;
    menuItems: any = [];
    showHorizontalMenu: any = [];
    public breadcrumbs: {
        name: string;
        url: string
    }[] = [];
    Title: string
    arrowLeft: boolean = false;
    arrowRight: boolean = false;
    chartsList: any;
    width: any;
    height: any;
    constructor(public appSettings: AppSettings,
        public router: Router,
        public activatedRoute: ActivatedRoute,
        public title: Title,
        private modalService: NgbModal,
        public menuService: MenuService, private nav: NavbarService,private authStore: AuthenticationStore) {
            this.onResize();
        // console.log('activeurl', this.router.url)
        this.settings = this.appSettings.settings;        
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.breadcrumbs = [];
                this.parseRoute(this.router.routerState.snapshot.root);
                this.pageTitle = "";
                this.breadcrumbs.forEach(breadcrumb => {
                    this.pageTitle += ' > ' + breadcrumb.name;
                })
                this.menuItems = this.menuService.getVerticalMenuItems();
                if(this.breadcrumbs.length > 0) {
                if (this.breadcrumbs[0].name == "Workspace") {
                    this.Title = "Workspace"
                    if(this.width > 1024){
                    this.arrowLeft = false;
                    this.arrowRight = false;
                    }
                    this.showHorizontalMenu = [];
                    this.menuItems.forEach(items => {
                        if (items.parentId == 1) {
                            items['isactive'] = true
                            this.showHorizontalMenu.push(items);
                        }
                    });
                    this.workSpaceList = this.showHorizontalMenu
                    // if(this.width === 1024){
                    //     this.arrowRight= true;
                    //     this.arrowLeft=false;
                    //     this.showHorizontalMenu = [];
                    //     this.showHorizontalMenu=this.workSpaceList.filter((item,id) => item.id <= 8)

                    // }
                    if(this.width === 1024){
                    if(this.router.url === '/pages/workspace') {
                        this.onLeftClick();
                    }
                    if(this.arrowRight === false){
                        this.onRightClick()
                    }
                    else {
                        this.onLeftClick();
                    }
                }
                if(this.width === 768){
                    if(this.router.url === '/pages/workspace') {
                        this.onLeftClick();
                    }
                     if(this.arrowRight === false){
                         this.onRightClick()
                    }
                    else {
                        this.onLeftClick()
                    }
                }
                }
                if (this.breadcrumbs[0].name == "Scheduling") {
                    this.Title = "Scheduling"
                    if(this.width > 1024){
                    this.arrowLeft = false;
                    this.arrowRight = false;
                    }
                    this.showHorizontalMenu = [];
                    this.menuItems.forEach(items => {
                        if (items.parentId == 12) {
                            items['isactive'] = true
                            this.showHorizontalMenu.push(items);
                        }
                    });
                    this.schedulingList = this.showHorizontalMenu;
                    if(this.width === 1024){
                        if(this.router.url === '/pages/scheduling') {
                            this.onLeftClick();
                        }
                        if(this.arrowRight === false){
                            this.onRightClick()
                        }
                        else {
                            this.onLeftClick();
                        }
                    }
                    if(this.width === 768){
                        if(this.router.url === '/pages/scheduling') {
                            this.onLeftClick();
                        }
                         if(this.arrowRight === false){
                             this.onRightClick()
                        }
                        else {
                            this.onLeftClick()
                        }
                    }
                }
                if (this.breadcrumbs[0].name == "Charts") {
                    this.Title = "Charts"
                    this.showHorizontalMenu = [];
                    this.menuItems.forEach(items => {
                        if (items.parentId == 24) {
                            if (authStore.PatientDetail) {
                                let temp = authStore.PatientDetail
                                if (temp.PatientStatus === "Inactive") {
                                    if((items.title === "Graphs")||(items.title === "Documents")||(items.title === "Letters")||(items.title === "Messages")||(items.title === "Sketch Pad")||(items.title === "All Charts Print"))
                                    { items['isactive'] = false }
                                    else {items['isactive'] = false }
                                } else { items['isactive'] = true }
                            } else { items['isactive'] = false }
                            this.showHorizontalMenu.push(items);
                        }
                    });
                    this.chartsList = this.showHorizontalMenu;
                    // if(this.width === 1366){
                    if(this.router.url === '/pages/chart') {
                        this.onLeftClick();
                    } else if(this.arrowRight === false){
                        this.onRightClick()
                    } else {
                        this.onLeftClick();
                    }
                // }
                if(this.width === 1024){
                    if(this.router.url === '/pages/chart') {
                        this.onLeftClick();
                    } else if(this.arrowRight === false){
                        this.onRightClick()
                    } else {
                        this.onLeftClick();
                    }
                }
                if(this.width === 768){
                    if(this.router.url === '/pages/chart') {
                        this.onLeftClick();
                    } else if(this.arrowRight === false){
                        this.onRightClick()
                    } else {
                        this.onLeftClick();
                    }
                }
                }
                if (this.breadcrumbs[0].name == "Billing") {
                    this.Title = "Billing"
                    if(this.width > 1024){
                    this.arrowLeft = false;
                    this.arrowRight = false;
                    }
                    this.showHorizontalMenu = [];
                    this.menuItems.forEach(items => {
                        if (items.parentId == 45) {
                            items['isactive'] = true
                            this.showHorizontalMenu.push(items);
                        }
                    });
                    this.billinglist = this.showHorizontalMenu;
                    if(this.width === 1024){
                        if(this.router.url === '/pages/billing') {
                            this.onLeftClick();
                        }
                        if(this.arrowRight === false){
                            this.onRightClick()
                        }
                        else {
                            this.onLeftClick();
                        }
                    }
                    if(this.width === 768){
                        if(this.router.url === '/pages/billing') {
                            this.onLeftClick();
                        }
                         if(this.arrowRight === false){
                             this.onRightClick()
                        }
                        else {
                            this.onLeftClick()
                        }
                    }
                }
                if (this.breadcrumbs[0].name == "Orders") {
                    this.Title = "Orders"
                    this.arrowLeft = false;
                    this.arrowRight = false;
                    this.showHorizontalMenu = [];
                    this.menuItems.forEach(items => {
                        if (items.parentId == 60) {
                            items['isactive'] = true
                            this.showHorizontalMenu.push(items);
                        }
                    });
                    // console.log('showHorizontalMenu', this.showHorizontalMenu)
                }
                if (this.breadcrumbs[0].name == "Practice") {
                    this.Title = "Practice"
                    this.arrowLeft = false;
                    this.arrowRight = false;
                    this.showHorizontalMenu = [];
                    this.menuItems.forEach(items => {
                        if (items.parentId == 72) {
                            items['isactive'] = true
                            this.showHorizontalMenu.push(items);
                        }
                    });
                    // console.log('showHorizontalMenu', this.showHorizontalMenu)
                }
                if (this.breadcrumbs[0].name == "Reports") {
                    this.Title = "Reports"
                    this.arrowLeft = false;
                    this.arrowRight = false;
                    this.showHorizontalMenu = [];
                    this.menuItems.forEach(items => {
                        if (items.parentId == 121) {
                            items['isactive'] = true
                            this.showHorizontalMenu.push(items);
                        }
                    });
                    // console.log('showHorizontalMenu', this.showHorizontalMenu)
                }
                if (this.breadcrumbs[0].name == "Scanning") {
                    this.Title = "Scanning"
                    this.arrowLeft = false;
                    this.arrowRight = false;
                    this.showHorizontalMenu = [];
                    this.menuItems.forEach(items => {
                        if (items.parentId == 131) {
                            items['isactive'] = true
                            this.showHorizontalMenu.push(items);
                        }
                    });
                    // console.log('showHorizontalMenu', this.showHorizontalMenu)
                }
                if (this.breadcrumbs[0].name == "Inventory") {
                    this.Title = "Inventory"
                    this.arrowLeft = false;
                    this.arrowRight = false;
                    this.showHorizontalMenu = [];
                    this.menuItems.forEach(items => {
                        if (items.parentId == 136) {
                            items['isactive'] = true
                            this.showHorizontalMenu.push(items);
                        }
                    });
                    // console.log('showHorizontalMenu', this.showHorizontalMenu)
                }
                if (this.breadcrumbs[0].name == "Help") {
                    this.Title = "Help"
                    this.arrowLeft = false;
                    this.arrowRight = false;
                    this.showHorizontalMenu = [];
                    this.menuItems.forEach(items => {
                        if (items.parentId == 145) {
                            items['isactive'] = true
                            this.showHorizontalMenu.push(items);
                        }
                    });
                    // console.log('showHorizontalMenu', this.showHorizontalMenu)
                }
                if (this.breadcrumbs[0].name == "Profile") {
                    this.Title = "Profile"
                    this.arrowLeft = false;
                    this.arrowRight = false;
                    this.showHorizontalMenu = [];
                    this.menuItems.forEach(items => {
                        if (items.parentId == 144) {
                            items['isactive'] = true
                            this.showHorizontalMenu.push(items);
                        }
                    });
                   
                }
            }
                this.title.setTitle(this.settings.name + this.pageTitle);
            }
        })
    }

    parseRoute(node: ActivatedRouteSnapshot) {
        if (node.data['breadcrumb']) {
            if (node.url.length) {
                let urlSegments: UrlSegment[] = [];
                node.pathFromRoot.forEach(routerState => {
                    urlSegments = urlSegments.concat(routerState.url);
                });
                let url = urlSegments.map(urlSegment => {
                    return urlSegment.path;
                }).join('/');
                this.breadcrumbs.push({
                    name: node.data['breadcrumb'],
                    url: '/' + url
                })
            }
        }
        if (node.firstChild) {
            this.parseRoute(node.firstChild);
        }
    }

    public closeSubMenus() {
        let menu = document.querySelector("#menu0");
        if (menu) {
            for (let i = 0; i < menu.children.length; i++) {
                let child = menu.children[i].children[1];
                if (child) {
                    if (child.classList.contains('show')) {
                        child.classList.remove('show');
                        menu.children[i].children[0].classList.add('collapsed');
                    }
                }
            }
        }
    }
    onLeftClick(){
        if(this.breadcrumbs[0].name == "Charts"){
            this.arrowRight = true;
            this.arrowLeft = false;
            // if(this.width === 1366){
        this.showHorizontalMenu = []
        this.showHorizontalMenu = this.chartsList.filter((item,id) => item.id <= 35)
            // }
            if(this.width === 1024){
                this.showHorizontalMenu = [];
                this.showHorizontalMenu = this.chartsList.filter((item,id) => item.id <= 35)
            }
        if(this.width === 768){

            this.showHorizontalMenu = [];
            this.showHorizontalMenu = this.chartsList.filter((item,id) => item.id <= 33)
        }
        }
        if(this.breadcrumbs[0].name == "Workspace"){
            this.arrowRight= true;
            this.arrowLeft=false;
            if(this.width === 1024){
                this.showHorizontalMenu = [];
                this.showHorizontalMenu=this.workSpaceList.filter((item,id) => item.id <= 8)
            }
            if(this.width === 768){
                this.showHorizontalMenu = [];
                this.showHorizontalMenu=this.workSpaceList.filter((item,id) => item.id <= 6)
            }
        }
        if(this.breadcrumbs[0].name === "Scheduling"){
            this.arrowRight = true;
            this.arrowLeft = false;
            if(this.width === 1024){
                this.showHorizontalMenu =[];
                this.showHorizontalMenu = this.schedulingList.filter((item,id) => item.id <= 19)
            }
            if(this.width === 768){
                this.showHorizontalMenu = [];
                this.showHorizontalMenu = this.schedulingList.filter((item,id) => item.id <= 17)
            }
        }
        if(this.breadcrumbs[0].name === "Billing"){
            this.arrowRight = true;
            this.arrowLeft = false;
            if(this.width === 1024){
            this.showHorizontalMenu = [];
            this.showHorizontalMenu = this.billinglist.filter((item,id) => item.id <= 52)
            }
            if(this.width === 768){
                this.showHorizontalMenu = [];
                this.showHorizontalMenu = this.billinglist.filter((item,id) => item.id <= 50)
            }
        }
    }
    onRightClick(){
        if(this.breadcrumbs[0].name == "Charts"){
        this.arrowLeft = true;
        this.arrowRight = false;
        // if(this.width === 1366 ){
        this.showHorizontalMenu = []
        this.showHorizontalMenu = this.chartsList.filter(item => item.id >= 36);
    // }
        if(this.width === 1024){
            this.showHorizontalMenu = [];
            this.showHorizontalMenu = this.chartsList.filter(item => item.id >=36)
        }
        if(this.width === 768){
            this.showHorizontalMenu =[];
            this.showHorizontalMenu = this.chartsList.filter(item => item.id >= 34)
        }
        }
        if(this.breadcrumbs[0].name == "Workspace"){
            this.arrowRight= false;
            this.arrowLeft=true;
            if(this.width === 1024){
            this.showHorizontalMenu = [];
            this.showHorizontalMenu=this.workSpaceList.filter((item,id) => item.id >= 9)
            }
            if(this.width === 768){
                this.showHorizontalMenu = [];
                this.showHorizontalMenu=this.workSpaceList.filter((item,id) => item.id >= 7)
                }
        }
        if(this.breadcrumbs[0].name === "Scheduling"){
            this.arrowLeft = true;
            this.arrowRight = false;
            if(this.width === 1024){
                this.showHorizontalMenu =[];
                this.showHorizontalMenu = this.schedulingList.filter((item,id) => item.id >= 20)
            }
            if(this.width === 768){
                this.showHorizontalMenu = [];
                this.showHorizontalMenu = this.schedulingList.filter((item,id) => item.id >= 18)
            }
        }
        if(this.breadcrumbs[0].name === "Billing"){
            this.arrowLeft = true;
            this.arrowRight = false;
            if(this.width === 1024){
            this.showHorizontalMenu = [];
            this.showHorizontalMenu = this.billinglist.filter((item,id) => item.id >= 53)
            }
            if(this.width === 768){
                this.showHorizontalMenu = [];
                this.showHorizontalMenu = this.billinglist.filter((item,id) => item.id >= 51)
            }
        }
    }
    openModal(module) {
        if (module.isactive) {
            const modalRef = this.modalService.open(ConsultationTemplateComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
            modalRef.componentInstance.name = 'true';
        }
    }

    getColor(value){
        if(!value.isactive){
            return 'gray';
        }
       
    }
}













// import { Component, ViewEncapsulation } from '@angular/core';

// import { AppState } from "../../../app.state";
import { AuthenticationStore } from './../../../authentication/authentication-store';
import { thresholdFreedmanDiaconis } from 'd3';

// @Component({
//     selector: 'az-breadcrumb',
//     encapsulation: ViewEncapsulation.None,
//     styleUrls: ['./breadcrumb.component.scss'],
//     templateUrl: './breadcrumb.component.html'
// })

// export class BreadcrumbComponent {

//     public activePageTitle:string = '';

//     constructor(private _state:AppState){
//         this._state.subscribe('menu.activeLink', (activeLink) => {
//             if (activeLink) {
//                 this.activePageTitle = activeLink;
//             }
//         });
//     }

//     public ngOnInit():void {
//         if (!this.activePageTitle) {
//             this.activePageTitle = 'dashboard';
//         }

//     }

// }