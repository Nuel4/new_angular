import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService} from 'ngx-toastr'
@Component({
  selector: 'app-chart-tile-picker',
  templateUrl: './chart-tile-picker.component.html',
  styleUrls: ['./chart-tile-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChartTilePickerComponent implements OnInit {
  lastChildID: any;
  selectedTiles: any = [];
  prevTilesList: any;
  targetTiles: any;
  tileList = [{
    name: 'Progress Note',
    // id: 1,
    conId: 'div1',
    dragId: 'drag1'
  },
  {
    name: 'Problem list',
    // id: 2,
    conId: 'div2',
    dragId: 'drag2'
  },
  {
    name: 'Past Medical History',
    // id: 3,
    conId: 'div3',
    dragId: 'drag3'
  },
  {
    name: 'Allergies',
    // id: 4,
    conId: 'div4',
    dragId: 'drag4'
  },
  {
    name: 'Medication',
    // id: 5,
    conId: 'div5',
    dragId: 'drag5'
  },
  {
    name: 'Labs',
    // id: 6,
    conId: 'div6',
    dragId: 'drag6'
  },
  {
    name: 'Patient Education',
    // id: 7,
    conId: 'div7',
    dragId: 'drag7'
  },
  {
    name: 'Vitals',
    // id: 8,
    conId: 'div8',
    dragId: 'drag8'
  }]
  // selectedTiles = [{
  //   name: 'Tile1',
  //   conId: 'div1',
  //   dragId: 'drag1'
  // },
  // {
  //   name: 'Tile2',
  //   conId: 'div2',
  //   dragId: 'drag2'
  // },
  // {
  //   name: 'Tile3',
  //   conId: 'div3',
  //   dragId: 'drag3'
  // },
  // {
  //   name: 'Tile4',
  //   conId: 'div4',
  //   dragId: 'drag4'
  // }]
  constructor(private modal: NgbActiveModal, private toaster: ToastrService) { }

  ngOnInit() {
  }
  allowDrop(ev) {
    // console.log('allow drop :', ev);
    ev.preventDefault();
  }

  drag(ev) {
    console.log("start drag", ev)
    console.log('ev.path[0].innerText', ev.path[0].innerText)
    ev.dataTransfer.setData("text", ev.path[0].innerText)
    ev.dataTransfer.setData("drag", ev.target.id);
    // console.log('drag :', ev.target.id);
    ev.dataTransfer.setData("div", ev.path[1].id)
    // console.log('ev.path[1] :', ev.path[1].id);
    // console.log('this.lastChildID :', this.lastChildID);
  }

  drop(ev) {
    ev.preventDefault();
    console.log('drop', ev);
    console.log('ev.path[0].innerText', ev.path[0].innerText)
    // this.selectedTiles.forEach((item, index) => {
    //   if(item.name === ev.dataTransfer.getData("text")){
    //     item.contId = ev.path[1].id
    //     item.dragId = ev.path[0].id 
    //   }
    //   if(item.name === ev.path[0].innerText){
    //     item.conId = ev.dataTransfer.getData("div");
    //     item.dragId = ev.dataTransfer.getData("drag");
    //   }
    // })
    // var data = ev.dataTransfer.getData("text");
    // ev.target.appendChild(document.getElementById(data));
    var div1 = document.getElementById(ev.dataTransfer.getData("div"))
    var div2 = document.getElementById(ev.path[1].id)
    var drag1 = document.getElementById(ev.dataTransfer.getData("drag"));
    var drag2 = document.getElementById(ev.path[0].id);
    div2.appendChild(drag1);
    div1.appendChild(drag2);
    // console.log("div1", div1);
    // console.log('div2 :', div2);
   console.log("selectedTiles", this.selectedTiles)
  }
  listChange(event){
    console.log('event on click:', event);
    console.log('list', this.selectedTiles)
    if(this.selectedTiles.length > 6){
this.toaster.error("A limit of 6 tiles apply to chart")
      this.selectedTiles.pop()
    }
    if(this.selectedTiles.length > 6){
      this.toaster.error("A limit of 6 tiles apply to chart")
            this.selectedTiles.pop()
          }
//           if(this.prevTilesList.length > this.selectedTiles.length){
//             var inList = this.selectedTiles.filter(item => {return item.name === event.originalEvent.path[3].innerText})
//            var inPrev = this.prevTilesList.filter(item => {return item.name === event.originalEvent.path[3].innerText} )
//             if(inList){
// this.selectedTiles
//            }
//           }
       
//           this.prevTilesList = this.selectedTiles
  }
  saveTiles(){
    console.log("Selected tiles", this.selectedTiles)
  }
//   listChange(event){
// console.log("event", event)
//   }
}
