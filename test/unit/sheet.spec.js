"use strict";
require("dotenv").config();


const { ServiceBroker } = require("moleculer");
const sheetService = require("../../services/sheet.service");
const testData = require("../../test/sheetTestCases.json");

sheetService.transporter = {
	type: "NATS",
	options: {
		url: process.env.NATS_HOST,
		user: "",
		pass: ""
	}
};

describe("test cases for project service", () => {
	let broker = new ServiceBroker({
		logger: true,
		transporter: "nats://localhost:4222",
	});
	broker.createService(sheetService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	it("should return with 'sheetName cant be null' error", () => {
		return broker.call("sheet.addSheet",
			testData.addSheetWithNullSheetName)
			.then(res => {
			},
			err => {
				expect(err.code).toBe(422);
			});
	});
	it("should return with 'sheetName not valid' error", () => {
		return broker.call("sheet.addSheet",
			testData.addSheetWithEmptySheetName)
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.code).toBe(422);
			});
	});
	it("should return with 'sheetName too short' error", () => {
		return broker.call("sheet.addSheet",
			testData.addSheetWithShortSheetName)
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.code).toBe(422);
			});
	});

	it("should return with 'description too short' error", () => {
		return broker.call("sheet.addSheet",
			testData.addSheetWithShortDescription)
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.code).toBe(422);
			});
	});

	it("should add new sheet", () => {
		return broker.call("sheet.addSheet",
			testData.addNewSheet)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("Sheet Name already exist!");
			});
	});

	it("should return with 'description is missing' error", () => {
		return broker.call("sheet.updateSheet",
			testData.updateSheetWithDesMissing)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("description is missing");
			});
	});
	it("should return with 'SheetName is missing' error", () => {
		return broker.call("sheet.updateSheet",
			testData.updateSheetWithSheetNameMissing)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("SheetName is missing");
			});
	});
	it("should return with 'ProjectId or SheetId missing!", () => {
		return broker.call("sheet.updateSheet",
			testData.updateSheetWithSheetIdMissing)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("ProjectId or SheetId missing!");
			});
	});

	it("should return with 'Sheet Name already exist!", () => {
		return broker.call("sheet.updateSheet",
			testData.updateSheetWithSameSheetName)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("Sheet Name already exist!");
			});
	});

	it("should return with 'Sheet Name already exist!", () => {
		return broker.call("sheet.updateSheet",
			testData.updateSheetWithSameSheetNam)
			.then(res => {
				expect(res.code).toBe(200);
			},
			err => {
				expect(err.message).toBe("Sheet Name already exist!");
			});
	});
	it("should return with 'Options can only be provided for headerType 'enum'' error", () => {
		return broker.call("sheet.addSheetFields",
			testData.addFieldsWithOptionsWithoutEnum)
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.message).toBe("Options can only be provided for headerType 'enum'");
			});
	});

	it("should return with 'You can add only one header at a time' error", () => {
		return broker.call("sheet.addSheetFields",
			testData.adDFieldsWithMultipleEntries)
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.message).toBe("You can add only one header at a time");
			});
	});
	it("should return with 'Options are missing' error", () => {
		return broker.call("sheet.addSheetFields",
			testData.addFieldsWithOptionsMissing)
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.message).toBe("Options are missing");
			});
	});

	it("should return with 'required keys missing' error", () => {
		return broker.call("sheet.addSheetFields",
			testData.addFieldsWithRequiredFieldsMissing)
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.message).toBe("required keys missing");
			});
	});
	it("should return with 'name should contain value of string type", () => {
		return broker.call("sheet.addSheetFields",
			testData.addFieldNameOfTypeOtherThanString)
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.message).toBe("name should contain value of string type");
			});
	});
	it("should return with 'allowSuggestion should be of boolean type only' error", () => {
		return broker.call("sheet.addSheetFields",
			testData.addFieldAutoSuggestionOfTypeOtherThanBoolean)
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.message).toBe("allowSuggestion should be of boolean type only");
			});
	});
	it("should return with 'headerType must contain anyone of values - text,number,key,geocode,count, enum' error", () => {
		return broker.call("sheet.addSheetFields",
			testData.addHeaderTypeOutOfEnum)
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.message).toBe("headerType must contain anyone of values - text,number,key,geocode,count, enum");
			});
	});
	it("format must contain anyone of values - none,mobile,email,date' error", () => {
		return broker.call("sheet.addSheetFields",
			testData.addFormatOutOfEnum)
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.message).toBe("format must contain anyone of values - none,mobile,email,date");
			});
	});
	it("should return with 'No data found for the requested Sheet ID' error", () => {
		return broker.call("sheet.addSheetFields", {
			"field": [
				{
					"name": "location",
					"headerType": "text",
					"allowSuggestion": true,
					"format": "none",
					"required": true
				},
			],
			projectId: "5d5e7d802c2c3d374051bfb5",
			sheetId: "5d63c9a8059ad737c1244ba3"

		})
			.then(res => {
				console.log(res);
			},
			err => {
				expect(err.message).toBe("No data found for the requested Sheet ID");
			});
	});
	it("should return with Sheet Fields added successfully!", () => {
		return broker.call("sheet.addSheetFields",
			testData.addFieldSuccessFully)
			.then(res => {
				expect(res.message).toBe("Sheet Fields added successfully!");
			},
			err => {
				expect(err.message).toBe("field name already present");
			});
	});
	it("should return with 'No data found related to sheetId provided !' error", () => {
		return broker.call("sheet.updateSheetField",
			testData.updateFieldWithWrongSheetId)
			.then(res => {
				// expect(res.message).toBe("Sheet Fields added successfully!");
			},
			err => {
				expect(err.message).toBe("No data found related to sheetId provided !");
			});
	});

	it("should return with 'data not found related to the record' error", () => {
		return broker.call("sheet.updateSheetField",
			testData.updateFieldWrongRecord)
			.then(res => {
				// expect(res.message).toBe("Sheet Fields added successfully!");
			},
			err => {
				expect(err.message).toBe("data not found related to the record");
			});
	});

	it("should return with 'Field name already exists' error", () => {
		return broker.call("sheet.updateSheetField",
			testData.updateFieldWithSameFieldName)
			.then(res => {
				// expect(res.message).toBe("Sheet Fields added successfully!");
			},
			err => {
				expect(err.message).toBe("Field name already exists");
			});
	});

	it("should return with 'Sheet Field updated successfully!' error", () => {
		return broker.call("sheet.updateSheetField",
			testData.updateFieldSuccessfully)
			.then(res => {
				expect(res.message).toBe("Sheet Field updated successfully!");
			},
			err => {
				expect(err.message).toBe("Field name already exists");
			});
	});

	it("should return with 'No data found related to sheetId provided !' error", () => {
		return broker.call("sheet.deleteSheetField",
			testData.deleteFieldWithWrongSheetId)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("No data found related to sheetId provided !");
			});
	});

	it("should return with 'data not found related to the sheetId' error", () => {
		return broker.call("sheet.deleteSheetField",
			testData.deleteFieldWithWrongFieldId)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("No data found related to sheetId provided !");
			});
	});

	it("should return with 'data not found related to the record' error", () => {
		return broker.call("sheet.deleteSheetField",
			testData.deleteFieldWithWrongField)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("data not found related to the record");
			});
	});

	it("should return with 'Sheet Field deleted successfully!' error", () => {
		return broker.call("sheet.deleteSheetField",
			testData.deleteSheetField)
			.then(res => {
				expect(res.message).toBe("Sheet Field deleted successfully!");
			},
			err => {
				expect(err.message).toBe("data not found related to the record");
			});
	});
	it("should return with 'No data found , check projectId or SheetId' error", () => {
		return broker.call("sheet.getSheetRecords",
			testData.getSheetRecordsWithWrongProjectId)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("No data found , check projectId or SheetId");
			});
	});
	it("should return with 'No data found , check projectId or SheetId' error", () => {
		return broker.call("sheet.getSheetRecords",
			testData.getSheetRecordsWithWrongSheetId)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("No data found , check projectId or SheetId");
			});
	});
	it("should be able to get all records", () => {
		return broker.call("sheet.getSheetRecords",
			testData.getSheetRecordsSuccessfully)
			.then(res => {
				expect(res.code).toBe(200);
			},
			err => {
				expect(err.message).toBe("No data found , check projectId or SheetId");
			});
	});
	it("should be able to get all sheets", () => {
		return broker.call("sheet.getAllSheets",
			testData.getAllSheets)
			.then(res => {
				expect(typeof res).toBe("object");
			},
			err => {
			});
	});
	it("should return with 'Can't be added as data not found related to the sheetId' error", () => {
		return broker.call("sheet.addSheetRecords",
			testData.addSheetRecordsWithWrongProjectId)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("Can't be added as data not found related to the sheetId");

			});
	});
	it("should return with 'tech stack is a required field' error", () => {
		return broker.call("sheet.addSheetRecords",
			testData.addSheetRecordsWithRequiredFieldMissing)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("tech stack is a required field");

			});
	});
	it("should return with 'tech stack data type is not matching' error", () => {
		return broker.call("sheet.addSheetRecords",
			testData.addSheetRecordsWithWrongDataType)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("tech stack data type is not matching");

			});
	});
	it("should return with 'tech stack is out of enum range' error", () => {
		return broker.call("sheet.addSheetRecords",
			testData.addSheetRecordsWithOutOfEnumRange)
			.then(res => {
			},
			err => {
				expect(err.message).toBe("tech stack is out of enum range");
			});
	});
	it("should add records successfully", () => {
		return broker.call("sheet.addSheetRecords",
			testData.addSheetRecords)
			.then(res => {
				expect(res.code).toBe(200);
			},
			err => {
			});
	});




});

