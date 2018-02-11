import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    private database: DatabaseProvider,
    private alertCtrl: AlertController,
    public httpClient: HttpClient,
    private loadingCtrl: LoadingController
    
  ) {
    
  }

  alert(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['Ok']
    });
    alert.present();
  }

  calculate() {
    this.navCtrl.push('calculator-page');
 }

 upload() {
    let done= false;
    let fall = false;

    let loader = this.loadingCtrl.create({
      content: "Sincronizando..."
    });
    loader.present();

    this.database.GetAllPerson().then((data:any) =>{
      var link = 'http://www.definetucuerpo.com/calculator/api.php';
      if(data.length > 0){
        for (var i=0; i < data.length;i++){
          let person = data[i];
          let measure:any = {};
      
          this.database.GetPersonMeasure(person.person_id).then((data) =>{
            person.measures = data;
            console.log(person);
            var myData = JSON.stringify({person: person});
            this.httpClient.post(link, myData)
              .subscribe((data) => {
              console.log(data);
              if(data == 1){
                  this.database.DeletePerson(person.person_id).then((data:any) =>{
                    console.log(data);
                  }, error =>{
                    console.log(error);
                  });
                  this.database.DeleteMeasures(person.person_id).then((data:any) =>{
                    console.log(data);
                  }, error =>{
                    console.log(error);
                  });
              }
              else{
                this.alert("Error!", data);
              }
            }, error => {
              fall = true;
              this.alert("Error!", "Ouch, debes reintentar hubó un problema: "  + error.text);
              console.log(error);
              });
          }, (error) =>{
            console.log(error);
          });

          if ( i == data.length - 1 ){
            loader.dismiss();
            this.alert("Finalizado", "La sincronziacion ha finalizado.");
              if(fall)
                this.alert("Aviso", "Algunos registros quedaron pendientes por sincronizar, reintenta mas tarde.");    
          }

        }
    }else {
      this.alert("Okey", "No tienes nada pendiente por sincronizar, relax.");
      loader.dismiss();

    }
   },
    (error) =>{

    });

}

 ionViewWillEnter() {
  let tabs = document.querySelectorAll('.tabbar');
  if ( tabs !== null ) {
    Object.keys(tabs).map((key) => {
      tabs[ key ].style.transform = 'translateY(56px)';
    });
  } // end if
}

ionViewDidLeave() {
  let tabs = document.querySelectorAll('.tabbar');
  if ( tabs !== null ) {
    Object.keys(tabs).map((key) => {
      tabs[ key ].style.transform = 'translateY(0)';
    });
  } // end if
}

  slides = [
    {
      title: "Welcome to the Docs!",
      description: "The <b>Ionic Component Documentation</b> showcases a number of useful components that are included out of the box with Ionic.",
      image: "assets/imgs/ica-slidebox-img-1.png",
    },
    {
      title: "What is Ionic?",
      description: "<b>Ionic Framework</b> is an open source SDK that enables developers to build high quality mobile apps with web technologies like HTML, CSS, and JavaScript.",
      image: "assets/imgs/ica-slidebox-img-2.png",
    },
    {
      title: "What is Ionic Cloud?",
      description: "The <b>Ionic Cloud</b> is a cloud platform for managing and scaling Ionic apps with integrated services like push notifications, native builds, user auth, and live updating.",
      image: "assets/imgs/ica-slidebox-img-3.png",
    }
  ];

}
