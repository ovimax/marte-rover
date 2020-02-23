const fs = require ('fs');

//Classes
const Errors = require("./error.module");
const Maps = require("./map.module");
const Rover = require("./rover.module");

const routeSheet = './route_sheet.txt';
let error = false;

const __init = async () => {
	let response = await __getRouteSheet();
	console.log(response)
	return response;
}

	/**
	 * Read the route sheet info and create 
	 */
const __getRouteSheet = async () =>{
	let response;
	fs.readFile(routeSheet, 'utf8', async (err, datos) => {
		if (err){
			error = true;
			console.log(err)
			response = await Errors.launchError(500,"");
		} else {
			let data = datos.split("\n");
			response = datos
		}
		//this.setMap(data);
	});

	return response;
}
/*
	setMap(data)
	{
		if(response[0].length == 3){
			let pos = r[0].split(" ");
			map.setMapSize(parseInt(pos[0],10),parseInt(pos[1],10));
			data = data.shift();
			setRovers()
		} else {
			return new Error({code:100,msg:""});
		}
	}

	set
*/

module.exports =  {
	init:__init,
	getRouteSheet:__getRouteSheet,
};