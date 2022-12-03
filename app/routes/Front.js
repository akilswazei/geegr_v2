const express = require("express")
const service = require('./../controllers/front/Service');
const project = require('./../controllers/front/Project');
const Home = require('./../controllers/front/Home');

front_router = express.Router()

front_router.get('/', Home.index);

front_router.get('/services', service.index);
front_router.get('/service/details', service.details);

front_router.get('/projects', project.index);
front_router.get('/project/details', project.details);

module.exports=front_router
