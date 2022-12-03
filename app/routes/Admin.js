const express = require("express")
const service = require('./../controllers/admin/ServiceCategory');

vendot_router = express.Router()


vendot_router.post('/service-category/add', service.add);
//vendot_router.get('/service/details', service.details);

// vendot_router.get('/projects', project.index);
// vendot_router.get('/project/details', project.details);

module.exports=vendot_router
