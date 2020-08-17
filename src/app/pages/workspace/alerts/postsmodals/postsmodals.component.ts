import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { NgbActiveModal, NgbModal, } from '@ng-bootstrap/ng-bootstrap';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MypostsService } from '../../../../services/workspace/myposts.service';

@Component({
  selector: 'app-postsmodals',
  templateUrl: './postsmodals.component.html',
  styleUrls: ['./postsmodals.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PostsmodalsComponent implements OnInit {
  @Input() title;

  private myposts: any;
  private savePost: any;
  constructor(public modal: NgbActiveModal,
    mp: MypostsService) { }

  ngOnInit() {
  }

  // SavePosts() {
  //   if (this.title === "Add") {
  //     let userdata = JSON.parse(sessionStorage.getItem("UserDetail"));
  //     console.log("value of userdata", userdata);
  //     console.log("saved posts is: ", this.myposts);
  //     this.savePost = {
  //       UserId: userdata.UserId,
  //       Note: this.myposts,
  //       DateCreated: new Date(),
  //       CreatedByUserId: userdata.UserId,
  //       DateLastUpdated: new Date(),
  //       LastUpdatedByUserId: userdata.UserId,
  //       Status: true,
  //       CreatedByUser: userdata.LastName+","+userdata.FirstName,
  //       LastUpdatedByUser: userdata.LastName+","+userdata.FirstName,
  //       User: userdata.LastName+","+userdata.FirstName
  //     }
  //     console.log("save post value is: ",this.savePost);
  //   }
  // }


}
