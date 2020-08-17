import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter} from '@angular/core';
import { NgbActiveModal, NgbModal, } from '@ng-bootstrap/ng-bootstrap';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MypostsService } from '../../../../services/workspace/myposts.service';
import { Router } from '@angular/router';
// import { MypostsComponent } from '../myposts.component'
import { notEqual } from 'assert';
import { iterateListLike } from '@angular/core/src/change_detection/change_detection_util';
import { parseHostBindings } from '@angular/compiler';
import { ToastrService} from 'ngx-toastr'
// import { ItemService } from 'src/app/services/inventory/items/items.service';
@Component({
  selector: 'app-mypostmodal',
  templateUrl: './mypostmodal.component.html',
  styleUrls: ['./mypostmodal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MypostmodalComponent implements OnInit {
  @Input() title;
  @Input() note;
  @Input() item;
  @Input() IsDelete;
  @Input() postId;
  @Output() loadEvent:EventEmitter<any> = new EventEmitter()
  private myposts: any;
  private savePost: any;
  constructor(
    public modal: NgbActiveModal,
    private mp: MypostsService,
    private router: Router,
    private toaster: ToastrService
    // private mpS: MypostsComponent,
  ) { }

  ngOnInit() {
  }

  SavePosts() {
    if (this.title == "Add") {
      let userdata = JSON.parse(sessionStorage.getItem("UserDetail"));
      this.savePost = {
        UserId: userdata.UserId,
        Note: this.myposts,
        DateCreated: new Date(),
        CreatedByUserId: userdata.UserId,
        DateLastUpdated: new Date(),
        LastUpdatedByUserId: userdata.UserId,
        Status: true,
      }
      this.mp.Mypost(this.savePost).subscribe(res => {
        this.loadEvent.emit(true);
        this.showAlert("Post saved successfully!")
        // let param = {
        //   first: 5,
        //   page: 0,
        //   pageCount: 24,
        //   rows: 5
        // }
        // this.router.navigateByUrl('/pages/workspace/myposts', { skipLocationChange: true }).then(() =>
        //   this.router.navigate(["pages/workspace"]));
        // this.mpS.paginate(param);
      })
    }

    if (this.title == "Edit") {
      let userdata = JSON.parse(sessionStorage.getItem("UserDetail"));
      this.savePost = {
        MyPostsId: this.item.MyPostsId,
        UserId: this.item.UserId,
        Note: this.note,
        DateCreated: new Date(),
        CreatedByUserId: this.item.UserId,
        DateLastUpdated: new Date(),
        LastUpdatedByUserId: this.item.UserId,
        Status: true,
      }
      this.mp.updatePost(this.savePost).subscribe(res => {
        this.loadEvent.emit(true)
        this.showAlert("Post edited successfully!")
        // let param = {
        //   first: 5,
        //   page: 0,
        //   pageCount: 24,
        //   rows: 5
        // }
        // this.router.navigateByUrl('/pages/workspace/myposts', { skipLocationChange: true }).then(() =>
        //   this.router.navigate(["/pages/workspace"]));
        // this.mpS.paginate(param);
      })
    }
  }
  deletePost() {
    let deletepost = {
      MyPostsId: this.postId
    }
    this.mp.deletePost(deletepost).subscribe(result => {
      this.loadEvent.emit(true)
      this.modal.close('Close click')
this.showAlert("Post deleted successfully!");
      // console.log("success")
      // this.router.navigateByUrl('/pages/workspace/myposts', { skipLocationChange: true }).then(() =>
      //   this.router.navigate(["/pages/workspace"]));
    });
  }
  showAlert(msg: string){
this.toaster.success(msg)
  }
}
