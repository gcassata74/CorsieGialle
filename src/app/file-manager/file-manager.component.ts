import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentScanner, DocumentScannerOptions } from '@ionic-native/document-scanner/ngx';
import { File } from '@ionic-native/file/ngx';
import { ModalController, NavController, Platform, AlertController } from '@ionic/angular';
import { DocviewPage } from '../docview/docview.page';
import { DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { HomePage } from '../home/home.page';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-file-manager',
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.scss'],
})
export class FileManagerComponent implements OnInit {

  title:string ="Documenti di transito";
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
    public modalCtrl: ModalController,
    private platform: Platform,
    public alertController: AlertController,
    public storage:NativeStorage,
  ) {
      this.refreshList();
  }


  ngOnInit() {
        if(this.showModal)
          this.title = "Seleziona allegati"
        this.presentDisclaimer();
   }

  async presentDisclaimer() {

    let disclaimer = await  this.storage.getItem('disclaimer');
    disclaimer.read=0;
    if(disclaimer.read==='1') return;

    const alert = await this.alertController.create({
      cssClass: 'disclaimer',
      header: "Attenzione!",
      subHeader: "Condizioni d'uso",
      message: "<p>Gli enti gestori di corsie gialle / ZTL richiedono, di norma, i seguenti documenti:</p><ul style= 'list-style-type: none;'><li>Patente di guida</li><li>Libretto di circolazione</li><li>Licenza ncc o tesserino disabili</li></ul><p>Alcuni comuni potrebbero richiedere ulteriori moduli o documenti</p><p>si prega, quindi, di prestare attenzione che la mail sia stata effettivamente inviata e alle eventuali risposte degli enti preposti controllando la propria casella di posta</p><p>E' responsabilità dell'utente verificre che i documenti acquisiti siano adeguatamente leggibili</p><p>Corsie gialle declina qualsiasi responsabilità per documentazione incompleta,poco leggibile, o per mail non inviate</p>",
      buttons: [{
        text: 'Ok',
        handler: (alertData) => {
          this.storage.setItem('disclaimer', {read: alertData[0]});
        }
    }],
      inputs: [
        
        {
          type:'checkbox',
          label:'Non mostrare più',
          value:'1'
        }
      ],
    });

    await alert.present();
  }



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
