/**
 * Definimos las variables de configuracion, por defecto serán constantes
 */

module.exports = () => {
	return {
		routeSheet: './route_sheet.txt', // ruta de la hoja de rutas
		maxMapSize: [50,50], // tamaño maximo de un mapa [x,y]
		maxRoverRoute: 100, // numero maximo de movimientos de un rover
		compass:["N","E","S","W"], // una brújula
		cartesians: {
			N:[0,1],
			S:[0,-1],
			E:[1,0],
			W:[-1,0]
		}, // coordenads cartenias principales
	};
}