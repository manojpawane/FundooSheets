"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const Project = require('../models/project.model');
const { MoleculerClientError } = require("moleculer").Errors;
const sheetSchema = require("../models/sheet.model");

require("dotenv").config();

module.exports = {
	name: "project",
	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.MONGODB_URL),
	model: Project,

	/**
	 * Service settings
	 */
	settings: {

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
		 * Add the new Project with respect to user
		 * @param {*} ctx 
		 */
		addProject: {
			/**
			 * Checks if the user is authorized to access respective API
			 */
		    auth:"required",
		    async handler(ctx){
			
				try {
					if(ctx.params.projectName === null || ctx.params.projectName === undefined || ctx.params.projectName === '')
					{
						return this.Promise.reject(new MoleculerClientError("Project name missing", 422));
					}
				/**
				 * Checks if user exists who want to add projects
				 */	
				let userExists = await ctx.call("user.get", { id: ctx.meta.user._id } );
				if(userExists != undefined){
				/**
				  * find if project name already exists with respective to user
				  */
				 let projectNameExists = await Project.findOne({
					projectName: new RegExp('\\b' + ctx.params.projectName + '\\b', 'i'),
					userId:ctx.meta.user._id,
					isDelete : false
				})
				
				/**
				 * If project name already exists throw exception with status code
				 */
				if(projectNameExists){
					return this.Promise.reject(new MoleculerClientError('The Project name already exists', 422));
				}
				/**
				 * creates a new Project
				 */
				else{
					let project = new Project({
						projectName : ctx.params.projectName,
						description : ctx.params.description,
						type: ctx.params.type,
						userId:ctx.meta.user._id,
						createdBy:ctx.meta.user._id
					})
					return await Project.create(project);  
				   } 
				}
				else{
					return this.Promise.reject( new MoleculerClientError("Invalid user", 404));

				}
				 }
				catch (error) {
					return this.Promise.reject( new MoleculerClientError(error.message, 500));
				}
		}
		  },

		/**
		 * Gets the list of Projects created by respective user
		 */
		getProjects: {
		  /**
		   * Checks if the user is authorized to access respective API
		   */
			auth: "required",
			async handler(ctx) {
				try {
					/**
					 * checks if users exists from USER SERVICE via NATS transporter
					 */
					let userExists = await ctx.call("user.get", { id: ctx.meta.user._id });
					
					/**
					 * If user exists than its going to get the all projects with respect to user
					 */
					// console.log("sheetsExists", sheetsExists);
					// return data;

					
                    
					if (userExists) {
						var projects = await Project.find({
							userId: ctx.meta.user._id,
							isDelete: false
						})

						/**
						 * returns list of projects with respect to user
						 */
						if (projects) {
							projects=JSON.parse( JSON.stringify(projects));
							let data = await sheetSchema.aggregate([{$group:{_id:"$projectId",count:{"$sum":1}}}])
							 
                            for(let i=0 ; i < projects.length ; i++){
								 for(let j=0 ; j < data.length ; j++){
									 console.log("data[j]._id", data[j]._id);
									 console.log("projects[i]._id", projects[i]._id);
									 
									 if(String( projects[i]._id) === String(data[j]._id)){
										 console.log("inside");
										 										
										 projects[i]["sheetCount"] = data[j].count
									 }
								 }

							}
							console.log("projects: ", projects);
							
							return projects;
						}
						else {
							return this.Promise.reject(new MoleculerClientError("Projects not available", 404, ""));
						}
					}
					else {
						return this.Promise.reject(new MoleculerClientError("User does not exists", 404));
					}
				} catch (error) {
					return this.Promise.reject(new MoleculerClientError(error.message, 500));
				}
			}
		},

		/**
		 * Action for updating the Project details
		 */
		updateProject: {
	    /**
	     * Checks if the user is authorized to access respective API
		*/
			auth: "required",
			async  handler(ctx) {
				try {
					/**
					 * To check whether user exists
					 */
					let userExists = await ctx.call("user.get", { id: ctx.meta.user._id });

					if (userExists) {
						/**
						 * Gets the project details for respective id
						 */
						let projectDetails = await Project.findOne({
							userId: ctx.meta.user._id,
							_id: ctx.params.projectId,
							isDelete: false
						})

						if (projectDetails) {
							/**
							 * search for the duplicates project name except existing one
							 */
							let projectNameExists = await Project.findOne({
								projectName: new RegExp('\\b' + ctx.params.projectName + '\\b', 'i'),
								userId: ctx.meta.user._id,
								_id: { "$ne":ctx.params.projectId} ,
								isDelete: false,
							})
							if (projectNameExists !== null) {
								return this.Promise.reject(new MoleculerClientError("The Project name already exists", 422));
							}
							/**
							 * Update the Project details
							 */
							else {
								projectDetails.projectName = ctx.params.projectName,
									projectDetails.description = ctx.params.description,
									projectDetails.type = ctx.params.type,
									projectDetails.updatedBy = ctx.meta.user._id
								return await projectDetails.save();
							}
						}
						else {
							return this.Promise.reject(new MoleculerClientError("The Project does not exists", 404));
						}
					}
					else {
						return this.Promise.reject(new MoleculerClientError("Invalid user", 404));
					}
				} catch (error) {
					return this.Promise.reject(new MoleculerClientError(error.message, 500));
				}
			}
		},

	  /**
	   * Delete the project by Id
	   */
		deleteProject: {
			auth: "required",
			async handler(ctx) {
				try {
					/**
					 * Checks if projects exists 
					 */
					let existingProject = await Project.findOne({
						userId: ctx.meta.user._id,
						_id: ctx.params.projectId,
						isDelete: false
					})

					/**
					 * If projects exists delete the project with respective id
					 */
					if (existingProject) {
						existingProject.isDelete = true;
						existingProject.updatedBy = ctx.meta.user._id;
						await Project.findByIdAndUpdate(ctx.params.projectId, existingProject);
						return await Project.findById(ctx.params.projectId);
					}
					else {
						return this.Promise.reject(new MoleculerClientError("Project not available", 404));
					}
				} catch (error) {
					return this.Promise.reject(new MoleculerClientError(error, 500));
				}
			}
		},

	  /**
	   * Gets the project by its Id 
	   */
		getProjectById: {
			auth: "required",
			async handler(ctx) {
				try {
					let project = await Project.findOne({
						userId: ctx.meta.user._id,
						_id: ctx.params.projectId,
						isDelete: false
					})
					
					if (project) {
						return project;
					}
					else {
						return this.Promise.reject(new MoleculerClientError("Project not available", 404, ""));
					}
				} catch (error) {
					return this.Promise.reject(new MoleculerClientError(error.message, 500));
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