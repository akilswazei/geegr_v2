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

        io.emit(proposal_id, { message: message,type: type,from: from, data: data });
        const chat=new Chat({ proposal_id: proposal_id,message: message,type: type,from: from, data: data }) 
        const result = await chat.save()       
        return {status: true, message: result}
      } catch(err){
        return {status: false, message: err}
      }

}



// const bcrypt = require("bcryptjs");
// const aa = async () => {
//   console.log(await bcrypt.hash("Admin.one1", 10));
// };
// aa();
