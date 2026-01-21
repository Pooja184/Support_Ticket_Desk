import express from 'express'

const app=express();

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Api working....")
    console.log("api working")
})

app.listen(3000,()=>console.log(`server listening`))