const fs		= require ('fs');
const config	= require("../config")();

// Modules
const Maps	= require("./maps.module")();
const Rover	= require("./rover.module")();

const __init = async () => {
	try {
		let initConfig = await __setInitialConfigurations();
		if (initConfig.errorCode) { return initConfig; }

		let initMove = await __moveRovers();
		if (initMove.errorCode) { return initMove; }

		return "Welcome to Rover Marte";
	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __init" };
	}
}

const __setInitialConfigurations = async () => {
	try	{
		// Leer la hoja de rutas y convertir los datos en array
		let dataFile = fs.readFileSync(config.routeSheet, 'utf8');
		let arrData = dataFile.split("\n");

		// Definir el tamaño del mapa
		let map = await Maps.setMapSize(arrData);
		if (map.errorCode) { return map; }

		// Retirar la informacion del mapa del array de datos
		arrData = arrData.slice(1,arrData.length);

		// Definimos una coleccion de rovers
		let rovers = await Rover.setRoverCollection(arrData);
		if (rovers.errorCode) { return rovers; }

		return true;
	}catch (error) {
    	return { errorCode: 500, error: "ERROR into __setInitialConfigurations" };
	}
}

const __moveRovers = async (rovers) => {
	try {

		let cartesians = config.cartesians;
		let compass = config.compass;

		let rovers = await Rover.getRoverCollection();
		if (rovers.length == 0) {
			return { errorCode: 404, error: "No existes rovers" };
		}

		for (let rover of rovers)
		{
			let arrPos = rover.pos.split(" ");
			let sRoute = rover.route;
			let currentP = [parseInt(arrPos[0]),parseInt(arrPos[1])]
			let currentO = compass.indexOf(arrPos[2])


			console.log(currentP)
			console.log(currentO)

			let oldP = [currentP[0],currentP[1]];
			let oldO = currentO;

			for (let r of sRoute)
			{
				if(r != "F"){
					if (r=="R"){
						currentO = (currentO+1==compass.length)?0:currentO+1;
					} else {
						currentO = (currentO-1<0)?(compass.length-1):currentO-1;
					}
				}else{
					let newCar = compass[currentO]
					currentP[0] = currentP[0] + cartesians[newCar][0];
					currentP[1] = currentP[1] + cartesians[newCar][1];
				} 
				break;
			}
			console.log(currentP)
			console.log(oldP);

		}

		return true;
	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __moveRovers" };
	}
}

const __checkCurrentPosition = async (currentP) => {
	try {
		let mapSize = await Maps.getMapSize();

		if(currentP[0] > mapSize[0] || currentP[0] < 0){ return false; }
		if(currentP[1] > mapSize[1] || currentP[1] < 0){ return false; }

		return true
	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __checkCurrentPosition" };
	}
}

module.exports = () => {
	return {
		init:__init,
	};
} 