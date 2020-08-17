import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { SketchpadModalComponent } from './sketchpad-modal/sketchpad-modal.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sktch-pad',
  templateUrl: './sktch-pad.component.html',
  styleUrls: ['./sktch-pad.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SktchPadComponent implements OnInit {
  Categories: any[];
  selectedCategory: any = { name: 'Arm', id: 1 };
  Templates: any = [];
  selectedTemplate: any
  TemplatesList: any[];
  selectedImg: any;
  modalRef: any;
  isIncreaseCard: boolean = false;
  isCancelBtn: boolean = true;
  constructor(private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.Categories = [
      { name: 'Arm', id: 1 },
      { name: 'Body ', id: 2 },
      { name: 'Brain', id: 3 },
      { name: 'Breast', id: 4 },
      { name: 'Colon', id: 5 },
      { name: 'Foot', id: 6 },
      { name: 'Hand', id: 7 },
      { name: 'Head', id: 8 },
      { name: 'Hit', id: 9 },
      { name: 'Knee', id: 10 },
      { name: 'Leg', id: 11 },
      { name: 'Organs', id: 12 },
      { name: 'Respiratory', id: 13 },
      { name: 'Skull', id: 14 },
      { name: 'Stomach', id: 15 },
      { name: 'Urology', id: 16 },
    ];
    this.TemplatesList = [
      { id: 1, pid: 1, name: 'Arm 1', url: '../../../../assets/img/Sketches/Arm/1_arm1.jpg' },
      { id: 2, pid: 1, name: 'Arm 2', url: '../../../../assets/img/Sketches/Arm/2_arm2.jpg' },
      { id: 3, pid: 1, name: 'Arm 3', url: '../../../../assets/img/Sketches/Arm/3_arm3.jpg' },
      { id: 4, pid: 2, name: 'Body', url: '../../../../assets/img/Sketches/Body/4_body.jpg' },
      { id: 5, pid: 2, name: 'Ribcage', url: '../../../../assets/img/Sketches/Body/5_ribcage.jpg' },
      { id: 6, pid: 2, name: 'Ribcage Side', url: '../../../../assets/img/Sketches/Body/6_ribcage2.jpg' },
      { id: 7, pid: 2, name: 'Body, Front & Back', url: '../../../../assets/img/Sketches/Body/Body.JPG' },
      { id: 8, pid: 3, name: 'Brain Top View', url: '../../../../assets/img/Sketches/Brain/7_brain.jpg' },
      { id: 9, pid: 3, name: 'Brain', url: '../../../../assets/img/Sketches/Brain/8_brain2.jpg' },
      { id: 10, pid: 4, name: 'Breast', url: '../../../../assets/img/Sketches/Breast/9_breast.jpg' },
      { id: 11, pid: 5, name: 'Colon', url: '../../../../assets/img/Sketches/Colon/10_colon.jpg' },
      { id: 12, pid: 6, name: 'Foot', url: '../../../../assets/img/Sketches/Foot/11_foot.jpg' },
      { id: 13, pid: 6, name: 'Arms', url: '../../../../assets/img/Sketches/Foot/11_foot.jpg' },
      { id: 14, pid: 7, name: 'Hand', url: '../../../../assets/img/Sketches/Hand/12_hand.jpg' },
      { id: 15, pid: 9, name: 'Hipbone', url: '../../../../assets/img/Sketches/Hip/13_hipbone.jpg' },
      { id: 16, pid: 9, name: 'Hipbone Joint', url: '../../../../assets/img/Sketches/Hip/14_hipbone2.jpg' },
      { id: 17, pid: 10, name: 'Knee', url: '../../../../assets/img/Sketches/Knee/17_knee.jpg' },
      { id: 18, pid: 11, name: 'Leg-front', url: '../../../../assets/img/Sketches/Leg/15_legfront.jpg' },
      { id: 19, pid: 11, name: 'Leg-back', url: '../../../../assets/img/Sketches/Leg/16_legback.jpg' },
      { id: 20, pid: 12, name: 'Heart', url: '../../../../assets/img/Sketches/Organs/18_heart.jpg' },
      { id: 21, pid: 12, name: 'Open Heart', url: '../../../../assets/img/Sketches/Organs/19_heart2.jpg' },
      { id: 22, pid: 12, name: 'Eye', url: '../../../../assets/img/Sketches/Organs/20_eye.jpg' },
      { id: 23, pid: 13, name: 'Respiratory Full View', url: '../../../../assets/img/Sketches/Respiratory/21_respiratory.jpg' },
      { id: 24, pid: 13, name: 'Respiratory', url: '../../../../assets/img/Sketches/Respiratory/22_respiratory2.jpg' },
      { id: 25, pid: 14, name: 'Skull', url: '../../../../assets/img/Sketches/Skull/23_skull1.jpg' },
      { id: 26, pid: 14, name: 'Skull Sideview', url: '../../../../assets/img/Sketches/Skull/24_sideskull.jpg' },
      { id: 27, pid: 14, name: 'Jawline', url: '../../../../assets/img/Sketches/Skull/25_jawline.jpg' },
      { id: 28, pid: 15, name: 'Stomach', url: '../../../../assets/img/Sketches/Stomach/26_stomach.jpg' },
      { id: 29, pid: 16, name: 'Kindey', url: '../../../../assets/img/Sketches/Urology/Kidney.JPG' },
    ]
    this.loadTemplate()

    if(this.route.snapshot.routeConfig.path === "template-editor"){
      this.isIncreaseCard = true;
      this.isCancelBtn = false;
    }
  }

  loadTemplate() {
    this.Templates = []
    this.TemplatesList.map(item => {
      if (item.pid === this.selectedCategory.id) {
        this.Templates.push(item)
      }
      })
      this.Categories.forEach(ele => {
        if(ele.name === 'Head'){
          this.selectedCategory.name = 'No items';
          this.selectedImg ="No Images"
        }
      })
    this.selectedTemplate = this.Templates[0]
    this.loadImg()
  }

  loadImg() {
    this.selectedImg = this.selectedTemplate.url
  }

  openModal(isModal = true) {
    this.modalRef = this.modalService.open(SketchpadModalComponent, { centered: true, size: 'lg', windowClass: 'modelStyle' })
    if (isModal) {
      this.loadImg()
      this.modalRef.componentInstance.imageUrl = "../" + this.selectedImg;
      this.modalRef.componentInstance.imageName = this.selectedTemplate.name;
      this.modalRef.componentInstance.ComponentName = 'Sketch Pad';
    }
    else
      this.modalRef.componentInstance.imageUrl = this.selectedImg;
      this.modalRef.componentInstance.imageName = this.selectedTemplate.name;
      this.modalRef.componentInstance.ComponentName = 'Sketch Pad';
  }

  cancelsketchpad(){
    this.router.navigate(['/pages/chart'], { skipLocationChange: true });
  }

  OnFileSelected(event) {
    let reader = new FileReader();
    let img: any
    console.log(event)
    reader.readAsDataURL(event.originalEvent.target.files[0]);
    reader.onload = (event) => {
      this.selectedImg = (<FileReader>event.target).result;
      this.openModal(false)
      // fu.clear()
    }
  }
}
