const express = require("express")
const service = require('./../controllers/admin/ServiceCategory');
const employee = require('./../controllers/admin/Employee');

admin_router = express.Router()


//admin_router.post('/service-category/add', service.add);
//admin_router.post('/service-category/update', service.update);
admin_router.post('/employee_list', employee.index);
admin_router.post('/employee/add', employee.add);
admin_router.post('/employee/delete', employee.remove);
module.exports=admin_router
