import express, {json} from 'express'
import {config} from 'dotenv'
import mongoose from 'mongoose'
import {router} from "./routes/routes.js"
import fileUpload from 'express-fileupload'
import cors from 'cors'
import http from 'http';
import {fileURLToPath} from "url";
import path from "path";
import {Server} from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

config();

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3000"
    }
});

app.use(cors())
app.use(json());
app.use(express.static(path.resolve(__dirname, 'images')))
app.use(fileUpload({}))
app.use('/api', router);

// io.on('connection',socket => {
//     console.log('a user connected' + socket.id);
// })


const startApp = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        server.listen(PORT, () => console.log('Started at port ' + PORT));
    } catch (e) {
        console.log(e);
    }

}

startApp();