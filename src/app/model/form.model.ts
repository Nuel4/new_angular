
export class Form {
    FormId: number;
    FormName: string;
    FormExtension: string
    FormPath: string;
    DateCreated: Date;
    CreatedByUserId: number;
    DateLastUpdated: Date;
    LastUpdatedByUserId: number;
}

export class Document {
    Name: string;
      Extension: string;
      DateCreated: Date;
      CreatedByUserId: number;
      DateLastUpdated: Date;
      LastUpdatedByUserId: number;
      Path: string;
      PatientId?: any;
    //   FileData: any;
      SavedMethodIdentifier: number;
      IsInactive: boolean;
      DmsCategoryId: number;
      UserId: number;
      ReviewStatus: number;
      NoOfPages: number;
      DocumentDate: Date;
}