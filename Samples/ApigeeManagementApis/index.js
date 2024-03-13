#!/usr/bin/env node

const {ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const fetch = require('node-fetch');
var helpers = require('./helpers.js');
var targetServerModule = require('./MagmtApiSchema/targetServer.js'); 

var baseURL ;
var requestOptions ;

const resolvers =
{
  Query:
  {
    TargetServersList: (parent, args) =>
    {
      const { env_name } = args
      return helpers.getOrgDetails(args , "/environments/"+env_name+"/targetservers" );
    },
    
    TargetServerDetails: (parent, args) =>
    {
      const { targetServer } = args
      return  targetServerModule.getTargetServerDetails(args , targetServer ) ; 
    },
      
    AllTargetServersDetails: (parent, args) =>
    {
     return  targetServerModule.getAllTargetServersDetail(args ) ;
    },
    
    developers: (parent, args) =>
    {
      return helpers.getOrgDetails(args , "developers?expand=true" )
             .then(res => res.developer) ;
    },
	
	developersSubset: (parent, args) =>
    {
	  const { developerIds } = args 
      return helpers.getOrgDetails(args , "developers?expand=true" )
             .then(res => res.developer)
			 .then(res => res.filter((element) => developerIds.includes (element.developerId )))			 ;
    },
	users: (parent, args) =>
    {
      var res
        helpers.setEnvVariables(args) ;
        res =  fetch( helpers.getBaseURL() +"/users?expand=true" , helpers.getRequestOption())
        .then(res => res.json())
        .then(res => res.user) ;
        return res ;
    },
    userByEmailId : (parent, args) =>
    { 
		const { emailId } = args
	    var res
        helpers.setEnvVariables(args) ;
        res =  fetch( helpers.getBaseURL() +"/users?expand=true" , helpers.getRequestOption())
        .then(res => res.json())
        .then(res => res.user)
		.then(res => res.filter((element) => element.emailId == emailId));
		
        return res ;
	  
    },
	user: (parent, args) =>
    {
      helpers.setEnvVariables(args) ;
      const { emailId } = args
	  	  
      return fetch(helpers.getBaseURL() + "/users/" + emailId   , helpers.getRequestOption() )
      .then(res => res.json())
    },
    apps : (parent, args)  =>
    {
      return helpers.getOrgDetails(args , "apps?expand=true" )
             .then(res => res.app) ;
    },
	
	//-------------------------
	appsIncludeProduct : (parent, args)  =>
    { 	const { includeProduct } = args 
		
		var matchCounter = 0 ; 
		 var result =  helpers.getOrgDetails(args , "apps?expand=true" )
             .then(res => res.app) 
			 .then(res => res.filter(function(element)
										 {  
											var isMatchedElement = true ; 
											for (const credential of element.credentials) 
											{  
												for (const apiProduct of credential.apiProducts ) 
												{
													isMatchedElement = (apiProduct.apiproduct == includeProduct )  ; 
													if (isMatchedElement) {matchCounter++ ; break} ; 
												}
												if (isMatchedElement) break ;
											}
										
											return isMatchedElement ; 
										 }
									) 
				  ) 
			 
			 ;
		return result ; 
      
    },
	
	//-------------------------
	appsIncludeProducts : (parent, args)  =>
    { 	const { includeProducts } = args 
		const { apiProduct_status } = args 
		
		var matchCounter = 0 ; 
		 var result =  helpers.getOrgDetails(args , "apps?expand=true" )
             .then(res => res.app) 
			 .then(res => res.filter(function(element)
										 {  
											var isMatchedElement = true ; 
											for (const credential of element.credentials) 
											{  
												for (const apiProduct of credential.apiProducts ) 
												{
													isMatchedElement = ( includeProducts.includes(apiProduct.apiproduct)  &&  apiProduct.status == apiProduct_status ) ; 
													if (isMatchedElement ) {matchCounter++ ; break} ; 
												}
												if (isMatchedElement) break ;
											}
										
											return isMatchedElement ; 
										 }
									) 
				  ) 
			 
			 ;
		return result ; 
      
    },
    
	//-------------------------
	apiProducts : (parent, args)  =>
    {
      return getAllProducts(parent, args);  
    },
  
	//-------------------------
   	productsWithoutProxies : (parent, args)  =>
    { 
		var matchCounter = 0 ; 
		return getAllProducts(parent, args)
			.then(res => res.filter(function(element)
				{  
					var isMatchedElement = false ; 
					var proxiesCount = element.proxies.length ; 
					console.log ("proxiesCount" + ":" + proxiesCount ) ; 
					isMatchedElement = (proxiesCount === 0 )
					return isMatchedElement ; 
				 }
			)  
			)
		;	
    }, 
	//-------------------------
   	productsIncludeProxies : (parent, args)  =>
    { 	
		const { includeProxies } = args 
		
		var matchCounter = 0 ; 
		return getAllProducts(parent, args)
			.then(res => res.filter(function(element)
				{  
					var isMatchedElement = false ; 
					for (const proxy of element.proxies) 
						{  
							isMatchedElement = includeProxies.includes(proxy) ; 
							if (isMatchedElement ) {matchCounter++ ; break} ; 
						}
					return isMatchedElement ; 
				 }
				) 
			)
		;	
    }, 
    //-------------------------
    apis : (parent, args)  =>
    {
      return helpers.getOrgDetails(args , "apis?expand=true" )
    },
    
	//--------------------------
	envDeployments : (parent, args)  =>
    {
      const { env_name } = args
      var result =  helpers.getOrgDetails(args , "e/" + env_name + "/deployments/" ).then(res => res.aPIProxy)
					.then(res => res.filter(function(element) 
					{
						var proxyName = element.name ; 
						var revision = element.revision[0].name ; 
						console.log (proxyName + ":" + revision ) ; 
						var policies = helpers.getOrgDetails(args , "/apis/"+proxyName+"/revisions/"+revision+"/policies?expand=true" )
						element.policies=policies ; 
						return true ;   
					}
					))		
	  return result ; 
      
    },
	ProxyPolicies : (parent, args) => 
	{
		const { revision } = args
		const { proxyName} = args 
		return  helpers.getOrgDetails(args , "/apis/"+proxyName+"/revisions/"+revision+"/policies?expand=true" ) ; 
		
	},
    organizations : (parent, args) =>
    {
      helpers.setEnvVariables(args)
      return getOrgs() ;
    } ,
    organization : (parent, args) =>
    {
      const { org_name } = args
      helpers.setEnvVariables(args)
      return fetch( helpers.getBaseURL() +"/o/"+org_name +"?expand=true" , helpers.getRequestOption())
        .then(res => res.json());
    } ,
    environments : (parent, args) =>
    {
        helpers.setEnvVariables(args) ;
        const { org_name } = args
        return getEnvs(`${org_name}`) ;
    } ,
    environment : (parent, args) =>
    {
        helpers.setEnvVariables(args) ;
        const { org_name } = args
        const { env_name } = args
        return getEnv(`${org_name}` , `${env_name}`)
              .then ( function (envDetails)  { return envDetails })
    }
  },

  Organization: {
    org_detials : parent => {
      const { name } = parent
      return fetch( helpers.getBaseURL() +"/organizations/"+name , helpers.getRequestOption() ).then(res => res.json())
    },
    environments: parent => {
      const { name } = parent
      return getEnvs(name) ;  //fetch(helpers.getBaseURL() + "/o/"+name+ "/e", helpers.getRequestOption()).then(res => res.json())
    },
    apis: parent => {
      const { name } = parent
      return fetch(helpers.getBaseURL() + "/organizations/"+name+ "/apis", helpers.getRequestOption()).then(res => res.json())
    },
    developers: parent => {
      const { name } = parent
	  try{
	  return fetch(helpers.getBaseURL() + "/organizations/"+name+ "/developers?expand=true", helpers.getRequestOption()).then(res => res.json())
	  .then(res => res.developer) ;
	  }
	  catch {(console.error('error' , error))}
    },
    apps: parent => {
      const { name } = parent
      try{
      return fetch(helpers.getBaseURL() + "/organizations/"+name+ "/apps?expand=true", helpers.getRequestOption()).then(res => res.json())
      .then(res => res.app) ;
      }
      catch {(console.error('error' , error))}
    },
    products : parent => {
      const { name } = parent
      try{
      return fetch(helpers.getBaseURL() + "/organizations/"+name+ "/apiproducts?expand=true", helpers.getRequestOption()).then(res => res.json())
        .then(res => res.apiProduct) ;
      }
      catch {(console.error('error' , error))}
    },

  }
}

async function  getOrg(org_name )
{
  const response = await fetch( helpers.getBaseURL() + "/organizations/"+org_name  , helpers.getRequestOption()) ;
  const json = await response.json();
  return json ;
}

async function  getAllProducts(parent, args )
{
  return helpers.getOrgDetails(args , "apiproducts?expand=true" ).then(res => res.apiProduct)
}

async function getOrgs()
{
    const response = await fetch( helpers.getBaseURL()  + "/organizations/" , helpers.getRequestOption())
    const orgNames = await response.json();
    console.log("OrgNames : " + JSON.stringify(orgNames)) ;
    var result = [] ;
    for ( i =0 ; i < orgNames.length ; i++)
    {
      var orgDetails ;
      orgDetails = await getOrg ( orgNames[i]) ;
      result.push (orgDetails )
    }
    return result ;
}



async function  getEnv(org_name , env_name)
{
  const response = await fetch( helpers.getBaseURL() + "/organizations/"+org_name + "/environments/"+env_name+"?expand=true" , helpers.getRequestOption()) ;
  const json = await response.json();
  return json ;
}

async function getEnvs(org_name )
{
  const response = await fetch( helpers.getBaseURL()  + "/organizations/"+org_name + "/environments/?expand=true" , helpers.getRequestOption())
  const envNames = await response.json();
  console.log("envNames : " + JSON.stringify(envNames)) ;
  var result = [] ;
  for ( i =0 ; i < envNames.length ; i++)
  {
    var envDetails ;
    envDetails = await getEnv (org_name , envNames[i]) ;
    result.push (envDetails )
  }
  //console.log("result : " + JSON.stringify(result)) ;
  return result ;
}


const server = new ApolloServer({  playground: true, typeDefs , resolvers });

server.listen().then(({ url }) => {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  console.log(`graphql server For Apigee Management API's By Shawky Foda is ready at ${url}`);
});
