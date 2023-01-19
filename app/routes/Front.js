const express = require("express")
const service = require('./../controllers/front/Service');
const project = require('./../controllers/front/Project');
const Home = require('./../controllers/front/Home');

front_router = express.Router()

front_router.get('/', Home.index);
front_router.post('/category_search', Home.category_search);

front_router.post('/services', service.index);
front_router.post('/service/details', service.details);

front_router.post('/projects', project.index);
front_router.post('/project/details', project.details);

module.exports=front_router
