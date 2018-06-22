import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, PopoverController } from 'ionic-angular';
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

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  public local_array: any;
  public bairro: string;
  public cidade: string;
  public estado: string;
  public pais: string;
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
  userId: any;
  texto:string = "";
  public imageURI:any = [];
  imageFileName:any;
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
  videoId: any;
  flag_upload = true;
  flag_play = true;
  aImages: any;
  arrayImages: any = [];
  constructor(public navCtrl: NavController,
    private transfer: FileTransfer,
    private camera: Camera,
    private _sanitizer: DomSanitizer,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public http: Http, 
    public fileChooser: FileChooser,
    public sanitizer: DomSanitizer,
    private storage: Storage,
    public popoverCtrl: PopoverController,
    private geolocation: Geolocation) {
      
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
  
  cahngeLink(){
    this.linkPost = this.linkPost;
    console.log(this.youtubeSaneado);
  }

  checkIn() {
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
    
            let alert = this.alertCtrl.create();
            alert.setTitle('Onde Você está?');
        
            for(var i = 0; i < 20; i++) {
              alert.addInput({
                type: 'radio',
                label: data2.results[i].name,
                value: data2.results[i].name,
                checked: false
              });
            }

            alert.addButton('Cancel');
            alert.addButton({
              text: 'OK',
              handler: data => {
                this.checkin = data;
              }
            });
            alert.present();
          });
        }, (err: PositionError) => {
          console.log("error : " + err.message);
        });    
      }


      presentLoadingDefault() {
        this.loading = this.loadingCtrl.create({
          content: 'Publicando...'
        });
      
        this.loading.present();
      }
      presentLoadingCarregando() {
        this.loading = this.loadingCtrl.create({
          content: 'Preparando Imagem...'
        });
      
        this.loading.present();
      }
      
      // getImages(){
      //   JFileChooser chooser = new JFileChooser();
    
      //   // Possibilita a seleção de vários arquivos
      //   chooser.setMultiSelectionEnabled(true);
        
      //   // Apresenta a caixa de diálogo
      //   chooser.showOpenDialog(frame);
        
      //   // Retorna os arquivos selecionados. Este método retorna vazio se
      //   // o modo de múltipla seleção de arquivos não estiver ativada.
      //   File[] files = chooser.getSelectedFiles();  
      // }

      getImage() {
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true,
          targetWidth: 1200,
          targetHeight: 800
        }
      


        this.camera.getPicture(options).then((imageData) => {
          this.imageURI = imageData;
          this.arrayImages.push(imageData);
          this.uploadFile(imageData);
        }, (err) => {
          console.log(err);
          // this.presentToast(err);
        });
      }
      
      private setPostType(type){
        this.postType = type;
        console.log(this.postType)
      }

      getVideo() {
        this.fileChooser.open()
        .then(uri => {
        this.videoId = uri;
        this.flag_play = false;
        this.flag_upload = false;
        this.uploadVideo();
        })
        .catch(e => 
          console.log(e));
        }

        uploadVideo() {
          
          const fileTransfer: FileTransferObject = this.transfer.create();
          let options1: FileUploadOptions = {
            fileKey: 'video_upload_file',
            fileName: this.videoId,
            headers: {},
            mimeType: 'multipart/form-data',
            params: { },
            chunkedMode: false
          }
          this.presentLoading();
          fileTransfer.upload(this.videoId, encodeURI('https://bluedropsproducts.com/upload.php'), options1)
          .then((data) => {
          this.loader.dismissAll();
          this.flag_upload = true;
          this.showToast('middle', 'Video is uploaded Successfully!'+ this.videoId);
          }, (err) => {
          // this.loading.dismiss();
          });
          }
          presentLoading() {
          this.loader = this.loadingCtrl.create({
          content: "Uploading…"
          });
          this.loader.present();
          }
          showToast(position: string, message: string) {
          let toast = this.toastCtrl.create({
          message: message,
          duration: 3000,
          position: position
          });
          toast.present(toast);
          }


      // getVideo() {
      //   const options: CameraOptions = {
      //     quality: 100,
      //     destinationType: this.camera.DestinationType.FILE_URI,
      //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      //     mediaType: this.camera.MediaType.VIDEO,
      //     correctOrientation: true,
      //     targetWidth: 1600,
      //     targetHeight: 1600
      //   }
      
      //   this.camera.getPicture(options).then((imageData) => {
      //     this.imageUriVideo = imageData;
      //     this.presentToast(imageData);
      //     this.uploadFileVideo(imageData);
      //   }, (err) => {
      //     console.log(err);
      //     this.presentToast(err);
      //   });
      // }
      loadLocation(lat, long) {
        let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + long + "&key=AIzaSyDSO6Siell1ljeulEnHXDL4a5pfrCttnTc";
        this.http.get(url).map(res => res.json()).subscribe(data => {
          console.log(data);
          this.bairro = data.results[0].address_components[2].long_name;
          this.cidade = data.results[0].address_components[3].long_name;
          this.estado = data.results[0].address_components[5].short_name;
          this.pais = data.results[0].address_components[6].long_name;
          this.sendPost(lat, long);
        }, (err) => {
          this.loadLocation(lat, long),
          this.loading.dismiss();
          });
      }

      pushPage() {
        this.navCtrl.push('FeedPage');
      }
      getPicture() {
        const options: CameraOptions = {
          quality: 100,
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: this.camera.PictureSourceType.CAMERA,
          correctOrientation: true,
          targetWidth: 1600,
          targetHeight: 1600
        }
      
        this.camera.getPicture(options).then((imageData) => {
          this.imageURI = imageData;
          let path = imageData;
          let new_path = path.substring(path.indexOf('s'));
          this.localFileName = new_path;
          this.uploadFile(imageData);
    
        }, (err) => {
          console.log(err);
          this.presentToast(err);
        });
      }


      uploadFile(fileToUp){
        if(fileToUp != null) {
          this.presentLoadingCarregando();
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
            this.imagesNames.push('https://bluedropsproducts.com/app/uploads/' + this.imageFileName);
            this.loading.dismiss();
            console.log(data+" Uploaded Successfully");
          }, (err) => {
            console.log(err);
            this.presentToast('Tente novamente');
            this.loading.dismiss();
          });
        } 
      }
      
      getBackground(image) {
        return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
      }

      uploadFileVideo(fileToUp){
        this.presentToast(fileToUp);
        if(fileToUp != null) {
          const fileTransfer: FileTransferObject = this.transfer.create();
          
          let formattedDate = new Date();
          let d = formattedDate.getDate();
          let m = formattedDate.getMonth();
          m += 1;  // JavaScript months are 0-11
          let y = formattedDate.getFullYear();
          let random = Math.floor(Math.random() * 1000000) + 100000;
          let random2 = Math.floor(Math.random() * 1000000) + 100000;
          this.imageFileNameVideo = d + "_" + m + "_" + y + "_" + random + "_" + random2 + ".mp4";
          let options: FileUploadOptions = {
            fileKey: 'imagem',
            fileName: this.imageFileNameVideo,
            chunkedMode: false,
            mimeType: "multipart/form-data",
            headers: {}
          }
          
          fileTransfer.upload(fileToUp, encodeURI('https://bluedropsproducts.com/upload.php'), options)
          .then((data) => {
            this.imageFileNameVideo = 'https://bluedropsproducts.com/app/uploads/' + this.imageFileNameVideo;
            console.log(data+" Uploaded Successfully");
            this.presentToast(data);
          }, (err) => {
            console.log(err);
            this.presentToast(err);
          });
        } 
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
        this.presentLoadingDefault();
        this.navCtrl.push('FeedPage', { id: this.userId});
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
      

  sendPost(lat, long) {
    //this.presentToast(this.pais);
    let headers = new Headers();
    headers.append('Access-Control-Allow-Origin', '*');
    headers.append('Accept', 'application/json');
    headers.append('content-type', 'application/json');
    if (!this.imageFileName) {
      this.imageFileName = "none";
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
      local: this.checkin
    }

    var link = 'https://bluedropsproducts.com/app/anuncios/criarRefri';
    //this.presentToast("antes");
    this.http.post(link, JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        //this.presentToast("depois");
        this.publicando = false;
        this.imagesNames = '';
        //this.presentToast(data.data);
        this.navCtrl.push('FeedPage', { id: this.userId});
        this.loading.dismiss();
        console.log(data.data);
      
      }, (err) => {
          this.sendPost(lat, long),
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

    let link = 'https://bluedropsproducts.com/app/usuarios/getUserInfo';

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
    this.bairro = null;
    this.cidade = null;
    this.estado = null;
    this.pais = null;
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
