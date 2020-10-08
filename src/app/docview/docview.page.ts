import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentScanner, DocumentScannerOptions } from '@ionic-native/document-scanner/ngx';
import { File } from '@ionic-native/file/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer/ngx';
import {DocumentViewer , DocumentViewerOptions} from "@ionic-native/document-viewer/ngx"
import { ActionSheetController, ModalController } from '@ionic/angular';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-docview',
  templateUrl: './docview.page.html',
  styleUrls: ['./docview.page.scss']
})
export class DocviewPage implements OnInit {
  @Input() doc: any;
  photos = [];
  photosdata = [];
  pdfobject: any = null;




  constructor(private router: Router,
    private route: ActivatedRoute,
    private docscan: DocumentScanner,
    private file: File,
    private photoviewer: PhotoViewer,
    private actionSheetCtrl: ActionSheetController ,
    private documentviewer : DocumentViewer,
    public modalCtrl: ModalController
  ) {  
    
   


}

  ngOnInit() {
    
     let win: any = window;
     this.doc.safeURL = win.Ionic.WebView.convertFileSrc(this.file.externalDataDirectory+this.doc.name);
     
  }

  closeModal(){
    this.modalCtrl.dismiss();
  }


  viewpdf() {
    let path = "";
    let file = "";
    path = this.file.externalDataDirectory ;
    file = this.doc.name ;

    let mcontent = [];
    this.file.readAsDataURL(path, file).then((data) => {
    
        mcontent.push({
          image: data,
          width: 580 
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
        title: 'attestati_transito',
        email: { enabled: true }
      }
      this.pdfobject.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        this.file.writeFile(this.file.externalDataDirectory, this.doc.name.replace(/\.[^/.]+$/, "")+".pdf", blob, { replace: true }).then(fileEntry => {
          // Open the PDf with the correct OS tools
          //this.documentviewer.viewDocument(this.file.externalDataDirectory + 'myletter.pdf', 'application/pdf', options);
        
        })
      });


    });

  }


}
