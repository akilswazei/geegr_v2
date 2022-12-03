const jwt=require('jsonwebtoken')
const Project = require("./../../../models/Project_model");
const User = require("./../../../models/User_model");
const Proposal = require("./../../../models/Proposal_model");
const Category = require("./../../../models/ServiceCategory_model");

// const {insert_user} = require("./../../functions/core")

async function index(req,res,next){
    const result = await Project.find({});
    return res.send({
        data: result,
        status: true,
        error:{}
    });
}
async function details(req,res,next){
    const query={};
    query._id = req.body._id;
    const result = (await Project.findOne(query)).toObject();
    const projects = await Project.find({created_by: result.created_by});
     if(result.category){
            result.category=await Category.findOne({_id: result.category})
        }
      if(result.created_by){
            result.customer=await User.findOne({_id: result.created_by})
        }  
     if(result.sub_category){
        result.sub_category=await Category.findOne({_id: result.sub_category})
    }
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
