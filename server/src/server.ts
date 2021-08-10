import { ApolloServer } from "apollo-server-express";
import { PrismaClient } from "@prisma/client";
import Express from "express";
import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import { buildSchema } from "type-graphql";
import { createServer } from 'http';
import { UserResolver } from "./resolvers/User";
// import { SubscriptionServer } from 'subscriptions-transport-ws';
// import { execute, subscribe } from 'graphql';
const PORT = process.env.PORT || 5000;

// resolvers

const main = async () => {

    // const jwt = async(req: any, _res: any, next: NextFunction) => {
    //     const token = req.get("X-JWT");
    //     if(token) {
    //         const user = await decodeJWT(token);
    //         if(user) {
    //             req.user = user;
    //         } else {
    //             req.user = undefined;
    //         }
    //     }
    //     next();
    // }

    const schema = await buildSchema({
        resolvers: [ 
            UserResolver
         ],
        authChecker: ({ context: { req } }) => {
            if(req.user)
                return true;
            else 
                return false
        },
        emitSchemaFile: true,
        validate: false,

    });
    const prisma = new PrismaClient();
    const server = new ApolloServer({ schema, context: (ctx) => {
            return {
                req: ctx.req,
                //connection: ctx.connection,
                prisma
            }
        }
    }); 
    const app = Express();
    //app.use(jwt);
    const ws = createServer( app );
    await server.start();
    server.applyMiddleware({ app });
    // SubscriptionServer.create(
    //     { schema, execute, subscribe,
    //         onConnect: async (connectionParams: any) => {
    //                     const token = connectionParams["X-JWT"];
    //                     if(token) {
    //                         const user = await decodeJWT(token);
    //                         if(user) {
    //                             return {
    //                                 currentUser: user
    //                             }
    //                         }
    //                     }
    //                     throw new Error("Not Authorised to Subscribe...");
    //                 },
    //                 onDisconnect: () => {
    //                     console.log("Client disconnected from subscriptions");
    //                 }
    //     },
    //     { server: ws, path: "/subscriptions" }
    //   );
    //server.installSubscriptionHandlers(ws);
    ws.listen({ port: PORT }, () => console.log(`🚀 Server ready and listening at ==> http://localhost:${PORT}${server.graphqlPath}`))
}
main().catch((error)=> {
    console.log(error, 'error');
});
