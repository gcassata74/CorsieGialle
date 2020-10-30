import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { File } from '@ionic-native/file/ngx';

import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { ImageResizer } from '@ionic-native/image-resizer/ngx';
import { DocumentScanner} from '@ionic-native/document-scanner/ngx';
import { DocviewPageModule } from './docview/docview.module';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { EmailComponent } from './email/email.component';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
//import { AutoCompleteModule } from 'ionic4-auto-complete';
import { CityService } from './services/city.service';
import { DatePipe } from '@angular/common';
import { StringFormatPipe } from './utils/string-format.pipe';
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';

@NgModule({
  declarations: [
    AppComponent,
    FileManagerComponent,
    RequestFormComponent,
    EmailComponent,
    StringFormatPipe,
    AutoCompleteComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    DocviewPageModule,
    ReactiveFormsModule,
    FormsModule,
    ],
  providers: [
    StatusBar,
    SplashScreen,
    File ,
    PhotoViewer , 
    DocumentViewer ,
    ImageResizer , 
    DocumentScanner,
    EmailComposer, 
    CityService,
    DatePipe,
    NativeStorage,
    AlertController,
    Keyboard,
    StringFormatPipe,
    LocalNotifications,
    AppRate,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
