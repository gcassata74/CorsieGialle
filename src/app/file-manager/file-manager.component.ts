import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentScanner, DocumentScannerOptions } from '@ionic-native/document-scanner/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController } from '@ionic/angular';
import { DocviewPage } from '../docview/docview.page';
import { DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
})
export class FileManagerComponent implements OnInit {

  doclist$: any;
  filedirs: any[] = [];
  docs: any[] = [];
  fileList: any[];
  pdfobject: any = null;

  @Input() showModal:boolean = false;


  constructor(
    private router: Router,
    private docscan: DocumentScanner,
    private file: File,
    public modalCtrl: ModalController

  ) {
      this.refreshList();
  }
  ngOnInit() { }

  async showdoc(doc) {

   const modal = await this.modalCtrl.create({
    component: DocviewPage,
    componentProps: { 
        doc: doc
      }
  });
   
   return await modal.present();
  }

  refreshList(){
    this.file.listDir(this.file.externalDataDirectory, '').then((l) => {
      this.fileList = l.filter(entry => entry.isFile);
    });
  }

  taskDate() {

    var d = new Date();
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }


  takePhoto() {
    
    let opts: DocumentScannerOptions = {};
    this.docscan.scanDoc(opts)
      .then((res: string) => {

          let n = res.lastIndexOf("/");
          let oldpath = res.substr(0, n);
          let oldfile = res.substr(n + 1);
          let newpath = this.file.externalDataDirectory;
          //save jpg file
          this.file.moveFile(oldpath, oldfile, newpath, oldfile).then((r) => {
            this.refreshList();
          });
          
      });
  }

  deletephoto(doc) {
    console.log(doc);
    if(doc){
      doc.remove();
      this.refreshList();
    }  

  }

  selectPhoto(doc){
    this.docs.push(doc);
  }

  attach(){
    this.modalCtrl.dismiss(this.docs);
  }



}
