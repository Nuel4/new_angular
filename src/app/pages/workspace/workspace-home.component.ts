import { Component, OnInit, ViewEncapsulation, ViewChild, TemplateRef, AfterViewInit, OnChanges, SimpleChange, Input } from '@angular/core';

import * as $ from 'jquery';
import { GridService } from '../../services/workspace/grid.service';
import {DisplayGrid, GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponentInterface, GridType} from 'angular-gridster2';
import {Router} from '@angular/router'
import { AvailabilityExceptionComponent } from './calendar/availability-exception/availability-exception.component';
import { NgbModal} from '@ng-bootstrap/ng-bootstrap'
import { CptDisclaimerComponent } from '../login/cpt-disclaimer/cpt-disclaimer.component';

@Component({
    selector: 'app-viewworkwpace',
    templateUrl: 'workspace-home.component.html',
    styleUrls: ['workspace-home.component.scss'],
    encapsulation: ViewEncapsulation.None
})



export class WorkspaceHomeComponent implements OnInit, AfterViewInit, OnChanges {
    options: GridsterConfig;
    dashboard: Array<GridsterItem>;
    NBMD: string;
    NBMT: boolean;

    constructor(private gs: GridService, private router: Router, private modal: NgbModal) {
    }
    static itemChange(item, itemComponent) {
        // console.log('itemChanged', item, itemComponent);
    }

    static itemResize(item, itemComponent) {
        // console.log('itemResized', item, itemComponent);
    }

    // these function are worte to make grid draggable
    static eventStart(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) {
        // console.info('eventStart', item, itemComponent, event);
      }
    
      static eventStop(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent) {
        // console.info('eventStop', item, itemComponent, event);
      }
      static overlapEvent(source: GridsterItem, target: GridsterItem, grid: GridsterComponent) {
        // console.log('overlap', source, target, grid);
      }
    // here ends grid draggable functions

