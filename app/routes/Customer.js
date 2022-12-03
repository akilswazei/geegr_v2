const express = require("express")
const service = require('./../controllers/Customer/Project');
const proposal = require('./../controllers/Customer/Proposal');
const Home = require('./../controllers/front/Home');

customer_router = express.Router()


customer_router.post('/project/add', service.add);
customer_router.post('/proposal/complete_project', proposal.complete_project);
customer_router.post('/proposal/accept_proposal', proposal.accept_proposal);
customer_router.post('/proposal', proposal.index);
//vendot_router.get('/service/details', service.details);

// vendot_router.get('/projects', project.index);
// vendot_router.get('/project/details', project.details);

module.exports=customer_router
