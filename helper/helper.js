// const generator = require("generate-password");

// exports.generateRandomPassword = async () => {
//   const password = await generator.generate({
//     length: 10,
//     numbers: true,
//   });
//   return password;
// };
  const Chat = require("./../models/Chat_model");  


exports.accepted_inputs =(accepted_input,data) =>{
  let newdata={};
  for (const property in data) {
    if(accepted_input.includes(property))
    newdata[property]=data[property]
  }
  return newdata  
}

exports.send_message =async (proposal_id,type,from,message,data) =>{
      try{
        const chat=new Chat({ proposal_id: proposal_id,message: message,type: type,from: from, data: {...data,proposal_id:proposal_id} }) 
        const result = await chat.save().then(chat => chat.populate("data.file")).then(chat =>{
                            chat=chat.toObject();
                            if(chat?.data?.file && chat.data.file.length!=0){
                                chat.data.file.map(async (ffile,gkey)=>{
                                    ffile.file=process.env.root_url+'/uploads/'+ffile.file
                                    return ffile
                                })
                                console.log("run before");
                                
                            }    
                return chat  
          });
        io.emit(proposal_id, result);
        return {status: true, message: result}
      } catch(err){
        console.log(err);
        return {status: false, message: err}
      }

}

exports.update_message =async (proposal_id,data) =>{
      try{
        let latestchat=await Chat.find({type:'proposal_update',proposal_id: proposal_id}).sort({ _id: -1 }).limit(1)
        console.log(latestchat,'mayerro')

        latestchat=await Chat.findOneAndUpdate({_id: latestchat[0]._id},{'$set':  {'data.line_items': data.line_items, update:true}},{new: true});

        latestchat=latestchat.toObject();
        console.log(latestchat,'UPDATETEST');
        io.emit(proposal_id, latestchat);

        return {status: true, message: result}
      } catch(err){
        console.log(err,'mayerro')
        return {status: false, message: err}
      }

}
exports.update_line_item_message =async (proposal_id,message_id,data) =>{
      try{
        // 'data.line_items': data.line_items,
        let latestchat=await Chat.findOneAndUpdate({_id: message_id},{'$set':  {update:true}},{new: true})  

        const chat=new Chat({ proposal_id: proposal_id,message: "Line Item Added successfully",type: "system",from: "system", data: {} }) 
        const chatResult = await chat.save() 
        
        io.emit(proposal_id, latestchat);
        io.emit(proposal_id, chatResult);

        return {status: true, message: result}
      } catch(err){
        console.log(err,'mayerro')
        return {status: false, message: err}
      }

}



// const bcrypt = require("bcryptjs");
// const aa = async () => {
//   console.log(await bcrypt.hash("Admin.one1", 10));
// };
// aa();
