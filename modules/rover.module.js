const config	= require("../config")();
const Maps	= require("./maps.module")();

const __init = async () => 
{
	let a = await Maps.getMapSize();
	return a
}

const __setRoverCollection = async (data) => 
{
	try {
		let rovers = [];
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
	let roverPos = roverData.pos;
	let roverRoute = roverData.route;

	if ( roverRoute.length > config.maxRoverRoute )
	{
		return { errorCode: 400, error: "Los movimientos de un rover exceden los parramentros de configuración" };
	}

	roverPos = roverPos.split(" ");
	if ( roverPos.length > 3) 
	{
		return { errorCode: 400, error: "La posicion de un rover no esta bien definida" };
	}

	let mapSize = await Maps.getMapSize();
	let roverPosX = parseInt(roverPos[0]);
	let roverPosY = parseInt(roverPos[1]);

	if ( roverPosX > mapSize[0] || roverPosY > mapSize[1]) 
	{
		return { errorCode: 400, error: "La posicion de un rover esta fuera del mapa" };
	}
}
module.exports = () => {
	return {
		init:__init,
		setRoverCollection:__setRoverCollection,
	};
}
