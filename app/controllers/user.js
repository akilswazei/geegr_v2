const {insert_user} = require("./../../functions/core")

async function get(req,res){ return res.send({"data": "I am get"}); }

async function remove(req,res){ return res.send({"data": "I am remove"}); }

async function update(req,res){ return res.send({"data": "I am update"}); }

async function list(req,res){ return res.send({"data": "I am list"}); }

async function add(req,res,next){
    result=await insert_user(req.body)
    return res.send(result); 
}

module.exports={get,remove,update,list,add}