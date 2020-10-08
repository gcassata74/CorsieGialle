import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { File } from '@ionic-native/file/ngx';
import { async } from 'rxjs/internal/scheduler/async';
import { Subject } from 'rxjs';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfServiceService {

  pdfCreated = new Subject<any>();
  pdfobject: any = null;

  constructor(private file:File) { }

  createPdf(photos: any[]){

    let allp = [];
    let path = "";
    let file = "";
    let n=0;
   
    photos.forEach((el) => {
      n = el.name.lastIndexOf("/");
      path = this.file.externalDataDirectory;
      file = el.name ;
      allp.push(this.file.readAsDataURL(path, file));
    });

    let mcontent = [];
    let _i = 0 ; 
    Promise.all(allp).then((values) => {
      values.forEach( (data) => { 
        _i = _i + 1 ;
        mcontent.push({
          image: data,
          width: 580 
        });
        console.log(photos.length , _i) ; 
        if (photos.length > _i ) {  
        mcontent.push({text: '', pageBreak: 'before'});
        } 
      });


      var docDefinition = {
        pageSize: {
          width: 595.28,
          height: 'auto'
        } ,
        pageOrientation: 'portrait',
        pageMargins: [0, 0, 0, 0],
        
        content: mcontent
      };
      console.log(docDefinition);
      this.pdfobject = pdfMake.createPdf(docDefinition);
      const options: DocumentViewerOptions = {
        title: 'documenti_transito.pdf',

        email: { enabled: true }
      }
        this.pdfobject.getBuffer((buffer) => {
       let blob = new Blob([buffer], { type: 'application/pdf' });
    
     // Save the PDF to the data Directory of our App
    this.file.createDir(this.file.externalDataDirectory,"tmp",true).then(()=> {
      this.file.writeFile(this.file.externalDataDirectory+"/tmp", 'corsiegialle.pdf', blob, { replace: true }).then((f)=>{
          this.pdfCreated.next(f);
      });
    });

  });
  
});
    

  }
  

}
