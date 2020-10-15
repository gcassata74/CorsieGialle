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
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';


   


const subject:string = "Richiesta autorizzazione transito corsie preferenziali / ZTL";
const mailbody:string = "Con la presente sono a richiedere il permesso di transito temporaneo su ztl e corsie gialle del vostro comune  dalle ore {0} del giorno {1} alle ore {2} del giorno {3}, per il veicolo targato {4},allego la documentazione inerente alla titolarità di transito. \n Richiedo cortese riscontro positivo o negativo alla richiesta, in risposta alla presente mail, per evitare inutili sanzioni e ricorsi vista l'evidente titolarità di transito \n Cordiali saluti"
const notification:string ="Ricorda il tuo transito nella città di {0} dalle ore {1} del giorno {2} alle ore {3} del giorno {4}, verifica la tua mail per eventuale conferma del comune"

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
              private keyboard: Keyboard,
              private localNotifications: LocalNotifications) {
               
             this.initContactForm();
  }

  ngOnInit() {


      this.pdfService.pdfCreated.subscribe((f) =>{
       this.attachments = [f.nativeURL];
       this.prepareEmail();
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

  

  prepareEmail(){

    let output = this.requestForm.value;
    let data:any = {};

    data.city = this.selectedCity.name;
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
     
    this.sendEmail(email,data);
   
  }  


  async sendEmail(email:any, data: any) {

    let inputDate = data.start_transit_date.split('-');
    let datestring = inputDate[2] + "-" + inputDate[1] + "-" + inputDate[0] + "T" + data.start_transit_hour +":00";

    await this.storage.setItem('targa', {property: data.targa});
    await this.emailComposer.open(email);
    await this.initContactForm();
    await  this.localNotifications.schedule({
        text: this.stringFormatPipe.transform(notification,data.city,data.start_transit_hour,data.start_transit_date,data.end_transit_hour,data.end_transit_date),
        trigger: {at: new Date(new Date(datestring).getTime() - 600000)},
        led: 'FF0000',
        sound: 'file://sound.mp3'
       });


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
