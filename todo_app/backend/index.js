const express = require("express");
//to import from types.js
const { createTodo, updateTodo } = require("./types");
const { todo } = require("./db");
const cors = require("cors");
const app = express();
app.use(express.json());
// app.use(cors({
//     origin: "http://localhost:5173"
// }))
app.use(cors());
// body {
//     title:String;
//     description:String;
// }

app.post("/todo" , async function(req , res){
    const createPayload = req.body;
    const parsedPayload = createTodo.safeParse(createPayload);
    if(!parsedPayload.success){
        res.status(411).json({
            msg:"you sent the wrong input",
        })
    return;
    }

    //put it in mongodb
    await todo.create({
        title:createPayload.title,
        description:createPayload.description,
        completed:false
    })
    res.json({
        msg:"Todo crated"
    })
})




app.get("/todos", async function(req, res) {
    try {
        const todos = await todo.find({});
        return res.json(todos);
    } catch (error) {
        return res.status(500).json({
            msg: "Internal Server Error"
        });
    }
});

app.put("/completed" , async function(req , res){

    const updatePayload = req.body;
    const parsedPayload = updateTodo.safeParse(updatePayload);

    if(!parsedPayload.success){
        res.status(411).json({
            msg:"you sent the wrong input",
        }) 
  return;
    }    

    await todo.update({

        _id : req.body.id
    } , {
        completed : true
    })
    res.json({
        msg: "Todo marked as completed"
    })
})

app.listen(3000);
