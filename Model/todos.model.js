const mongoose = require("mongoose");
const todosSchema =new mongoose.Schema({
    user_id:String,
    taskname : String,
    status :  String,
    tag :  String

  

})

const todosModel = mongoose.model("todos123",todosSchema);
module.exports={
    todosModel
};
