import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Content, Platform } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { AboutPage } from '../about/about';
import { CommentsPage } from '../comments/comments';
import { PerfilPage } from '../perfil/perfil';
import { MapPage } from '../map/map';
import { FerramentasPage } from '../ferramentas/ferramentas';
import { LaunchNavigator, LaunchNavigatorOptions, AppSelectionOptions, RememberChoiceOptions} from '@ionic-native/launch-navigator';
import { Storage } from '@ionic/storage';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { AlertController } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import { PopoverTopComponent } from '../../components/popover-top/popover-top';
import { PopoverOptsAnunciosComponent } from '../../components/popover-opts-anuncios/popover-opts-anuncios';
import { PopoverNotificacoesComponent } from '../../components/popover-notificacoes/popover-notificacoes';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import $ from 'jquery';
/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var globalLat: any;
declare var globalLng: any;

@IonicPage()
@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {
  @ViewChild("contentRef") contentHandle: Content;
  texto:string;
  public feed: any;
  public btnTop: boolean;
  public btnNews: boolean;
  public topOrNews: any = 'News';
  public index_feed: number;
  options: GeolocationOptions;
  currentPos: Geoposition;
  public items = [];
  public local_array: any;
  public local_array1: any;
  public local_array2: any;
  public local_array3: any;
  public local_array4: any;
  public local_array5: any;
  public teste: any;
  public bairro: string;
  public cidade: string;
  public estado: string;
  public pais: string;
  private tabBarHeight;
  private topOrBottom:string;
  private contentBox;
  destination:string;
  start:string;
  loginId: number;
  userId: any;
  userImagem: any;
  dataIni: any;
  userName: any;
  usuario: any;
  userEmail: any;
  public local: any = "pais";
  public range: any = 1000;
  public nome_usuario: any;
  public foto_usuario: any = 'assets/imgs/user.png';
  public notificacoes_qts: any;
   constructor(public platform: Platform, public sanitizer: DomSanitizer, private iab: InAppBrowser, public navCtrl: NavController, private _sanitizer: DomSanitizer, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public navParams: NavParams, public http: Http, private geolocation: Geolocation, private launchNavigator: LaunchNavigator, public loadingCtrl: LoadingController, private storage: Storage, private photoViewer: PhotoViewer) {
    if(navParams.get("slide")){
      this.local = navParams.get("slide");
      switch(navParams.get("slide")) {
        case "proximidade":
          this.range = 0;
          break;
        case "amigos":
          this.range = 200;
          break;
        case "bairro":
          this.range = 400;
          break;
        case "cidade":
          this.range = 600;
          break;
        case "top":
          this.range = 800;
          break;
        case "News":
          this.range = 1000;
          break;
      }
    }
    this.http = http;
    this.start = "";
    this.destination = "";
    for (let i = 1; i <= 50; i++) {
      this.items.push({ "number": i });
    }

    if(navParams.get("meuid")){
      this.userId = navParams.get("meuid");
    } else {
      this.storage.get('meuid')
      .then( res =>{
        this.getUserInfo(res);
          console.log(res);
          this.userId = res;
        } 
      );

    }

    if(navParams.get("nome")){
      this.userName = navParams.get("nome");
    } else {
      this.storage.get('nome')
      .then( res =>{
        console.log(res);
        this.userName = res;
      } 
    );
      
    }
    
    if(navParams.get("imagem")){
      this.userImagem = navParams.get("imagem");
    } else {
      this.storage.get('imagem')
      .then( res =>{
        console.log(res);
          this.userImagem = res;
        } 
      );
      
    }
    
    if(navParams.get("email")){
      this.userEmail = navParams.get("email");
    } else {
      this.storage.get('email')
      .then( res =>{
          console.log(res);
          this.userEmail = res;
        } 
      );
    }
      
      
      
  }
  public getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
  
  private getSrc(link) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  getUserInfo(user) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id_usuario: user
    }

    let link = 'https://refriplaybusiness.com.br/usuarios/getUserInfo';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      console.log(data);
      this.usuario = data['usuario'];
      this.nome_usuario = this.usuario.nome;
      this.foto_usuario = this.usuario.user_image;
    });

  }

  public checkLink() {
    setTimeout(function() {
  
      'use strict';
      var siteURL = '',
          entries = document.querySelectorAll('ion-card-content.card-content > p'),
          i;
      
      if ( entries.length > 0 ) {
        for (i = 0; i < entries.length; i = i + 1) {
          entries[i].innerHTML = entries[i].innerHTML.replace(/#(\S+)/g,'<a href="#$1">#$1</a>');
          entries[i].innerHTML = entries[i].innerHTML.replace(/http(\S+)/g,'<a (click)="openBrowser(http$1)">http$1</a>');
          entries[i].innerHTML = entries[i].innerHTML.replace(/www(\S+)/g,'<a (click)="openBrowser(http://www$1)">www$1</a>');
        }
      }
    }, 1000);
    
  };
  openBrowser(url){
    console.log(url);
    const browser = this.iab.create(url);
  }

  public update(key: string, data: string) {
    return this.save(key, data);
  }
 
  private save(key: string, data: string) {
    return this.storage.set(key, data);
  }
 
  public remove(key: string) {
    return this.storage.remove(key);
  }
  
  public get(key: string) {
    return this.storage.get(key);
  }

  getQtdNotificacoes() {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id_usuario: this.userId,
    }

    var link = 'https://refriplaybusiness.com.br/usuarios/notificacoes_qtd';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.notificacoes_qts = data;
      });
  }

  enviarEstrelas(stars, anuncio) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id_usuario: this.userId,
      id_anuncio: anuncio,
      n_estrelas: stars
    }

    var link = 'https://refriplaybusiness.com.br/anuncios/stars';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
      });
  }

  denunciarPost(post) {
    if(post.id_anuncio == this.userId) {
      this.showAlert("OPA!","Você não pode denunciar o proprio Post!","OK");
    } else {
      let confirm = this.alertCtrl.create({
        title: 'Você realmente deseja denunciar este Post?',
        message: 'Caso você denuncie este Post ele desaparecerá permanentemente do seu feed!',
        buttons: [
          {
            text: 'Cancelar',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Aceitar',
            handler: () => {

              let index = this.feed.indexOf(post);
              if(index > -1){
                this.feed.splice(index, 1);
              }
              let headers = new Headers();
              headers.append('Access-Control-Allow-Origin', '*');
              headers.append('Accept', 'application/json');
              headers.append('content-type', 'application/json');

              let body = {
                id_usuario: this.userId,
                id_anuncio: post.id_anuncio
              }
              var link = 'https://refriplaybusiness.com.br/post/denunciar';

              this.http.post(link, JSON.stringify(body), { headers: headers })
              .map(res => res.json())
              .subscribe(data => {
                
              });
            }
          }
        ]
      });
      confirm.present();
    }
  }

  alterarTopNews(myEvent) {
    let popover = this.popoverCtrl.create(PopoverTopComponent,{atual:this.topOrNews},{cssClass:"popover-top"});
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(popoverData => {
      if(popoverData != this.topOrNews && (popoverData == "Top" || popoverData == "pão")) {
        this.topOrNews = popoverData;
        this.index_feed = 0;
        this.feed = [];
        this.getUserPosition();
      }
    })
  }
  opts(myEvent, post) {
    let popover = this.popoverCtrl.create(PopoverOptsAnunciosComponent,{},{cssClass:"popover-opts"});
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(popoverData => {
      if(popoverData == "denunciar") {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Accept', 'application/json');
        headers.append('content-type', 'application/json');

        let body = {
          id_usuario: this.userId,
          id_anuncio: post.id
        }
        var link = 'https://refriplaybusiness.com.br/anuncios/denunciarAnuncio';

        this.http.post(link, JSON.stringify(body), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          let index = this.feed.indexOf(post);
            if(index > -1){
              this.feed.splice(index, 1);
            }
        });
      }
    });

  }
  notificacoes(myEvent) {
    let popover = this.popoverCtrl.create(PopoverNotificacoesComponent,{id_usuario: this.userId},{cssClass:"popover-notificacoes"});
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(popoverData => {
      if(popoverData) {
        if(popoverData.tipo == "perfil") {
          this.goPerfil(popoverData.id);
        } else if(popoverData.tipo == "post") {
          this.comments(popoverData.id);
        }
      }
      let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Accept', 'application/json');
      headers.append('content-type', 'application/json');

      let body = {
        id_usuario: this.userId,
      }
      var link = 'https://refriplaybusiness.com.br/usuarios/limparNotificacoes';

      this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.notificacoes_qts = 0;
      });
    })
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.getUserPosition();
      refresher.complete();
    }, 2000);
  }

  seguidores() {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id_usuario: this.userId
    }
    var link = 'https://refriplaybusiness.com.br/anuncios/seguidores';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.index_feed = 0;
        this.feed = data;
        console.log(data);
      });
  }

  alterarLocal(val) {
    if(val == "range") {
      switch(this.range) {
        case 0:
          this.local = "proximidade";
          break;
        case 200:
          this.local = "amigos";
          break;
        case 400:
          this.local = "bairro";
          break;
        case 600:
          this.local = "cidade";
          break;
        case 800:
          this.local = "top";
          break;
        case 1000:
          this.local = "News";
          break;
      }
    } else {
      switch(val) {
        case "proximidade":
          this.range = 0;
          break;
        case "amigos":
          this.range = 200;
          break;
        case "bairro":
          this.range = 400;
          break;
        case "cidade":
          this.range = 600;
          break;
        case "top":
          this.range = 800;
          break;
        case "news":
          this.range = 1000;
          break;
      }
    }
    this.limparFeed();
  }

  limparFeed() {
    this.index_feed = 0;
    this.feed = [];
    this.getUserPosition();
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Publicando...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

  loadMore(infiniteScroll = null) {
    this.index_feed = this.index_feed + 1;
    this.getUserPosition(infiniteScroll);
  }

  ampliarImagem(imagem, texto = "") {
    this.photoViewer.show(imagem,texto,{share:true});
  }

  deleteAnuncio(post) {
    let confirm = this.alertCtrl.create({
      title: 'Você realmente deseja deletar este Post?',
      message: 'Caso você delete este Post ele desaparecerá permanentemente!',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceitar',
          handler: () => {
            let index = this.feed.indexOf(post);
              if(index > -1){
                this.feed.splice(index, 1);
              }
            let headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Accept', 'application/json');
            headers.append('content-type', 'application/json');

            let body = {
              id_anuncio: post.id_anuncio,
            }

            let link = 'https://refriplaybusiness.com.br/anuncios/deletar';

            this.http.post(link, JSON.stringify(body), { headers: headers })
            .map(res => res.json())
            .subscribe(data => {
              console.log(data)
              post.id_anuncio
            });
          }
        }
      ]
    });
    confirm.present();
  }

  navigate(lat, lng){
    this.destination = lat + "," + lng;
    let options: LaunchNavigatorOptions = {
      start: this.start,
      appSelection:{
        rememberChoice: {enabled: false}
      }
    };
    
    this.launchNavigator.navigate(this.destination, options)
        .then(
            success => alert('Launched navigator'),
            error => alert('Error launching navigator: ' + error)
    );
  }

  getUserPosition(infiniteScroll = null) {
    this.options = {
      enableHighAccuracy: true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {

      this.currentPos = pos;
      
      this.loadLocation(pos.coords.latitude, pos.coords.longitude, infiniteScroll);
      console.log(pos.coords.latitude, pos.coords.longitude);

    }, (err: PositionError) => {
      console.log("error : " + err.message);
    });
  }

  showAlert(title, text, button) {
    let alert = this.alertCtrl.create({ title: title, subTitle: text, buttons: [button] });
    alert.present();
  }

  top(postId, tops, status) {
    if(!status){
      let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Accept', 'application/json');
      headers.append('content-type', 'application/json');

      let body = {
        anuncio: postId,
        liker: this.userId
      }
      var link = 'https://refriplaybusiness.com.br/likes/top';

      this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(tops);
        console.log(data);
        var div = document.getElementById('top' + data.anuncio);
        div.innerHTML = "TOP " + (parseInt(tops) + 1);
        var divA = document.getElementById('arrow' + data.anuncio);
        if(divA){
          divA.style.display = "none";
        }
      });
    }
  }
 
  comments(postId) {
   this.navCtrl.push(CommentsPage, {
     anuncio: postId
    });
    // let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Accept', 'application/json');
    // headers.append('content-type', 'application/json');
    // let body = {
    //   anuncio: postId,
    //   liker: this.userId
    // }
    // var link = 'https://refriplaybusiness.com.br/likes/top';
    // this.http.post(link, JSON.stringify(body), { headers: headers })
    //   // .map(res => res.json())
    //   .subscribe(data => {
    //     console.log(data);
    //     // console.log(data.data);
    //   });
  }

  loadLocation(lat, long, infiniteScroll) {
    let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyDSO6Siell1ljeulEnHXDL4a5pfrCttnTc";
    this.http.get(url).map(res => res.json()).subscribe(data => {
      console.log(data);
      this.bairro = data.results[0].address_components[2].long_name;
      this.cidade = data.results[0].address_components[3].long_name;
      this.estado = data.results[0].address_components[5].short_name;
      this.pais = data.results[0].address_components[6].long_name;
      this.loadFeed(lat,long, infiniteScroll);
      this.getQtdNotificacoes();
    });
  }

  loadFeed(lat, long, infiniteScroll, hach: any = null) {

    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true"); 
    this.userId = parseInt(this.userId);
    console.log(this.userId, this.userImagem);
    let tipo:number;
    
    if(this.topOrNews == "Top") {
      tipo = 1;
    } else if(this.topOrNews == "News") {
      tipo = 2;
    }

    let localNome = "nulo";
    if(this.local == "bairro"){
      localNome = this.bairro;
    } else
    if(this.local == "News"){
      localNome = this.topOrNews;
    } else
    if(this.local == "top"){
      localNome = this.topOrNews;
    } else
    if(this.local == "pais"){
      localNome = this.pais;
    } else
    if(this.local == "proximidade"){
      this.topOrNews = "News";
    }
    console.log(localNome);
    let body = {
      l_tipo: this.local,
      local: localNome,
      userId: this.userId,
      index: this.index_feed,
      publico: 1,
      lat: lat,
      long: long,
      tipo: tipo,
      hach: hach
    }
    var link = 'https://refriplaybusiness.com.br/anuncios/puxarTodos';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log( data.data, data.status);
        if ( data.data ) {
          data.data.forEach(element => {
            // element.usuario == parseInt(element.usuario);
            if(element.distance >= 1) {
               element.unit = 'Km';
               element.distance = parseInt(element.distance);
              } else {
                element.distance = element.distance * 1000;
                element.distance = parseInt(element.distance);
              element.unit = 'm';
            }
             console.log(element.distance);
          });
        };
        if (this.feed && data.status && this.feed != data.data) {
          if(!infiniteScroll) {
            this.index_feed = 0;
            this.feed = [];
          }
          data.data.forEach(element => {
            console.log(element.distance);
            this.feed.push(element);
          });
          
          console.log(this.feed);
          console.log(this.index_feed);
          this.checkLink();
          if(infiniteScroll) {
            infiniteScroll.complete();
          }
        } else {
          if (!data.status) {
            if(infiniteScroll) {
              infiniteScroll.complete();
            }
          } else {
            if(this.feed != data.data) {
              this.feed = data.data;
              this.checkLink();
            }
            if(infiniteScroll) {
              infiniteScroll.complete();
            }
          }
        }
        console.log(data);
      });
  }

  goImage() {
    this.navCtrl.push(AboutPage, {slide: this.local});
  }

  goPerfil(id_perfil = this.userId) {
    this.getData(id_perfil);
    console.log(id_perfil);
  }
  goPagePerfil(perfilId, image, nome){
    console.log(perfilId, image, nome);
    this.navCtrl.push(PerfilPage, {
        perfilId: perfilId, userId: this.userId, image: image, nome: nome
    });
  }
  scrollingFun(e) {
    if (e.scrollTop > 1) {
      if(document.getElementsByClassName("scroll-content")[1]){
        document.getElementsByClassName("scroll-content")[1]['style'].marginTop = '100px';
      }
      if(document.getElementsByClassName("scroll-content")[0]){
        document.getElementsByClassName("scroll-content")[0]['style'].marginTop = '100px';
      }
      if(document.querySelector("#sendbar")){
        document.querySelector("#sendbar")['style'].display = 'none';
      }

    } 
    if(e.deltaY < 0) {
      if(document.getElementsByClassName("scroll-content")[1]){
        document.getElementsByClassName("scroll-content")[1]['style'].marginTop = '145px';
      }
      if(document.getElementsByClassName("scroll-content")[0]){
        document.getElementsByClassName("scroll-content")[0]['style'].marginTop = '145px';
      }
      if(document.querySelector("#sendbar")){
        document.querySelector("#sendbar")['style'].display = 'flex';
      }

    }//if 
  }//scrollingFun
  goMap(lat, lng, img, user) {
    console.log(img, user);
    let data = {
      lat: lat,
      lng: lng,
      imagem: img,
      user: user
    }
    console.log(data);
    this.navCtrl.push(MapPage, data);
  }

  getUserPostPosition() {
    this.presentLoadingDefault();
    this.options = {
      enableHighAccuracy: true
    };

    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {

      this.currentPos = pos;
      console.log(pos.coords.latitude, pos.coords.longitude);
      // this.getGeocode(pos.coords.latitude, pos.coords.longitude);
      let url2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + pos.coords.latitude + "," + pos.coords.longitude + "&rankby=distance&key=AIzaSyDSO6Siell1ljeulEnHXDL4a5pfrCttnTc";
      this.http.get(url2).map(res => res.json()).subscribe(data2 => {
        this.local_array1 = data2.results[0].name;
        this.local_array2 = data2.results[1].name;
        this.local_array3 = data2.results[2].name;
        this.local_array4 = data2.results[3].name;
        this.local_array5 = data2.results[4].name;

        let alert = this.alertCtrl.create();
        alert.setTitle('Onde você está?');
    
        alert.addInput({
          type: 'radio',
          label: this.local_array1,
          value: this.local_array1,
          checked: false
        });
    
        alert.addInput({
          type: 'radio',
          label: this.local_array2,
          value: this.local_array2,
          checked: false
        });
    
        alert.addInput({
          type: 'radio',
          label: this.local_array3,
          value: this.local_array3,
          checked: false
        });
    
        alert.addInput({
          type: 'radio',
          label: this.local_array4,
          value: this.local_array4,
          checked: false
        });
    
        alert.addInput({
          type: 'radio',
          label: this.local_array5,
          value: this.local_array5,
          checked: false
        });
    
        alert.addButton('Cancel');
        alert.addButton({
          text: 'OK',
          handler: data => {
            this.sendPost(pos.coords.latitude, pos.coords.longitude, data);
          }
        });
        alert.present();
      });
    }, (err: PositionError) => {
      console.log("error : " + err.message);
    });
    
  }

  // sendPost(lat, long, bairro, cidade, estado, pais, tipo, local) {
  sendPost(lat, lng, local) {
    let tipo:number;
    if(this.btnTop) {
      tipo = 1;
    } else if(this.btnNews) {
      tipo = 2;
    }
    
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyDSO6Siell1ljeulEnHXDL4a5pfrCttnTc";
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.bairro = data.results[0].address_components[2].long_name;
      this.cidade = data.results[0].address_components[3].long_name;
      this.estado = data.results[0].address_components[5].short_name;
      this.pais = data.results[0].address_components[6].long_name;
    });

  
    let body = {
      local: local,
      userId: this.userId,
      imagem: "none",
      texto: this.texto,
      lat: lat,
      long: lng,
      bairro: this.bairro,
      cidade: this.cidade,
      estado: this.estado,
      pais: this.pais,
      tipo: tipo,
      usuario: this.userId
    }
    var link = 'https://refriplaybusiness.com.br/anuncios/criar';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        
        console.log(data["_body"]);
        this.navCtrl.push('FeedPage');
      });

  }
  
  getGeocode(lat, lng){
        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyDSO6Siell1ljeulEnHXDL4a5pfrCttnTc";
        this.http.get(url).map(res => res.json()).subscribe(data => {

        });
    
        let url2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + "&rankby=distance&key=AIzaSyDSO6Siell1ljeulEnHXDL4a5pfrCttnTc";
        this.http.get(url2).map(res => res.json()).subscribe(data2 => {
        });
        
    
  }

  public getData(id_usuario = this.userId) {
    console.log(id_usuario);
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id_usuario: id_usuario
    }

    let link = 'https://refriplaybusiness.com.br/usuarios/getUserInfo';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      console.log(data)
      this.goPagePerfil(data.usuario.id, data.usuario.user_image, data.usuario.nome);
  
    });
  }

  setStorage() {
    this.getUserPosition();
  }

  goFerramentas(){
    this.navCtrl.push(FerramentasPage,{userId: this.userId, email: this.userEmail, nome: this.nome_usuario});
  }


  ionViewDidLoad() {
    this.index_feed = 0;
    this.getUserPosition();

  }


}
