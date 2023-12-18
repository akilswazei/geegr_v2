const express = require("express")
const fs = require("fs");
const Media = require("./../models/Media_model");

const fileupload=(base64Data,ref_id) =>{
    console.log(getFileExtension(base64Data));
    const filename=ref_id+"-"+Date.now()+'.'+getFileExtension(base64Data);
    const path = './uploads/'+filename;

    var data = base64Data.replace(/^data:image\/\w+;base64,/, "");
   // var buf = Buffer.from(data, 'base64');

    fs.writeFileSync(path, data,  {encoding: 'base64'});
    return filename;

}

function getFileExtension(filename){
    // get file extension
    extension = filename.split(";");
    extension=extension[0].substring("11")
    return extension;
}
let customupload= async function (req) {
  
  console.log(Object.keys(req).length)

  // When a file has been uploaded
  if (req && Object.keys(req).length !== 0) {
        
    // Uploaded path
    const uploadedFile = req.uploadFile;
  
    // Logging uploading file
    console.log(uploadedFile,'jony');
  
    let now=new Date().toString();
    // Upload path
    ///const uploadPath = '/home/geegr_v2'+ "/uploads/" +now+uploadedFile.name;

    const uploadPath = "geegr_v2/uploads/" +now+uploadedFile.name;        
  
    // To save the file using mv() function
    try{
        await uploadedFile.mv(uploadPath);
        console.log("Uploading files");
        let saveImage = new Media({file: now+uploadedFile.name});
        saveImage.save();
        return saveImage._id
    } catch(e){
        console.log(e)
        return false
    }


  } else return false
}

module.exports={fileupload,customupload}