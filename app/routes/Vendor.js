const express = require("express")
const service = require('./../controllers/vendor/Service');
const proposal = require('./../controllers/vendor/Proposal');
const project = require('./../controllers/front/Project');
const Home = require('./../controllers/front/Home');

vendot_router = express.Router()


vendot_router.post('/service/add', service.add);
vendot_router.post('/service/update', service.update);
vendot_router.post('/proposal/add', proposal.add);
vendot_router.post('/proposal/add_review', proposal.add_review);

//vendot_router.get('/service/details', service.details);

// vendot_router.get('/projects', project.index);
// vendot_router.get('/project/details', project.details);

module.exports=vendot_router
