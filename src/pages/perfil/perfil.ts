import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { PopoverController } from 'ionic-angular';
import { PopoverDenunciarComponent } from '../../components/popover-denunciar/popover-denunciar';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { CommentsPage } from '../comments/comments';
import { RegisterPage } from '../register/register';
import { StatsPage } from '../stats/stats';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Base64 } from '@ionic-native/base64';
import { ImagePicker } from '@ionic-native/image-picker';

/**
 * Generated class for the PerfilPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {
  public stat_anuncios: any = 0;
  public stat_seguidores: any = 0;
  public stat_seguindo: any = 0;
  public seguindo: any;
  public userId: any;
  public perfilId: any;
  public anuncios: any;
  public usuario: any;
  public usuario_nome: any;
  public usuario_imagem: any;
  public perfil_imagem: any;
  public perfil_nome: any;
  public index_anuncio: any;
  public alteraNome: boolean = false;
  usuarioProfissional: any;
  usuarioPessoal: any;
  iageLogo: any;
  pageId: any = 'publicacoes';
  enviandoSeguir: boolean;
  public imageURI: any;
  imageFileName: any;
  logo: any;
  logo64: any;
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public photoViewer: PhotoViewer, 
    public popoverCtrl: PopoverController, 
    private _sanitizer: DomSanitizer, 
    public navParams: NavParams, 
    private imagePicker: ImagePicker,
    private base64: Base64,
    public http: Http, 
    private iab: InAppBrowser,
    private storage: Storage,
    public camera: Camera,
    public transfer: FileTransfer ) {
    
    this.perfilId = this.navParams.get("perfilId");
    this.userId = this.navParams.get("userId");
    this.perfil_imagem = this.navParams.get("image");
    this.perfil_nome = this.navParams.get("nome");
    this.enviandoSeguir = false;
    this.storage.get('logo')
    .then( res =>{
        console.log(res);
        this.logo = res;
      } 
    );
    this.storage.get('logo64')
    .then( res =>{
        console.log(res);
        this.logo64 = res;
      } 
    );
  }
  
alterarTab(Id){
    this.pageId = Id;
    console.log(this.pageId);
    this.storage.get('logo')
    .then( res =>{
        console.log(res);
        this.logo = res;
      } 
    );
    this.storage.get('logo64')
    .then( res =>{
        console.log(res);
        this.logo64 = res;
      } 
    );
  }

  ionViewDidLoad() {
    this.alteraNome = false;
    this.usuarioPessoal = null;
    this.checkSeguir(this.perfilId, this.userId);
    this.getStats();
    this.carregarPerfil();
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.checkSeguir(this.perfilId, this.userId);
     this.getStats();
     this.carregarPerfil();
      refresher.complete();
    }, 2000);
  }

private save(key: string, data: string) {
  this.storage.set(key, data).then(result=>{
    return result;
  });
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
     // var link = 'https://bluedropsproducts.com/app/likes/top';
 
     // this.http.post(link, JSON.stringify(body), { headers: headers })
     //   // .map(res => res.json())
     //   .subscribe(data => {
     //     console.log(data);
     //     // console.log(data.data);
     //   });
   }
  
   getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
  carregarPerfil() {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id_usuario: this.userId,
      id_perfil: this.perfilId
    }
    console.log('l');
    
    let link = 'https://bluedropsproducts.com/app/usuarios/perfil';
    
    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      this.anuncios = data['anuncios'].data;
      console.log(data['anuncios'].data);
      this.usuario = data['usuario'];
      //this.perfil_nome = this.anuncios[0]['nome'];
        //this.perfil_imagem = this.anuncios[0]['user_image'];
        this.usuario_imagem = this.usuario['user_image'];
        this.checkLink();
      }, (err) => {
        // this.carregarPerfil();
      });
    }
    


  goStats(which) {
      this.navCtrl.push(StatsPage, {
        tipo: which,
        userId: this.userId
      });
  }

  getStats() {
    let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Accept', 'application/json');
      headers.append('content-type', 'application/json');

      let body = {
        id_usuario: this.perfilId
      }

      let link = 'https://bluedropsproducts.com/app/usuarios/getStats';

      this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.stat_anuncios = data.anuncios;
        this.stat_seguidores = data.seguidores;
        this.stat_seguindo = data.seguindo;
      });
  }
  
  seguir(id_perfil, id_usuario) {
    if(id_perfil == id_usuario) {
      this.showAlert("OPA!","Você não pode deixar de seguir você mesmo!","OK");
    } else if(this.seguindo && !this.enviandoSeguir) {
      this.enviandoSeguir = true;
      let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Accept', 'application/json');
      headers.append('content-type', 'application/json');

      let body = {
        id_perfil: id_perfil,
        id_usuario: id_usuario
      }

      let link = 'https://bluedropsproducts.com/app/usuarios/DeixarSeguir';

      this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.seguindo = false;
        this.enviandoSeguir = false;
      });
    } else if(!this.seguindo && !this.enviandoSeguir) {
      this.enviandoSeguir = true;
      let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Accept', 'application/json');
      headers.append('content-type', 'application/json');

      let body = {
        id_perfil: id_perfil,
        id_usuario: id_usuario
      }

      let link = 'https://bluedropsproducts.com/app/usuarios/seguir';

      this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.seguindo = true;
        this.enviandoSeguir = false;
      });
    }
  }

  checkSeguir(id_perfil, id_usuario) {
    if(id_perfil == id_usuario) {
      this.seguindo = true;
    } else {
      let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Accept', 'application/json');
      headers.append('content-type', 'application/json');

      let body = {
        id_perfil: id_perfil,
        id_usuario: id_usuario
      }

      let link = 'https://bluedropsproducts.com/app/usuarios/checkSeguidor';

      this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.seguindo = data;
      });
    }
  }

  ampliarImagem(imagem, texto = "") {
    this.photoViewer.show('https://bluedropsproducts.com/app/uploads/'+imagem,texto,{share:true});
  }

  getImage(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  // public checkLink() {
  //   setTimeout(function() {
  
  //     'use strict';
  //     var siteURL = '',
  //         entries = document.querySelectorAll('ion-card-content.card-content > p'),
  //         i;
      
  //     if ( entries.length > 0 ) {
  //       for (i = 0; i < entries.length; i = i + 1) {
  //         entries[i].innerHTML = entries[i].innerHTML.replace(/#(\S+)/g,'<a href="#$1">#$1</a>');
  //         entries[i].innerHTML = entries[i].innerHTML.replace(/http(\S+)/g,'<a href="http$1">http$1</a>');
  //         entries[i].innerHTML = entries[i].innerHTML.replace(/www(\S+)/g,'<a href="www$1">www$1</a>');
  //       }
  //     }
  //   }, 1000);
  // };
  
  deleteAnuncio(post) {
    let confirm = this.alertCtrl.create({
      title: 'Você Realmente Deseja Deletar Este Anuncio?',
      message: 'Caso você delete este anuncio ele desaparecerá permanentemente!',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
          }
        },
        {
          text: 'Aceitar',
          handler: () => {
            let index = this.anuncios.indexOf(post);
              if(index > -1){
                this.anuncios.splice(index, 1);
              }
            let headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            headers.append('Accept', 'application/json');
            headers.append('content-type', 'application/json');

            let body = {
              id_anuncio: post.id_anuncio,
            }

            let link = 'https://bluedropsproducts.com/app/anuncios/deletar';

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
  
  // loadMore(infiniteScroll = null) {
  //   this.index_anuncio = this.index_anuncio + 1;
  // }
  getLogo() {
    let options = {
      maximumImagesCount: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        this.logo = results[i];
        this.base64.encodeFile(results[i]).then((base64File: string) => {
          this.logo64 = base64File;
          this.save('logo', results[i]);
          this.save('logo64', base64File);
        }, (err) => {
          console.log(err);
        });
      }
    }, (err) => { });
  }

  showAlert(title, text, button) {
    let alert = this.alertCtrl.create({ title: title, subTitle: text, buttons: [button] });
    alert.present();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverDenunciarComponent,{},{cssClass:"popover-denuncia"});
    popover.present({ ev: myEvent });
    popover.onDidDismiss(popoverData => {
      if(popoverData) {
        if(popoverData == 'logout'){
          console.log(popoverData);
          this.navCtrl.push(RegisterPage, {});
        }
      }
    })
  }

  setUsuarioProfissional(nome, tipo, doc, xp, esp1, sub1, esp2, sub2, formacao, subesp){
  console.log(nome, tipo, doc, xp, esp1, sub1, esp2, sub2, formacao, subesp);
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      nome: nome,
      tipo: tipo,
      doc: doc,
      xp: xp,
      esp1: esp1,
      sub1: sub1,
      esp2: esp2,
      sub2: sub2,
      subesp: subesp,
      formacao: formacao,
      id: this.userId
    }
    console.log(this.userId);
    let link = 'https://bluedropsproducts.com/app/ferramentas/setUsuarioProfissional';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.usuarioProfissional = data;
        if(this.usuarioProfissional == data){
          this.getUsuarioProfissional();
        }
        console.log(data);
      }
    });
  }

  getUsuarioProfissional(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id: this.perfilId
    }
    console.log(this.userId);
    let link = 'https://bluedropsproducts.com/app/ferramentas/getUsuarioProfissional';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.usuarioProfissional = data;
        console.log(data);
        if(data.length != 0 && data.length){
          this.alterarTab("profissional_m");
          return data;
        }
        else{
          this.alterarTab("profissional_n");
        }
      }
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
          entries[i].innerHTML = entries[i].innerHTML.replace(/http(\S+)/g,'<h5 (click)="openBrowser(http$1)">http$1</h5>');
          entries[i].innerHTML = entries[i].innerHTML.replace(/www(\S+)/g,'<h5 (click)="openBrowser(www$1)">www$1</h5>');
        }
      }
    }, 1000);
    
  };
  getSrc(link) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  openBrowser(url){
    console.log(url);
    const browser = this.iab.create(url);
  }

  alterarImagemPerfil(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      targetWidth: 400,
      targetHeight: 400
    }
  
    this.camera.getPicture(options).then((imageData) => {
      this.imageURI = imageData;
      this.uploadFile(imageData);
    }, (err) => {
      console.log(err);
      
    });
  }
  uploadFile(fileToUp){
    if(fileToUp != null) {
      const fileTransfer: FileTransferObject = this.transfer.create();
      
      let formattedDate = new Date();
      let d = formattedDate.getDate();
      let m = formattedDate.getMonth();
      m += 1;  // JavaScript months are 0-11
      let y = formattedDate.getFullYear();
      let random = Math.floor(Math.random() * 1000000) + 100000;
      let random2 = Math.floor(Math.random() * 1000000) + 100000;
      this.imageFileName = d + "_" + m + "_" + y + "_" + random + "_" + random2 + ".jpg";
      let options: FileUploadOptions = {
        fileKey: 'imagem',
        fileName: this.imageFileName,
        chunkedMode: false,
        mimeType: "multipart/form-data",
        headers: {}
      }
      fileTransfer.upload(fileToUp, encodeURI('https://bluedropsproducts.com/upload.php'), options)
          .then((data) => {
            this.perfil_imagem = 'https://bluedropsproducts.com/app/uploads/' + this.imageFileName;
            console.log(data+" Uploaded Successfully");
            this.setImage();

          }, (err) => {
            console.log(err);
          });
    }
  }

  setImage(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      image: 'https://bluedropsproducts.com/app/uploads/' + this.imageFileName,
      id: this.userId
    }
    console.log(this.userId);
    let link = 'https://bluedropsproducts.com/app/ferramentas/setNewImage';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        console.log(data);

      }
    });
  }

  updateUsuarioProfissional(nome, tipo, doc, xp, esp1, sub1, esp2, sub2, formacao, subesp){
  
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      nome: nome,
      tipo: tipo,
      doc: doc,
      xp: xp,
      esp1: esp1,
      sub1: sub1,
      esp2: esp2,
      sub2: sub2,
      subesp: subesp,
      formacao: formacao,
      id: this.userId
    }
    console.log(this.userId);
    let link = 'https://bluedropsproducts.com/app/ferramentas/updateUsuarioProfissional';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.usuarioProfissional[0] = data;
        if(this.usuarioProfissional[0] == data){
          this.getUsuarioProfissional();
        }
        console.log(data);
      }
    });
  }

  updatePerfilProfissional(){
    this.alterarTab('profissional_o');
  }
  alterarNome(){
    this.alteraNome = true;
  }
  setNovoNome(nome){
    let headers = new Headers();
      headers.append('Access-Control-Allow-Origin', '*');
      headers.append('Accept', 'application/json');
      headers.append('content-type', 'application/json');

      let body = {
        nome: nome,
        nomeanterior: this.perfil_nome,
        id: this.userId
      }

      let link = 'https://bluedropsproducts.com/app/ferramentas/setNovoNome';

      this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.usuario = data;
        console.log(data);
        this.perfil_nome = this.usuario.nome;
        this.alteraNome = false;
      });
  }

  setUsuarioPessoal(nome, idade, endereco, tel){
  
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      nome: nome,
      idade: idade,
      endereco: endereco,
      tel: tel,
      id: this.userId
    }
    console.log(this.userId);
    let link = 'https://bluedropsproducts.com/app/ferramentas/setUsuarioPessoal';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.usuarioPessoal =[];
        this.usuarioPessoal[0] = data;
        if(this.usuarioPessoal[0] == data){
          this.getUsuarioPessoal();
        }
        console.log(data);
      }
    });
  }

  public getUsuarioPessoal(){
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id: this.perfilId
    }
    console.log(this.userId);
    let link = 'https://bluedropsproducts.com/app/ferramentas/getUsuarioPessoal';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.usuarioPessoal = data[0];
        console.log(this.usuarioPessoal);
        if(data.length != 0 && data.length){
          this.alterarTab("pessoal");
          return data;
        }
        else{
          this.alterarTab("pessoal_n");
        }
      }
    });
  }
  updatePerfilPessoal(){
    this.alterarTab('pessoal_o');
  }

  updateUsuarioPessoal(nome, idade, endereco, tel){
  
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      nome: nome,
      idade: idade,
      endereco: endereco,
      tel: tel,
      id: this.userId
    }
    console.log(this.userId);
    let link = 'https://bluedropsproducts.com/app/ferramentas/updateUsuarioPessoal';

    this.http.post(link, JSON.stringify(body), { headers: headers })
    .map(res => res.json())
    .subscribe(data => {
      if(data){
        this.usuarioPessoal = data;
        if(this.usuarioPessoal == data){
          this.getUsuarioPessoal();
        }
        console.log(data);
      }
    });
  }
  
}
