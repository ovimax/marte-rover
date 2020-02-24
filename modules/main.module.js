const fs		= require ('fs');
const config	= require("../config")();

// Modules
const Maps	= require("./maps.module")();
const Rover	= require("./rover.module")();

const __init = async () => {
	try {
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
		return rovers;
	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __init" };
	}
}

const __moveRovers = async (rovers) => {
	try {

	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __moveRovers" };
	}
}

module.exports = () => {
	return {
		init:__init,
	};
} 