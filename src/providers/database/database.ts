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
        db.executeSql("CREATE TABLE IF NOT EXISTS person (person_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthday TEXT, genre TEXT, email TEXT, phone TEXT, country TEXT)", []);
        db.executeSql("CREATE TABLE IF NOT EXISTS measures (measures_id INTEGER PRIMARY KEY AUTOINCREMENT, person_id INTEGER, weight INTEGER, height INTEGER, neck INTEGER, "+
          "chest INTEGER, armL INTEGER, armR INTEGER, legL INTEGER, legR INTEGER, calfL INTEGER, calfR INTEGER, waist INTEGER, hip INTEGER, performance INTEGER, foods INTEGER, "+
          "diet INTEGER, eat TEXT, place TEXT, injury INTEGER, supplements INTEGER "+
          ")", []);
        this.isOpen = true;
      }).catch((error) => {
        console.log(error);
      })
    }
  }

  CreatePerson(person){
    return new Promise ((resolve, reject) => {
      let sql = "INSERT INTO person (name, birthday, genre, email, phone, country) VALUES (?, ?, ?, ?, ?, ?)";
      this.db.executeSql(sql, [person.name, person.birthday, person.genre, person.phone, person.country]).then((data) =>{
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  CreateMeasurement(personId, measure){
    return new Promise ((resolve, reject) => {
      let sql = "INSERT INTO measurement (person_id, weight, height, neck, chest, armL, armR, legL, legR, calfL, calfR, waist, hip, performance, foods, place, injury, supplements, diet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
      this.db.executeSql(sql, [personId, measure.weight, measure.height, measure.neck, measure.chest, measure.armL, measure.armR, measure.legL, measure.legR, measure.calfL, measure.calfR, measure.waist, measure.hip, measure.performance, measure.foods,
                              measure.place, measure.injury, measure.supplements, measure.diet]).then((data) =>{
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

  GetPerson(id){
    return new Promise ((resolve, reject) => {
      this.db.executeSql("SELECT * FROM person where person_id = ?", [id]).then((data) => {
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

  GetPersonMeasure(id){
    return new Promise ((resolve, reject) => {
      this.db.executeSql("SELECT * FROM measures where person_id = ?", [id]).then((data) => {
        let arrayUsers = [];
        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            arrayUsers.push({
              measure_id: data.rows.item(i).measure_id,
              person_id: data.rows.item(i).person_id,
              weight: data.rows.item(i).weight,
              height: data.rows.item(i).height,
              neck: data.rows.item(i).neck,
              armL: data.rows.item(i).armL,
              armR: data.rows.item(i).armR,
              chest: data.rows.item(i).chest,
              legL: data.rows.item(i).legL,
              legR: data.rows.item(i).legR,
              calfL: data.rows.item(i).calfL,
              calfR: data.rows.item(i).calfR,
              waist: data.rows.item(i).waist,
              hip: data.rows.item(i).hip,
              eat: data.rows.item(i).eat,
              foods: data.rows.item(i).foods,
              diet: data.rows.item(i).diet,
              place: data.rows.item(i).place,
              supplements: data.rows.item(i).supplements,
              performance: data.rows.item(i).name,
              injury: data.rows.item(i).birthday,
              imc: data.rows.item(i).genre,
              tmb: data.rows.item(i).email,
              fat: data.rows.item(i).country
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
