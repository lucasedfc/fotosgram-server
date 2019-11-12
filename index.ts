import Server from "./classes/server";
import userRoutes from "./routes/user";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const server = new Server;

// Body parser
server.app.use( bodyParser.urlencoded({ extended: true }));
server.app.use( bodyParser.json());


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