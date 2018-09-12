import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Content, Platform, ToastController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { AboutPage } from '../about/about';
import { CommentsPage } from '../comments/comments';
import { PerfilPage } from '../perfil/perfil';
import { MapPage } from '../map/map';
import { LaunchNavigator, LaunchNavigatorOptions, AppSelectionOptions, RememberChoiceOptions } from '@ionic-native/launch-navigator';
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

import { PesquisarPage } from '../pesquisar/pesquisar';
import { NotificacoesPage } from '../notificacoes/notificacoes';
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
  public unregisterBackButtonAction: any;
  texto: string;
  public feed: any;
  public btnTop: boolean;
  public btnNews: boolean;
  public topOrNews: any = 'News';
  public index_feed: number;
  options: GeolocationOptions;
  currentPos: Geoposition;
  public items = [];
  public boolVer = 'false';
  public local_array: any;
  public local_array1: any;
  public local_array2: any;
  public local_array3: any;
  public local_array4: any;
  public local_array5: any;
  public alturaVerMais = '240px';
  public teste: any;
  public bairro: string;
  public cidade: string;
  public estado: string;
  public pais: string;
  private tabBarHeight;
  private topOrBottom: string;
  private contentBox;
  destination: string;
  start: string;
  loginId: number;
  userId: any;
  userImagem: any;
  userName: any;
  usuario: any;
  userEmail: any;
  public buttonId: string = 'News';
  public local: any = "proximidade";
  public range: any;
  public nome_usuario: any;
  public foto_usuario: any;
  public notificacoes_qts: any;
  public progress: any;
  constructor(public platform: Platform, private iab: InAppBrowser, public navCtrl: NavController, private _sanitizer: DomSanitizer, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public navParams: NavParams, public http: Http, private geolocation: Geolocation, private launchNavigator: LaunchNavigator, public loadingCtrl: LoadingController, private storage: Storage, private photoViewer: PhotoViewer, private toastCtrl: ToastController) {
    if (navParams.get("slide")) {
      this.local = navParams.get("slide");
      switch (navParams.get("slide")) {
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
        case "estado":
          this.range = 800;
          break;
        case "pais":
          this.range = 1000;
          break;
      }
    }
    if(this.navParams.get("progress")){
      this.progress = true;
      this.loadProgress();
      this.storage.get('meuid')
      .then(res => {
        this.getUserInfo(res);
        console.log(res);
        this.userId = res;
      }
      );
    }
    this.http = http;
    this.start = "";
    this.destination = "";
    for (let i = 1; i <= 50; i++) {
      this.items.push({ "number": i });
    }
    this.storage.get('meuid')
      .then(res => {
        this.getUserInfo(res);
        console.log(res);
        this.userId = res;
      }
      );
    this.storage.get('nome')
      .then(res => {
        console.log(res);
        this.userName = res;
      }
      );
    this.storage.get('imagem')
      .then(res => {
        console.log(res);
        this.userImagem = res;
      }
      );
    this.storage.get('email')
      .then(res => {
        console.log(res);
        this.userEmail = res;
      }
      );
  }

  public initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
        this.customHandleBackButton();
    }, 10);
  }

  private customHandleBackButton(): void {
      //alert("NOPE!");
  }

  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  getSrc(link) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  goPesquisar(id) {
    this.navCtrl.push(PesquisarPage, { userId: id });
  }
  
  loadProgress(){
    setTimeout(() =>{
      this.progress = false;
    }, 6000)
  }

  vermais(){
    if(this.boolVer == 'false'){
      this.alturaVerMais = '700px';
      this.boolVer = 'true';
    }
    else if(this.boolVer == 'true'){
      this.alturaVerMais = '240px';
      this.boolVer = 'false';
    }
  }
  

  getUserInfo(user) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id_usuario: user
    }

    let link = 'http://18.217.102.194/usuarios/getUserInfo';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.usuario = data['usuario'];
        this.nome_usuario = this.usuario.nome;
        this.foto_usuario = this.usuario.user_image;
      });

  }

  public checkLink() {
    setTimeout(function () {

      'use strict';
      var siteURL = '',
        entries = document.querySelectorAll('ion-card-content.card-content > p'),
        i;

      if (entries.length > 0) {
        for (i = 0; i < entries.length; i = i + 1) {
          entries[i].innerHTML = entries[i].innerHTML.replace(/#(\S+)/g, '<a href="#$1">#$1</a>');
          entries[i].innerHTML = entries[i].innerHTML.replace(/http(\S+)/g, '<a (click)="openBrowser(http$1)">http$1</a>');
          entries[i].innerHTML = entries[i].innerHTML.replace(/www(\S+)/g, '<a (click)="openBrowser(http://www$1)">www$1</a>');
        }
      }
    }, 1000);

  };
  openBrowser(url) {
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

    var link = 'http://18.217.102.194/usuarios/notificacoes_qtd';

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

    var link = 'http://18.217.102.194/anuncios/stars';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
      });
  }

  denunciarPost(post) {
    if (post.id_anuncio == this.userId) {
      this.showAlert("OPA!", "Você não pode denunciar o proprio Post!", "OK");
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
              if (index > -1) {
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
              var link = 'http://18.217.102.194/post/denunciar';

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

  alterarTopNews() {
    this.index_feed = 0;
    this.feed = [];
    this.getUserPosition();
  }
  opts(myEvent, post) {
    let popover = this.popoverCtrl.create(PopoverOptsAnunciosComponent, {}, { cssClass: "popover-opts" });
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(popoverData => {
      if (popoverData == "denunciar") {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Accept', 'application/json');
        headers.append('content-type', 'application/json');

        let body = {
          id_usuario: this.userId,
          id_anuncio: post.id
        }
        var link = 'http://18.217.102.194/anuncios/denunciarAnuncio';

        this.http.post(link, JSON.stringify(body), { headers: headers })
          .map(res => res.json())
          .subscribe(data => {
            let index = this.feed.indexOf(post);
            if (index > -1) {
              this.feed.splice(index, 1);
            }
          });
      }
    });

  }
  notificacoes(myEvent) {
    let popover = this.popoverCtrl.create(PopoverNotificacoesComponent, { id_usuario: this.userId }, { cssClass: "popover-notificacoes" });
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(popoverData => {
      if (popoverData) {
        if (popoverData.tipo == "perfil") {
          this.goPerfil(popoverData.id);
        } else if (popoverData.tipo == "post") {
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
      var link = 'http://18.217.102.194/usuarios/limparNotificacoes';

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
    var link = 'http://18.217.102.194/anuncios/seguidores';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.index_feed = 0;
        this.feed = data;
        console.log(data);
      });
  }

  alterarLocal(val) {
    if (val == "range") {
      if(this.range <= 100) {
        this.local = "proximidade";
      } else if(this.range > 100 && this.range <= 300) {
        this.local = "amigos";
      } else if(this.range > 300 && this.range <= 500) {
        this.local = "bairro";
      } else if(this.range > 500 && this.range <= 700) {
        this.local = "cidade";
      } else if(this.range > 700 && this.range <= 900) {
        this.local = "estado";
      } else if(this.range > 900) {
        this.local = "pais";
      }
    } else {
      switch (val) {
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
        case "estado":
          this.range = 800;
          break;
        case "pais":
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
    this.photoViewer.show(imagem, texto, { share: true });
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
            if (index > -1) {
              this.feed.splice(index, 1);
            }
            let headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Accept', 'application/json');
            headers.append('content-type', 'application/json');

            let body = {
              id_anuncio: post.id_anuncio,
            }

            let link = 'http://18.217.102.194/anuncios/deletar';

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

  navigate(lat, lng) {
    this.destination = lat + "," + lng;
    let options: LaunchNavigatorOptions = {
      start: this.start,
      appSelection: {
        rememberChoice: { enabled: false }
      }
    };

    this.launchNavigator.navigate(this.destination, options)
      .then(
        success => alert('Launched navigator'),
        error => alert('Error launching navigator: ' + error)
      );
  }

  getUserPosition(infiniteScroll = null) {
    console.log('aqui');
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
    if (!status) {
      let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Accept', 'application/json');
      headers.append('content-type', 'application/json');

      let body = {
        anuncio: postId,
        liker: this.userId
      }
      var link = 'http://18.217.102.194/likes/top';

      this.http.post(link, JSON.stringify(body), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          console.log(tops);
          console.log(data);
          var div = document.getElementById('top' + data.anuncio);
          div.innerHTML = "TOP " + (parseInt(tops) + 1);
          var divA = document.getElementById('arrow' + data.anuncio);
          if (divA) {
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
    // var link = 'http://18.217.102.194/likes/top';
    // this.http.post(link, JSON.stringify(body), { headers: headers })
    //   // .map(res => res.json())
    //   .subscribe(data => {
    //     console.log(data);
    //     // console.log(data.data);
    //   });
  }
  compartilhar(anuncio_id, image) {

    const confirm = this.alertCtrl.create({
      title: 'Compartilhar com seguidores?',
      cssClass: 'camelo',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Não',
          cssClass: 'nao',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Sim',
          
          handler: () => {
            let headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Accept', 'application/json');
            headers.append('content-type', 'application/json');
            headers.append('Access-Control-Expose-Headers', "true");

            let body = {
              id_anuncio: anuncio_id,
              id_usuario: this.userId,
              image: image
            }
            var link = 'http://18.217.102.194/compartilhamentos/compartilhar';

            this.http.post(link, JSON.stringify(body), { headers: headers })
              .map(res => res.json())
              .subscribe(data => {
                console.log(data);
                let toast = this.toastCtrl.create({
                  message: 'Compartilhado',
                  duration: 2000,
                  position: 'bottom'
                });
                toast.present();
              });

          }
        }
      ]
    });
    confirm.present();



    //  this.navCtrl.push(CommentsPage, {
    //    anuncio: postId
    //   });
    // let headers = new Headers();
    // headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Accept', 'application/json');
    // headers.append('content-type', 'application/json');
    // let body = {
    //   anuncio: postId,
    //   liker: this.userId
    // }
    // var link = 'http://18.217.102.194/likes/top';
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
      this.loadFeed(lat, long, infiniteScroll);
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
    let tipo: number;

    if (this.topOrNews == "Top") {
      tipo = 1;
    } else if (this.topOrNews == "News") {
      tipo = 2;
    }

    let localNome = "nulo";
    if (this.local == "bairro") {
      localNome = this.bairro;
    } else
      if (this.local == "cidade") {
        localNome = this.cidade;
      } else
        if (this.local == "estado") {
          localNome = this.estado;
        } else
          if (this.local == "pais") {
            localNome = this.pais;
          } else
            if (this.local == "proximidade") {
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
    var link = 'http://18.217.102.194/anuncios/puxarTodos';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data.data, data.status);
        if (data.data) {
          data.data.forEach(element => {
            // element.usuario == parseInt(element.usuario);
            if (element.distance >= 1) {
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
          if (!infiniteScroll) {
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
          if (infiniteScroll) {
            infiniteScroll.complete();
          }
        } else {
          if (!data.status) {
            if (infiniteScroll) {
              infiniteScroll.complete();
            }
          } else {
            if (this.feed != data.data) {
              this.feed = data.data;
              this.checkLink();
            }
            if (infiniteScroll) {
              infiniteScroll.complete();
            }
          }
        }
        console.log(data);
      });
  }

  goImage() {
    this.navCtrl.push(AboutPage, { slide: this.local });
  }

  goPerfil(id_perfil = this.userId) {
    this.getData(id_perfil);
    console.log(id_perfil);
  }
  goPesquisa(id_perfil = this.userId) {
    this.navCtrl.push(PesquisarPage, {
    });
    console.log(id_perfil);
  }
  goNotif(id_perfil = this.userId) {
    
    this.navCtrl.push(NotificacoesPage, {userId: id_perfil});
    let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Accept', 'application/json');
      headers.append('content-type', 'application/json');

      let body = {
        id_usuario: this.userId,
      }
      var link = 'http://18.217.102.194/usuarios/limparNotificacoes';

      this.http.post(link, JSON.stringify(body), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.notificacoes_qts = 0;
        });
    console.log(id_perfil);
  }
  goPagePerfil(perfilId, image, nome) {
    console.log(perfilId, image, nome);
    this.navCtrl.push(PerfilPage, {
      perfilId: perfilId, userId: this.userId, image: image, nome: nome
    });
  }
  goPerfilPage(perfilId, image, nome, post, seguindo, seguidores) {
    console.log(perfilId, image, nome);
    this.navCtrl.push(PerfilPage, {
      perfilId: perfilId, userId: this.userId, image: image, nome: nome, post: post, seguindo: seguindo, seguidores: seguidores
    });
  }
 
  scrollingFun(e) {
    
    if(e.scrollTop > 1 && e.deltaY >=0) {
        for(let i=0; i < document.getElementsByClassName("scroll-content").length; i++){
          document.getElementsByClassName("scroll-content")[i]['style'].marginTop = '100px';
        } 
        // document.getElementsByClassName("scroll-content")[0]['style'].marginTop = '100px';
        // document.getElementsByClassName("scroll-content")[2]['style'].marginTop = '100px';
        for(let i = 0; i < document.getElementsByClassName("sendbar").length; i++){
          document.getElementsByClassName("sendbar")[i]['style'].display = 'none';
        }
        // document.getElementsByClassName("sendbar")[0]['style'].display = 'none';
        // document.getElementsByClassName("sendbar")[1]['style'].display = 'none';
        console.log("hide");
    }
    else if(e.deltaY < 0) {
      for(let i=0; i < document.getElementsByClassName("scroll-content").length; i++){
        document.getElementsByClassName("scroll-content")[i]['style'].marginTop = '145px';

      } 
        // document.getElementsByClassName("scroll-content")[1]['style'].marginTop = '145px';
        // document.getElementsByClassName("scroll-content")[0]['style'].marginTop = '145px';
        // document.getElementsByClassName("scroll-content")[2]['style'].marginTop = '145px';

        for(let i = 0; i < document.getElementsByClassName("sendbar").length; i++){
          document.getElementsByClassName("sendbar")[i]['style'].display = 'flex';
        }

        // document.getElementsByClassName("sendbar")[0]['style'].display = 'flex'; 
        // document.getElementsByClassName("sendbar")[1]['style'].display = 'flex'; 
        // console.log("show");
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
    let tipo: number;
    if (this.btnTop) {
      tipo = 1;
    } else if (this.btnNews) {
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
    var link = 'http://18.217.102.194/anuncios/criar';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {

        console.log(data["_body"]);
        this.navCtrl.push('FeedPage');
      });

  }

  getGeocode(lat, lng) {
    let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyDSO6Siell1ljeulEnHXDL4a5pfrCttnTc";
    this.http.get(url).map(res => res.json()).subscribe(data => {

    });

    let url2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + lat + "," + lng + "&rankby=distance&key=AIzaSyDSO6Siell1ljeulEnHXDL4a5pfrCttnTc";
    this.http.get(url2).map(res => res.json()).subscribe(data2 => {
    });


  }

  public PerfilPage(id_usuario) {
    console.log(id_usuario);
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id_usuario: id_usuario
    }

    let link = 'http://18.217.102.194/usuarios/getUserInfo';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log("AQUI", data)
        this.goPerfilPage(data.usuario.id, data.usuario.user_image, data.usuario.nome, data.posts, data.seguido, data.seguidor);

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

    let link = 'http://18.217.102.194/usuarios/getUserInfo';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log(data)
        this.goPagePerfil(data.usuario.id, data.usuario.user_image, data.usuario.nome);

      });
  }

   public showRadio() {
    let alert = this.alertCtrl.create({
      title: 'Top ou News',
      
    });
    

    alert.addInput({
      type: 'radio',
      label: 'News',
      value: 'News',
      
      
    });
    alert.addInput({
      type: 'radio',
      label: 'Top',
      value: 'Top',
      
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data =>{
        this.topOrNews = data;
        this.buttonId = data;
        this.getUserPosition();
      }
    });
    alert.present();
    
  }


  setStorage() {
    this.getUserPosition();
  }

  ionViewDidLoad() {
    this.index_feed = 0;
    this.getUserPosition();
    this.getUserInfo(this.userId);
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
}


}
