import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Content, Platform, ToastController, ViewController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { AboutPage } from '../about/about';
import { CommentsPage } from '../comments/comments';
import { PerfilPage } from '../perfil/perfil';
import { PreperfilPage } from '../preperfil/preperfil';
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

/**
 * Generated class for the NotificacoesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notificacoes',
  templateUrl: 'notificacoes.html',
})
export class NotificacoesPage {
  @ViewChild("contentRef") contentHandle: Content;
  texto: string;
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
  public notificacoesPost:any;
  constructor(public viewCtrl: ViewController, public platform: Platform, private iab: InAppBrowser, public navCtrl: NavController, private _sanitizer: DomSanitizer, public popoverCtrl: PopoverController, public alertCtrl: AlertController, public navParams: NavParams, public http: Http, private geolocation: Geolocation, private launchNavigator: LaunchNavigator, public loadingCtrl: LoadingController, private storage: Storage, private photoViewer: PhotoViewer, private toastCtrl: ToastController) {
    this.http = http;
    this.userId = navParams.get("userId");
    this.carregar_notificacoes();
  }
  async carregar_notificacoes() {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    headers.append('Access-Control-Expose-Headers', "true");

    let body = {
      id_usuario: this.userId
    }
    var link = 'https://wa-studio.com/redelive/usuarios/notificacoes';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.notificacoesPost = data;
        console.log(this.notificacoes);
        this.getUserInfo(this.userId);
      });
  }
  goPost(post_id) {
    let data = {
      tipo: "post",
      id: post_id
    }
    this.viewCtrl.dismiss(data);
  }

  goPerfil(perfil_id) {
    let data = {
      tipo: "perfil",
      id: perfil_id
    }
    this.viewCtrl.dismiss(data);
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

  getUserInfo(user) {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id_usuario: user
    }

    let link = 'https://wa-studio.com/redelive/usuarios/getUserInfo';

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

    var link = 'https://wa-studio.com/redelive/usuarios/notificacoes_qtd';

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

    var link = 'https://wa-studio.com/redelive/anuncios/stars';

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
              var link = 'https://wa-studio.com/redelive/post/denunciar';

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
        var link = 'https://wa-studio.com/redelive/anuncios/denunciarAnuncio';

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
      var link = 'https://wa-studio.com/redelive/usuarios/limparNotificacoes';

      this.http.post(link, JSON.stringify(body), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          this.notificacoes_qts = 0;
        });
    })
  }

  doRefresh(refresher) {
    setTimeout(() => {
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
    var link = 'https://wa-studio.com/redelive/anuncios/seguidores';

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
      switch (this.range) {
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
          this.local = "estado";
          break;
        case 1000:
          this.local = "pais";
          break;
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

            let link = 'https://wa-studio.com/redelive/anuncios/deletar';

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
      var link = 'https://wa-studio.com/redelive/likes/top';

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
    // var link = 'https://wa-studio.com/redelive/likes/top';
    // this.http.post(link, JSON.stringify(body), { headers: headers })
    //   // .map(res => res.json())
    //   .subscribe(data => {
    //     console.log(data);
    //     // console.log(data.data);
    //   });
  }
  compartilhar(anuncio_id) {

    const confirm = this.alertCtrl.create({
      title: 'Compartilhar com seguidores?',
      cssClass: 'camelo',
      message: 'Do you agree to use this lightsaber to do good across the intergalactic galaxy?',
      buttons: [
        {
          text: 'Não',
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
              id_usuario: this.userId
            }
            var link = 'https://wa-studio.com/redelive/compartilhamentos/compartilhar';

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
    // var link = 'https://wa-studio.com/redelive/likes/top';
    // this.http.post(link, JSON.stringify(body), { headers: headers })
    //   // .map(res => res.json())
    //   .subscribe(data => {
    //     console.log(data);
    //     // console.log(data.data);
    //   });
  }

  
  

  goImage() {
    this.navCtrl.push(AboutPage, { slide: this.local });
  }
  goPesquisa(id_perfil = this.userId) {
    this.navCtrl.push(PesquisarPage, {
    });
    console.log(id_perfil);
  }
  goPagePerfil(perfilId, image, nome) {
    console.log(perfilId, image, nome);
    this.navCtrl.push(PerfilPage, {
      perfilId: perfilId, userId: this.userId, image: image, nome: nome
    });
  }
  goPagePreperfil(perfilId, image, nome, post, seguindo, seguidores) {
    console.log(perfilId, image, nome);
    this.navCtrl.push(PreperfilPage, {
      perfilId: perfilId, userId: this.userId, image: image, nome: nome, post: post, seguindo: seguindo, seguidores: seguidores
    });
  }
  scrollingFun(e) {
    if (e.scrollTop > 1) {
      if (document.getElementsByClassName("scroll-content")[1]) {
        document.getElementsByClassName("scroll-content")[1]['style'].marginTop = '100px';
      }
      if (document.getElementsByClassName("scroll-content")[0]) {
        document.getElementsByClassName("scroll-content")[0]['style'].marginTop = '100px';
      }
      if (document.querySelector("#sendbar")) {
        document.querySelector("#sendbar")['style'].display = 'none';
      }

    }
    if (e.deltaY < 0) {
      if (document.getElementsByClassName("scroll-content")[1]) {
        document.getElementsByClassName("scroll-content")[1]['style'].marginTop = '145px';
      }
      if (document.getElementsByClassName("scroll-content")[0]) {
        document.getElementsByClassName("scroll-content")[0]['style'].marginTop = '145px';
      }
      if (document.querySelector("#sendbar")) {
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
    var link = 'https://wa-studio.com/redelive/anuncios/criar';

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

  public prePerfilPage(id_usuario) {
    console.log(id_usuario);
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id_usuario: id_usuario
    }

    let link = 'https://wa-studio.com/redelive/usuarios/getUserInfoPreperfil';

    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        console.log("AQUI", data)
        this.goPagePreperfil(data.usuario.id, data.usuario.user_image, data.usuario.nome, data.posts, data.seguido, data.seguidor);

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

    let link = 'https://wa-studio.com/redelive/usuarios/getUserInfo';

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
      }
    });
    alert.present();
  }


 
  ionViewDidLoad() {
    this.index_feed = 0;
  }

}
