import { Component, ViewChild } from '@angular/core';
import { IonicPage, LoadingController, NavController, ToastController, NavParams, Content, AlertController } from 'ionic-angular';
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
  user: any;
  canLogin: any = "not yet";

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public http: Http, public loadingCtrl: LoadingController, private fb: Facebook, private storage: Storage, private alertCtrl: AlertController) {
    this.pageId="botoes";
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


  cadastrar(nomeCompleto, email, nome, pw) {
      console.log(nomeCompleto, email, nome, pw);
      let headerx = new Headers();
      headerx.append('Access-Control-Allow-Origin', '*');
      headerx.append('Accept', 'application/json');
      headerx.append('content-type', 'application/json');
      var body = {
        nomeCompleto: nomeCompleto,
        email: email,
        nome: nome,
        pw: pw,
        imagem: 'none'
      }
      var link = 'https://wa-studio.com/redelive/usuarios/cadastrar';
      this.http.post(link, body, { headers: headerx })
        .map(res => res.json())
        .subscribe(data => {
          if (data) {
            this.loginEmail(nome, pw);
          }
          console.log(data);
        });
    
  }

  checkEmail(email){
    let check = email.split("@", 2);
    console.log(check);
    if(check.length > 1){
      let test = check[1].split(".", 2);
      console.log(test);
      if(test.length > 1 && test[1] == "com"){
        this.canLogin = " ";
      }

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

  loginEmail(user, pw){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      user: user,
      pw: pw
    }

    let link = 'https://wa-studio.com/redelive/usuarios/loginEmail';
    
    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if( data && data != null ){
          this.setStorage(data);
          this.user = data;
          this.navCtrl.push('FeedPage', {user: this.user});

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
        this.cadastrar(this.users.name ,this.users.email, this.users.name, this.users.picture.data.url);
      })
      .catch(e => {
        console.log(e);
      });
  }
  
  ionViewDidLoad() {
    
    console.log('ionViewDidLoad RegisterPage');
    this.canLogin = "not yet";
  }

  novaSenha(email){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      email: email,
    }

    let link = 'https://wa-studio.com/redelive/usuarios/esqueciSenha';
    
    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if(data != false){
          this.presentAlert();
          this.alterarTab('login');
        }
        else{
          this.presentAlertErro();
          this.alterarTab('login')
        }
      });
  }
  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Senha gerada com sucesso!',
      subTitle: 'Sua senha foi gerada com sucesso e enviada para o seu email.',
      buttons: ['Dismiss']
    });
    alert.present();
  }
  presentAlertErro() {
    let alert = this.alertCtrl.create({
      title: 'Erro!',
      subTitle: 'O email inserido não está cadastrado ou não existe!',
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
