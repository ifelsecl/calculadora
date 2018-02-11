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
          "diet INTEGER, eat TEXT, place TEXT, injury INTEGER, supplements INTEGER, imc TEXT, tmb TEXT, fat TEXT "+
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
      this.db.executeSql(sql, [person.name, person.birthday, person.genre, person.email, person.phone, person.country]).then((data) =>{
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  CreateMeasurement(personId, measure){
    return new Promise ((resolve, reject) => {
      let sql = "INSERT INTO measures (person_id, weight, height, neck, chest, armL, armR, legL, legR, calfL, calfR, waist, hip, performance, foods, place, injury, supplements, diet, eat, imc, tmb, fat) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)";
      this.db.executeSql(sql, [personId, measure.weight, measure.height, measure.neck, measure.chest, measure.armL, measure.armR, measure.legL, measure.legR, measure.calfL, measure.calfR, measure.waist, measure.hip, measure.performance, measure.foods,
                              measure.place, measure.injury, measure.supplements, measure.diet, measure.eat, measure.imc, measure.tmb, measure.fat]).then((data) =>{
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  DeletePerson(personId){
    return new Promise ((resolve, reject) => {
      let sql = "DELETE FROM person where person_id = ?";
      this.db.executeSql(sql, [personId]).then((data) =>{
        resolve(data);
      }, (error) => {
        reject(error);
      });
    });
  }

  DeleteMeasures(personId){
    return new Promise ((resolve, reject) => {
      let sql = "DELETE FROM measures where person_id = ?";
      this.db.executeSql(sql, [personId]).then((data) =>{
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
              phone: data.rows.item(i).phone
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
              country: data.rows.item(i).country
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
        let measure = {};
        if (data.rows.length > 0) {
          measure = data.rows.item(0);          
        }
        resolve(measure);
      }, (error) => {
        reject(error);
      })
    })
  }
}
