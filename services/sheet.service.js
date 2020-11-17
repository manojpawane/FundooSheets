"use strict";
const ObjectID = require("mongodb").ObjectID
const moleculerAdapter = require("moleculer-db-adapter-mongoose");
const DbService = require("moleculer-db");
const { MoleculerClientError } = require("moleculer").Errors;
const { ValidationError } = require("moleculer").Errors;
const sheetSchema = require("../models/sheet.model");
const fieldsSchema = require("../models/fields.model");
const mongoose = require("mongoose");
const moment = require('moment');
let requiredField = ["name", "headerType", "allowSuggestion", "format", "required"];
let headerEnumMaster = ["text", "number", "key", "geocode", "enum", "count"];
let formatEnumMaster = ["none", "mobile", "email", "date"];
let async = require("async");
require("dotenv").config();
module.exports = {
	name: "sheet",
	mixins: [DbService],
	// adapter: new moleculerAdapter("mongodb://localhost:27017/fundooSheetsProjectMgmtSheetsModule"),
	adapter: new moleculerAdapter(process.env.MONGODB_URL),
	model: sheetSchema,
	/**
	 * Service settings
	 */
	settings: {

		/** Public fields */
		// fields: ["_id", "projectId", "fieldSchema"],
		/** Validator schema for entity */
		entityValidator: {
			sheetName: { type: "string", min: 3 },
			description: { type: "string", min: 5 },
			// fieldSchema: {type: "array"} 
		}
	},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
         * Add a new sheet
         */
		addSheet: {
			params: {
				sheet: {
					type: "object", props: {
						sheetName: { type: "string" },
						description: { type: "string" }
					}
				},
			},
			auth: "required",
			handler(ctx) {
				try {

					let entity = ctx.params.sheet;
					let projectId = ctx.params.projectId;
					let updatedEntity = {
						"sheetName": entity.sheetName,
						"description": entity.description
					};
					// console.log("entity ------- 56", entity);
					return this.Promise.resolve().then(() => {
						return ctx.call("project.get", { id: projectId })
							.then(data => {
								// console.log("data after finding project", data);
							}).then(() => {
								return this.validateEntity(updatedEntity)
									.then(() => {
										updatedEntity.projectId = projectId;
										updatedEntity.sheetUniqueName = updatedEntity.sheetName.toLowerCase() + "_" + projectId;

										if (projectId)
											return sheetSchema.find({ projectId: projectId, isDeleted: false })
												.then(sheetData => {
													// console.log("sheetdata: ", sheetData);
													for (let i = 0; i < sheetData.length; i++) {
														if (sheetData[i].sheetName.toLowerCase() === updatedEntity.sheetName.toLowerCase())
															return Promise.reject(new MoleculerClientError("Sheet Name already exist!", 422, ""));
													}
												});
									})
									.then(() => {
										return this.adapter.insert(updatedEntity)
											.then(doc => {
												doc.sheetUniqueName = doc.sheetName.toLowerCase().replace(/ /gi, "_") + "_" + projectId + "_" + doc._id;
												return this.adapter.updateById(doc._id, doc)
													.then(updatedoc => {
														// this.transformDocuments(ctx, {}, updatedoc)

														if (updatedoc === (null || undefined)) {
															return Promise.reject(new MoleculerClientError("Something bad happened", 500, ""));
														} else {
															return Promise.resolve({ message: "Sheet added successfully!", code: 200, type: "success", data: "" });
														}
													});
											});
									});

							});
					}).catch((err) => {
						console.log("errrrrr 106 ---------", err.message);
						return Promise.reject(err);
					});

				} catch (error) {
					console.log("error 113--------------", error);

					throw new Error(error);
				}
			}
		},

		updateSheet: {
			params: {
				field: {
					type: "object"
				},
			},
			auth: "required",
			handler(ctx) {
				try {
					let entity = ctx.params.field;
					let projectId = ctx.params.projectId;
					let sheetId = ctx.params.sheetId;

					return Promise.resolve()
						.then(() => {
							return ctx.call("project.get", { id: projectId })
								.then(data => {
									// console.log("data after finding project", data);
								}).then(() => {
									let keys = Object.keys(entity);
									if (!keys.includes("sheetName"))
										return Promise.reject(new MoleculerClientError("SheetName is missing", 400, "Bad request"));

									if (!keys.includes("description"))
										return Promise.reject(new MoleculerClientError("description is missing", 400, "Bad request"));

									if (sheetId === undefined)
										return Promise.reject(new ValidationError("ProjectId or SheetId missing!", ""));
									return sheetSchema.find({ isDeleted: false })
										.then(data => {
											if (data === undefined)
												return Promise.reject(new MoleculerClientError("No data found", 404));
											// console.log("data after fining all--", data);
											for (let i = 0; i < data.length; i++) {
												if (data[i].sheetName === entity.sheetName)
													return Promise.reject(new MoleculerClientError("Sheet Name already exist!", 422, ""));
											}
										})
										.then(() => {

											return sheetSchema.findOneAndUpdate({ projectId: projectId, _id: sheetId, isDeleted: false },
												{ sheetName: entity.sheetName, description: entity.description },
												{ new: true })
												.then(sheetData => {
													if (sheetData.sheetName === entity.sheetName && sheetData.description === entity.description)
														return Promise.resolve({ message: "Sheet updated successfully!", code: 200, type: "success", data: "" });
													return Promise.reject(new MoleculerClientError("Something went wrong", 500));
												});
										});
								});


						})
						.catch((err) => {
							return Promise.reject(err);
						});
				} catch (error) {
					return Promise.reject(new MoleculerClientError(error, 500));
				}
			}
		},

		/**
         * Add fields to sheet
         */
		addSheetFields: {
			params: {
				field: {
					type: "array"
				}
			},
			auth: "required",
			handler(ctx) {
				try {
					let entity = ctx.params.field;
					let sheetId = ctx.params.sheetId;
					let projectId = ctx.params.projectId;

					if (entity[0].options) {
						console.log("entity[0].headerType------", entity[0].headerType);
						console.log("entity[0].options.length ------", entity[0].options.length);

						if (entity[0].headerType != "enum" && entity[0].options.length > 1)
							return Promise.reject(new MoleculerClientError("Options can only be provided for headerType 'enum'", 404, "bad request"));
					}
					let uniqueSheetData;
					if (entity.length > 1)
						return Promise.reject(new MoleculerClientError("You can add only one header at a time", 400, "Bad request"));
					return this.Promise.resolve()
						.then(() => {

							//Check sheetId and projectId should not be undefined or null
							if (sheetId != null == projectId == null || sheetId != undefined == projectId == undefined)
								return Promise.reject(new MoleculerClientError("ProjectId or SheetId missing!", 422, ""));
							//Validate whether all required fields is present or not
							for (let i = 0; i < entity.length; i++) {

								let keys = Object.keys(entity[i]);
								//check if isEnum is true then option should also be there
								if (keys.includes("headerType") && entity[i].headerType === "enum") {
									if (keys.includes("options") === false)
										return Promise.reject(new MoleculerClientError("Options are missing", 400, "Bad request"));
								}
								for (let j = 0; j < requiredField.length; j++) {
									// Get all keys from object
									let keys = Object.keys(entity[i]);
									if (keys.indexOf(requiredField[j]) < 0)
										return Promise.reject(new MoleculerClientError("required keys missing", 400, "Bad request"));
								}

								let verifyVariableTypeValue = this.checkType(entity[i]);
								console.log("verifyVariableTypeValue---------", verifyVariableTypeValue);

								if (verifyVariableTypeValue !== "true")
									return Promise.reject(new ValidationError(verifyVariableTypeValue, 404, "Bad request"));
							}
							return sheetSchema.find({ projectId: projectId, isDeleted: false })
								.then(sheetData => {
									if (sheetData === undefined || sheetData == null)
										return Promise.reject(new MoleculerClientError("No data Found", 404, "no data found"));

									for (let i = 0; i < sheetData.length; i++) {
										if (sheetData[i]._id == sheetId) {
											uniqueSheetData = sheetData[i];
										}
									}
									if (uniqueSheetData === undefined || uniqueSheetData == null)
										return Promise.reject(new MoleculerClientError("No data found for the requested Sheet ID", 404, "no data found"));
									return fieldsSchema.find({ sheetId: sheetId, isDeleted: false })
										.then(fieldData => {
											for (let i = 0; i < fieldData.length; i++) {
												if (fieldData[i].name === entity[0].name)
													return Promise.reject(new MoleculerClientError("field name already present", 400, "Bad request"));
											}

											if (entity[0].headerType === "enum")
												entity[0].isEnum = true;
											for (let i = 0; i < entity.length; i++) {
												if (entity[i].headerType !== ("count" || "number")) {
													entity[i].type = "string";
												} else {
													entity[i].type = "number";
												}
											}
											entity[0].sheetId = sheetId;
											let data = new fieldsSchema(entity[0]);
											return data.save()
												.then(doc => {
													if (doc === (undefined || null)) {
														return Promise.reject(new MoleculerClientError("Something bad happened", 500, "Internal server error"));
													} else {
														return Promise.resolve({ message: "Sheet Fields added successfully!", code: 200, type: "success", data: "" });
													}
												});
										});
								});
						});
				} catch (error) {
					return Promise.reject(new MoleculerClientError(error, 500));

				}
			}
		},
		updateSheetField: {
			auth: "required",
			handler(ctx) {
				try {
					let entity = ctx.params.name;
					let sheetId = ctx.params.sheetId;
					let projectId = ctx.params.projectId;
					let fieldId = ctx.params.fieldId;

					return sheetSchema.findOne({ _id: sheetId, projectId: projectId, isDeleted: false })
						.then(sheetData => {
							if (sheetData === undefined || sheetData == null)
								return Promise.reject(new MoleculerClientError("No data found related to sheetId provided !", 404));

							return fieldsSchema.find({ sheetId: sheetId, isDeleted: false })
								.then((data) => {
									// console.log("data after finding fields", data);

									if (data === null || data.length < 1)
										return Promise.reject(new MoleculerClientError("data not found related to the sheetId", 404, ""));

									let collectionName = sheetData.sheetUniqueName;
									let model = this.schemaGenerator(data);
									let schemaModel = this.GetModelObject(collectionName, model);
									// console.log("schemaModel: ", schemaModel);

									return fieldsSchema.findOne({ _id: fieldId, isDeleted: false })
										.then(record => {
											console.log("records----", record);

											if (record === undefined || record === null)
												return Promise.reject(new MoleculerClientError("data not found related to the record", 404, ""));
											// if (record != null && record != []){
											if (record.name === entity)
												return Promise.reject(new MoleculerClientError("Field name already exists", 400, "Bad reequest"));

											let updateQuery = {};
											let data = {};
											data[record.name] = entity;
											console.log("data", data);

											updateQuery["$rename"] = data;
											console.log("update query", updateQuery);

											// schemaModel.update({}, { $rename: { city: 'location' }},{ multi : true},{new : true} )
											return schemaModel.updateMany({}, updateQuery)
												.then((data) => {
													console.log("data after renaming-----", data);
													// if (data.nModified === 0)
													// 	return Promise.reject(new MoleculerClientError(" field not updated", 500, ""));
												})
												.then(() => {
													return fieldsSchema.findByIdAndUpdate(fieldId, { name: entity }, { new: true })
														.then(fieldData => {
															if (fieldData === undefined) {
																return Promise.reject(new MoleculerClientError("No data found related to fieldId provided !", "404"));
															} else {
																mongoose.deleteModel(collectionName);
																return Promise.resolve({ message: "Sheet Field updated successfully!", code: 200, type: "success", data: "" });
															}

														});
												});
										});
								});
						});
				} catch (error) {
					return Promise.reject(new MoleculerClientError(error, 500));
				}
			}

		},

		deleteSheetField: {
			auth: "required",
			handler(ctx) {
				try {
					// let entity = ctx.params.name;
					let sheetId = ctx.params.sheetId;
					let projectId = ctx.params.projectId;
					let fieldId = ctx.params.fieldId;

					return sheetSchema.findOne({ _id: sheetId, projectId: projectId, isDeleted: false })
						.then(sheetData => {
							if (sheetData === undefined || sheetData == null)
								return Promise.reject(new MoleculerClientError("No data found related to sheetId provided !", "404"));

							return fieldsSchema.find({ sheetId: sheetId, isDeleted: false })
								.then((data) => {
									// console.log("data after finding fields", data);

									if (data === undefined || data === null)
										return Promise.reject(new MoleculerClientError("data not found related to the sheetId", 404, ""));

									let collectionName = sheetData.sheetUniqueName;
									let model = this.schemaGenerator(data);
									let schemaModel = this.GetModelObject(collectionName, model);
									// console.log("schemaModel: ", schemaModel);

									return fieldsSchema.findOne({ _id: fieldId, isDeleted: false })
										.then(record => {
											console.log("records 381----", record);

											if (record === undefined || record == null)
												return Promise.reject(new MoleculerClientError("data not found related to the record", 404, ""));

											let updateQuery = {};
											let data = {};
											data[record.name] = "";
											console.log("data", data);

											updateQuery["$unset"] = data;
											console.log("update query", updateQuery);

											// schemaModel.update({}, { $rename: { city: 'location' }},{ multi : true},{new : true} )
											return schemaModel.find({})
												.then(records => {


													return schemaModel.update({}, updateQuery, { multi: true })
														.then((data) => {
															console.log("data after deleting-----", data);
															// if (data.nModified === 0)
															// 	return Promise.reject(new MoleculerClientError(" field not deleted", 500, ""));
														})
														.then(() => {
															return fieldsSchema.findByIdAndUpdate(fieldId, { isDeleted: true }, { new: true })
																.then(fieldData => {
																	if (fieldData === undefined) {
																		return Promise.reject(new MoleculerClientError("No data found related to fieldId provided !", "404"));
																	} else {
																		mongoose.deleteModel(collectionName);
																		return Promise.resolve({ message: "Sheet Field deleted successfully!", code: 200, type: "success", data: "" });
																	}
																})
														});
												});
										});
								});
						});
				} catch (error) {
					return Promise.reject(new MoleculerClientError(error, 500));
				}
			}
		},

		getSheetRecords: {
			auth: "required",
			async handler(ctx) {
				try {
					let sheetId = ctx.params.sheetId;
					let projectId = ctx.params.projectId;
					console.log("projectId: ", projectId);
					console.log("sheetId: ", sheetId);
					let finalResult;
					//   this.Promise.resolve()
					// 	.then(() => {
					let schemaGenerator = this.schemaGenerator;
					let GetModelObject = this.GetModelObject;
					let response = {};
					let projectData = await ctx.call("project.get", { id: projectId })
					console.log("projectData--", projectData);
					if (projectData === undefined || projectData === null)
						return Promise.reject(new MoleculerClientError("No data found , check projectId", 404, ""));

					response["projectName"] = projectData.projectName;

					let sheetData = await sheetSchema.findOne({ projectId: projectId, _id: sheetId, isDeleted: false })

					if (sheetData === undefined || sheetData == null)
						return Promise.reject(new MoleculerClientError("No data found , check projectId or SheetId", 404, ""));

					response["sheetInfo"] = sheetData;
					let fieldData = await fieldsSchema.find({ sheetId: sheetId, isDeleted: false })
					// console.log("fieldData 447--------", fieldData);

					// if (fieldData === undefined || fieldData == null || fieldData.length < 1)
					// 	return Promise.reject(new MoleculerClientError("No data found , check sheetId", 404, ""));

					response["fields"] = fieldData;
					let model = schemaGenerator(fieldData);

					console.log("model generator:", model);
					let schemaModel = GetModelObject(sheetData.sheetUniqueName, model);
					let records = await schemaModel.find({})
					//let records = []
					// if (records.length < 1)
					// 	return Promise.reject(new MoleculerClientError("No records found ! ", 404, ""));
					console.log("records--", records);
					response["records"] = records;
					return Promise.resolve(response);

				} catch (error) {
					return Promise.reject(new MoleculerClientError(error, 500));
				}
			}
		},

		getAllSheets: {
			auth: "required",
			async handler(ctx) {
				try {
					let projectId = ctx.params.projectId;
					console.log("projectId: ", projectId);
					let allData = [];
					let sheetData = await sheetSchema.find({ projectId: projectId, isDeleted: false });

					// if (sheetData.length < 1)
					// 	return Promise.reject(new MoleculerClientError("No data found , check projectId ", 404, ""));
					for (let i = 0; i < sheetData.length; i++) {
						let newData = {}
						let fieldData = await fieldsSchema.find({ sheetId: sheetData[i]._id, isDeleted: false })
						newData["sheetInfo"] = sheetData[i]
						newData["fieldInfo"] = fieldData;
						allData.push(newData);
					}

					return allData;
				} catch (error) {
					return Promise.reject(new MoleculerClientError(error, 500));
				}

			}
		},
		deleteASheet: {
			auth: "required",
			handler(ctx) {
				try {
					let sheetId = ctx.params.sheetId;
					let projectId = ctx.params.projectId;
					console.log("projectId: ", projectId);
					console.log("sheetId: ", sheetId);
					return this.Promise.resolve()
						.then(() => {
							//   return this.adapter.removeById({projectId : projectId , _id : sheetId})
							return this.adapter.findOne({ projectId: projectId, _id: sheetId })
								.then(sheetData => {
									if (sheetData === undefined || sheetData === null)
										return Promise.reject(new MoleculerClientError("Can't be deleted as data not found related to the sheetId", 404, ""));
									return sheetSchema.findByIdAndUpdate(sheetId, { isDeleted: true }, { new: true })
										.then(sheetData => {
											if (sheetData.isDeleted === true) {
												return Promise.resolve({ message: "Sheet deleted successfully!", code: 200, type: "success", data: "" });
											} else {
												return Promise.reject(new MoleculerClientError("Deletion not done!", 500, ""));
											}
										});
								});
						});
				} catch (error) {
					return Promise.reject(new MoleculerClientError(error, 500));
				}
			}
		},
		addSheetRecords: {
			params: {
				records: {
					type: "array"
				}
			},
			auth: "required",

			handler(ctx) {
				try {
					let entity = ctx.params.records;
					let sheetId = ctx.params.sheetId;
					let projectId = ctx.params.projectId;
					console.log("entity to add record: 279---------", entity);

					return this.adapter.findOne({ projectId: projectId, _id: sheetId, isDeleted: false })
						.then(sheetData => {
							if (sheetData === undefined || sheetData == null)
								return Promise.reject(new MoleculerClientError("Can't be added as data not found related to the sheetId", 404, ""));

							return fieldsSchema.find({ sheetId: sheetId, isDeleted: false })
								.then((data) => {
									// console.log("data after finding fields", data);

									if (data === undefined || data === null || data.length < 1)
										return Promise.reject(new MoleculerClientError("Can't be added as data not found related to the sheetId", 404, ""));
									// else {
									// let fieldSchema = sheetData.fieldSchema;
									// if (fieldSchema.length > 0) {
									let model = this.schemaGenerator(data);
									console.log("model generator:", model);
									let schemaModel = this.GetModelObject(sheetData.sheetUniqueName, model);

									let validateRecords = this.validateRecords(data, entity);
									if (typeof validateRecords !== "object") {
										console.log("error data: ", validateRecords);
										return Promise.reject(new MoleculerClientError(validateRecords, 404, ""));
									} else {
										// console.log("validateRecords-----------", validateRecords);

										let data = new schemaModel(validateRecords);
										return data.save()
											.then(data => {
												if (data === (undefined || null)) {
													return Promise.reject(new MoleculerClientError("Records not added !", 500, ""));
												} else {
													return Promise.resolve({ message: "Sheet records added successfully!", code: 200, type: "success", data: "" });

												}
											});
									}
								});
						});
				} catch (error) {
					return Promise.reject(new MoleculerClientError(error, 500));
				}
			}
		},
		addAndUpdateMultipleSheetRecords: {
			params: {
				records: {
					type: "array"
				}
			},
			auth: "required",
			async handler(ctx) {
				let entity = ctx.params.records;
				// console.log("entity---", entity);
				let sheetId = ctx.params.sheetId;
				let projectId = ctx.params.projectId;
				// var updateData = entity.filter(function (entry) {
				// 	return (entry.rowId !== undefined || entry.rowId === null || entry.rowId === "")
				// });
				for (let k = 0; k < entity.length; k++) {
					entity[k].index = k;
				}
				// console.log("updated entity--", entity);


				var toBeAdded = entity.filter(function (entry) {
					return (entry.rowId === undefined || entry.rowId == null || entry.rowId === "");
				});
				var toBeUpdated = entity.filter(function (entry) {
					return ((entry.rowId != undefined && entry.rowId != null && entry.rowId != ""))
				});
				let responseArray = [];
				if (toBeUpdated.length === 0 && toBeAdded.length === 0)
					return Promise.reject(new MoleculerClientError("Data expected", 400, "Bad request"));
				// if (updateData.length != toBeUpdated.length)
				// 	return Promise.reject(new MoleculerClientError("RowId provided to update records is not of object type", 400, "Bad request"));

				//  console.log("data 2---", toBeUpdated);
				//  console.log("data 2---", toBeUpdated[0].info);

				for (let i = 0; i < toBeUpdated.length; i++) {
					if (!this.validateMongooseOBjectId(toBeUpdated[i].rowId))
						return Promise.reject(new MoleculerClientError("RowId is invalid", 400, "Bad Request"));

				}

				// console.log("data 3---", toBeAdded);

				let sheetData = await this.adapter.findOne({ projectId: projectId, _id: sheetId, isDeleted: false })
				if (sheetData === undefined || sheetData === null)
					return Promise.reject(new MoleculerClientError("Can't be added or updated as data not found related to the sheetId", 404, "No data found"));

				let fieldData = await fieldsSchema.find({ sheetId: sheetId, isDeleted: false });
				if (fieldData.length < 1)
					return Promise.reject(new MoleculerClientError("Header are not present in this sheet", 404, "No data found"));

				let model = this.schemaGenerator(fieldData);
				console.log("model generator:", model);

				let schemaModel = this.GetModelObject(sheetData.sheetUniqueName, model);
				mongoose.deleteModel(sheetData.sheetUniqueName);

				if (toBeAdded.length > 0) {
					console.log("to be added--", toBeAdded);

					for (let i = 0; i < toBeAdded.length; i++) {
						let validateRecords = this.validateRecords(fieldData, toBeAdded[i].info);
						if (typeof validateRecords !== "object") {
							// console.log("error data:680 ", validateRecords);
							// console.log("toBeAdded[i].info--", toBeAdded[i].info);
							//  let error = validateRecords + " Error Index : " + toBeAdded[i].rowNum; 
							let responseObject = {
								"rowNumber": toBeAdded[i].rowNum,
								"message": validateRecords
							}
							responseArray.push(responseObject);
							// return Promise.reject(new MoleculerClientError(validateRecords + " Error Index : " + toBeAdded[i].index, 404, ""));
						} else {
							console.log("validated records: ", validateRecords);
							// let error = toBeAdded[i].rowNum + " is added successfully"; 
							let responseObject = {
								"rowNumber": toBeAdded[i].rowNum,
								"message": "Added successfully"
							}
							responseArray.push(responseObject);
							let data = new schemaModel(validateRecords);
							console.log("data at 655: ", data);

							await data.save();
							//   return Promise.resolve({ message: "Sheet records added successfully!", code: 200, type: "success", data: "" });
						}

					}
				}
				//   console.log("toBeUpdated at 682---", toBeUpdated);
				if (toBeUpdated.length > 0) {
					// console.log("702--------------------", toBeUpdated[0].info.length);
					// console.log("703--------------------", toBeUpdated.length);

					for (let i = 0; i < toBeUpdated.length; i++) {

						// console.log("i am here 688-----------------------------------------------------------------------",toBeUpdated[i].rowId);

						let rowData = await schemaModel.findOne({ _id: toBeUpdated[i].rowId })
						// console.log("rowData at 686", rowData );

						if (rowData == undefined || rowData === null)
							return Promise.reject(new MoleculerClientError("No data found related to provided rowId", 404, ""));
						console.log("rowdata", rowData);
						console.log("721.1------------------------", i, " ", toBeUpdated[i]);
						let validateUpdateRecords = this.validateUpdateRecords(fieldData, toBeUpdated[i].info)
						if (typeof validateUpdateRecords !== "object") {
							console.log("error data: ", validateUpdateRecords);
							let responseObject = {
								"rowNumber": toBeUpdated[i].rowNum,
								"message": validateUpdateRecords
							}
							responseArray.push(responseObject);
							// return Promise.reject(new MoleculerClientError(validateUpdateRecords + " Error Index : " + toBeUpdated[i].index, 404, ""));
						} else {
							let responseObject = {
								"rowNumber": toBeUpdated[i].rowNum,
								"message": "Updated successfully"
							}
							responseArray.push(responseObject);
							// console.log("721.2------------------------", i, " ", toBeUpdated[i]);
							// console.log("721------------------------", i, " ", toBeUpdated[i].info.length);
							// console.log("722------------------------", i, " ", toBeUpdated[i].info);

							for (let j = 0; j < toBeUpdated[i].info.length; j++) {
								// console.log("toBeUpdated[i].info[j].name-----------------------717", toBeUpdated[i].info[j]);

								rowData[toBeUpdated[i].info[j].name] = toBeUpdated[i].info[j].value;
							}
							// console.log("row data at 691" , rowData);

							let updatedRowData = await schemaModel.findByIdAndUpdate(toBeUpdated[i].rowId, rowData, { new: true })
							if (updatedRowData === undefined || updatedRowData == null)
								return Promise.reject(new MoleculerClientError("Records not updated !", 500, "Internal server error"));
						}
					}

				}
				return Promise.resolve({ message: "Sheet records added and updated successfully! ", details: responseArray, code: 200, type: "success" });

			}
		},
		getSheetReport: {
			auth: "required",

			handler(ctx) {
				try {
					let sheetId = ctx.params.sheetId;
					let projectId = ctx.params.projectId;
					let enumFlag = true;
					let validateCollection = true;
					return this.Promise.resolve()
						.then(() => {
							return sheetSchema.findOne({ _id: sheetId, isDeleted: false })
								.then(sheetHeaderData => {
									if (sheetHeaderData === (undefined || null))
										return Promise.reject(new MoleculerClientError("Can't be added as data not found related to the sheetId", 404, ""));

									return fieldsSchema.find({ sheetId: sheetId, isDeleted: false })
										.then(data => {
											if (data.length < 1)
												return Promise.reject(new MoleculerClientError("Can't be added as data not found related to the sheetId", 404, ""));
											enumFlag = this.validateEnumHeaderType(data);
											// console.log("enumFlag :---------", enumFlag);

											if (enumFlag === false)
												return Promise.reject(new MoleculerClientError("Can't generate report ,  No enum headertype found", 404, ""));
											let collectionName = sheetHeaderData.sheetUniqueName;

											let model = this.schemaGenerator(data);
											console.log(model);
											let schemaModel = this.GetModelObject(collectionName, model);

											let operations = [];
											let attributes = this.getEnumFiledAndCountFields(data);
											console.log("attributes :", attributes);
											if (attributes.enum.length > 0) {
												for (let i = 0; i < attributes.enum.length; i++) {
													let mainGroup = {};
													let match = { "$match": {} };
													// match["$match"] = attributes.enum[i];
													match["$match"][attributes.enum[i]] = { '$exists': true, '$ne': null };
													console.log("match------------", match);
													mainGroup["$match"] = match.$match;
													console.log("maingroup-----------", mainGroup);

													let group = { "$group": {} };
													group["$group"]._id = "$" + attributes.enum[i];

													//let groupFields={};
													if (attributes.count.length > 0) {
														for (let j = 0; j < attributes.count.length; j++) {
															let groupFields = {};
															groupFields["$sum"] = "$" + attributes.count[j];
															group["$group"][attributes.count[j]] = groupFields;
														}
													}
													else {
														console.log("i am in else-------------------------------", group);
														let groupFields = {};
														groupFields["$sum"] = 1;
														group["$group"]["count"] = groupFields;
														// group["count"]["$sum"] = 1;
														// console.log("group : ", group);
														// mainGroup["$group"] = group.$group;
														// console.log("maingroup-----------", mainGroup);



													}
													let headerName = attributes.enum[i];
													console.log("group : ", group);

													operations.push((function (match, group, headerName) {
														return function (callback) {
															console.log(" single group : ", group);

															schemaModel.aggregate([match, group], (err, reportResult) => {
																if (err) {
																	callback(err);
																} else {
																	let res = { "name": headerName, "report": JSON.parse(JSON.stringify(reportResult)) };
																	callback(null, res);
																}
															});
														};
													})(match, group, headerName));
												}
												return async.series(operations);
											}
											else {
												return Promise.reject(new MoleculerClientError("No enum field available", 500, ""));
											}

										});
								});
						});
				} catch (error) {
					return Promise.reject(new MoleculerClientError(error, 500));
				}
			}
		},

		updateSheetRecords: {

			params: {
				update: {
					type: "array"
				}
			},
			auth: "required",
			handler(ctx) {
				try {
					let entity = ctx.params.update;
					let sheetId = ctx.params.sheetId;
					let projectId = ctx.params.projectId;
					let rowId = ctx.params.rowId;
					let validateCollection = true;
					// console.log("entity-------------", entity);

					let validateHeader;
					return this.Promise.resolve()
						.then(() => {
							return sheetSchema.findOne({ _id: sheetId, projectId: projectId, isDeleted: false })
								.then(sheetHeaderData => {
									if (sheetHeaderData == (null || undefined))
										return Promise.reject(new MoleculerClientError("Can't update ,  No Data found", 404, ""));

									return fieldsSchema.find({ sheetId: sheetId, isDeleted: false })
										.then(data => {
											if (data.length < 1)
												return Promise.reject(new MoleculerClientError("Can't be added as data not found related to the sheetId", 404, ""));

											validateHeader = this.validateHeader(data, entity);
											if (typeof validateHeader !== "boolean")
												return Promise.reject(new ValidationError(validateHeader, ""));

											let collectionName = sheetHeaderData.sheetUniqueName;
											validateCollection = this.findCollection(collectionName);
											if (validateCollection === false) {
												return Promise.reject(new MoleculerClientError("No Data found", 404, ""));
											}
											let model = this.schemaGenerator(data);
											let schemaModel = this.GetModelObject(collectionName, model);
											return schemaModel.findOne({ _id: rowId })
												.then(rowData => {
													if (rowData === (null || undefined))
														return Promise.reject(new MoleculerClientError("No data found related to provided rowId", 404, ""));
													for (let i = 0; i < entity.length; i++) {
														rowData[entity[i].name] = entity[i].value;
													}
													// console.log("rowData after update-----------", rowData);
													return schemaModel.findByIdAndUpdate(rowId, rowData, { new: true })
														.then(data => {
															if (data === (undefined || null)) {
																return Promise.reject(new MoleculerClientError("Records not updated !", 500, ""));
															} else {
																console.log("i am here", data);

																return { message: "Sheet records updated successfully!", code: 200, type: "success", data: "" };

															}
														});
												});


										});
								});
						});
				} catch (error) {
					return Promise.reject(new MoleculerClientError(error, 500));
				}
			}
		},
		deleteRow: {
			auth: "required",
			handler(ctx) {
				try {
					let sheetId = ctx.params.sheetId;
					let projectId = ctx.params.projectId;
					let rowId = ctx.params.rowId;
					console.log("projectId: ", projectId);
					console.log("sheetId: ", sheetId);
					let validateCollection = true;

					return this.adapter.findOne({ projectId: projectId, _id: sheetId, isDeleted: false })
						.then(sheetHeaderData => {
							if (sheetHeaderData === (undefined || null))
								return Promise.reject(new MoleculerClientError("Can't be deleted as data not found related to the sheetId", 404, ""));

							return fieldsSchema.find({ sheetId: sheetId })
								.then(data => {
									if (data.length < 1)
										return Promise.reject(new MoleculerClientError("Can't be added as data not found related to the sheetId", 404, ""));

									let collectionName = sheetHeaderData.sheetUniqueName;
									validateCollection = this.findCollection(collectionName);
									if (validateCollection === false)
										return Promise.reject(new MoleculerClientError("No Data found", 404, ""));
									let model = this.schemaGenerator(data);
									let schemaModel = this.GetModelObject(collectionName, model);
									return schemaModel.deleteOne({ _id: rowId })
										.then(rowData => {
											if (rowData.deletedCount === 0) {
												return Promise.reject(new MoleculerClientError("Can't be deleted as data not found related to the rowId", 404, ""));
											}
											else {
												return Promise.resolve({ success: true, message: "deleted sucess" });
											}


										});
								});
						});
				} catch (error) {
					return Promise.reject(new MoleculerClientError(error, 500));
				}
			}
		},

	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		getEnumFiledAndCountFields(fields) {
			let attributes = { "enum": [], "count": [] };
			for (let i = 0; i < fields.length; i++) {
				if (fields[i].headerType.toLowerCase() == "enum") {
					attributes.enum.push(fields[i].name);
				}
				if (fields[i].headerType.toLowerCase() == "count") {
					attributes.count.push(fields[i].name);
				}
			}
			return attributes;
		},

		schemaGenerator(fields) {
			console.log("i am in");

			let schema = {};
			for (let i = 0; i < fields.length; i++) {
				let name = fields[i].name;
				let type = fields[i].type;
				let required = fields[i].required;
				schema[name] = { type: type, required: required };
			}
			console.log("schemaa---------------", schema);

			return schema;
		},
		validateRecords(fields, records) {
			let record = {};
			//for(let i=0;i<records.length)
			console.log("records 984---", records);

			for (let i = 0; i < fields.length; i++) {


				let name = fields[i].name;
				let type = fields[i].type;
				let headerType = fields[i].headerType;
				let required = fields[i].required;
				let format = fields[i].format;
				let enumFlag = false;
				let formatFlag = false;
				console.log("this.arrayFilter(records, name) 1010--------", this.arrayFilter(records, name));
				console.log("required 1011----------------", required);


				if (required === false && this.arrayFilter(records, name).trim() !== "") {
					console.log("i am inside at 1012");

					if (headerType === "count" || headerType === "number") {
						let input = this.arrayFilter(records, name);
						// console.log("input--", input);

						input = Number(input);
						// console.log("input after--", input);

						if (isNaN(input)) {
							return name + " data type is not matching";
						};

					}

					if (required === true && (this.arrayFilter(records, name) === "")) {
						return name + " is a required field";
					}
					formatFlag = this.validateFormatType(format, this.arrayFilter(records, name));
					if (formatFlag === false)
						return name + " format does not match";
					if (headerType !== "count" && headerType !== "number") {

						if (typeof this.arrayFilter(records, name) != type) {
							// console.log("shoudl return ------------------------------------1041");
							return name + " data type is not matching";
						}
					}
					if (headerType === "enum") {
						let options = fields[i].options;
						for (let i = 0; i < options.length; i++) {
							if (this.arrayFilter(records, name) === options[i]) {
								enumFlag = true;
								break;
							}
							console.log("enum flag--", enumFlag);

						}
						if (enumFlag === false) {
							return name + " is out of enum range";
						}
					}
				}
				record[name] = this.arrayFilter(records, name);
				// console.log("value returned by this.arrayFilter: ---", i+" "+ this.arrayFilter(records, name));
				//schema[name]={type:type,required:required};
			}
			console.log("record at 1031--", record);

			return record;
		},
		validateUpdateRecords(fields, records) {
			console.log("721.13------------------------", records);
			let record = {};
			//for(let i=0;i<records.length)
			var filteredFields = [];
			// console.log("records insside-------------------1017", records);


			for (let i = 0; i < records.length; i++) {
				//   console.log("records--"+ i + " "+ records[i]);

				for (let j = 0; j < fields.length; j++) {
					// console.log("fields--"+ j + " "+ fields[i]);
					if (records[i].name === fields[j].name)
						filteredFields.push(fields[j]);
				}
			}
			console.log("filteredFields---------------1020", filteredFields);

			for (let i = 0; i < filteredFields.length; i++) {


				let name = filteredFields[i].name;
				let type = filteredFields[i].type;
				let headerType = filteredFields[i].headerType;
				let required = filteredFields[i].required;
				let format = filteredFields[i].format;
				let enumFlag = false;
				let formatFlag = false;
				if (required === false && this.arrayFilter(records, name).trim() !== "") {
					if (headerType === "count" || headerType === "number") {
						let input = this.arrayFilter(records, name);
						// console.log("input--", input);

						input = Number(input);
						// console.log("input after--", input);

						if (isNaN(input)) {
							return name + " data type is not matching";
						}

						// console.log("721.13------------------------ ,"+i +":", records);

					}

					if (required === true && (this.arrayFilter(records, name) === "")) {
						return name + " is a required field";
					}
					formatFlag = this.validateFormatType(format, this.arrayFilter(records, name));
					if (formatFlag === false)
						return name + " format does not match";

					if (headerType !== "count" && headerType !== "number") {
						if (typeof this.arrayFilter(records, name) != type) {
							return name + " data type is not matching";
						}
					}
					if (headerType === "enum") {
						// console.log("i am inside---------------------------------");

						let options = filteredFields[i].options;
						for (let i = 0; i < options.length; i++) {
							if (this.arrayFilter(records, name) === options[i]) {
								enumFlag = true;
								break;
							}
							// console.log("enum flag--", enumFlag);

						}
						if (enumFlag === false) {
							return name + " is out of enum range";
						}
					}
				}
				record[name] = this.arrayFilter(records, name);
				// console.log("value returned by this.arrayFilter: ---", i+" "+ this.arrayFilter(records, name));
				//schema[name]={type:type,required:required};
			}

			// console.log("721.3------------------------", records);
			return record;
		},
		validateFormatType(format, toValidateData) {
			if (format === "none")
				return true;
			// console.log("format---", format);
			// console.log("toValidateData---", toValidateData);
			let emailFlag = false;
			let mobileFlag = false;
			let dateFlag = false;
			if (format === "email") {
				emailFlag = this.validateEmail(toValidateData);
				if (emailFlag !== true)
					return false;
			} else
				if (format === "mobile") {
					mobileFlag = this.validateMobileNum(toValidateData);
					if (mobileFlag !== true)
						return false;
				}
				else if (format === "date") {
					dateFlag = this.validateDate(toValidateData);
					if (dateFlag !== true)
						return false;
				}
			return true;
		},

		validateEmail(email) {
			var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return regex.test(String(email).toLowerCase());
		},
		validateMobileNum(mobileNum) {
			var regex = /^[6-9]\d{9}$/
			return regex.test(String(mobileNum));
		},
		validateDate(date) {
			var formats = [
				moment.ISO_8601,
				"MM/DD/YYYY  :)  HH*mm*ss"
			];
			return moment(
				date, formats, true).isValid();

		},
		validateMongooseOBjectId(id) {
			var checkForHexRegExp = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i
			return checkForHexRegExp.test(String(id));
		},
		arrayFilter(array, value) {
			//return array;
			for (let i = 0; i < array.length; i++) {
				if (array[i].name == value) {
					return array[i].value;

				}
			}
			return "";
		},
		// validateEnumHeaderType(data) {
		// 	for (let i = 0; i < data.fieldSchema.length; i++) {
		// 		if (data.fieldSchema[i].headerType === "enum")
		// 			return true;
		// 	}
		// 	return false;
		// },
		validateEnumHeaderType(data) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].headerType === "enum")
					return true;
			}
			return false;
		},
		checkType(keys) {

			if (typeof keys.name !== "string" || keys.name === "")
				return "name should contain value of string type";

			if (typeof keys.allowSuggestion !== "boolean")
				return "allowSuggestion should be of boolean type only";

			if (typeof keys.required !== "boolean")
				return "required should be of boolean type only";

			if (keys.isEnum && typeof keys.isEnum !== "boolean")
				return "isEnum should be of boolean type only";

			if (!headerEnumMaster.includes(keys.headerType))
				return "headerType must contain anyone of values - text,number,key,geocode,count, enum";

			if (!formatEnumMaster.includes(keys.format))
				return "format must contain anyone of values - none,mobile,email,date";

			return "true";
		},

		GetModelObject(name, SchemaModel) {
			let model;
			console.log(mongoose.modelNames());
			let modelsNameList = mongoose.modelNames();
			// if (modelsNameList.indexOf(name) !== -1) {
			// 	mongoose.deleteModel(name);
			// }

			if (modelsNameList.indexOf(name) == -1) {
				const Schema = mongoose.Schema;
				model = mongoose.model(name, new Schema(SchemaModel), name);
				// console.log("model inside -------------", model);
			}
			else {
				console.log("in for exist");
				model = mongoose.model(name);
			}
			return model;
		},
		findCollection(name) {
			// console.log(mongoose.modelNames());			
			let collections;
			let collectionFound = false;
			mongoose.connection.db.listCollections().toArray(function (err, names) {
				if (err) {
					return false;
				}
				// console.log("names---------------------------------------------------------",names); 
				collections = names;
				for (let i = 0; i < names.length; i++) {
					if (names[i].name.trim() == name.trim()) {
						collectionFound = true;
						break;
					}
				}
				if (collectionFound === false)
					return false;
			});
		},
		validateHeader(fieldSchema, values) {
			var k = 0;
			var verifyEnumValueFlag = false;
			for (let i = 0; i < values.length; i++) {
				for (let j = 0; j < fieldSchema.length; j++) {
					if (values[i].name === fieldSchema[j].name) {
						k++;

						if (fieldSchema[j].headerType === "enum") {
							verifyEnumValueFlag = fieldSchema[j].options.includes(values[i].value);
							if (verifyEnumValueFlag === false)
								return values[i].name + " value is out of range ";
						}
					}

				}
			}
			console.log("value of k=============", k);

			if (k !== values.length)
				return "Headers not found";
			return true;
		}
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {

	}
};