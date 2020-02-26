var express = require("express");
var app 	= express();
var Main 	= require("./modules/main.module")();

app.get('/', async (req, res) => {
	try {
		let a = await Main.init();
		res.send(a)
	} catch (error) {
    	return { errorCode: 500, error: error };
	}
});

app.listen(3000, async () => {
  console.error('Aplicación ejemplo, escuchando el puerto 3000!');
});