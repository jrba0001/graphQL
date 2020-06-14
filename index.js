const {ApolloServer, gql} = require ('apollo-server');
const typeDefs = require ('./db/schema')
const resolvers = require ('./db/resolvers')
const jwt = require ('jsonwebtoken');
require('dotenv').config({ path: 'variables.env' });

const conectarDB = require('./config/db');

conectarDB();

//servidor
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:async ({req})=>{
        //console.log(req.headers['authorizations'])
        const token = req.headers['authorizations']||'';
        if(token){
            try {
                const usuario = await jwt.verify(token,process.env.SECRETA)
                return {usuario}
            } catch (error) {
                console.log(error)
                
            }
        }
    }
    });

//arranca servidor

server.listen({port:process.env.PORT||4000}).then(({url})=>{
    console.log(`Servidor arrancado en URL ${url}`)
})