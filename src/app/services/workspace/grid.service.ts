import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GridService {
private title: string;
private value: boolean;
  constructor() { }
  setDatafromNoticeBoard(title: string){
    this.title = title;
    
    console.log("value in gridsterservices is: ",this.title);
  }
  gettitlefromNoticeBoard(){
    return this.title;
  }
}
