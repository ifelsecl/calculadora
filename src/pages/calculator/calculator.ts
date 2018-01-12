import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { DatabaseProvider } from '../../providers/database/database';

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


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private database: DatabaseProvider,
    private loadingCtrl: LoadingController,
    
  ){
  }

  showResult = false;
  showCalculate = false;
  showLastPage = false;

  createPerson(){

    let loader = this.loadingCtrl.create({
      content: "Espera...",
      duration: 3000
    });
    loader.present();

    this.database.CreatePerson("john", "10/Nov/1990", "male", "john.przmz@gmail.com",  "+56999202150", "Chile", 1).then((data) =>{
      console.log(data);
    }, (error) =>{
      console.log(error);
    });
  }

  getPerson(){
    this.navCtrl.push('result-page');
    /*  this.database.GetAllPerson().then((data) =>{
      console.log(data);
    }, (error) =>{
      console.log(error);
    })
    */
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
  

  calculate() {
    let loader = this.loadingCtrl.create({
      content: "Espera...",
      duration: 3000
    });
    loader.present();
    this.slides.lockSwipeToNext(false);
    this.showResult = true;
    this.showCalculate = false;
    this.nextSlide();

    console.log(this.name);
    console.log(this.birthday);
    console.log(this.genre);
    console.log(this.email);
    console.log(this.phone);
    console.log(this.country);
    console.log(this.weight);
    console.log(this.height);
    console.log(this.neck);
    console.log(this.waist);
    console.log(this.hip);
    console.log(this.performance);
    console.log(this.foods);
    console.log(this.eat);
    console.log(this.diet);
    console.log(this.supplements);
    console.log(this.place);
    console.log(this.injury);


    /*  inicio calculos*/
    if(this.genre == 'male')
      this.fat = 495 / (1.0324 - 0.19077*( Math.log(this.waist - this.neck)) + 0.15456*(Math.log(this.height))) - 450;
    else
      this.fat = 495 / (1.29579 - 0.35004*(Math.log(this.waist + this.hip - this.neck)) + 0.22100*(Math.log(this.height))) - 450;

    this.imc = this.weight / Math.pow((this.height/100), 2);

    var mb = (10 * this.weight) + (6.25 * this.height)  - (5 * this.getAge(this.birthday));

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

    this.tmb = mb * f;
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalculatorPage');
    setTimeout(() => {

    },150);
  }

}
