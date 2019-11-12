import Server from "./classes/server";
import userRoutes from "./routes/user";

const server = new Server;

// Routes
server.app.use('/user', userRoutes )

//Init express
server.start( () => {
    console.log(`Server started on ${server.port}`);
});