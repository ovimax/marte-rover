

const __launchError = async (code,msg) => {
	if(msg == ""){
		switch (code){
			case 100:
				msg = "MAP SIZE UNDEFINED";
			default:
				msg = "SINTAX ERROR !!!";
		}
	}

	return `ERROR::${code} - ${msg}`;
}


module.exports = {
	launchError:__launchError,
};