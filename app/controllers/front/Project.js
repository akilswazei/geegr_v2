const jwt=require('jsonwebtoken')
const Project = require("./../../../models/Project_model");
const User = require("./../../../models/User_model");
const Proposal = require("./../../../models/Proposal_model");
const Category = require("./../../../models/ServiceCategory_model");
const {fileupload}= require("./../../../helper/fileupload");
// const {insert_user} = require("./../../functions/core")

async function index(req, res, next) {
    const data = req.body;

    // Destructure the data object for cleaner code
    const { s: searchData = "", location = "", page = 1 } = data;

    const pageSize = 10; // Adjust the page size as needed

    console.log("Fetching Service API Listing Line 16");
    console.log(req.body);

    console.log("Page in Query " + page);

    try {
        let projects;
        // If there's a search string or location, include them in the query
        const searchCriteria = {
            approval_status: "approved",
        };

        if (searchData.trim() !== "" || location.trim() !== "") {
            

            if (searchData.trim() !== "") {
                searchCriteria.title = { $regex: new RegExp(searchData, "i") };
            }

            if (location.trim() !== "") {
                searchCriteria.location = { $regex: new RegExp(location, "i") };
            }

            // Use the Project model here (assuming Project is defined)
            projects = await Project.find(searchCriteria)
                .populate('images')
                .sort({ created_at: 'desc' })
                .skip((page - 1) * pageSize)
                .limit(pageSize);

        } else {
            // If no search string or location, fetch all approved services
            // Use the Project model here (assuming Project is defined)
            projects = await Project.find({searchCriteria})
                .populate('images')
                .sort({ created_at: 'desc' })
                .skip((page - 1) * pageSize)
                .limit(pageSize);

        }

        // Calculate totalServices and totalPages outside the if-else block
        const totalServices = await Project.countDocuments(searchCriteria);
        const totalPages = Math.ceil(totalServices / pageSize);

        return res.send({
            data: projects,
            totPages: totalPages,
            status: true,
            error: {}
        });
    } catch (err) {
        console.log(err.message);
        next({ statusCode: 400, error: err.message });
    }
}

async function details(req,res,next){
    const query={};
    query._id = req.body._id;
    const result = (await Project.findOne(query)).toObject();

    const projectproposal = await Proposal.findOne({project_id: result.project_id});
     if(projectproposal){
        result.projectproposal=  projectproposal 
     }
     if(result.category){
            result.category=await Category.findOne({_id: result.category})
        }
      if(result.created_by){
            result.customer=await User.findOne({_id: result.created_by})
        }  
     if(result.sub_category){
        result.sub_category=await Category.findOne({_id: result.sub_category})
    }

    const projects = await Project.find({created_by: result.created_by});

  //  console.log(projects)
    let allproposals=[]
    await Promise.all( projects.map(async function(project, index){
        let proposal=await Proposal.findOne({project: project._id, status: "completed" })
        if(proposal){
            allproposals.push(proposal)

        } 
    })
    )
    let total_rating=0.0;
    if(allproposals){
        allproposals.map(async function(proposal, index){
            total_rating+=proposal.review_from_vendor.rating
        })

    }
    total_rating=total_rating/allproposals.length;
    result.past_history=allproposals;
    result.total_rating=total_rating;


    return res.send({
        data: result,
        status: true,
        error:{}
    });
}
module.exports={index,details}
