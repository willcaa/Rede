import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { FeedPage } from '../feed/feed';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/**
 * Generated class for the MapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google: any;
@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  public globalLat: any;
  public globalLng: any;
  @ViewChild('map') 
  private mapElement: ElementRef;
  public feed: any;
  public feedData: any;
  public userData: any;
  public userPic: any;
  public index_feed: number;
 
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, private platform: Platform) {
    this.http = http;
  }


  loadImageFeed(lat, long) {
    let header = new Headers();
    header.append('Access-Control-Allow-Origin', '*');
    header.append('Accept', 'application/json');
    header.append('content-type', 'application/json');

    let body = {
      index: 0,
      publico: 1,
      lat: lat,
      long: long
    }
    var link = 'https://refriplaybusiness.com.br/anuncios/puxarTodasFotos';

    this.http.post(link, JSON.stringify(body), { headers: header })
      .map(res => res.json())
      .subscribe(data => {
        console.log(this.feed, data.status);
     
        if (this.feed && data.status) {
          data.data.forEach(element => {
            if(element.imagem){
              console.log(element.distance);
              this.feed.push(element);
            }
          });
        
          console.log(this.feed);
          console.log(this.index_feed);
        } else {
          if (!data.status) {
            this.feed = this.feed;
          } else {
            this.feed = data.data;
          }
        }
        console.log(data.data);
      });
  }
  
  ionViewDidLoad() {
    
   
  }

}
