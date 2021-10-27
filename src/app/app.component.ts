import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'compass';
  epoch_date:string[]=[]
  dates:string[]=[]
  wind_speed:string[]=[]
  wind_direction:number[]=[]
  speed:string=""
  i=0
  date:string=""
  today=""
  yesterday=""
  yest=new Date(new Date());
  message=""
  disable=false
  constructor(private http:HttpClient){}

  ngOnInit(){
    //Setting Default values
    let present=new Date();
    this.today = present.toISOString().substring(0, 10);
    let yesterday=new Date(present.setDate(present.getDate()- 1));
    let dd = String(yesterday.getDate()).padStart(2, '0');
    let mm= String(yesterday.getMonth() + 1).padStart(2, '0');
    let yyyy = yesterday.getFullYear();
    this.yesterday=yyyy+"-"+mm+"-"+dd
  }

  generate(form:NgForm){

    const startDate=form.value.startDate+"T00:00:00Z";
    const endDate=form.value.endDate+"T00:00:00Z";
    const date1 = new Date(form.value.startDate);
    const date2 = new Date(form.value.endDate);
    const difference_In_Time = date2.getTime() - date1.getTime();
    const difference_In_Days = difference_In_Time / (1000 * 3600 * 24);
    
    //validation
    if(date2>=date1){
      if(difference_In_Days<1)
      this.message="Interval is Too Small"
      else if(difference_In_Days>7)
        this.message="Interval is Too Big"
      else{
        this.disable=true;
        //get data from Api
        this.getData(startDate,endDate);
      }
    }
    else
      this.message="End date must be greater than start date!"
    
  }


  getData(startDate:string,endDate:string){
    this.http.get<any>('https://api.30mhz.com/api/stats/check/i-a09e7854-83b5-11e9-bb41-7dd1da20f665/from/'+startDate+'/until/'+endDate+'?intervalSize=1h')
    .subscribe(response=>{
      //Populate Data
      this.populateData(response);
    }
    )
    
  }

  populateData(response:any){
    let rotate= document.getElementsByClassName("rotate") as HTMLCollectionOf<HTMLElement>;
    this.i=1;
    let d,date,time;
    this.epoch_date=Object.keys(response);

    //looping through response from api and storing result
    for(let i=0;i<Object.keys(response).length;i++){
      this.wind_speed.push((Math.round((+(response[Object.keys(response)[i]]["i_weathers.wind_speed"])) * 100) / 100).toFixed(2))
      this.wind_direction.push((response[Object.keys(response)[i]]["i_weathers.wind_direction"]))
      d=new Date(+Object.keys(response)[i]);
      date=d.toLocaleDateString(undefined,
          {timeZone:"UTC", day:"2-digit", month:"long",year:"numeric"}
          ).split(' ')
      time=d.toLocaleTimeString(undefined,{timeZone:'UTC',hour12:false,hour:"2-digit",minute:"2-digit"})
      this.dates.push((date[0]+" "+date[1]+" "+date[2]).replace(',','')+" "+time);
    }
      
    //Setting first values
    this.setValues(rotate[0],response,0)

    //Setting all other values
    let timer=setInterval(()=>{
      if(this.i<this.wind_speed.length-1){
        this.setValues(rotate[0],response,this.i)
        this.i+=1;
      }
      else{
        //reinitialing
        this.dates=[];
        this.wind_speed=[];
        this.epoch_date=[];
        this.wind_direction=[];
        this.speed="";
        this.date="";
        rotate[0].style.transform="rotateZ(0deg)";
        this.stopInterval(timer);
      }
    },2000)
  }
  
  stopInterval(timer:any){
    clearInterval(timer);
    this.message="Done! Select dates to start again."
    this.disable=false;
  }

  direction(degree:number){
    if(degree>=348.75 || degree<11.25){
      return 'N'
    }
    else if(degree>=11.25 || degree<33.75){
      return 'NNE'
    } 
    else if(degree>=33.75 || degree<56.25){
      return 'NE'
    } 
    else if(degree>=56.25 || degree<78.75){
      return 'ENE'
    } 
    else if(degree>=78.75 || degree<101.25){
      return 'E'
    } 
    else if(degree>=101.25 || degree<123.75){
      return 'ESE'
    } 
    else if(degree>=123.75 || degree<146.25){
      return 'SE'
    } 
    else if(degree>=146.25 || degree<168.75){
      return 'SSE'
    } 
    else if(degree>=168.75 || degree<191.25){
      return 'S'
    } 
    else if(degree>=191.25 || degree<213.75){
      return 'SSW'
    } 
    else if(degree>=213.75 || degree<236.25){
      return 'SW'
    } 
    else if(degree>=236.25 || degree<258.75){
      return 'WSW'
    } 
    else if(degree>=258.75 || degree<281.25){
      return 'W'
    } 
    else if(degree>=281.25 || degree<303.75){
      return 'WNW'
    } 
    else if(degree>=303.75 || degree<326.25){
      return 'NW'
    } 
    else if(degree>=326.25 || degree<348.75){
      return 'NNW'
    } 
    else
      return 'Not Defined'
  }

  setValues(rotate:HTMLElement,response:any, index:number){
    rotate.style.transform="rotateZ("+(response[Object.keys(response)[index]]["i_weathers.wind_direction"])+"deg)"
    this.speed=this.wind_speed[index]+" km/h "+this.direction(this.wind_direction[index]);
    this.date=this.dates[index];
  }

  onClose(){
    this.message=""
  }
}
