
const { gql } = require('apollo-server');


const typeDefs = gql`
    type Query
    {
      organizations (baseURL : String , Authorization :String): [Organization]
      organization(baseURL : String , Authorization :String , org_name:String!) : Organization
      apps ( baseURL : String , Authorization :String, org_name : String  ) : [App!]
	  appsIncludeProduct ( baseURL : String , Authorization :String, org_name : String , includeProduct : String  ) : [App!]
	  appsIncludeProducts( baseURL : String , Authorization :String, org_name : String , includeProducts : [String] , apiProduct_status : String ) : [App!]
      apiProducts (baseURL : String , Authorization :String , org_name : String ) :[Product]
      environments (baseURL : String , Authorization :String,  org_name : String) : [Environment!]
      environment  (baseURL : String , Authorization :String , org_name : String , env_name : String ) : Environment
      
      apis (baseURL : String , Authorization :String,  org_name : String): [String]

      users (baseURL : String , Authorization :String) : [UserDet!]
      user ( baseURL : String , Authorization :String, emailId: String!): UserDet
	  userByEmailId ( baseURL : String , Authorization :String, emailId: String!): [UserDet!]
	  
	  developers (baseURL : String , Authorization :String,  org_name : String) : [Developer!]
	  developersSubset (baseURL : String , Authorization :String,  org_name : String , developerIds : [String]) : [Developer!]
	  
	  productsIncludeProxies( baseURL : String , Authorization :String, org_name : String , includeProxies : [String] ) : [Product!]
	  productsWithoutProxies ( baseURL : String , Authorization :String, org_name : String ) : [Product!]
	  envDeployments  (baseURL : String , Authorization :String , org_name : String , env_name : String ) : [aPIProxy]
	  ProxyPolicies   (baseURL : String , Authorization :String , org_name : String , revision : String , proxyName : String ) : [Policy]
	  TargetServersList (baseURL : String , Authorization :String , org_name : String , env_name : String ) : [String]
	  AllTargetServersDetails (baseURL : String , Authorization :String , org_name : String , env_name : String ) : [TargetServer]
	  TargetServerDetails (baseURL : String , Authorization :String , org_name : String , env_name : String , targetServer : String) : TargetServer
	  

    }
	
	type TargetServer{
	host : String
	name : String 
	isEnabled : String 
	port : String
	sSLInfo : SSLInfo
	}
	
	type SSLInfo {
		ciphers : [String]
		clientAuthEnabled : String 
		enabled : String 
		ignoreValidationErrors : String
		keyAlias : String
		keyStore : String 
		protocols : [String]
		trustStore : String 
	}
	
    type aPIProxy {
    name : String
    policies : [Policy]
	revision : [Revision]
    
    }
    
    type Revision {
    name : String
    state : String 
    }
    
    type Policy {
    policyType : String
    name : String 
    enabled : String
	displayName:String
	sharedFlowBundle : String
    }
	
    
    type Organization {
      org_detials : Org_details
      environments : [Environment!]!
      apps : [App]
      apis : [String!]
      developers : [Developer]
      products : [Product]
    }

	type Developer {
      email : String
	  developerId : String 
	  apps : [String]
	  createdBy : String 
    }
	
    type Org_details {
      name : String
      displayName : String
      type : String
    }

    type Environment {
      name : String
      createdBy : String
      createdAt :String
      properties : Properties
    }

    type User {
      name: String!
    }

    type UserDet{
      emailId:String!
      firstName:String!
      lastName:String!
    }

    type App {
      appId : String
	  developerId : String 
      developer: Developer
      name : String
      status: String
      scopes: [String]
      credentials : [Credential]
	  callbackUrl : String
    }

    type Credential
    {
      apiProducts : [ApiProduct]
      consumerKey : String
      consumerSecret : String
      scopes : [String]
    }

    type ApiProduct
    {
      apiproduct : String
      status : String
    }

    type Product {
      name : String
      proxies : [String]
      scopes :[String]
      quota : String
      quotaInterval : String
      quotaTimeUnit : String
    }

    type Property {
      name : String
      value : String
    }

    type Properties {
      property : [Property]
    }

    type Mutation {
      createUser(name: String!): User!
      updateUser(id: ID!, name: String!): User
      deleteUser(id: ID!): User
    }

`;

module.exports = typeDefs;
