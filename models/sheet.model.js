const mongoose = require("mongoose");
const sheetSchema = new mongoose.Schema({
	sheetName: {
		type: String, require: [true, "sheetName is required field"], validate: /^[a-zA-Z0-9]([\w -]*[a-zA-Z0-9])?$/
	},
	description: { type: String, require: [true, "description is required field"] },
	projectId: { type: mongoose.Schema.Types.ObjectId, ref: "project", require: [true, "projectId is required field"] },
	sheetUniqueName: { type: String, default: "" },
	isDeleted: { type: Boolean, default: false }
},
	{
		timestamps: true
	}
);

const sheets = mongoose.model("sheets", sheetSchema, "sheets");
module.exports = sheets;