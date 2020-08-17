import { Component, OnInit, ViewEncapsulation, HostListener } from '@angular/core';
import { trigger,  state,  style, transition, animate } from '@angular/animations';
import { AppSettings } from '../../../app.settings';
import { Settings } from '../../../app.settings.model';
import { MenuService } from '../menu/menu.service';
import { Router } from '@angular/router';
import { AppointmentdetailsComponent } from '../applications/waitingroom/appointmentdetails/appointmentdetails.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PatientactionComponent } from '../applications/patientaction/patientaction.component';
import { NavbarService} from '../../../services/navbar.service'
import { PatientSummaryComponent } from './../applications/patient-summary/patient-summary.component';
import { AuthenticationStore } from './../../../authentication/authentication-store';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ MenuService ],
  animations: [
    trigger('showInfo', [
      state('1' , style({ transform: 'rotate(180deg)' })),
      state('0', style({ transform: 'rotate(0deg)' })),
      transition('1 => 0', animate('400ms')),
      transition('0 => 1', animate('400ms'))
    ])
  ]
})
export class HeaderComponent implements OnInit {
  public showHorizontalMenu:boolean = true; 
  public showInfoContent:boolean = false;
  public settings: Settings;
  public menuItems:Array<any>;
  favoriteOptions: any = [];
  SelectedDetailsList: any;
  searchInput: any;
  constructor(private router: Router,public appSettings: AppSettings, public menuService: MenuService,
    private modalService: NgbModal, private nav : NavbarService, private AuthStore: AuthenticationStore) {
      this.settings = this.appSettings.settings;
      this.menuItems = this.menuService.getHorizontalMenuItems();
      this.menuItems = this.menuService.getVerticalMenuItems().filter(menu => menu.routerLink != null || menu.href !=null);   
      this.menuItems.forEach(item=>{
        let menu = { 
          id: item.id, 
          name: item.title, 
          routerLink: item.routerLink, 
          href: item.href,
          icon: item.icon,
          target: item.target
        }
        this.favoriteOptions.push(menu);
      })
  }
  
  ngOnInit() {
    if(window.innerWidth <= 768) 
      this.showHorizontalMenu = false;
  }

  goWaitingRoom() {
    // this.router.navigate(['waitingroom']);
    const modalRef = this.modalService.open(AppointmentdetailsComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
  }

  goPatientAction() {
    const modalRef = this.modalService.open(PatientactionComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
  }

  goPatientSummary() {
    console.log("summ")
    const modalRef = this.modalService.open(PatientSummaryComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' });
    modalRef.componentInstance.name = 'true';
  }

  public closeSubMenus(){
    let menu = document.querySelector("#menu0"); 
    if(menu){
      for (let i = 0; i < menu.children.length; i++) {
          let child = menu.children[i].children[1];
          if(child){          
              if(child.classList.contains('show')){            
                child.classList.remove('show');
                menu.children[i].children[0].classList.add('collapsed'); 
              }             
          }
      }
    }
  }

  onSignOut() {
    sessionStorage.setItem("token", null);
    sessionStorage.setItem("LoggedIn", null);
    sessionStorage.setItem("UserDetail", null);
    sessionStorage.setItem("TaxonomyItemDetail", null);
    sessionStorage.setItem("PatientDetail", null);
    sessionStorage.setItem("SearchedPatientList", null);
    sessionStorage.setItem("AuthenticateAsync",null);
    this.AuthStore.UserDetail = null;
    this.AuthStore.LoggedIn = null;
    this.AuthStore.token = null;
    this.AuthStore.TaxonomyItemDetail = null;
    this.AuthStore.SearchedPatientList = null;
    this.AuthStore.AuthenticateAsync = null;
    this.router.navigate(['login'], {skipLocationChange: true});
  }
  LoadDetails(SelectedDetails) {
    let Detail;
    if (!SelectedDetails) {
      Detail = {
        search: "a"
      }
    }
    else {
      Detail = {
        search: SelectedDetails
      }
    }
    this.favoriteOptions=this.SelectedDetailsList
  }
  inputChanages(event){
    console.log(event)
    this.searchInput = event;
  }
  searchingModules(){
    this.favoriteOptions.forEach(item => {
      if(this.searchInput === item.name){
        this.router.navigate([item.routerLink], { skipLocationChange: true });
      }
    })
    this.searchInput = ''
  }
  @HostListener('window:resize')
  public onWindowResize():void {
     if(window.innerWidth <= 768){
        this.showHorizontalMenu = false;
     }      
      else{
        this.showHorizontalMenu = true;
      }
  }
  
}
