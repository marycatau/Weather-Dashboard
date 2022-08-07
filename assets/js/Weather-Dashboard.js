
var CityRecord=[];
var GlobalCity;


//get detail from local storage and load the saved city
function Init (){
    //hide the error code
    $('#errorcode').hide();
    $('#weatherdetails').hide();
    displaypastrecod();
}


function displaypastrecod(){
    CityRecord = JSON.parse(localStorage.getItem("CityRecord"));
    console.debug(CityRecord);  

    if(!Array.isArray(CityRecord)) {
        CityRecord = [];  
    } 
    
    /*CityRecord[0]="Manchester";
    CityRecord[1]="Hong_Kong";
    CityRecord[2]="Hellow";
    console.debug(CityRecord);  
*/
    for (i=0; i<CityRecord.length; i++) {
        var liE1=document.createElement('li');
        var buttonE1 = document.createElement('button');
        console.debug(i);
        $('#RecordList').append(liE1); 
        (liE1).append(buttonE1);
        buttonE1.textContent=CityRecord[i];

        //replace space by underscore in id name 
        var citynameE2= CityRecord[i].replace(/\s/g, "_");
        console.debug(citynameE2);
        
        buttonE1.setAttribute('id', citynameE2);
        buttonE1.setAttribute('type', "button"); 
        //set the css style using bootstrap
        buttonE1.classList.add("btn","btn-secondary","btn-sm","m-2");


    }
}


function searchcity(){

    var citynameE1= $('#CityInput').val();
    console.debug(citynameE1);
    //check if the input is valid or not
    if (!citynameE1) {
        alert("Please enter a valid city name!");
        return;
    }

    //check if any space in the input and set string to lowercase
    citynameE1=citynameE1.trim();
    console.debug(citynameE1);
   // citynameE1= citynameE1.replace(/\s/g, "_");
   // console.debug(citynameE1);
    citynameE1=citynameE1.toLowerCase();
    console.debug(citynameE1);


    $('#CityInput').val('');
    Checklatlon(citynameE1);
}


function Checklatlon(citynameE1){
  
    $('#errorcode').hide();
    //fetch the API call
    var CityQueryURL= "http://api.openweathermap.org/geo/1.0/direct?q="+citynameE1+"&limit=1&appid=14a0fd0022ec9befd3220d486e585dbe";
    
    //http://api.openweathermap.org/geo/1.0/direct?q=hong kong&limit=1&appid=14a0fd0022ec9befd3220d486e585dbe


    console.debug(CityQueryURL)
    //check if it is a cityname or not
    //call API
   fetch(CityQueryURL)
    .then(function (response) {
      if (!response.ok) {

        console.log(response);
        throw response.json();
      }

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      CheckCityDetail(data,citynameE1);
    })
    .catch(function (error) {
      console.error(error);
      $('#errorcode').show();

    });
    }

function CheckCityDetail(data,citynameE1){

    //storage the cityname
    var a=false;
    for(i=0; i<CityRecord.length; i++){
    if (CityRecord[i]=== citynameE1){
        var a=true;
        }
    }
    if(!a){
    CityRecord.push(citynameE1);
    console.debug(CityRecord);
    localStorage.setItem("CityRecord", JSON.stringify(CityRecord));
    var liE1=document.createElement('li');
    var buttonE1 = document.createElement('button');
    $('#RecordList').append(liE1); 
    (liE1).append(buttonE1);
    buttonE1.textContent=citynameE1;
    
    //replace space by underscore in id name 
    var citynameE2= citynameE1.replace(/\s/g, "_");
    console.debug(citynameE2);

    buttonE1.setAttribute('id', citynameE2);
    buttonE1.setAttribute('type', "button"); 
    buttonE1.classList.add("btn","btn-secondary","btn-sm","m-2");
    }


    //display cityname and past button
    $('#cityname').text(citynameE1);

    //get the lat and lon of the city
    var lat= data[0].lat;
    var lon=data[0].lon;
    console.debug(lat);
    console.debug(lon);

    // make one call for forecast and current weather details
    var WeatherQueryURL="https://api.openweathermap.org/data/3.0/onecall?lat="+lat+"&lon="+lon+"&exclude=hourly,minutely&appid=14a0fd0022ec9befd3220d486e585dbe";
    console.debug(WeatherQueryURL);

    fetch(WeatherQueryURL)
    .then(function (response) {
        if (!response.ok) {

        console.log(response);
        throw response.json();
    }

    return response.json();
    })
    .then(function (data) {
    console.log(data);
    Displayweather(data);
    })
    .catch(function (error) {
        console.error(error);
        $('#errorcode').show();

    });



}


function Displayweather(data){
$('#weatherdetails').show();

//display the current weather
var todayE1=data.current.dt;
console.debug(todayE1);
console.debug(moment.unix(todayE1).format());

var todaytemp = data.current.temp-273;
console.debug(todaytemp);

var todayweather = data.current.weather[0].icon;
console.debug(todayweather);
var todaywind= data.current.wind_speed;
console.debug(todaywind);
var todayHumid=data.current.humidity;
console.debug(todayHumid);
var todayuvi=data.current.uvi;
console.debug(todayuvi);

//input the today's weather details
$('#TodayDate').text(moment.unix(todayE1).format("YYYY/MM/DD"));
$('#Todayweather').html('<img src="http://openweathermap.org/img/wn/'+todayweather+'@2x.png">');
$('#Todaytemp').text(todaytemp);
$('#TodayWind').text(todaywind);
$('#TodayHumid').text(todayHumid);
$('#TodayUV').text(todayuvi);


//uv css
if(todayuvi < 3){
    $('#TodayUV').attr("class","bg-success text-white p-1");
} else if (todayuvi<6){
    $('#TodayUV').attr("class","bg-primary text-white p-1");
}  else {
    $('#TodayUV').attr("class","bg-danger text-white p-1");
}


//assign 5 day forecast weather value
for (i=1; i<6;i++){
    $('#'+i+'date').text(moment.unix(data.daily[i].dt).format("YYYY/MM/DD"));
    $('#'+i+'weather').html('<img src="http://openweathermap.org/img/wn/'+data.daily[i].weather[0].icon+'@2x.png">');
    $('#'+i+'temp').text(data.daily[i].temp.day-273);
    $('#'+i+'Wind').text(data.daily[i].wind_speed);
    $('#'+i+'Humid').text(data.daily[i].humidity);
}
 
for (i=0; i<CityRecord.length; i++) {
    var City=CityRecord[i].replace(/\s/g, "_");
    $('#'+City).click(pastcity);
}   

}

function pastcity(event){
    event.preventDefault();
    cityname=event.target.id;
    //replace underscore by space for cityname 
    cityname=cityname.replace("_"," ");
    console.debug(cityname);
    Checklatlon(cityname);


}

Init();
$('#search').click(searchcity);

for (i=0; i<CityRecord.length; i++) {
    var City=CityRecord[i].replace(/\s/g, "_");
    $('#'+City).click(pastcity);
}   