import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  private db: SQLiteObject;
  private isOpen: boolean;

  constructor(
    public http: HttpClient,
    public storage: SQLite
  ) {
    if (!this.isOpen) {
      this.storage = new SQLite();
      this.storage.create({ name: "data.db", location: "default" }).then((db: SQLiteObject) => {
        this.db = db;
        db.executeSql("CREATE TABLE IF NOT EXISTS person (person_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthday TEXT, genre TEXT, email TEXT, phone TEXT, country TEXT, supplements INTEGER)", []);
        this.isOpen = true;
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  CreatePerson(name:string, birthday:string, genre:string,email:string, phone:string, country:string, supplements:number){
    return new Promise ((resolve, reject) => {
      let sql = "INSERT INTO person (name, birthday, genre, email, phone, country, supplements) VALUES (?, ?, ?, ?, ?, ?, ?)";
      this.db.executeSql(sql, [name, birthday, genre, phone, country, supplements]).then((data) =>{
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  CreateMeasurement(person_id:number, weight:number, height:number, neck:number, waist:number, hip:number, dateCreated:string, performance:number, foods:number, workoutSpot:string, injury:number){
    return new Promise ((resolve, reject) => {
      let sql = "INSERT INTO measurement (person_id, weight, height, neck, waist, hip, date_created, performance, foods, workout_spot, injury  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      this.db.executeSql(sql, [person_id, weight, height, neck, waist, hip, dateCreated, performance, foods, workoutSpot, injury]).then((data) =>{
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  GetAllPerson(){
    return new Promise ((resolve, reject) => {
      this.db.executeSql("SELECT * FROM person", []).then((data) => {
        let arrayUsers = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            arrayUsers.push({
              person_id: data.rows.item(i).person_id,
              name: data.rows.item(i).name,
              birthday: data.rows.item(i).birthday,
              genre: data.rows.item(i).genre,
              email: data.rows.item(i).email,
              country: data.rows.item(i).country,
              supplements: data.rows.item(i).supplements
            });            
          }          
        }
        resolve(arrayUsers);
      }, (error) => {
        reject(error);
      })
    })
  }
}
