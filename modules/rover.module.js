const config	= require("../config")();
const Maps	= require("./maps.module")();


let rovers = [];

const __getRoverCollection = async () => 
{
	return rovers;
}

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

const __checkRoverData = async (roverData) => {
	try {
		let roverPos = roverData.pos;
		let roverRoute = roverData.route;

		if ( roverRoute.length > config.maxRoverRoute )
		{
			return { errorCode: 400, error: "Los movimientos de un rover exceden los parramentros de configuración. Max. "+config.maxRoverRoute };
		}

		roverPos = roverPos.split(" ");
		if ( roverPos.length != 3 || roverPos.includes("")) 
		{
			return { errorCode: 400, error: "La posición de un rover no esta bien definida. Debe ser 'X Y Z' siendo Z la orientación" };
		}

		if ( !config.compass.includes(roverPos[2])) 
		{
			return { errorCode: 400, error: "La orientación de un rover no esta bien definida. Debe ser "+config.compass };
		}

		let mapSize = await Maps.getMapSize();
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
		setRoverCollection:__setRoverCollection,
		getRoverCollection: __getRoverCollection,
	};
}
