import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';


/*
  Generated class for the UploadsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploadsProvider {

  constructor(private db: AngularFireDatabase,  private afStorage: AngularFireStorage) {
    console.log('Hello UploadsProvider Provider');
  }
  uploadToStorage(information): AngularFireUploadTask {
    let newName = `${new Date().getTime()}.txt`;
 
    return this.afStorage.ref(`files/${newName}`).putString(information);
  }

}
