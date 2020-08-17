import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { HelpService } from '../../../services/help/help.service'

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideosComponent implements OnInit {
  cols: any[];
  leftArrow: boolean = true;
  rightArrow: boolean = false;
  categories: any;
  videos: any;
  selectedCategory: any;
  selectedVideos: any;
  constructor( private router: Router,private helpService: HelpService ) { }

  ngOnInit() {
    this.cols = [
      { field: '', header: '' },
      { field: 'VideoName', header: 'Video File Name' },
      { field: '', header: '' },
  ];
  this.getCategories();
  this.getSupportVideos();
  }
  expandLeftArrow(){
      this.leftArrow = false;
      this.rightArrow = true;
          $("#showVideo").animate({
              width: "toggle"
          });
     
  }
  expandRightCol(){
    this.rightArrow = false;
    this.leftArrow = true;
        $("#showVideo").animate({
            width: "toggle"
        });
  }
  onCloseWindow(){
    this.router.navigate(['/pages/workspace'], { skipLocationChange: true })
  }
  getCategories(){
    this.helpService.getCategories().subscribe(res => {
      this.categories = res;
    })
  }
  getSupportVideos(){
    this.helpService.getSupportVideos().subscribe(res => {
      this.videos = res;
    })
  }
  changingCategory(event){
    let payload = {
      categoryId:event.CategoryId
    }
    if(event){
      this.helpService.getSupportvideosByCategoryId(payload).subscribe(res =>{
        this.videos = res;
      })
    }
    else if(this.selectedCategory === null){
      this.getSupportVideos()
    }
  }
  onRowSelect(event){
    console.log(event)
  }
}
