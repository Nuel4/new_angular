import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router } from '@angular/router';



// Interface to hold id amd values of guarantor and navigate through the value
interface ListOfGurantors {
  GurantorId: number;
  GurantorValue: string;
}

// Interface to hold id amd values of saluatation and navigate through the value
interface GuarantorSalutationInterface {
  GurantorSalutationId: number;
  GurantorSalutationValue: string;
}

// Interface to hold id amd values of Relationship and navigate through the value
interface GuarantorRealtionshipInterface {
  GuarantorRealtionshipId: number;
  GuarantorRealtionshipValue: string;
}

// Interface to hold values of Gurantor Main language and navigate through the value
interface GurantorMainLangInterface {
  GurantorMainLangId: number;
  GurantorMainLangValue: string;
}

// Interface to hold values of primary State and navigate through the value
interface GurantorPrimStateInterface {
  GurantorPrimStateId: number;
  GurantorPrimStateValue: string;
}

// Interface to hold values of Other language1 and navigate through the value
interface GurantorOtherLang1Interface {
  GurantorOtherLang1Id: number;
  GurantorOtherLang1Value: string;
}

// Interface to hold values of other language2 and navigate through the value
interface GurantorOtherLang2Interface {
  GurantorOtherLang2Id: number;
  GurantorOtherLang2Value: string;
}

// Interface to hold values of Secondary State and navigate through the value
interface GurantorSecStateInterface {
  SecStateId: number;
  SecStateValue: string;
}

// Interface to hold values of Occupation and navigate through the value
interface GurantorOccupInterface {
  OccupId: number;
  OccupValue: string;
}

@Component({
  selector: 'app-patientgurantordetails',
  templateUrl: './patientgurantordetails.component.html',
  styleUrls: ['./patientgurantordetails.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PatientgurantordetailsComponent implements OnInit {

  selectedFile: File;
  public file: any;

  existingGurantor: ListOfGurantors[] = [
    { GurantorId: 1, GurantorValue: 'ExistingGurantor1' },
    { GurantorId: 2, GurantorValue: 'ExistingGurantor2' },
    { GurantorId: 3, GurantorValue: 'ExistingGurantor3' }
  ];

  gurantorSalutation: GuarantorSalutationInterface[] = [
    { GurantorSalutationId: 1, GurantorSalutationValue: 'Mr' },
    { GurantorSalutationId: 2, GurantorSalutationValue: 'Dr' },
    { GurantorSalutationId: 3, GurantorSalutationValue: 'Mrs' }
  ];

  guarantorRealtionship: GuarantorRealtionshipInterface[] = [
    { GuarantorRealtionshipId: 1, GuarantorRealtionshipValue: 'Spouse' },
    { GuarantorRealtionshipId: 2, GuarantorRealtionshipValue: 'Father' },
    { GuarantorRealtionshipId: 2, GuarantorRealtionshipValue: 'Mother' }
  ];

  gurantorOtherLang1: GurantorOtherLang1Interface[] = [
    { GurantorOtherLang1Id: 1, GurantorOtherLang1Value: 'English' },
    { GurantorOtherLang1Id: 2, GurantorOtherLang1Value: 'Spanish' },
    { GurantorOtherLang1Id: 3, GurantorOtherLang1Value: 'Latin' }
  ];

  gurantorOtherLang2: GurantorOtherLang2Interface[] = [
    { GurantorOtherLang2Id: 1, GurantorOtherLang2Value: 'English' },
    { GurantorOtherLang2Id: 2, GurantorOtherLang2Value: 'Spanish' },
    { GurantorOtherLang2Id: 3, GurantorOtherLang2Value: 'Latin' }
  ];

  gurantorMainLang: GurantorMainLangInterface[] = [
    { GurantorMainLangId: 1, GurantorMainLangValue: 'English' },
    { GurantorMainLangId: 2, GurantorMainLangValue: 'Spanish' }
  ];

  primState: GurantorPrimStateInterface[] = [
    { GurantorPrimStateId: 1, GurantorPrimStateValue: 'AL' },
    { GurantorPrimStateId: 2, GurantorPrimStateValue: 'AB' },
    { GurantorPrimStateId: 2, GurantorPrimStateValue: 'FL' },
    { GurantorPrimStateId: 2, GurantorPrimStateValue: 'MA' },
    { GurantorPrimStateId: 2, GurantorPrimStateValue: 'NJ' },
    { GurantorPrimStateId: 2, GurantorPrimStateValue: 'NY' }
  ];

  secState: GurantorSecStateInterface[] = [
    { SecStateId: 1, SecStateValue: 'AL' },
    { SecStateId: 2, SecStateValue: 'AB' },
    { SecStateId: 2, SecStateValue: 'FL' },
    { SecStateId: 2, SecStateValue: 'MA' },
    { SecStateId: 2, SecStateValue: 'NJ' },
    { SecStateId: 2, SecStateValue: 'NY' }
  ];

  gurantorOccup: GurantorOccupInterface[] = [
    { OccupId: 1, OccupValue: 'Self-Employed' },
    { OccupId: 2, OccupValue: 'Student Part-time' },
    { OccupId: 2, OccupValue: 'Student Full-time' }
  ];

  constructor(
    private router: Router
    ) {
  }

  ngOnInit() {}

  /* */
  onFileChanged(event) {
    this.selectedFile = event.target.files[0];
  }
  /* */
  removeFile(): void {
    this.file = '';
  }
}
