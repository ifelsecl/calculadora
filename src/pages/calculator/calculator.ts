import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { DatabaseProvider } from '../../providers/database/database';
import { HttpClient } from '@angular/common/http';

/**
 * Generated class for the CalculatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'calculator-page'
})
@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html',
})
export class CalculatorPage {
  @ViewChild(Slides) slides: Slides;

  name: string;
  birthday: string;
  genre: string;
  email: string;
  phone: string;
  country: string;
  weight: number;
  height: number;
  neck: number;
  waist: number;
  hip: number;

  legL: number;
  legR: number;
  calfL: number;
  calfR: number;
  armL: number;
  armR: number;
  chest: number;

  performance: number;
  foods: number;
  eat: string;
  diet: number;
  supplements: number;
  place: number;
  injury: number;

  fat: number;
  imc: number;
  tmb: number;
  data = {};

  isSaveEnabled:boolean = true;

  showResult = false;
  showCalculate = false;
  showLastPage = false;
  person:any = {};


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private database: DatabaseProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public httpClient: HttpClient
    
  ){}
  getPerson(){
    this.navCtrl.push('result-page');
      this.database.GetAllPerson().then((data) =>{
      console.log(data);
    }, (error) =>{
      console.log(error);
    });
  }

  presentAlert(text) {
    let alert = this.alertCtrl.create({
      title: "Oops, datos incompletos.",
      subTitle: "Falto completar: " + text.join(', ') + ".",
      buttons: ['Ok']
    });
    alert.present();
  }

  alert(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['Ok']
    });
    alert.present();
  }

  prevSlide() {
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex >= 1)
      this.slides.slideTo(currentIndex - 1, 500);
    else
      this.navCtrl.push(HomePage);
  }

  nextSlide() {
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex <= 4)
      this.slides.slideTo(currentIndex + 1, 500);

  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if(currentIndex == 2){
      this.showCalculate = true;
      this.showLastPage = true;
      this.slides.lockSwipeToNext(true);
    }
    else if(currentIndex == 3){
      this.slides.lockSwipeToPrev(true);
    }
    else{
      this.showCalculate = false;
      this.showLastPage = false;
      this.slides.lockSwipeToNext(false);
    }
  }
  

  loading(){
    let loader = this.loadingCtrl.create({
      content: "Espera...",
      duration: 3000
    });
    loader.present();
  }

  calculate() {
    this.loading();
    this.slides.lockSwipeToNext(false);
    this.showResult = true;
    this.showCalculate = false;
    this.nextSlide();

    let text = [];
    if(this.name == undefined)
      text.push("Nombre");
    if(this.birthday == undefined)
      text.push("Fecha de Nacimiento");
    if(this.genre == undefined)
      text.push("Genero");
    if(this.email == undefined)
      text.push("Email");
    if(this.weight == undefined)
      text.push("Peso");
    if(this.height == undefined)
      text.push("Altura");
    if(this.neck == undefined)
      text.push("Cuello");
    if(this.waist == undefined)
      text.push("Cadera");
    if(this.chest == undefined)
      text.push("Pecho");
    if(this.armL == undefined)
      text.push("Brazo Izq");
    if(this.armR == undefined)
      text.push("Brazo Der");
    if(this.legL == undefined)
      text.push("Pierna Izq");
    if(this.legR == undefined)
      text.push("Pierna Der");
    if(this.calfL == undefined)
      text.push("Pantorrilla Izq");
    if(this.calfR == undefined)
      text.push("Pantorrilla Der");
    if(this.genre =="female" && this.hip == undefined)
      text.push("Cadera");


    if(this.performance == undefined)
      text.push("Actividad Fisica");
    if(this.foods == undefined)
      text.push("Cantidad de comidas");
    if(this.eat == undefined)
      text.push("Comidas frecuentes");

    if(text.length > 0){
      this.presentAlert(text);
      this.edit();
      return false;
    }

    var factor = 0;
    var age = this.getAge(this.birthday);

    /*  inicio calculos*/
    if(this.genre == 'male')
      factor = 1;

    this.imc = this.weight / Math.pow((this.height/100), 2);
    this.fat = (1.2 * this.imc) + (0.23 * age - 10.8 * factor - 5.4);
    var mb = (10 * this.weight) + (6.25 * this.height)  - (5 * age);

    if(this.genre == 'male')
      mb = mb + 5;
    else
      mb = mb - 161;

    let f = 0;
    let p = this.performance;
    if(p = 0)
      f = 1.2;
    else if(p = 1)
      f = 1.375;
    else if(p = 2)
      f = 1.55; 
    else if(p = 3)
      f = 1.725;
    else if(p = 4)
      f = 1.9;

    this.tmb = Number((mb * f).toFixed(2));
  }

  getAge(birthday){
    let b = new Date(birthday);
    let ageDifMs = Date.now() -  b.getTime();
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  edit(){
    this.showResult = false;
    this.slides.lockSwipeToPrev(false);
    this.slides.slideTo(0, 500);
  }

  save(){
    this.isSaveEnabled = false;
    var person:any = {};
    var measures:any = {};

    person.name = this.name;
    person.birthday = this.birthday;
    person.genre = this.genre;
    person.phone = this.phone;
    person.email = this.email;
    person.country = this.country;

    measures.weight = this.weight;
    measures.height = this.height;
    measures.neck = this.neck;
    measures.chest = this.chest;
    measures.armL = this.armL;
    measures.armR = this.armR;
    measures.waist = this.waist;
    measures.hip = (this.hip == 0 || this.hip == undefined) ? 0 : this.hip;
    measures.legL = this.legL;
    measures.legR = this.legR;
    measures.calfL = this.calfL;
    measures.calfR = this.calfR;
    measures.performance = this.performance;
    measures.foods = this.foods;
    measures.eat = this.eat;
    measures.diet = (this.diet == 0 || this.diet == undefined) ? 0 : 1;
    measures.supplements = (this.supplements == 0 || this.supplements == undefined) ? 0 : 1;
    measures.place = (this.place == 0 || this.place == undefined) ? "Casa" : "Gym";
    measures.injury = (this.injury == 0 || this.injury == undefined) ? 0 : 1;
    measures.imc = this.imc;
    measures.tmb = this.tmb;
    measures.fat = this.fat;
    person.measures = measures;

    var link = 'http://www.definetucuerpo.com/calculator/api.php';
    var myData = JSON.stringify({person: person});
    
  /*  this.httpClient.post(link, myData)
    .subscribe(data => {
    this.data.response = data["_body"];
    console.log(this.data);
  }, error => {
    console.log(error);
    //this.saveLocal(person);
    });*/

    this.saveLocal(person);
  }


  saveLocal(person){
    console.log(person);
    let loader = this.loadingCtrl.create({
      content: "Guardando en dispositivo...",
      duration: 2000
    });
    loader.present();
    var personId = 0;
    var measureId = 0;
    this.database.CreatePerson(person).then((data:any) =>{
     this.navCtrl.push(HomePage);
     personId = data.insertId;
      if(data.insertId > 0){
        this.database.CreateMeasurement(data.insertId, person.measures).then((data:any) =>{
          measureId = data.insertId;
          this.alert("Exitoso!", "Se ha guardado en el dispositivo, recuerda sincronizar mas tarde.");
          this.navCtrl.push(HomePage);
        }, (error) =>{
          this.alert("Error", "Ouch, hubó un problema: " + error);
          console.log(error);
        });
      }
    }, (error) =>{
      console.log(error);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalculatorPage');
    setTimeout(() => {

    },150);
  }

}
