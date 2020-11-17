module.exports = {
	"swagger": "2.0",
	"info": {
		"title": "Fundoo Sheets project Management ",
		"description": "",
		"version": "1.0"
	},
	"produces": [
		"application/json"
	],
	"host": process.env.PROJECT_API_URL + "/api",
	"paths": {
		"/projects": {
			"post": {
				"x-swagger-router-controller": "project",
				"operationId": "addProject",
				"tags": [
					"project"
				],
				"description": "add project",
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "body",
						"in": "body",
						"type": "object",
						"reguired": true,
						"schema": {
							"$ref": "#/definitions/addProject"
						}
					}
				],
				"responses": {}
			},
			"get": {
				"x-swagger-router-controller": "user",
				"operationId": "getprojectlist",
				"tags": [
					"project"
				],
				"description": "get project list",
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					}
				],
				"responses": {}
			}
		},
		"/projects/{projectId}": {
			"put": {
				"x-swagger-router-controller": "project",
				"operationId": "updateProject",
				"tags": [
					"project"
				],
				"description": "update project",
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "body",
						"in": "body",
						"type": "object",
						"reguired": true,
						"schema": {
							"$ref": "#/definitions/updateProject"
						}
					}
				],
				"responses": {}
			},
			"get": {
				"x-swagger-router-controller": "project",
				"operationId": "getProjectById",
				"tags": [
					"project"
				],
				"description": "get project list",
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "id",
						"in": "path",
						"type": "string",
						"reguired": true

					},
				],
				"responses": {}
			},
			"delete": {
				"x-swagger-router-controller": "project",
				"operationId": "deleteProject",
				"tags": [
					"project"
				],
				"description": "delete a project",
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "id",
						"in": "path",
						"type": "string",
						"reguired": true

					},
				],
				"responses": {}
			}
		},
		"/projects/{projectId}/sheets": {
			"post": {
				"x-swagger-router-controller": "sheet",
				"operationId": "addSheet",
				"description": "add a sheet",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "body",
						"in": "body",
						"type": "object",
						"reguired": true,
						"schema": {
							"$ref": "#/definitions/addSheet"
						}

					}

				],
				"responses": {}
			},
			"get": {
				"x-swagger-router-controller": "sheet",
				"operationId": "getAllSheets",
				"description": "get all sheets",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
				],
				"responses": {}
			}
		},
		"/projects/{projectId}/sheets/{sheetId}": {
			"get": {
				"x-swagger-router-controller": "sheet",
				"operationId": "getSheetRecords",
				"description": "get sheet details",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "sheetId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
				],
				"responses": {}
			},
			"delete": {
				"x-swagger-router-controller": "sheet",
				"operationId": "delete",
				"description": "delete a sheet",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "sheetId",
						"in": "path",
						"type": "string",
						"reguired": true

					}

				],
				"responses": {}
			},
			"put": {
				"x-swagger-router-controller": "sheet",
				"operationId": "updateSheet",
				"description": "update a sheet'name and description",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "sheetId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "body",
						"in": "body",
						"type": "object",
						"reguired": true,
						"schema": {
							"$ref": "#/definitions/updateSheet"
						}

					}

				],
				"responses": {}
			},
		},
		"/projects/{projectId}/sheets/{sheetId}/field": {
			"post": {
				"x-swagger-router-controller": "sheet",
				"operationId": "addfields",
				"description": "add sheet fields",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "sheetId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "body",
						"in": "body",
						"type": "object",
						"reguired": true,
						"schema": {
							"$ref": "#/definitions/addSheetFields"
						}

					}

				],
				"responses": {}
			}
		},
		"/projects/{projectId}/sheets/{sheetId}/row": {
			"post": {
				"x-swagger-router-controller": "sheet",
				"operationId": "addSheetRecords",
				"description": "add sheet records",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "sheetId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "body",
						"in": "body",
						"type": "object",
						"reguired": true,
						"schema": {
							"$ref": "#/definitions/addSheetRecords"
						}

					}

				],
				"responses": {}
			}
		},
		"/projects/{projectId}/sheets/{sheetId}/rows": {
			"post": {
				"x-swagger-router-controller": "sheet",
				"operationId": "addAndUpdateMultipleSheetRecords",
				"description": "add and update multiple sheet records",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "sheetId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "body",
						"in": "body",
						"type": "object",
						"reguired": true,
						"schema": {
							"$ref": "#/definitions/addAndUpdateMultipleSheetRecords"
						}

					}

				],
				"responses": {}
			}
		},
		"/projects/{projectId}/sheets/{sheetId}/field/{fieldId}": {
			"put": {
				"x-swagger-router-controller": "sheet",
				"operationId": "updateSheetField",
				"description": "update sheet field",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "sheetId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "fieldId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "body",
						"in": "body",
						"type": "object",
						"reguired": true,
						"schema": {
							"$ref": "#/definitions/updateSheetField"
						}

					}

				],
				"responses": {}
			},
			"delete": {
				"x-swagger-router-controller": "sheet",
				"operationId": "deleteSheetField",
				"description": "delete sheet field",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "sheetId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "fieldId",
						"in": "path",
						"type": "string",
						"reguired": true

					}

				],
				"responses": {}
			}
		},



		"/projects/{projectId}/sheets/{sheetId}/row/{rowId}": {
			"put": {
				"x-swagger-router-controller": "sheet",
				"operationId": "updateSheetRecords",
				"description": "update sheet records",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "sheetId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "rowId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "body",
						"in": "body",
						"type": "object",
						"reguired": true,
						"schema": {
							"$ref": "#/definitions/updateSheetRecords"
						}

					}

				],
				"responses": {}
			},
			"delete": {
				"x-swagger-router-controller": "sheet",
				"operationId": "deleteASheet",
				"description": "delete a sheet",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "sheetId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "rowId",
						"in": "path",
						"type": "string",
						"reguired": true

					}

				],
				"responses": {}
			}
		},
		"/projects/{projectId}/sheets/{sheetId}/report": {
			"get": {
				"x-swagger-router-controller": "sheet",
				"operationId": "getSheetReport",
				"description": "get sheet report",
				"tags": [
					"sheet"
				],
				"parameters": [
					{
						"name": "authorization",
						"in": "header",
						"type": "string",
						"reguired": true
					},
					{
						"name": "projectId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
					{
						"name": "sheetId",
						"in": "path",
						"type": "string",
						"reguired": true

					},
				],
				"responses": {}
			}
		}

	},
	"definitions": {
		"addProject": {
			"type": "object",
			"properties": {
				"projectName": {
					"type": "String"
				},
				"description": {
					"type": "String"
				}

			},
			"example": {
				"projectName": "myjavaproject",
				"description": "my new project"
			}
		},
		"updateProject": {
			"type": "object",
			"properties": {
				"projectName": {
					"type": "String"
				},
				"description": {
					"type": "String"
				}

			},
			"example": {
				"projectName": "myjavaproject",
				"description": "my new project"
			}
		},
		"addSheet": {
			"type": "object",
			"properties": {
				"sheet": {
					"type": "object",
					"properties": {
						"sheetName": {
							"type": "String"
						},
						"description": {
							"type": "String"
						}
					}
				}
			},
			"example": {
				"sheet": {
					"sheetName": "apply",
					"description": "apply list"
				}
			}
		},
		"updateSheet": {
			"type": "object",
			"properties": {
				"field": {
					"type": "object",
					"properties": {
						"sheetName": {
							"type": "String"
						},
						"description": {
							"type": "String"
						}
					}
				}
			},
			"example": {
				"field": {
					"sheetName": "apply",
					"description": "apply list"
				}
			}
		},
		"addSheetFields": {
			"type": "object",
			"properties": {
				"field": {
					"type": "object",
					"properties": {
						"name": {
							"type": "String"
						},
						"headerType": {
							"type": "String"
						},
						"allowSuggestion": {
							"type": "boolean"
						},
						"format": {
							"type": "String"
						},
						"required": {
							"type": "boolean"
						},
						"options": {
							"type": "array"
						}
					}
				}
			},
			"example": {
				"field": [
					{
						"name": "tech stack",
						"headerType": "enum",
						"allowSuggestion": true,
						"format": "none",
						"required": true,
						"options": ["java", "mean", "mern"]
					}

				]
			}
		},
		"addSheetRecords": {
			"type": "object",
			"properties": {
				"records": {
					"type": "object",
					"properties": {
						"name": {
							"type": "String"
						},
						"value": {
							"type": "String"
						}
					}
				}
			},
			"example":
			{
				"records":
					[{
						"name": "company name",
						"value": "bridgelabz"
					},
					{
						"name": "location",
						"value": "mumbai"
					}, {
						"name": "tech stack",
						"value": "mean"
					}, {
						"name": "number_of_engineers",
						"value": 19
					}]


			}
		},
		"addAndUpdateMultipleSheetRecords": {
			"type": "object",
			"properties": {
				"records": {
					"type": "object",
					"properties": {
						"name": {
							"type": "String"
						},
						"value": {
							"type": "String"
						}
					}
				}
			},
			"example":
			{
				"records": [
					{
						"rowId": "",
						"info": [
							{
								"name": "company name",
								"value": "bridgelabz"
							},
							{
								"name": "location",
								"value": "mumbai"
							},
							{
								"name": "tech stack",
								"value": "mean"
							},
							{
								"name": "number of engineers",
								"value": 19
							}
						]
					},
					{
						"rowId": "5d64f32df60a6b330031a493",
						"info": [
							{
								"name": "company name",
								"value": "honeywell"
							},
							{
								"name": "location",
								"value": "bangalore"
							}]
					}
				]
			}
		},

		"updateSheetRecords": {
			"type": "object",
			"properties": {
				"records": {
					"type": "object",
					"properties": {
						"name": {
							"type": "String"
						},
						"value": {
							"type": "String"
						}
					}
				}
			},
			"example":
			{
				"update": [{
					"name": "company name",
					"value": "valuefy"
				},
				{
					"name": "location",
					"value": "bangalore"
				}]
			}
		},
		"updateSheetField": {
			"type": "object",
			"properties": {
				"name": {
					"type": "String"
				}

			},
			"example": {
				"name": "myNewHeaderName",
			}
		},
	}
};





