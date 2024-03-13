const fetch = require('node-fetch');
var baseURL ;
var requestOptions ;

module.exports = {

    getOrgDetails : function getOrgDetails(args , detail_name )
    {
      console.log( "=====" + detail_name + " : " + JSON.stringify(args)) ;
	  const { org_name } = args

	  setEnvVariablesxx(args) ;
	  return  fetch( baseURL + "/organizations/"+ org_name + "/" +detail_name  , requestOptions )
	  .then(res => res.json())
    } ,

    setEnvVariables : function setEnvVariables ( args )
    {
      const { baseURL } = args
	  setRequestOptionxx (args)
	  setBaseURLxx(baseURL) ;
    } ,

    getBaseURL : function getBaseURL()
      {
        return baseURL ;
      } ,
    getRequestOption : function getRequestOption(  )
    {
      return requestOptions  ;
    }

  }

//----------------------------

function setBaseURLxx(m_baseURL)
{
  baseURL = m_baseURL ;
}

 
function setRequestOptionxx( args )
{
    const { Authorization } = args
    requestOptions = {
      method: 'GET',
      headers: {"Authorization" : Authorization },
      redirect: 'follow'
    };
}

function setEnvVariablesxx (args)
{
  const { baseURL } = args
  setRequestOptionxx(args) ;
  setBaseURLxx(baseURL) ;
}
