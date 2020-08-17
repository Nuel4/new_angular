import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppSettings } from '../app.settings';
import { Settings } from '../app.settings.model';
//Broadcaster
import { Broadcaster } from '../broadcast/broadcaster';
import { Services } from './services/services';
import { NavbarService } from '../services/navbar.service'
declare var jQuery: any;
@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss'],
    providers: [Services],
    encapsulation: ViewEncapsulation.None
})
export class PagesComponent implements OnInit {
    public showMenu: boolean = false;
    public showSetting: boolean = false;
    public menus = ['vertical', 'horizontal'];
    public menuOption: string;
    public menuTypes = ['default', 'compact', 'mini'];
    public menuTypeOption: string;

    public settings: Settings;
    constructor(public appSettings: AppSettings, private nav: NavbarService, public router: Router, private broadcaster: Broadcaster, private serv: Services) {
        this.settings = this.appSettings.settings;
        if (sessionStorage["skin"]) {
            this.settings.theme.skin = sessionStorage["skin"];
        }
        this.broadcaster.on<string>('MyEvent')
            .subscribe(message => {
            });

    }

    ngOnInit() {
        if (window.innerWidth <= 768) {
            this.settings.theme.showMenu = false;
            this.settings.theme.sideChatIsHoverable = false;
        }
        this.showMenu = this.settings.theme.showMenu;
        this.menuOption = this.settings.theme.menu;
        this.menuTypeOption = this.settings.theme.menuType;
    }

    public chooseMenu(menu) {
        this.settings.theme.menu = menu;
        this.router.navigate(['/']);
    }

    public chooseMenuType(menuType) {
        this.settings.theme.menuType = menuType;
        if (menuType == 'mini') {
            jQuery('.menu-item-link').tooltip('enable');
        } else {
            jQuery('.menu-item-link').tooltip('disable');
        }
    }

    public changeTheme(theme) {
        this.settings.theme.skin = theme;
        sessionStorage["skin"] = theme;
    }

    ngAfterViewInit() {
        document.getElementById('preloader').classList.add('hide');
    }


    @HostListener('window:resize')
    public onWindowResize(): void {
        let showMenu = !this._showMenu();

        if (this.showMenu !== showMenu) {
            this.showMenuStateChange(showMenu);
        }
        this.showMenu = showMenu;
    }

    public showMenuStateChange(showMenu: boolean): void {
        this.settings.theme.showMenu = showMenu;
    }

    private _showMenu(): boolean {
        return window.innerWidth <= 768;
    }


}
