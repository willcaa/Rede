import { AngularFireModule, FirebaseApp } from 'angularfire2';
import { AngularFireStorageModule, AngularFireStorage } from 'angularFire2/storage';
import { AngularFireDatabaseModule, AngularFireDatabase  } from 'angularfire2/database';
import firebase from 'firebase';
declare var globalLat: any;
declare var globalLng: any;
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, Popover } from 'ionic-angular';
import { MyApp } from './app.component';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { IonicStorageModule } from '@ionic/storage';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { FilePath } from '@ionic-native/file-path';

import { AboutPage } from '../pages/about/about';
import { PesquisarPage } from '../pages/pesquisar/pesquisar';
import { CommentsPage } from '../pages/comments/comments';
import { CheckinPage } from '../pages/checkin/checkin'
import { ContactPage } from '../pages/contact/contact';
import { PerfilPage } from '../pages/perfil/perfil';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MapPage } from '../pages/map/map';
import { RegisterPage } from '../pages/register/register';
import { FeedPageModule } from '../pages/feed/feed.module';
import { StatsPage } from '../pages/stats/stats';
import { PreperfilPage } from '../pages/preperfil/preperfil';
import { EditarperfilPage } from '../pages/editarperfil/editarperfil';

import { StatusBar } from '@ionic-native/status-bar';
import { Geolocation } from '@ionic-native/geolocation';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { GoogleMaps } from '@ionic-native/google-maps';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { Facebook } from '@ionic-native/facebook';
import { LocatonsProvider } from '../providers/locatons/locatons';
import { PopoverDenunciarComponent } from '../components/popover-denunciar/popover-denunciar';
import { PopoverTopComponent } from '../components/popover-top/popover-top';
import { PopoverOptsAnunciosComponent } from '../components/popover-opts-anuncios/popover-opts-anuncios';
import { PopoverNotificacoesComponent } from '../components/popover-notificacoes/popover-notificacoes';
import { ListaPage } from '../pages/lista/lista';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UploadsProvider } from '../providers/uploads/uploads';
import { PesquisarPageModule } from '../pages/pesquisar/pesquisar.module';
// import { PreperfilPageModule } from '../pages/preperfil/preperfil.module';
import { NotificacoesPage } from '../pages/notificacoes/notificacoes';


var config = {
  apiKey: "AIzaSyDSm9-mf313F665PuNQiP4khMPpv6Hraac",
  authDomain: "refriplay-193b6.firebaseapp.com",
  databaseURL: "https://refriplay-193b6.firebaseio.com",
  projectId: "refriplay-193b6",
  storageBucket: "refriplay-193b6.appspot.com",
  messagingSenderId: "794076739257"
};

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    CommentsPage,
    CheckinPage,
    ContactPage,
    PerfilPage,
    PreperfilPage,
    EditarperfilPage,
    NotificacoesPage,
    HomePage,
    TabsPage,
    MapPage,
    StatsPage,
    PesquisarPage,
    RegisterPage,
    PopoverDenunciarComponent,
    PopoverTopComponent,
    PopoverOptsAnunciosComponent,
    PopoverNotificacoesComponent,
    ListaPage
  ],
  
  imports: [
    AngularFireModule.initializeApp(config),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      backButtonIcon: 'ios-arrow-back',
    }),
    IonicStorageModule.forRoot(),
    FeedPageModule,
    HttpModule,
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    CheckinPage,
    PerfilPage,
    PreperfilPage,
    EditarperfilPage,
    HomePage,
    TabsPage,
    MapPage,
    NotificacoesPage,
    StatsPage,
    RegisterPage,
    CommentsPage,
    PesquisarPage,
    PopoverDenunciarComponent,
    PopoverTopComponent,
    PopoverOptsAnunciosComponent,
    PopoverNotificacoesComponent,
    ListaPage
  ],
  providers: [
    StatusBar,
    ImagePicker,
    FileOpener,
    Geolocation,
    AngularFireStorage,
    GoogleMaps,
    InAppBrowser,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FileTransfer,
    FileTransferObject,
    File,
    FilePath,
    LaunchNavigator,
    Camera,
    Facebook,
    PhotoViewer,
    FileChooser,
    LocatonsProvider,
    ScreenOrientation,
    UploadsProvider
  ]
})
export class AppModule {}
