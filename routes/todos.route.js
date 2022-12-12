const express = require("express");

const { todosModel } = require("../Model/todos.model");

const todosRouter = express.Router();

todosRouter.get("/", async (req, res) => {
  try {
    const notes = await todosModel.find();
    res.send(notes);
  } catch (err) {
    console.log(err);
    res.send({ massage: "Something Went Wrong" });
  }
});

todosRouter.post("/create", async (req, res) => {
  const payload = req.body;
  try {
    const new_user = new todosModel(payload);
    await new_user.save();
    res.send({ massage: "Note Created Successfully" });
  } catch (err) {
    console.log(err);
    res.send({ massage: "Something Went Wrong" });
  }
});

todosRouter.patch("/update/:todosID", async (req, res) => {
  try {
    const payload = req.body;
    const todosID = req.params.todosID;
    const userID = req.body.userID;
    const todo = await todosModel.findOne({ _id: todosID });
    if (userID !== todo.userID) {
      res.send("Not Authorised");
    } else {
      await todosModel.findByIdAndUpdate({ _id: todosID },payload);
      res.send({ massage: "Todo Updated Successfully" });
    }
  } catch (err) {
    console.log(err);
    res.send({ massage: "Something Went Wrong" });
  }
});

todosRouter.delete("/delete/:todosID", async (req, res) => {
  try {
    const todosID = req.params.todosID;
    const userID = req.body.userID;
    const todo = await todosModel.findOne({ _id: todosID });
    if (userID !== todo.userID) {
      res.send("Not Authorised");
    }
   else{
    await todosModel.findByIdAndDelete({ _id: todosID });
    res.send({ massage: "Todo Deleted Successfully" });
   }
  } catch (err) {
    console.log(err);
    res.send({ massage: "Something Went Wrong" });
  }
});

module.exports = { todosRouter };