const config	= require("../config")();
const Maps		= require("./maps.module")();
let rovers = [];

const __getRoverCollection = async () => { return rovers; }

/**
 * Recoge la información de cada rover de la hoja de ruta: posicion y orientacion iniciales, la ruta del rover
 * @param  {[array]} data [informacion de los rover de la hoja de rutas]
 * @return {[array]}      [coleccion con la informacion de los rovers]
 */
const __setRoverCollection = async (data) => 
{
	try {
		if (data.length%2 != 0){
			return { errorCode: 400, error: "La información de los rovers no es completa" };
		}
		for(let i = 0; i<data.length;i++)
		{
			if(i%2 == 0)
			{
				let rover = {
					pos: data[i],
					route: data[i+1],
				};

				let checkData = await __checkRoverData(rover);
				if(checkData.errorCode){return checkData;}

				rovers.push(rover);
			}
		}
		return rovers;
	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __setRoverCollection" };
	}
}

/**
 * Verificamos si los datos del rover son los especificados en el problema y que el rover se encontra dentro del mapa
 * @param  {[json]} roverData [informacion del rover, posicion, orientacion y ruta]
 * @return {[multi]}           [- JSON error: si se se encuentra un error
 *                              - Bool si no hay error]
 */
const __checkRoverData = async (roverData) => {
	try {
		let roverPos = roverData.pos;
		let roverRoute = roverData.route;
		let mapSize = await Maps.getMapSize();

		// Verificamos que la ruta del rover no exceda a los parametros del configuracion
		if ( roverRoute.length > config.maxRoverRoute )
		{
			return { errorCode: 400, error: "Los movimientos de un rover exceden los parramentros de configuración. Max. "+config.maxRoverRoute };
		}

		// Verificamos que hemos recibido los 3 parramentros de la posicion inicial del rover
		roverPos = roverPos.split(" ");
		if ( roverPos.length != 3 || roverPos.includes("")) 
		{
			return { errorCode: 400, error: "La posición de un rover no esta bien definida. Debe ser 'X Y Z' siendo Z la orientación" };
		}

		// Verificar que la orientacion esta bien definida
		if ( !config.compass.includes(roverPos[2])) 
		{
			return { errorCode: 400, error: "La orientación de un rover no esta bien definida. Debe ser "+config.compass };
		}

		// Verificamos que el rover se encuentra en el mapa definido
		let roverPosX = parseInt(roverPos[0]);
		let roverPosY = parseInt(roverPos[1]);
		if ( roverPosX > mapSize[0] || roverPosY > mapSize[1]) 
		{
			return { errorCode: 400, error: "La posición de un rover esta fuera del mapa. Tamaño del mapa: "+mapSize[0]+"x"+mapSize[1] };
		}

		return false;
	} catch (error) {
    	return { errorCode: 500, error: "ERROR into __checkRoverData" };
	}
}
module.exports = () => {
	return {
		getRoverCollection:__getRoverCollection,
		setRoverCollection:__setRoverCollection,
	};
}
