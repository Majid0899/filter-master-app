import app from "./app";

const PORT = 4000;

app.get("/",(req,res)=>{
    res.send("Hello")
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
