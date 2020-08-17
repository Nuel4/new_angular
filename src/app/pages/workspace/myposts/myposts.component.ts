import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import {
  ElementRef, OnDestroy, DoCheck, OnChanges, Input, Output, EventEmitter, IterableDiffers,
  AfterViewChecked, SimpleChanges
} from '@angular/core';
import { MypostmodalComponent } from './mypostmodal/mypostmodal.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MypostsService } from '../../../services/workspace/myposts.service';
import { PaginatorModule } from 'primeng/paginator';
import { Router } from '@angular/router';


@Component({
  selector: 'app-myposts',
  templateUrl: './myposts.component.html',
  styleUrls: ['./myposts.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MypostsComponent implements OnInit, AfterViewInit {
  @Input() wData: any;
  @Input() refresh;
  @Output() onSomething = new EventEmitter<string>();

  private mypostsdata: any;
  private totalRecords: number = 24;
  private notes: any;
  private postId: any;

  toWorkSpace: boolean;
  widgetData: any;
  constructor(
    private modalService: NgbModal,
    private mp: MypostsService,
    private router: Router
  ) { }

  ngOnInit() {
    let param = {
      first: 5,
      page: 0,
      pageCount: 24,
      rows: 5
    }
    this.paginate(param);

  }

  refreshData() {
    this.onSomething.emit();
    this.paginate();
  }
  ngOnChanges() {
    if (this.refresh) {
      this.paginate();
      this.refresh = false;
    }
  }

  ngAfterViewInit() {
    // this.widgetData = JSON.parse(this.wData);
    // if (this.widgetData) {
    //   this.toWorkSpace = true;
    // }
  }
  open(content) {
    const modalRef = this.modalService.open(MypostmodalComponent);
    modalRef.componentInstance.title = content;
    modalRef.componentInstance.IsDelete = false;
    modalRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        let param = {
          first: 5,
          page: 0,
          pageCount: 24,
          rows: 5
        }
        this.paginate(param);
      }
    })

  }
  edit(content, item) {
    const modalRef = this.modalService.open(MypostmodalComponent);
    modalRef.componentInstance.title = content;
    modalRef.componentInstance.note = item.Note;
    modalRef.componentInstance.item = item;
    modalRef.componentInstance.IsDelete = false;
    modalRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        let param = {
          first: 5,
          page: 0,
          pageCount: 24,
          rows: 5
        }
        this.paginate(param);
      }
    })

  }

  paginate(event?) {
    let userdata = JSON.parse(sessionStorage.getItem("UserDetail"));
    let param = {
      userId: userdata.UserId,
      offset: event ? event.page : 0,
      limit: "5",
    }
    this.mp.getPagedPosts(param).subscribe(result => {
      this.mypostsdata = result
      this.totalRecords = this.mypostsdata.TotalItems;
      this.notes = this.mypostsdata.Results;
    });
  }
  deleteNotes(item) {
    // console.log(item);
    // this.postId = {
    //   "MyPostsId": item
    // }
    const modalRef = this.modalService.open(MypostmodalComponent, { windowClass: 'delete-class' });
    modalRef.componentInstance.IsDelete = true;
    modalRef.componentInstance.postId = item
    // this.postId = JSON.stringify({ 'MyPostsId': item });
    modalRef.componentInstance.loadEvent.subscribe((value) => {
      if (value) {
        let param = {
          first: 5,
          page: 0,
          pageCount: 24,
          rows: 5
        }
        this.paginate(param);
      }
    })

  }
}
