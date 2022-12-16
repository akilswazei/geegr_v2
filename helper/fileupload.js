const express = require("express")
const fs = require("fs");


fileupload = express.Router();

fileupload.post('/', (req, res,next) => {
  
    const path = './uploads/'+Date.now()+'.png'

        const imgdata = req.body.file;

//          console.log(imgdata)
        // to convert base64 format into random filename
        const base64Data = imgdata.replace(/^data:([A-Za-z-+/]+);base64,/, '');
        console.log(base64Data)
        fs.writeFileSync(path, base64Data,  {encoding: 'base64'});

        return res.send(path);


})
module.exports=fileupload