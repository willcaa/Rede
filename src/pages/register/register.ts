import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, ToastController, NavParams, Content } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Facebook } from '@ionic-native/facebook';
import { Storage } from '@ionic/storage';
import { FeedPage } from '../feed/feed';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  loginInvalido = false;
  isLoggedIn:boolean = false;
  users: any;
  destination: string;
  start: string;
  data:any = {};
  loginId: number;
  pageId:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, private fb: Facebook, private storage: Storage) {
    this.pageId="login";
    this.http = http;
    this.start = "";
    this.destination = "";
    fb.getLoginStatus()
    .then(res => {
      console.log(res.status);
      if(res.status === "connect") {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    })
    .catch(e => console.log(e));
  }
  alterarTab(Id){
    this.pageId = Id;
    console.log(this.pageId);
  }


  cadastrar(email, nome, pw) {
  
    this.storage.get('meuid').then((val) => {
      console.log('Id', val);
      this.loginId = val;
    });
    if(this.loginId) {
      this.navCtrl.push('FeedPage');
      console.log(" logado");
    } else {
      let headerx = new Headers();
      headerx.append('Access-Control-Allow-Origin', '*');
      headerx.append('Accept', 'application/json');
      headerx.append('content-type', 'application/json');
      var body = {
        email: email,
        nome: nome,
        pw: pw,
        imagem: 'none'
      }
      var link = 'https://bluedropsproducts.com/app/usuarios/cadastrar';
  
      this.http.post(link, body, { headers: headerx })
        .map(res => res.json())
        .subscribe(data => {
          if ( data ) {
            this.setStorage(data);
          };
          console.log(data);
        });
    }
  }

  setStorage(data) {
    this.save('nome', data.nome);
    this.save('email', data.email);
    this.save('imagem', data.user_image);
    this.save('meuid', data.id);
    this.goFeed(data);
  }
  private save(key: string, data: string) {
    return this.storage.set(key, data);
  }
  goFeed(data) {
    this.navCtrl.push('FeedPage',{
      data: data
    });
  }

  login() {
    this.fb.login(['public_profile', 'user_friends', 'email'])
      .then(res => {
        if(res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => console.log('Error logging into Facebook', e));
  }

  loginEmail(email, pw){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      email: email,
      pw: pw
    }

    let link = 'https://bluedropsproducts.com/app/usuarios/loginEmail';
    
    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if( data && data != null ){
          this.setStorage(data);
          this.navCtrl.push('FeedPage')
        }
        else{
          this.loginInvalido = true;
        }
      });
  }

  logout() {
    this.fb.logout()
      .then( res => this.isLoggedIn = false)
      .catch(e => console.log('Error logout from Facebook', e));
  }

  getUserDetail(userid) {
    this.fb.api("/"+userid+"/?fields=picture.width(9999).height(9999),id,email,name,gender",["public_profile"])
      .then(res => {
        this.users = res;
        this.cadastrar(this.users.email, this.users.name, this.users.picture.data.url);
      })
      .catch(e => {
        console.log(e);
      });
  }
  
  ionViewDidLoad() {
    
    console.log('ionViewDidLoad RegisterPage');
    // this.cadastrar();
  }

}
