import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { comuni }  from '../data/comuni';
import { CityService } from '../services/city.service';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { encode } from 'punycode';
import { DatePipe } from '@angular/common';
import { StringFormatPipe } from '../utils/string-format.pipe';

const subject:string = "Richiesta autorizzazione transito corsie preferenziali / ZTL";
const mailbody:string = "Con la presente sono a richiedere il permesso di transito temporaneo su ztl e corsie gialle del vostro comune per il giorno {0}, dalle ore {1} alle ore {2}, per il veicolo targato {3},allego la documentazione inerente alla titolarità di transito. \n Richiedo cortese riscontro positivo o negativo alla richiesta, in risposta alla presente mail, per evitare inutili sanzioni e ricorsi vista l'evidente titolarità di transito \n Cordiali saluti"

@Component({
  selector: 'app-request-form',
  templateUrl: './request-form.component.html',
  styleUrls: ['./request-form.component.scss'],
})
export class RequestFormComponent implements OnInit {
 
 

  requestForm: FormGroup;

  constructor(private stringFormatPipe:StringFormatPipe,
              private datePipe: DatePipe,
              private formBuilder: FormBuilder, 
              public cityService: CityService,
              private emailComposer: EmailComposer) {
    this.createContactForm();
  }

  ngOnInit() { }
  

  createContactForm(){
    this.requestForm = this.formBuilder.group({
      city: ['', Validators.required],
      transit_date: [new Date(), Validators.required],  
      start_transit_hour:['', Validators.required],
      end_transit_hour:['', Validators.required],
      targa: ['', Validators.required],

    });
  }

  onSubmit() {
      let output = this.requestForm.value;
      output.transit_date = this.datePipe.transform(new Date(output.transit_date), 'dd-MM-yyyy');
      output.start_transit_hour = this.datePipe.transform(new Date(output.start_transit_hour),'HH:mm');
      output.end_transit_hour = this.datePipe.transform(new Date(output.end_transit_hour),'HH:mm');
      this.sendEmail(output);
  }

  

  sendEmail(output){
     

    let email = {
      to: "giuseppe.cassata74@gmail.com",
      //cc: this.sendObj.cc,
      //bcc: this.sendObj.bcc,
      attachments: [],
      subject: subject,
      body: this.stringFormatPipe.transform(mailbody,output.transit_date,output.start_transit_hour,output.end_transit_hour, output.targa.toUpperCase()),
      isHtml: true
      }; 
    
    this.emailComposer.open(email);
  }  

}
