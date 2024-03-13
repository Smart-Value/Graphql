	const fetch = require('node-fetch');
	var helpers = require('../helpers.js');

	async function getTargetServerDetails(args ,  targetServerName )
	{
	  const { env_name } = args
	  return  await helpers.getOrgDetails(args , "/e/"+env_name+"/targetservers/" + targetServerName);
	}

	async function getAllTargetServersDetail(args )
	{
		const { env_name } = args
		const targetServers = await helpers.getOrgDetails(args , "/e/"+env_name+"/targetservers/" );
		//const targetServers = await response.json();
		console.log("targetServers : " + JSON.stringify(targetServers)) ;
		var result = [] ;
		for ( i =0 ; i < targetServers.length ; i++)
		{
     if (targetServers[i] != null)
       {
		    var targetServerDetails ;
		    targetServerDetails = await getTargetServerDetails ( args , targetServers[i]) ; 
            //if (targetServerDetails.name == targetServers[i] )  
            result.push (targetServerDetails )
       }
    }
		return result ;
		
	} 

	 module.exports.getTargetServerDetails = getTargetServerDetails ; 
	 module.exports.getAllTargetServersDetail = getAllTargetServersDetail ;
	 