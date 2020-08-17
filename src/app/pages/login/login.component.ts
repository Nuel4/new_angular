import { ProgressnoteService } from './../../services/chart/progressnote.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { HttpWrapperService, GlobalState, Global } from '../../core'
import { AuthenticationStore, AuthenticationService } from '../../authentication'
import { UserProfileService } from '../../services/userprofile/userprofile.service'
import { PracticeService } from '../../services/practice/practice.service'
import { TaxonomyService } from '../../services/inventory/taxonomy/taxonomy.service';
import { CptDisclaimerComponent } from './cpt-disclaimer/cpt-disclaimer.component';
import {version } from '../../../../package.json'
// import  version  from '../../../../package.json';
import { UserIdleService } from 'angular-user-idle';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
    // public router: Router;
    public form: FormGroup;
    public email: AbstractControl;
    public password: AbstractControl;
    public returnUrl: string;
    private OptionsList: any
    errorMessage: string;
    appVersion: any;
today = new Date
    constructor(private router: Router, fb: FormBuilder,
        private activeRoute: ActivatedRoute,
        private authService: AuthenticationService,
        private userProfileService: UserProfileService,
        private practiceService: PracticeService,
        private authStore: AuthenticationStore,
        private taxonomyService: TaxonomyService,
        private modalService: NgbModal, 
        private userIdle: UserIdleService,
        private activeModal: NgbActiveModal,
        private state: GlobalState) {
        this.form = fb.group({
            'email': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            // CustomValidators.email
            'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
        });

        this.email = this.form.controls['email'];
        this.password = this.form.controls['password'];
    }

    ngOnInit() {
        // get return url from route parameters or default to 'pages/dashboard'
        // this.returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || 'pages/workspace';
        this.appVersion = version;
        //Start watching for user inactivity.
  this.userIdle.startWatching();
    
  // Start watching when user idle is starting.
  this.userIdle.onTimerStart().subscribe(() => {
      this.userIdle.resetTimer();
      this.userIdle.ping$.subscribe(() => {});
      this.activeModal.dismiss('Cross click');
      this.signOut();
  });
    }


    signOut() {
        sessionStorage.setItem("token", null);
        sessionStorage.setItem("LoggedIn", null);
        sessionStorage.setItem("UserDetail", null);
        sessionStorage.setItem("TaxonomyItemDetail", null);
        sessionStorage.setItem("AuthenticateAsync",null)
        this.authStore.UserDetail = null;
        this.authStore.LoggedIn = null;
        this.authStore.token = null;
        this.authStore.TaxonomyItemDetail = null;
        this.authStore.SearchedPatientList = null;
        this.authStore.AuthenticateAsync = null;
        this.router.navigate(['/login']);
    }

    public onSubmit(values: Object): void {
        if (this.form.valid) {
            this.authService.getToken({ email: this.email.value, password: this.password.value })
                .subscribe(token => {
                    
                    if (token.access_token != null) {
                        this.authStore.token = token.access_token;
                        this.authStore.LoggedIn = true;
                        sessionStorage.setItem('token', token.access_token);
                        sessionStorage.setItem('LoggedIn', 'true');
                        const appUserId = token.AppUser.ApplicationUserId
                        // TODO: get user details and user profile info
                        // console.log(appUserId)
                        this.userProfileService.GetAppUserInfo(appUserId).subscribe( result => {
console.log("token authentication", result)
if(!result.EulaAccepted){
    setTimeout(() => {                                        
        const modRef =  this.modalService.open(CptDisclaimerComponent, { centered: true, size: 'lg', windowClass: 'modelStyle', backdrop : 'static' });
         modRef.componentInstance.cptDisclaimer = true;
     },100)
} else {
    setTimeout(() => {                                        
        const modRef =  this.modalService.open(CptDisclaimerComponent, { centered: true, size: 'lg', windowClass: 'modelStyle', backdrop : 'static' });
         modRef.componentInstance.newUser = false;
         modRef.componentInstance.appUserId = appUserId;
     },100)
}
                        },
                        error => {
                            this.errorMessage = <any>error;
                        })
                        
                        this.userProfileService.getUserByApplicationUserId(appUserId)
                            .subscribe(user => {
                                if (!user.Inactive) {
                                    // console.log(user)
                                    this.state.notifyDataChanged(Global.LoggedIn_User, user);
                                    this.authStore.UserDetail = user;
                                    sessionStorage.setItem('UserDetail', JSON.stringify(user));
                                    if (user.PreferredPhysician1 !== null) {
                                        this.authService.getPhysiciansById(user.PreferredPhysician1).subscribe(phy => {
                                            console.log('Physician Details',phy)
                                            this.authStore.PhysicianDetail = phy[0]
                                            sessionStorage.setItem('PhysicianDetail', JSON.stringify(phy));
                                        })
                                    }
                                    else if (user.PreferredPhysician2 !== null) {
                                        this.authService.getPhysiciansById(user.PreferredPhysician2).subscribe(phy => {
                                            console.log('Physician Details',phy)
                                            this.authStore.PhysicianDetail = phy[0]
                                            sessionStorage.setItem('PhysicianDetail', JSON.stringify(phy));
                                        })
                                    }
                                    else if (user.PreferredPhysician3 !== null) {
                                        this.authService.getPhysiciansById(user.PreferredPhysician3).subscribe(phy => {
                                            console.log('Physician Details',phy)
                                            this.authStore.PhysicianDetail = phy[0]
                                            sessionStorage.setItem('PhysicianDetail', JSON.stringify(phy));
                                        })
                                    }else{
                                        this.authService.getPhysicianbyUserId({userId:user.UserId}).subscribe(phy => {
                                            console.log('Physician Details',phy)
                                            this.authStore.PhysicianDetail = phy[0]
                                            sessionStorage.setItem('PhysicianDetail', JSON.stringify(phy));
                                        })
                                    }
                                    this.router.navigate(['pages/workspace']);                                    
                                }
                            },
                                error => {
                                    this.errorMessage = <any>error;
                                    // console.log(this.errorMessage);
                                });

                        //Option list setting global values
                        this.authService.getOptionsList().subscribe(resp => {
                            if (resp.length > 0) {
                                resp.map(opt => {
                                    if (opt.OptionCategory === 'Billing' && opt.OptionProperty === 'Auto_Apply_Copay_To_Bill' && opt.OptionValue === true) {
                                        this.state.notifyDataChanged(Global.Globel_Auto_Allocate, true);
                                        Global.Globel_Auto_Allocate = true
                                        // console.log(Global.Globel_Auto_Allocate)
                                    }
                                    else {
                                        this.state.notifyDataChanged(Global.Globel_Auto_Allocate, false);
                                        Global.Globel_Auto_Allocate = false
                                        // console.log(Global.Globel_Auto_Allocate)
                                    }
                                    if (opt.OptionCategory === 'Billing' && opt.OptionProperty === 'Direct_Auto_Post_RA' && opt.OptionValue === true) {
                                        this.state.notifyDataChanged(Global.Globel_Direct_Auto_Post, true);
                                        Global.Globel_Direct_Auto_Post = true
                                        // console.log(Global.Globel_Direct_Auto_Post)
                                    }
                                    else {
                                        this.state.notifyDataChanged(Global.Globel_Direct_Auto_Post, false);
                                        Global.Globel_Direct_Auto_Post = false
                                        // console.log(Global.Globel_Direct_Auto_Post)
                                    }
                                })
                            }
                        })

                        //Get Application user info    
                        this.userProfileService.GetAppUserInfo(appUserId).subscribe(data =>{
                            this.authStore.ApplicationUserDetail = data;
                            console.log('AppUserInfo',data);
                            sessionStorage.setItem('ApplicationUserDetail', JSON.stringify(data));
                        })

                        // Get TaxonomyItem Details
                        this.taxonomyService.getTaxonomyItemDetails()
                            .subscribe(data => {
                                this.authStore.TaxonomyItemDetail = data;
                                sessionStorage.setItem('TaxonomyItemDetail', JSON.stringify(data));
                            },
                                error => {
                                    this.errorMessage = <any>error;
                                    // console.log(this.errorMessage);
                                });

                        // get practices details
                        this.practiceService.getPractices()
                            .subscribe(practice => {
                                this.authStore.PracticeDetail = practice[0];
                                sessionStorage.setItem('PracticeDetail', JSON.stringify(practice[0]));
                            },
                                error => {
                                    this.errorMessage = <any>error;
                                    // console.log(this.errorMessage);
                                });

                        // this.router.navigate([this.returnUrl]);
                    }
                },
                    error => this.errorMessage = <any>error);
        }
    }
    forgetPassword(){
        const modRef =  this.modalService.open(CptDisclaimerComponent, { centered: true, size: 'sm', windowClass: 'modelStyle', backdrop : 'static' });
         modRef.componentInstance.password = true;
    }
    ngAfterViewInit() {
        // console.log('ppppppppppppppppppppppppppppp')
        document.getElementById('preloader').classList.add('hide');
    }

}