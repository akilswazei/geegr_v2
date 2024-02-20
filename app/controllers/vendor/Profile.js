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
        const inputs=accepted_inputs(["first_name","last_name","contact_no","description"],data)

        if(req?.files?.images){
            if(Array.isArray(req.files.images)){
                await Promise.all( req.files.images.map(async (value,key)=>{
                    console.log(value,key)
                    req.files.uploadFile=req.files.images[key];
                    profile_image.push((await customupload(req.files)))
                }))
            } else{
                req.files.uploadFile=req.files.images;
                profile_image.push((await customupload(req.files)))
            }
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
let getRandomFileName = async function () {
    var timestamp = new Date().toISOString().replace(/[-:.]/g,"");  
    var random = ("" + Math.random()).substring(2, 8); 
    var random_number = timestamp+random;  
    return random_number;
}


let customupload= async function (req) {
  
    console.log(Object.keys(req).length)
  
    // When a file has been uploaded
    if (req && Object.keys(req).length !== 0) {
          
      // Uploaded path
      const uploadedFile = req.uploadFile;
    
      // Logging uploading file
     // console.log(uploadedFile,'jony');
    
     
  
      let now = await getRandomFileName();
      // Upload path
  
      console.log(now,'fileunique name time'+uploadedFile);    
  
      // UNCOMMENT FOR LOCAL CHECK  
      const uploadPath = process.env.UPLOAD_IMAGE_PATH+now+uploadedFile.name;
  
      // UNCOMMENT FOR LIVE CHECK FOR IP http://170.187.251.211:3000    
      //const uploadPath = '/home/geegr_v2/uploads/' +now+uploadedFile.name;
    
      // To save the file using mv() function
      try{
          console.log("Upload Files");
          await uploadedFile.mv(uploadPath);
          
          /*let saveImage = new Media({file: now+uploadedFile.name});
          saveImage.save();  
          console.log("File Id " + saveImage._id);*/

          return now+uploadedFile.name;
      } catch(e){
  
           console.log("File Id Error" + e );
          return false
      }
  
  
    } else return false
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
