var express = require("express");
var app 	= express();
var Main 	= require("./modules/main.module");


app.get('/', async (req, res) => {
	try {
		let a = await Main.init();
		console.log(a)
		res.send(a);
	} catch(error) {
		console.log(error)
	}
	
});

app.listen(3000, function() {
  console.error('Aplicación ejemplo, escuchando el puerto 3000!');
});