const jwt=require('jsonwebtoken')
const User = require("./../../../models/User_model");
const {accepted_inputs} = require("./../../../helper/helper");
const bcrypt = require("bcryptjs");
const path = require("path");

async function index(req,res,next){
    let data=req.body;

    try{
        console.log(data.user._id,'tuid')
        let result = await User.findOne({_id: data.user._id});
        
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        console.log(err.message);
         next({statusCode: 400, error: err.message});
    }
}
async function update(req,res,next){
    let data=req.body;

    try{
        var errormessage;
        const profile_image=[]
        const inputs=accepted_inputs(["first_name","last_name","vendor_contact_no","vendor_description"],data)
        if(req?.files?.file && req?.files?.file?.length!=0){
            const files=!Array.isArray(req.files.file)?[req.files.file]:req.files.file
            await Promise.all( files.map(async (file) => {
                const image=file.name;
                await file.mv(path.resolve('','/home/geegr_v2/uploads',image), function(error){
                    errormessage=error;
                })            
                console.log(image)
                profile_image.push(image);                
            }))
            inputs.profile_image=profile_image;
        }

        if(errormessage!=undefined){
            throw new Error(error);
        }
        let result = await User.findOneAndUpdate({_id: data.user._id},inputs,{new: true});
        
        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        console.log(err.message);
         next({statusCode: 400, error: err.message});
    }
}
async function address_index(req,res,next){
    let data=req.body;
    try{
        let result = await User.findOne({_id: data.user._id})
         return res.send({
            data: result.vendor_address,
            status: true,
            error:{}
        });
    } 
    catch(err){
        return {error: err.message}
        next({statusCode: 400, error: err.message});
    }
}

async function settings(req,res,next){
    let data=req.body;
    try{
        let result = await User.findOne({_id: data.user._id})
         return res.send({
            data: result.settings,
            status: true,
            error:{}
        });
    } 
    catch(err){
        return {error: err.message}
        next({statusCode: 400, error: err.message});
    }
}

async function update_settings(req,res,next){
    let data=req.body;
    try{
        const inputs=accepted_inputs(["key","value"],data)
        let result = await User.findOne({_id: data.user._id}).then((doc) =>{
            try{
                 item = doc.settings.id(data.settings_id);
                 item["key"]=inputs.key
                 item["value"]=inputs.value
                doc.save();    
                return item;
            } catch(err){
                return {error: err.message}
            }
        });
        if(result.error){
            throw new Error(result.error);
        }


        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }  catch(err){
        return {error: err.message}
        next({statusCode: 400, error: err.message});
    }
}

async function address_detail(req,res,next){
    let data=req.body;
    try{
        let result = await User.findOne({_id: data.user._id}).then((doc) =>{
                item = doc.vendor_address.id(data.address_id);
                return item
            })

         return res.send({
            data: result,
            status: true,
            error:{}
        });
    } 
    catch(err){
        return {error: err.message}
        next({statusCode: 400, error: err.message});
    }
}
async function add_address(req,res,next){
    let data=req.body;

    try{
        const inputs=accepted_inputs(["nick_name","country","address","appartment","city","state","zipcode"],data)
        let result = await User.findOne({_id: data.user._id}).then((doc) =>{
            try{
                console.log(doc.vendor_address)
                if(doc.vendor_address==null){
                    doc.vendor_address=[];
                }
                doc.vendor_address.push(inputs)
                doc.save();    
                return doc;
            } catch(err){
                return {error: err.message}
            }
        });
        if(result.error){
            throw new Error(result.error);
        }


        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        console.log(err.message);
         next({statusCode: 400, error: err.message});
    }
}
async function update_address(req,res,next){
    let data=req.body;

    try{
        const inputs=accepted_inputs(["nick_name","country","address","appartment","city","state","zipcode"],data)
        let result = await User.findOne({_id: data.user._id}).then((doc) =>{
            try{
                 item = doc.vendor_address.id(data.address_id);
                 item["nick_name"]=inputs.nick_name
                 item["country"]=inputs.country
                 item["address"]=inputs.address
                 item["appartment"]=inputs.appartment
                 item["city"]=inputs.city
                 item["state"]=inputs.state
                 item["zipcode"]=inputs.zipcode
                doc.save();    
                return item;
            } catch(err){
                return {error: err.message}
            }
        });
        if(result.error){
            throw new Error(result.error);
        }


        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        console.log(err.message);
         next({statusCode: 400, error: err.message});
    }
}


async function delete_address(req,res,next){
    let data=req.body;

    try{

        const inputs=accepted_inputs(["nick_name","country","address","appartment","city","state","zipcode"],data)
        let result = await User.findOneAndUpdate({_id: data.user._id}, {
            $pull: {
                vendor_address: {_id: data.address_id},
            },
        },{new: true});
        if(result.error){
            throw new Error(result.error);
        }


        return res.send({
            data: result,
            status: true,
            error:{}
        });
    }
    catch (err) {
        console.log(err.message);
         next({statusCode: 400, error: err.message});
    }
}


module.exports={index,update,add_address,update_address,delete_address,address_index,address_detail,settings,update_settings}
