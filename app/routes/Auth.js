const express = require("express")
const user = require('../controllers/user');

user_router = express.Router()

console.log("i am there");
user_router.post('/', user.add);
user_router.put('/', user.update);
user_router.get('/:id', user.get);
user_router.delete('/', user.remove);
user_router.get('/', user.list);

module.exports=user_router
