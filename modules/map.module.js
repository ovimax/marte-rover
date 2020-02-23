
let pos = [0,0];

const __setMapSize = async (x,y) => {
	pos[0] = x;
	pos[1] = y;
	return pos
}

const __getMapSize = async () => {
	return pos;
}


module.exports = {
	getMapSize: __getMapSize,
	setMapSize: __setMapSize
}