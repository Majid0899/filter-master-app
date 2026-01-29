import app from "./app";
import dotenv from 'dotenv'

dotenv.config()

const PORT: number = Number(process.env.PORT) || 4000;
const URL: string = process.env.URL || 'http://localhost';

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.listen(PORT, () => {
  console.log(`Server running on ${URL}:${PORT}`);
});
