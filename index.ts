import Server from "./classes/server";
import userRoutes from "./routes/user";
import mongoose from 'mongoose';

const server = new Server;

// Routes
server.app.use('/user', userRoutes );

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/fotosgram', 
{ useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}, (err) => {
    
    if(err) throw err;
    console.log('MongoDB Connected');
    });

//Init express
server.start( () => {
    console.log(`Server started on ${server.port}`);
});