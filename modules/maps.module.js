const config	= require("../config")();
let mapSize = [0,0];

/**
 * Definimos el tamaño del mapa
 * @param  {[array]} data [datos de la hoja de rutas]
 * @return {[array]}      [Puntso maximos [x,y] del mapa]
 */
const __setMapSize = async (data) => {
	try {
		mapSize = data[0].split(" ");
		mapSize[0] = parseInt(mapSize[0]);
		mapSize[1] = parseInt(mapSize[1]);

		// Verificar si hemos recibido la informacion del mapa
		if ( mapSize.length != 2 || mapSize.includes(NaN)){
			mapSize = [0,0];
			return { errorCode: 400, error: "El tamaño del mapa no esta definido en la hoja de rutas" };
		}
		
		// Verificar que el tamaño del mapa no exceda los parramentro de configuracion
		if ( mapSize[0] > config.maxMapSize[0] || mapSize[1] > config.maxMapSize[0] ){
			return { errorCode: 400, error: "El tamaño del mapa es demasiado grande, max <50,50>" };
		}

		return mapSize;
	} catch (error) {
    	return { errorCode: 500, error: error };
	}
}

const __getMapSize = async () => {
	return mapSize;
}


module.exports = () => {
	return {
		setMapSize:__setMapSize,
		getMapSize:__getMapSize,
	};
}