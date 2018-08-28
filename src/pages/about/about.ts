import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, PopoverController, ModalController} from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { PopoverTopComponent } from '../../components/popover-top/popover-top';
import { HtmlInfoWindow } from '@ionic-native/google-maps';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { FileChooser } from '@ionic-native/file-chooser';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActionSheetController } from 'ionic-angular';
import { PostPage } from '../post/post';
declare var window: any;
@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  
  public Fbref: any;
  public local_array: any;
  public bairro: string = ' ';
  public cidade: string = ' ';
  public estado: string = ' ';
  public pais: string = "Brasil";
  public checkin: any = null;
  public local_array1: any;
  public local_array2: any;
  public local_array3: any;
  public local_array4: any;
  public local_array5: any;
  
  public userImagem: any;
  public usuario: any;
  public nome_usuario: any;
  public foto_usuario: any;
  public topOrNews: any = 'Top';
  public publicando: boolean;
  dataPost: any;
  userId: any;
  texto:string = "";
  public imageURI:any = [];
  imageFileName:any;
  videoFileName:any;
  videosNames:any;
  imageFileNameVideo:any;
  fileUrl:any;
  imageUriVideo:any;
  local: any = "bairro";
  localFileName:any;
  hasID: any = false;
  options: GeolocationOptions;
  currentPos: Geoposition;
  loading: any;
  imagesNames: any = [];
  postType: number = 0;
  linkPost: any;
  linkYoutube: any;
  youtubeSaneado: any;
  loader: any;
  video: any;
  videoId: any;
  flag_upload = true;
  flag_play = true;
  aImages: any;
  images: any = [];
  public length: any;
  image1: any = null;
  image2: any = null;
  image3: any = null;
  image4: any = null;
  image5: any = null;
  public locais: any = [];
  public locaisFull: any = [];
  image6: any = null;
  localBack: any;
  videos:any;
  constructor(public navCtrl: NavController,
    private transfer: FileTransfer,
    public modalCtrl: ModalController,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    private _sanitizer: DomSanitizer,
    private imagePicker: ImagePicker,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public http: Http, 
    public fileChooser: FileChooser,
    public sanitizer: DomSanitizer,
    private storage: Storage,
    private file: File,
    public popoverCtrl: PopoverController,
    public navParams: NavParams,
    private geolocation: Geolocation) {
      this.localBack = this.navParams.get("slide");

    }

  cahngeYoutube(){
    let link;
    link = this.linkYoutube.split('=')
    this.youtubeSaneado = "https://www.youtube-nocookie.com/embed/" + link[1] + "?rel=1&amp;controls=1&amp;showinfo=0'";
    console.log(this.youtubeSaneado);
  }

  excluiImgArray(id){
    this.imagesNames =  this.imagesNames.filter(function(el) { 
      return el.id !== id; 
        });
        console.log( this.imagesNames, id);
  }
  Publicar() {
    this.checkIn();
  }
  
  cahngeLink(){
    this.linkPost = this.linkPost;
    console.log(this.youtubeSaneado);
  }
  public altura = '10';
  checkLength(text){
    console.log(text.length)
    this.length = text.length;
    if(this.length >= 99 && this.length < 350){

      this.altura = this.length.toString() + 'px';

    }else if(this.length < 99){
      this.altura = '10';
    }else{
      this.altura = '350';
    }
  }

  async checkIn() {
    //this.presentLoadingDefault();
    this.options = {
      enableHighAccuracy: true
    };
    
    this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
    
          this.currentPos = pos;
          console.log(pos.coords.latitude, pos.coords.longitude);
          // this.getGeocode(pos.coords.latitude, pos.coords.longitude);
    
          let url2 = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + pos.coords.latitude + "," + pos.coords.longitude + "&rankby=distance&key=AIzaSyDSO6Siell1ljeulEnHXDL4a5pfrCttnTc";
          this.http.get(url2).map(res => res.json()).subscribe(data2 => {
            this.locais = [];
            this.locaisFull =[];
            for(let i = 0; i < 5; i++){
              this.locais.push(data2.results[i].name);
            }
            data2.results.forEach(element => {
              this.locaisFull.push(element.name);
            });
            this.getLocal();
          });
          
        }, (err: PositionError) => {
          console.log("error : " + err.message);
        });    
      }

    publish(data){
      // this.presentLoadingDefault();
      this.dataPost = data;
      this.uploadImage1();
    }
    async getLocal(){
      let profileModal = this.modalCtrl.create('PublicarPage', {locais: this.locais, locaisFull: this.locaisFull});
      profileModal.present();
      

      profileModal.onDidDismiss(data => {  
        if(data.local && data.type){
          this.checkin = data.local;
          console.log(data)
          this.carregaLocal(data.type);
        }
      });
    }

    carregaLocal(mod){
      let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + this.currentPos.coords.latitude + "," + this.currentPos.coords.longitude + "&key=AIzaSyDSO6Siell1ljeulEnHXDL4a5pfrCttnTc";
        this.http.get(url).map(res => res.json()).subscribe(data => {
          console.log(data);
          this.bairro = data.results[0].address_components[2].long_name;
          this.cidade = data.results[0].address_components[3].long_name;
          this.estado = data.results[0].address_components[5].short_name;
          this.pais = data.results[0].address_components[6].long_name;
          console.log(mod);
          this.publish(mod);
        }, (err) => {
          this.getUserPosition(),
          this.loading.dismiss();
          });

    }

      presentLoadingDefault() {
        this.loading = this.loadingCtrl.create({
          content: 'Publicando...'
        });
      
        this.loading.present();
      }
      // presentLoadingCarregando() {
      //   this.loading = this.loadingCtrl.create({
      //     content: 'Preparando Imagem...'
      //   });
      
      //   this.loading.present();
      // }
      presentLoadingCarregandoVideo() {
        this.loading = this.loadingCtrl.create({
          content: 'Carregando Vídeo...'
        });
      
        this.loading.present();
      }
      
      async getImages(){
        let options = {
          maximumImagesCount: 5,
          width: 800,
          height: 800,
          quality: 75,
        }
      
        this.imagePicker.getPictures(options).then(results =>{
          console.log(results);
          this.images = [];
          this.image1 = results[0];
          this.image2 = results[1];
          this.image3 = results[2];
          this.image4 = results[3];
          this.image5 = results[4];
          for(let i=0; i < results.length;i++){
            this.images.push(results[i]);
          };
        });

        let toast = this.toastCtrl.create({
          message: this.image1
        });
        toast.present();
      }

      getVideo() {
        const options: CameraOptions = {
          quality: 50,
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM,
          mediaType: this.camera.MediaType.VIDEO,
          correctOrientation: true,
          targetWidth: 1200,
          targetHeight: 800
        }
        this.camera.getPicture(options).then((videoData) => {
          this.videoId = videoData;
        }, (err) => {
          console.log(err);
          this.presentToast(err);
        });
      }
 



     

     
      // getVideo() {
      // this.fileChooser.open().then((videoData) => {
          
      //   alert(videoData);

      //     this.file.resolveLocalFilesystemUrl(videoData).then((newUrl) => {
      //       let dirPath = newUrl.nativeURL;
      //       let dirPathSegments = dirPath.split('/');
      //       dirPathSegments.pop();
      //       dirPath = dirPathSegments.join('/');
      //       this.file.readAsArrayBuffer(dirPath, newUrl.name).then(async (buffer) => {
      //         alert(buffer+', '+newUrl.name);
      //         await this.uploadVideo(buffer, newUrl.name);
      //       })
      //     })
      //   }, (err) => {
      //     console.log(err);
      //     this.presentToast(err);
      //   });
      // }

      // async uploadVideo(buffer, name){
      //   alert('aqui');
      //   let blob = new Blob([buffer], {type: 'image/jpeg'});
      //   let storage = firebase.storage();
      //   storage.ref('videos/' + name).put(blob).then((d)=>{
      //     this.presentToast('done');
      //     alert(d);
      //   }).catch((error)=>{
      //     this.presentToast(error);

      //   })
      // }

      private setPostType(type){
        this.postType = type;
        console.log(this.postType)
      }

      loadLocation(lat, long) {
        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyDSO6Siell1ljeulEnHXDL4a5pfrCttnTc";
        this.http.get(url).map(res => res.json()).subscribe(data => {
          console.log(data);
          this.bairro = data.results[0].address_components[2].long_name;
          this.cidade = data.results[0].address_components[3].long_name;
          this.estado = data.results[0].address_components[5].short_name;
          this.pais = data.results[0].address_components[6].long_name;
          this.sendPost(this.currentPos.coords.latitude, this.currentPos.coords.longitude, this.dataPost);
        }, (err) => {
          this.getUserPosition(),
          this.loading.dismiss();
          });
      }

      pushPage() {
        this.navCtrl.push('FeedPage');
      }

      async getPicture() {
        const options: CameraOptions = {
          quality: 70,
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: this.camera.PictureSourceType.CAMERA,
          correctOrientation: true,
          targetWidth: 1080,
          targetHeight: 1080
        }
      
        this.camera.getPicture(options).then((imageData) => {
          this.images = [];
          this.image1 = imageData;
          this.image2 = null;
          this.image3 = null;
          this.image4 = null;
          this.image5 = null;
          this.images.push(imageData);
          // let path = imageData;
          // let new_path = path.substring(path.indexOf('s'));
          // this.localFileName = new_path;
          // this.uploadFile(imageData);
    
        }, (err) => {
          console.log(err);
          this.presentToast(err);
        });
        let toast = this.toastCtrl.create({
          message: this.image1
        });
        toast.present();
      }
    
        uploadVideo() {
          this.presentLoadingCarregandoVideo()
            const fileTransfer: FileTransferObject = this.transfer.create();
            
            let formattedDate = new Date();
            let d = formattedDate.getDate();
            let m = formattedDate.getMonth();
            m += 1;  // JavaScript months are 0-11
            let y = formattedDate.getFullYear();
            let random = Math.floor(Math.random() * 1000000) + 100000;
            let random2 = Math.floor(Math.random() * 1000000) + 100000;
            this.videoFileName = d + "_" + m + "_" + y + "_" + random + "_" + random2 + ".mp4";
            let options: FileUploadOptions = {
              fileKey: 'imagem',
              fileName: this.videoFileName,
              chunkedMode: false,
              mimeType: "video/mp4",
              headers: {}
            }
            
            fileTransfer.upload(this.videoId, encodeURI('https://wa-studio.com/redelive/upload.php'), options)
            .then((data) => {
              console.log(data+" Uploaded Successfully");
              this.getUserPosition();
              this.loading.dismiss();
            }, (err) => {
              console.log(err);
            });
          }

      uploadImage1(){
        
        if(this.image1) {
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
          
          fileTransfer.upload(this.image1, encodeURI('https://wa-studio.com/redelive/upload.php'), options)
          .then((data) => {
            this.imagesNames.push('https://wa-studio.com/redelive/uploads/' + this.imageFileName);
            console.log(data+" Uploaded Successfully");
            if(this.image2 && this.image2 != null){
              this.uploadImage2();
            } else{
              this.getUserPosition();
              this.loading.dismiss();
            }
          }, (err) => {
            console.log(err);
            this.presentToast('Tente novamente');
            this.loading.dismiss();
          });
        } else {
          this.getUserPosition();
          this.loading.dismiss();
        }
      }
      uploadImage2(){
        if(this.image2 != null) {
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
          
          fileTransfer.upload(this.image2, encodeURI('https://wa-studio.com/redelive/upload.php'), options)
          .then((data) => {
            this.imagesNames.push('https://wa-studio.com/redelive/uploads/' + this.imageFileName);
            console.log(data+" Uploaded Successfully");
            if(this.image3 && this.image3 != null){
              this.uploadImage3();
            } else{
              this.getUserPosition();
              this.loading.dismiss();
            }
          }, (err) => {
            console.log(err);
            this.presentToast('Tente novamente');
            this.loading.dismiss();
          });
        } else {
          this.getUserPosition();
          this.loading.dismiss();
          // this.presentToast('up2');
        }
      }
      uploadImage3(){
        if(this.image3 != null) {
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
          
          fileTransfer.upload(this.image3, encodeURI('https://wa-studio.com/redelive/upload.php'), options)
          .then((data) => {
            this.imagesNames.push('https://wa-studio.com/redelive/uploads/' + this.imageFileName);
            console.log(data+" Uploaded Successfully");
            if(this.image4 && this.image4 != null){
              this.uploadImage4();
            } else{
              this.getUserPosition();
              this.loading.dismiss();
            }
          }, (err) => {
            console.log(err);
            this.presentToast('Tente novamente');
            this.loading.dismiss();
          });
        }  else {
          this.getUserPosition();
          this.loading.dismiss();
        }
      }
      uploadImage4(){
        if(this.image4 != null) {
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
          
          fileTransfer.upload(this.image4, encodeURI('https://wa-studio.com/redelive/upload.php'), options)
          .then((data) => {
            this.imagesNames.push('https://wa-studio.com/redelive/uploads/' + this.imageFileName);
            console.log(data+" Uploaded Successfully");
            if(this.image5 && this.image5 != null){
              this.uploadImage5();
            } else{
              this.getUserPosition();
              this.loading.dismiss();
            }
          }, (err) => {
            console.log(err);
            this.presentToast('Tente novamente');
            this.loading.dismiss();
          });
        }  else {
          this.getUserPosition();
          this.loading.dismiss();
        }
      }
      uploadImage5(){
        if(this.image5 != null) {
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
          
          fileTransfer.upload(this.image5, encodeURI('https://wa-studio.com/redelive/upload.php'), options)
          .then((data) => {
            if(this.image6 && this.image6 != null){
              console.log();
            } else{
              this.getUserPosition();
              this.loading.dismiss();
            }
            console.log(data+" Uploaded Successfully");
          }, (err) => {
            console.log(err);
            this.presentToast('Tente novamente');
            this.loading.dismiss();
          });
        }  else {
          this.getUserPosition();
          this.loading.dismiss();
        }
      }
      
      getBackground(image) {
        return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
      }

 
    

      presentToast(msg, time = 8000) {
        let toast = this.toastCtrl.create({
          message: msg,
          duration: time,
          position: 'bottom'
        });
      
        toast.onDidDismiss(() => {
          console.log('Dismissed toast');
        });
      
        toast.present();
      }

      getUserPosition() {
        if(this.loading){
          this.loading.dismiss();
        }
        this.presentLoadingDefault();
        this.publicando = true;
        this.options = {
          enableHighAccuracy: true
        };
        
        this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
          
          this.currentPos = pos;
          //this.presentToast(pos.coords.latitude + ", ", pos.coords.longitude);
          this.loadLocation(pos.coords.latitude, pos.coords.longitude);
          
        }, (err: PositionError) => {
          console.log("error : " + err.message);
          this.loading.dismiss();
          this.getUserPosition();
        });
        
      }
      
      
      sendPost(lat, long, pub) {
        this.navCtrl.push('FeedPage', { id: this.userId, slide: this.localBack, progress: true});
        // this.presentToast(this.pais);
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Accept', 'application/json');
        headers.append('content-type', 'application/json');
        if (!this.imageFileName) {
          this.imageFileName = "none";
        }
        let vermais = false;
        if(this.texto.length > 240){
          vermais = true;
        }
        let body = {
          imagem: this.imagesNames,
          texto: this.texto,
          tipo: this.postType,
          lat: lat,
          long: long,
          bairro: this.bairro,
          cidade: this.cidade,
          estado: this.estado,
          pais: this.pais,
          usuario: this.userId,
          link: this.linkPost,
          youtubeA: this.youtubeSaneado,
          video: this.videoFileName,
          local: this.checkin,
          pub: pub,
          vermais: vermais
        }
        
        var link = 'https://wa-studio.com/redelive/anuncios/criarRefri';
        // this.presentToast("antes");
        this.http.post(link, JSON.stringify(body), { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          // this.presentToast("depois");
          this.publicando = false;
          this.imagesNames = '';
          //this.presentToast(data.data);
          this.navCtrl.push('FeedPage', { id: this.userId, slide: this.localBack, progress: false});
          
        console.log(data.data);
      
      }, (err) => {
          this.getUserPosition(),
          this.loading.dismiss();
          });
  }

  getUserInfo() {
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');

    let body = {
      id_usuario: this.userId
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

  private getSrc(link) {
    return this._sanitizer.bypassSecurityTrustResourceUrl(link);
  }
  
  alterarTopNews(myEvent) {
    let popover = this.popoverCtrl.create(PopoverTopComponent,{atual:this.topOrNews},{cssClass:"popover-about"});
    popover.present({
      ev: myEvent
    });

    popover.onDidDismiss(popoverData => {
      if(popoverData) {
        this.topOrNews = popoverData;
      }
    })
  }

  reset() {
    this.local_array = null;
    this.bairro = ' ';
    this.cidade = ' ';
    this.estado = ' ';
    this.pais = 'Brasil';
    this.checkin = null;
    this.publicando = null;
    this.texto = "";
    this.imageURI = null;
    this.imageFileName = null;
    this.fileUrl = null;
    this.local = "bairro";
    this.localFileName = null;
    this.options = null;
    this.currentPos = null;
    
  }
  public  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Onde Você está ?',
      buttons: [
        {
          text: 'Destructive',
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },{
          text: 'Archive',
          handler: () => {
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
      
    });
    actionSheet.present();
  }
  getID() {
    this.storage.get('meuid').then((val) => {
      console.log('Id', val);
      this.userId = val;
      this.getUserInfo();
    });
  }

  ionViewDidLoad() {
    this.reset();
    this.publicando = false;
    this.getID();
  }

}
