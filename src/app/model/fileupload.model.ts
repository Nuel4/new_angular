import { Guid } from './../core'

export enum FileUploadType{
  Practice = 0,
  Patient,
}
export class fileupload {
    id: string;
    file: File;
    filename:string;
    filetype:string;
    filesize:string;
    progress: number;
    message: string;
    isCancel: boolean;
    isError: boolean;
    isCompleted:boolean;
    get isInprogress(): boolean {
      if (this.progress > 1 && this.isCompleted == false && this.isError == false)
        return true;
  
      return false;
    };
  
    constructor(file: File) {
      this.file = file;
      this.filename = file.name;
      this.filesize = (file.size / (1024)).toFixed(2); //KB
      //this.filesize = (file.size / (1024 * 1024)).toFixed(2); //MB
      this.filetype = file.type;
      this.progress = 0;
      this.id = Guid.newGuid();
      this.message = '';
      this.isCancel = false;
      this.isError = false;
      this.isCompleted = false;
    }
  }