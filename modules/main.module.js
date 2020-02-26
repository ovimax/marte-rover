const fs		= require ('fs');
const config	= require("../config")();

// Modules
const Maps	= require("./maps.module")();
const Rover	= require("./rover.module")();
var lostRovers = [];
var newPosRover = [];
var response = `<h3>Welcome to Rover Marte</h3><span><b>INPUT:</b></span><br>[[INPUT]]<br><br><span><b>OUTPUT:</b></span><br>[[OUTPUT]]`;

/**
 * Iniciamos la prueba Rover Marte
 * @return {[string]} [respuesta de la prueba]
 */
const __init = async () => {
	try {
		let initConfig = await __setInitialConfigurations();
		if (initConfig.errorCode) { return initConfig; }

		let initMove = await __moveRovers();
		if (initMove.errorCode) { return initMove; }

		let outputSheet  = await __setOutputSheet();

		return response;
	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __init" };
	}
}

/**
 * Definimos las configuraciones iniciales
 * @return {[bool]}
 */
const __setInitialConfigurations = async () => {
	try	{
		// Leer la hoja de rutas y convertir los datos en array
		let dataFile = fs.readFileSync(config.routeSheet, 'utf8');
		dataFile = dataFile.replace(/\r?\r/g, "");
		let arrData = dataFile.split("\n");
		response = response.replace("[[INPUT]]",arrData.join("<br>"))

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

/**
 * Movemos cada rover por el mapa, segun su ruta
 * @return {[bool ]}
 */
const __moveRovers = async () => {
	try {

		let cartesians = config.cartesians;
		let compass = config.compass;
		let lost;

		let rovers = await Rover.getRoverCollection();
		if (rovers.length == 0) {
			return { errorCode: 404, error: "No existen rovers" };
		}

		for (let rover of rovers)
		{
			let arrPos = rover.pos.split(" ");
			let sRoute = rover.route;
			let currentP = [parseInt(arrPos[0]),parseInt(arrPos[1])]
			let currentO = compass.indexOf(arrPos[2])

			let oldP = [currentP[0],currentP[1]];
			let oldO = currentO;
			lost = false;
			for (let r of sRoute)
			{
				if (!lost){
					if(r != "F"){
						if (r=="R"){
							currentO = (currentO+1==compass.length)?0:currentO+1;
						} else {
							currentO = (currentO-1<0)?(compass.length-1):currentO-1;
						}
					}else{
						let checkLost = await __checkLostRovers(currentP,currentO);

						if(checkLost){
							let newO  = compass[currentO]
							currentP[0] = currentP[0] + cartesians[newO ][0];
							currentP[1] = currentP[1] + cartesians[newO ][1];
						}
					} 
					if (await __checkCurrentPosition(currentP) )
					{
						oldP = [currentP[0],currentP[1]];
						oldO = currentO;
					} else {
						// Recogemos en un array los rover perdidos, para que futuros rovers no se pierdan
						lostRovers.push({
								position:oldP,
								orientation: oldO,
							});
						lost = true;
						break;
					}
				}
			}

			newPosRover.push({
				position:oldP,
				orientation: oldO,
				lost:lost,
			});
		}
		return true;
	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __moveRovers" };
	}
}


/**
 * Verificamos si el rover se ha salido del mapa
 * @param  {[array]} currentP [Posicion [x,y] del rover]
 * @return {[bool]}  
 */
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

/**
 * Verificamos si la poscion y orientacion actuales de un rover coincide con la de un rover perdido
 * @param  {[array]} currentP [posocion [x,y] actuales del rover]
 * @param  {[int]} currentO [orientacion actual del rover]
 * @return {[bool]}
 */
const __checkLostRovers = async (currentP,currentO) => {
	try {	
		if(lostRovers.length > 0)
		{
			for(let lost of lostRovers){	
				if (JSON.stringify(lost.position)==JSON.stringify(currentP) && lost.orientation == currentO)
				{
					return false;
				}
			}
		}

		return true;
	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __checkLostRovers" };
	}
}

/**
 * Definimos la respuesta con las ultimas posiciones de cada rover
 * @return {[string]}
 */
const __setOutputSheet = () => {
	try {
		let output = "";
		for (let rover of newPosRover)
		{
			let lost = (rover.lost)?" LOST":"";
			output += `${rover.position[0]} ${rover.position[1]} ${config.compass[rover.orientation]}${lost}<br>`
		}
		response = response.replace("[[OUTPUT]]",output)
		return output;
	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __setOutputSheet" };
	}
}

module.exports = () => {
	return {
		init:__init,
	};
} 