    ngOnInit() {
        console.log("router", this.router.url)
        if(this.router.url === '/pages/workspace/exception'){
this.modal.open(AvailabilityExceptionComponent)
        }
        this.options = {
            itemChangeCallback: WorkspaceHomeComponent.itemChange,
            itemResizeCallback: WorkspaceHomeComponent.itemResize,
            colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
                  rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
            // this hides the grid coloumn
            displayGrid: DisplayGrid.None,
            // this enables the draggable event on grid
            draggable: {
              delayStart: 0,
              enabled: false,
              ignoreContentClass: 'gridster-item-content',
              ignoreContent: false,
              dragHandleClass: 'drag-handler',
              stop: WorkspaceHomeComponent.eventStop,
              start: WorkspaceHomeComponent.eventStart,
              dropOverItems: false,
              dropOverItemsCallback: WorkspaceHomeComponent.overlapEvent,
              
            },
            // emptyCellDragMaxCols: 0,
            // emptyCellDragMaxRows: 5,


            // gridType: "fit",
        // 'fit' will fit the items in the container without scroll;
        // 'scrollVertical' will fit on width and height of the items will be the same as the width
        // 'scrollHorizontal' will fit on height and width of the items will be the same as the height
        // 'fixed' will set the rows and columns dimensions based on fixedColWidth and fixedRowHeight options
        // 'verticalFixed' will set the rows to fixedRowHeight and columns width will fit the space available
        // 'horizontalFixed' will set the columns to fixedColWidth and rows height will fit the space available
        // fixedColWidth: 200,
        // fixed col width for gridType: 'fixed'
        // fixedRowHeight: 10,
        // fixed row height for gridType: 'fixed'
        // keepFixedHeightInMobile: false,
        // keep the height from fixed gridType in mobile layout
        // keepFixedWidthInMobile: false,
        // keep the width from fixed gridType in mobile layout
        // compactType: 'none',
        // compact items: 'none' | 'compactUp' | 'compactLeft' | 'compactUp&Left' | 'compactLeft&Up'
        // mobileBreakpoint: 640,
        // if the screen is not wider that this, remove the grid layout and stack the items
        // minCols: 12,
        // minimum amount of columns in the grid
        // maxCols: 4,
        // maximum amount of columns in the grid
        // minRows: 4,
        // minimum amount of rows in the grid
        // maxRows: 2,
        // maximum amount of rows in the grid
        // defaultItemCols: 1,
        // default width of an item in columns
        // defaultItemRows: 1,
        // default height of an item in rows
        // maxItemCols: 50,
        // max item number of cols
        // maxItemRows: 50,
        // max item number of rows
        // minItemCols: 1,
        // min item number of columns
        // minItemRows: 1,
        // min item number of rows
        // minItemArea: 1,
        // min item area: cols * rows
        // maxItemArea: 2500,
        // max item area: cols * rows
        // margin: 10,
        // margin between grid items
        // outerMargin: true,
        // if margins will apply to the sides of the container
        // scrollSensitivity: 10,
        // margin of the dashboard where to start scrolling
        // scrollSpeed: 20,
        // how much to scroll each mouse move when in the scrollSensitivity zone
        // initCallback: undefined,
        // callback to call after grid has initialized.Arguments: gridsterComponent
        // destroyCallback: undefined,
        // callback to call after grid has destroyed.Arguments: gridsterComponent
        // itemChangeCallback: undefined,
        // callback to call for each item when is changes x, y, rows, cols.
        // Arguments: gridsterItem, gridsterItemComponent
        // itemResizeCallback: undefined,
        // callback to call for each item when width/height changes.
        // Arguments: gridsterItem, gridsterItemComponent
        // itemInitCallback: undefined,
        // callback to call for each item when is initialized and has size > 0.
        // Arguments: gridsterItem, gridsterItemComponent
        // itemRemovedCallback: undefined,
        // callback to call for each item when is removed.
        // Arguments: gridsterItem, gridsterItemComponent
        // enableEmptyCellClick: false,
        // enable empty cell click events
        // enableEmptyCellContextMenu: false,
        // enable empty cell context menu (right click) events
        // enableEmptyCellDrop: true,
        // enable empty cell drop events
        // enableEmptyCellDrag: true,
        // enable empty cell drag events
        // emptyCellClickCallback: undefined,
        // empty cell click callback
        // emptyCellContextMenuCallback: undefined,
        // empty cell context menu (right click) callback
        // emptyCellDropCallback: undefined,
        // empty cell drag drop callback. HTML5 Drag & Drop
        // emptyCellDragCallback: undefined,
        // empty cell drag and create item like excel cell selection
        // Arguments: event, gridsterItem{x, y, rows: defaultItemRows, cols: defaultItemCols}
        // emptyCellDragMaxCols: 50,
        // limit empty cell drag max cols
        // emptyCellDragMaxRows: 50,
        // limit empty cell drag max rows
        // draggable: {
        //   delayStart: 0,
        //   // milliseconds to delay the start of resize, useful for touch interaction
        //   enabled: false,
        //   // enable/disable draggable items
        //   ignoreContentClass: 'gridster-item-content',
        //   // default content class to ignore the drag event from
        //   ignoreContent: false,
        //   // if true drag will start only from elements from `dragHandleClass`
        //   dragHandleClass: 'drag-handler',
        //   // drag event only from this class. If `ignoreContent` is true.
        //   stop: undefined,
        //   // callback when dragging an item stops.  Accepts Promise return to cancel/approve drag.
        //   start: undefined
        //   // callback when dragging an item starts.
        //   // Arguments: item, gridsterItem, event
        // },
        resizable: {
          delayStart: 0,
          // milliseconds to delay the start of resize, useful for touch interaction
          enabled: false,
          // enable/disable resizable items
          handles: {
            s: false,
            e: false,
            n: false,
            w: false,
            se: false,
            ne: false,
            sw: false,
            nw: false
          }, // resizable edges of an item
          stop: undefined,
          // callback when resizing an item stops. Accepts Promise return to cancel/approve resize.
          start: undefined
          // callback when resizing an item starts.
          // Arguments: item, gridsterItem, event
        },
        // swap: true,
        // allow items to switch position if drop on top of another
        // pushItems: true,
        // push items when resizing and dragging
        // disablePushOnDrag: false,
        // disable push on drag
        // disablePushOnResize: false,
        // disable push on resize
        // pushDirections: { north: true, east: true, south: true, west: true },
        // control the directions items are pushed
        // pushResizeItems: false,
        // on resize of item will shrink adjacent items
        // displayGrid: 'none',
        // display background grid of rows and columns. Options: 'always' | 'onDrag&Resize' | 'none'
        // disableWindowResize: true,
        // disable the window on resize listener. This will stop grid to recalculate on window resize.
        // disableWarnings: false,
        // disable console log warnings about misplacement of grid items
        // scrollToNewItems: false
        // scroll to new items placed in a scrollable view
          };

        this.dashboard = [
            // { cols: 8, rows: 4, y: 0, x: 0, componentName: 'VAllAppointmentsComponent', componentHeader: 'Appointments' },
            { cols: 4, rows: 6, y: 0, x: 0, dragEnabled: true, resizeEnabled: true, componentName: 'CalendarComponent', componentHeader: 'Appointments' },
            { cols: 4, rows: 6, y: 0, x: 4, dragEnabled: true, resizeEnabled: true, componentName: 'NoticeboardComponent', componentHeader: 'Noticeboard' },
            { cols: 4, rows: 6, y: 0, x: 8, dragEnabled: true, resizeEnabled: true, componentName: 'AlertsComponent', componentHeader: 'Alerts' },
            //  { cols: 4, rows: 3, y: 2, x: 8, dragEnabled: true, resizeEnabled: true, componentName: 'MypostsComponent', componentHeader: 'My Posts' },
        ];                                
        
    }
    NoticeBoardModal(NBMV){
        this.NBMD = NBMV.title;
        this.NBMT = NBMV.content;
        // console.log("Values in workspace home: ",NBMV);
    }
    onSomething() {
        // console.log('Kaushik');
    }

    changedOptions() {
        this.options.api.optionsChanged();
    }

    removeItem(item) {
        this.dashboard.splice(this.dashboard.indexOf(item), 1);
    }

    addItem() {
        // this.dashboard.push({});
    }

    ngOnChanges(){
        
       let title = this.gs.gettitlefromNoticeBoard();
    //    console.log("value of title in parent component",title);
    }

    ngAfterViewInit() {
        // setTimeout(()=>{            
        //     const modRef = this.modalService.open(CptDisclaimerComponent, { centered: true, size: 'sm', windowClass: 'modelStyle' });
        //     modRef.componentInstance.cptDisclaimer = true;
        // }) 
        setTimeout(() => {
            // $('.dynamsoft-dialog-wrap').remove();
            // $('.dynamsoft_waiting').remove();
            // $('.breadcrumb').remove();
            // $('body > :last-child').remove();
        }, 1000)
        
    }


    public onShowDIalog(title: any,value: boolean){
        // console.log("value of child component: ",title,value);
        // this.display = value;
    }


    NBModalsvalues(value: boolean){
    // this.NBModalvalue = value;

    }
}


