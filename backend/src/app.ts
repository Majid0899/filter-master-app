import express,{Application} from "express"
import cors from 'cors'
import { createConnection } from './config/db'



const app:Application = express();


app.use(cors())
app.use(express.json());




// Create the database connection
createConnection()

export default app;
