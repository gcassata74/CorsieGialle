import { Component, OnInit, } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { comuni }  from '../data/comuni';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { DatePipe } from '@angular/common';
import { StringFormatPipe } from '../utils/string-format.pipe';
import { ModalController, Platform, NavController } from '@ionic/angular';
import { CityModel } from '../models/city-model.model';
import { FileManagerComponent } from '../file-manager/file-manager.component';
import { PdfServiceService } from '../services/pdf-service.service';
import { File } from '@ionic-native/file/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { MustNotOverlap } from  './custom-validation';


   


const subject:string = "Richiesta autorizzazione transito corsie preferenziali / ZTL";
const mailbody:string = "Con la presente sono a richiedere il permesso di transito temporaneo su ztl e corsie gialle del vostro comune  dalle ore {0} del giorno {1} alle ore {2} del giorno {3}, per il veicolo targato {4},allego la documentazione inerente alla titolarità di transito. \n Richiedo cortese riscontro positivo o negativo alla richiesta, in risposta alla presente mail, per evitare inutili sanzioni e ricorsi vista l'evidente titolarità di transito \n Cordiali saluti"

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],

})
export class RequestFormComponent implements OnInit {
 
 
  requestForm: FormGroup;
  cities:any[]=comuni;
  selectedCity: CityModel;
  modalController: any;
  attachments: any[]=[];

  constructor(private stringFormatPipe:StringFormatPipe,
              private datePipe: DatePipe,
              private formBuilder: FormBuilder, 
              private emailComposer: EmailComposer,
              public modalCtrl: ModalController,
              public pdfService:PdfServiceService,
              public file:File,
              public storage:NativeStorage,
              private platform: Platform,
              private keyboard: Keyboard) {
               
             this.initContactForm();
  }

  ngOnInit() {

      this.pdfService.pdfCreated.subscribe((f) =>{
       this.attachments = [f.nativeURL];
       this.sendEmail();
      });


      this.storage.getItem('targa').then(data=>{
        if(data)
          this.requestForm.get('targa').patchValue(data.property);

      },error=>{console.log(error)});



   }
  

   initContactForm(){
      
        this.requestForm = this.formBuilder.group({
          start_transit_date: ['', Validators.required],  
          start_transit_hour:['', Validators.required],
          end_transit_date: ['', Validators.required],  
          end_transit_hour:['', Validators.required],
          targa: ['', Validators.required]
        },{
          validator: MustNotOverlap('start_transit_date','start_transit_hour', 'end_transit_date','end_transit_hour')
        });

       
  }

  onKeyPressed(event) {
    if(event.keyCode===13)
     this.keyboard.hide();
}

  onSubmit() {
     this.selectAttachments();
  }

  selectCity(city:CityModel){
    this.selectedCity = city;
  }

  

  sendEmail(){

    let output = this.requestForm.value;
    let data:any = {};


    data.start_transit_date = this.datePipe.transform(new Date(output.start_transit_date), 'dd-MM-yyyy');
    data.end_transit_date = this.datePipe.transform(new Date(output.end_transit_date), 'dd-MM-yyyy');
    data.start_transit_hour = this.datePipe.transform(new Date(output.start_transit_hour),'HH:mm');
    data.end_transit_hour = this.datePipe.transform(new Date(output.end_transit_hour),'HH:mm');
    data.targa = output.targa.toUpperCase();

    let email = {
      to: this.selectedCity.emails.join(';'),
      attachments: this.attachments,
      subject: subject,
      body: this.stringFormatPipe.transform(mailbody,data.start_transit_hour,data.start_transit_date,data.end_transit_hour,data.end_transit_date, data.targa),
      isHtml: true
      }; 


    //store targa into native storage
    this.storage.setItem('targa', {property: data.targa}).then(() => {
      this.emailComposer.open(email);
      this.initContactForm();
    },
    error => console.error('Error storing item', error)
 );  
    
   
  }  

  
  async selectAttachments() {
  
    const modal = await this.modalCtrl.create({
      component: FileManagerComponent,
      componentProps: { 
          showModal: true,
        }
    });
    
    modal.onDidDismiss()
    .then((attachments) => {
      this.pdfService.createPdf(attachments.data)
  });

    return await modal.present();
  }

  

}
