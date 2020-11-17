const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let projectSchema = new Schema({
	projectName: { 
		type:String,
		required:true,
		max:100,
		min:3,
		validate: /^[a-zA-Z]+[a-zA-Z0-9-_ ]*[a-zA-Z0-9]$/
	},

	description:{
		type:String,
	},
    

	type:{
		type: String
	},

	userId : {
		type:mongoose.Schema.Types.ObjectId, required:true
	},  

	createdBy:{
		type:mongoose.Schema.Types.ObjectId,
	},

	updatedBy :{
		type:mongoose.Schema.Types.ObjectId
	},

	isDelete:{
		type:Boolean,
		default:false
	}
},
{
	timestamps: true
}
);


module.exports = mongoose.model("project", projectSchema , "project");