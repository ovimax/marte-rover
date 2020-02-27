const fs		= require ('fs');
const config	= require("../config")();

// Modules
const Maps	= require("./maps.module")();
const Rover	= require("./rover.module")();

// Variables
let lostRovers = [],
	newPosRover,
	response = `<h3>Welcome to Rover Marte</h3><span><b>INPUT:</b></span><br>[[INPUT]]<br><br><span><b>OUTPUT:</b></span><br>[[OUTPUT]]`,
	cartesians = config.cartesians,
	compass = config.compass,
	mapSize,
	rovers;

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
		mapSize = await Maps.setMapSize(arrData);
		if (mapSize.errorCode) { return mapSize; }

		// Retirar la informacion del mapa del array de datos
		arrData = arrData.slice(1,arrData.length);

		// Definimos una coleccion de rovers
		rovers = await Rover.setRoverCollection(arrData);
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
const __moveRovers = () => {
	try {
		if (rovers.length == 0) { return { errorCode: 404, error: "No existen rovers" }; }

		newPosRover = rovers.map(rover => {return __move(rover)})
		
		return true;
	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __moveRovers" };
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

/**
 * FUNCTIONS
 */

/**
 * Mover un rover
 * @param  {[JSON]} rover [posicion inicial del rover]
 * @return {[JOSN]}       [posicion final del rover]
 */
function __move(rover) {
	let arrPos = rover.pos.split(" ");
		sRoute = rover.route,
		currentP = [parseInt(arrPos[0]),parseInt(arrPos[1])],
		currentO = compass.indexOf(arrPos[2]),
		oldP = [currentP[0],currentP[1]],
		oldO = currentO,
		lost = false;

	for (let r of sRoute){
		if (!lost) {
			if(r != "F"){
				if (r=="R"){
					currentO = (currentO+1==compass.length)?0:currentO+1;
				} else {
					currentO = (currentO-1<0)?(compass.length-1):currentO-1;
				}
			}else{
				let checkLost = __checkLostRovers(currentP,currentO);

				if(checkLost){
					let newO  = compass[currentO];
					currentP[0] = currentP[0] + cartesians[newO][0];
					currentP[1] = currentP[1] + cartesians[newO][1];
				}
			}

			if ( __checkCurrentPosition(currentP) )
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
	return {
		position:oldP,
		orientation: oldO,
		lost:lost,
	};
}

function __changeOrientation(currentO,orientation)
{

}


/**
 * Verificamos si el rover se ha salido del mapa
 * @param  {[array]} currentP [Posicion [x,y] del rover]
 * @return {[bool]}  
 */
function __checkCurrentPosition(currentP){
	if(currentP[0] > mapSize[0] || currentP[0] < 0){ return false; }
	if(currentP[1] > mapSize[1] || currentP[1] < 0){ return false; }
	return true;
}

/**
 * Verificamos si la poscion y orientacion actuales de un rover coincide con la de un rover perdido
 * @param  {[array]} currentP [posocion [x,y] actuales del rover]
 * @param  {[int]} currentO [orientacion actual del rover]
 * @return {[bool]}
 */
function __checkLostRovers(currentP,currentO){	
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
}



module.exports = () => {
	return {
		init:__init,
	};
} 