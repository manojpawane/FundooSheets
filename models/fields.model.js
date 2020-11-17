const mongoose = require("mongoose");
const fieldSchema = new mongoose.Schema({
	name: {
		type: String,
		require: [true, "name is required field"],
		validate: /^[a-zA-Z0-9]([\w -]*[a-zA-Z0-9])?$/
	},
	headerType: {
		type: String,
		enum: ["text", "number", "key", "geocode", "enum", "count"],
		require: [true, "headerType is required field"]
	},
	format: {
		type: String,
		enum: ["none", "mobile","email", "date"],
		require: [true, "format is required field"]
	},
	sheetId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "sheets",
		require: [true, "sheets is required field"]
	},
	type: {
		type: String,
		default: "string"
	},
	isEnum: {
		type: Boolean,
		default: false
	},
	options: {
		type: Array,
		default: []
	},
	required: {
		type: Boolean,
		default: false
	},
	allowSuggestion: {
		type: Boolean,
		default: false
	},
	isDeleted: {
		type: Boolean,
		default: false
	}
},
	{
		timestamps: true
	}
);

const fields = mongoose.model("fields", fieldSchema, "fields");
module.exports = fields;