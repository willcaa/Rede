import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { PopoverController } from 'ionic-angular';
import { PopoverDenunciarComponent } from '../../components/popover-denunciar/popover-denunciar';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { CommentsPage } from '../comments/comments';
import { StatsPage } from '../stats/stats';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

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
  usuarioProfissional: any;
  pageId: any;
  enviandoSeguir: boolean;
  public imageURI: any;
  imageFileName: any;
  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    public photoViewer: PhotoViewer, 
    public popoverCtrl: PopoverController, 
    private _sanitizer: DomSanitizer, 
    public navParams: NavParams, 
    public http: Http, 
    private storage: Storage,
    public camera: Camera,
    public transfer: FileTransfer ) {
    
    this.perfilId = this.navParams.get("perfilId");
    this.userId = this.navParams.get("userId");
    this.perfil_imagem = this.navParams.get("image");
    this.perfil_nome = this.navParams.get("nome");
    this.enviandoSeguir = false;
  }
  
alterarTab(Id){
    this.pageId = Id;
    console.log(this.pageId);
  }

  ionViewDidLoad() {
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

    let link = 'https://bluedropsproducts.com/app/usuarios/perfil';
    
    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        this.anuncios = data['anuncios'].data;
        console.log(data['anuncios']);
        this.usuario = data['usuario'];
        //this.perfil_nome = this.anuncios[0]['nome'];
        //this.perfil_imagem = this.anuncios[0]['user_image'];
        this.usuario_imagem = this.usuario['user_image'];
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

  showAlert(title, text, button) {
    let alert = this.alertCtrl.create({ title: title, subTitle: text, buttons: [button] });
    alert.present();
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverDenunciarComponent,{},{cssClass:"popover-denuncia"});
    popover.present({ ev: myEvent });
    popover.onDidDismiss(popoverData => {
      if(popoverData) {

      }
    })
  }

  setUsuarioProfissional(nome, tipo, doc, xp, esp, sub, formacao, subesp){
  
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      nome: nome,
      tipo: tipo,
      doc: doc,
      xp: xp,
      esp: esp,
      sub: sub,
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
      id: this.userId
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

  getSrc(link) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  alterarImagemPerfil(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      targetWidth: 1600,
      targetHeight: 1600
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
            'https://bluedropsproducts.com/app/uploads/' + this.imageFileName;
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
        this.usuarioProfissional = data;
        console.log(data);
      }
    });
  }

  updateUsuarioProfissional(nome, tipo, doc, xp, esp, sub, formacao, subesp){
  
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      nome: nome,
      tipo: tipo,
      doc: doc,
      xp: xp,
      esp: esp,
      sub: sub,
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
}
