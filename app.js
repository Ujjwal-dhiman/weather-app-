const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine' , 'ejs');

let name = "";
let temp = "";
let imageURL = "";
let description= "";
let status= "";

app.get("/" , function(req,res){
	let date = new Date();
	options = {
		weekday : "long",
		day : "numeric",
		month : "long"
	}

	let currentDate = date.toLocaleDateString("en-US",options);
	res.render("weather" , {todayDate:currentDate,cityName:name,cityTemp:temp,cityDesc:description,cityImage:imageURL})
})

app.post("/" ,  function(req,res){
	let cityName = req.body.input;

	const url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName +"&appid=9021fe9a8478b8d87f4693153c2801be&units=metric"

	https.get(url, function(response){
		response.on("data" , function(data){
			let jsonData = JSON.parse(data);
			 name = jsonData.name;
			 temp = jsonData.main.temp;
			 image = jsonData.weather[0].icon
			 description = jsonData.weather[0].description;
			 status = jsonData.cod;
			 if(status === "404"){
			 	console.log("City not found")
			 }
			 imageURL = "http://openweathermap.org/img/w/" + image + ".png"

			res.redirect("/")
		})
	})

})

app.listen(3000 , function(){

	console.log("server started on port 3000")
})