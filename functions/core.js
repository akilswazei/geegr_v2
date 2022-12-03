const post_model = require("../models/user_model")

// exports.insert_post=async (data)=>{
//    const mdata={post_title,post_content,post_status,categoires}=data;

//    if(data.metadata){
//       mdata.metadata=data.metadata;
//    }
//    const saveData=new post_model(mdata);
//    let result;
//    try{
//       await saveData.save();
//       result= {"status": true, "data": {id: 124}}
//    } catch(e){
//       result= {"status": false, "data": {},error:"error"}
//    }
//    return result;
// }
// exports.update_post=async (data)=>{
//    const mdata={post_title,post_content,post_status,categoires,post_author}=data;
//    let result;
//    if(data.metadata){
//       mdata.metadata=data.metadata;
//    }
//    try{
//       await post_model.updateOne({ _id: data._id }, mdata);
//       result= {"error": false, "message": "success"}
//    } catch(e){
//       result= {"error": true, "message": "error"}
//    }
//    return result;
// }

// exports.delete_postmeta=async (data)=>{
//    try{
//       await post_model.update({ _id: data._id }, {
//          $pull: {
//              "metadata": { "name":data.name },
//           }
//       });
//       result= {"error": false, "message": "success"}
//    } catch(e){
//       result= {"error": true, "message": "error"}
//    }
//    return result;
// }


// exports.update_postmeta=async (data)=>{
//    const mdata={name,value}=data
//    let metadata
//    try{
//       let todo='add';
//       let post=await post_model.findById(data._id);
//       post=post.toObject();
//       for(let i in post.metadata){
//          if(post.metadata[i].name==mdata.name){
//             todo='update';
//             break;
//          }
//       }
//       if(todo=='add'){
//          await post_model.update({ _id: data._id }, {
//             $push: { metadata: mdata }
//          });
//       } else{
//          await post_model.update({ _id: data._id,'metadata.name': mdata.name }, {
//             $set: {
//                 "post_title.$.value": mdata.value,
//              }
//          });
//       }
//       result= {"error": false, "message": "success"}
//    } catch(e){
//       result= {"error": true, "message": "error"}
//    }
//    return result;
// }

// exports.get_posts=async ()=>{
//    let mdata=[];
//    let result;
//    try{
//         let data=await post_model.find({});
//         for (let i in data){
//          let temppost=data[i].toObject();
//          let categoires=await category_model.find({ '_id': { $in: temppost.categoires } });
//          let post_author=await user_model.findById(temppost.post_author);
//          mdata[i]={...temppost,categoires:categoires,post_author: post_author};
//         }
//         result= {"error": false, "data": mdata}
//     } catch(e){
//        result= {"error": true, "message": "error"}
//     }
//     console.log("I am first");
//     return result;
//  }


// exports.insert_category=async (data)=>{
//     const saveData=new category_model(data);
//     let result;
//     try{
//        await saveData.save();
//        result= {"error": false, "message": "success"}
//     } catch(e){
//        result= {"error": true, "message": "error"}
//     }
//     return result;
//  }

//  exports.insert_user=async (data)=>{
//    const mdata={username,user_email,user_status,user_password}=data;
//    const saveData=new user_model(mdata);
//    let result;
//    try{
//       await saveData.save();
//       result= {"error": false, "message": "success"}
//    } catch(e){
//       result= {"error": true, "message": "error"}
//    }
//    return result;
// }

postmeta_model