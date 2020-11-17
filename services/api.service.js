"use strict";

const _ = require("lodash");
const ApiGateway = require("moleculer-web");
const { UnAuthorizedError } = ApiGateway.Errors;
require("dotenv").config();
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger/swagger.js");

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3001,

		routes: [{
			path: "/api",
			 authorization: true,
			whitelist: [
				// Access to any actions in all services under "/api" URL
				"**"
			],
			aliases: {
				// Project api
				"POST /projects":"project.addProject",
				"GET  /projects": "project.getProjects",
				"PUT  /projects/:projectId": "project.updateProject",
				"DELETE /projects/:projectId": "project.deleteProject",
				"GET /projects/:projectId": "project.getProjectById", 

				//sheet api
				"POST /projects/:projectId/sheets": "sheet.addSheet",
				"PUT /projects/:projectId/sheets/:sheetId": "sheet.updateSheet",
				"POST /projects/:projectId/sheets/:sheetId/field": "sheet.addSheetFields",
				// "POST /projects/:projectId/sheets": "sheet.addSheetUsingSchema",
				"GET /projects/:projectId/sheets/:sheetId": "sheet.getSheetRecords",
				"DELETE /projects/:projectId/sheets/:sheetId": "sheet.deleteASheet",
				"GET /projects/:projectId/sheets": "sheet.getAllSheets",
				"POST /projects/:projectId/sheets/:sheetId/row": "sheet.addSheetRecords",
				"POST /projects/:projectId/sheets/:sheetId/rows": "sheet.addAndUpdateMultipleSheetRecords",
				"GET /projects/:projectId/sheets/:sheetId/report": "sheet.getSheetReport",
				"PUT /projects/:projectId/sheets/:sheetId/row/:rowId": "sheet.updateSheetRecords", 
				"DELETE /projects/:projectId/sheets/:sheetId/row/:rowId": "sheet.deleteRow",
				"PUT /projects/:projectId/sheets/:sheetId/field/:fieldId": "sheet.updateSheetField",
				"DELETE /projects/:projectId/sheets/:sheetId/field/:fieldId": "sheet.deleteSheetField" 
 
			

			},
			cors: true,
		}],

		// Serve assets from "public" folder
		assets: {
			folder: "public"
		}
	},
	methods: {
		/**
		 * Authorize the request
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		authorize(ctx, route, req) {
			let token;
			if (req.headers.authorization) {
				token = req.headers.authorization;//.split(" ")[1];
			}
			return this.Promise.resolve(token)
				.then(token => {
					if (token) {
						// Verify JWT token
						return ctx.call("user.resolveToken", { token })
							.then(user => {
								if (user) {
									console.log("user: "+user);
									// Reduce user fields (it will be transferred to other nodes)
									// eslint-disable-next-line no-undef
									ctx.meta.user = _.pick(user, ["_id", "email"]);
									ctx.meta.token = token;
								}
								return user;
							})
							// eslint-disable-next-line no-unused-vars
							.catch(err => {
								// Ignored because we continue processing if user is not exist
								//console.log("gffhfhd");
								//return this.Promise.reject(new UnAuthorizedError());
								return null;
							});
					}
				})
				.then(user => {
					console.log("req.$endpoint.action : ",req.$endpoint.action.auth);
					if (req.$endpoint.action.auth == "required" && !user)
						return this.Promise.reject(new UnAuthorizedError());
				});
		},


	},
	/**
	 * Service created lifecycle event handler
	 */
	created() {
		const app = express();
		

		// app.use("/apiexpress",this.express());
		app.get("/testing", function (req, res) {
			res.send("Hello World");
		});
		app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
		this.app=app;
	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {
		this.expressServer=this.app.listen(process.env.SWAGGER_PORT || 4001,'0.0.0.0', err => {
			if (err)
				return this.broker.fatal(err);
			this.logger.info(`swagger server started on port ${process.env.SWAGGER_PORT || 4001}`);
		});
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {
		if (this.expressServer.listening) {
			this.expressServer.close(err => {
				if (err)
					return this.logger.error("WWW server close error!", err);

				this.logger.info("WWW server stopped!");
			});
		}
	}
};
