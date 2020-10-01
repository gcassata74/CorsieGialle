import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { EmailComposer } from '@ionic-native/email-composer/ngx';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent implements OnInit {

  constructor(public navCtrl: NavController, private emailComposer: EmailComposer) {}

  
  ngOnInit() {}

  sendObj = {
    to: '',
    cc: '',
    bcc: '',
    attachments:'',
    subject:'',
    body:''
  }

 

  sendEmail(){
    let email = {
      to: this.sendObj.to,
      cc: this.sendObj.cc,
      bcc: this.sendObj.bcc,
      attachments: [this.sendObj.attachments],
      subject: this.sendObj.subject,
      body: this.sendObj.body,
      isHtml: true
      }; 
    
    this.emailComposer.open(email);
  }  
  



}
