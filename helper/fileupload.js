const express = require("express")
const fs = require("fs");


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

module.exports={fileupload}