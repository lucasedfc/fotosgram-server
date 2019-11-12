import Server from "./classes/server";

const server = new Server;

//Init express
server.start( () => {
    console.log(`Server started on ${server.port}`);
});