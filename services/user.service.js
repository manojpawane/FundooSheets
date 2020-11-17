"use strict";
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { MoleculerClientError } = require("moleculer").Errors;
const bcrypt = require("bcrypt");
const userModel=require("../models/user.model");
const eventEmitter = require("../Events/events");
require("dotenv").config();
module.exports = {
	name: "user",
	mixins: [DbService],
	adapter: new MongooseAdapter(process.env.MONGODB_URL),
	model:userModel,

	//transporter: "nats://nats.server:4222",

	/**
	 * Service settings
	 */
	settings: {
		JWT_SECRET: process.env.JWT_SECRET || "bridgelabz_sheet",

		/** Public fields */
		fields: ["_id", "email", "createdAt"],

		/** Validator schema for entity */
		entityValidator: {
			password: { type: "string", min: 6 },
			// eslint-disable-next-line no-useless-escape
			email: { type: "email", pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },

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
		 * Say a 'Hello'
		 *
		 * @returns
		 */
        hello() {
            //var userObj = { "email": "hello@test.com", "password": "123456" }
            //return this.adapter.insert(userObj)
            // console.log("env check ", process.env.DATA)
            console.log("all working ", mongoose.modelNames())
            return "Hello user Moleculer ";
        },

		/**
		 * Welcome a username
		 *
		 * @param {String} name - User name
		 */
        welcome: {
            auth: "required",
            params: {
                name: "string"
            },
            handler(ctx) {
                return `Welcome, ${ctx.params.name}`;
            }
        },

        register: {
            params: {
                user: {
                    type: "object", props: {
                        email: { type: "email" },
                        password: { type: "string", min: 1 }
                    }
                }
            },
            handler(ctx) {
                let entity = ctx.params.user;
                return this.validateEntity(entity)
                    .then(() => {
                        if (entity.email)
                            return this.adapter.findOne({ email: entity.email })
                                .then(found => {
									if (found)
                                        return Promise.reject(new MoleculerClientError("Email is exist!", 422, "", [{ field: "email", message: "is exist" }]));

                                });
                    })
                    .then(() => {
                        entity.password = bcrypt.hashSync(entity.password, 10);
                        entity.status = true;
                        return this.adapter.insert(entity)
                            .then(doc => this.transformDocuments(ctx, {}, doc));
                    })
            }
        },
        login: {
            params: {
                user: {
                    type: "object", props: {
                        email: { type: "email" },
                        password: { type: "string", min: 1 }
                    }
                }
            },
            handler(ctx) {
                const { email, password } = ctx.params.user;
                return this.Promise.resolve()
                    .then(() => this.adapter.findOne({ email }))
                    .then(user => {
                        //console.log("hey 1 :", user)
                        if (!user)
                            return this.Promise.reject(new MoleculerClientError("Email or password is invalid!", 401, "", [{ field: "email", message: "is not found" }]));
                        
                        return bcrypt.compare(password, user.password).then(res => {
                            if (!res)
                                return Promise.reject(new MoleculerClientError("Wrong password!", 401, "", [{ field: "email", message: "is not found" }]));

                            // Transform user entity (remove password and all protected fields)
                            if(user.status==true){
                                return this.transformDocuments(ctx, {}, user);
                            }
                            else{
                                return Promise.reject(new MoleculerClientError("Account is suspended", 401, ""));
                            }
                            
                        }).then(user => this.transformEntity(user, true, ctx.meta.token).user)
                    })

            }
		},
		
		/**
		 * Forget password sends a link to user mail id to reset the password
		 */
		forgotPassword : {

		async handler(ctx){
				try {
					/**
					 * checks if user exists or not
					 */
					var userExist = await userModel.findOne({
						email: ctx.params.email
					})
					/// checks if user exist if not then encrypt the password and add the user into database
					if (userExist) {
						/// creates a token so we can verify
						var token = await this.generateJWT(userExist);
						let subject = 'Password reset link';
						let text = 'Hello,\n\n' + 'Please reset your password by clicking the link: \nhttp:\/\/' + 'localhost:3000' + '\/updatePassword\/' + token + '\n';
						
						//// event is fired for sending a mail
						eventEmitter.emit('sendEmail', subject, userExist, text);
						return {sucess:true,message:"Email has been sent to registered Email Id"} ;
					}
					else {
						return this.Promise.reject( new MoleculerClientError("The email address you entered is not register with us.", 404));
					}
				} catch (error) {
					throw this.Promise.reject(new MoleculerClientError(error, 500));
				}
			}
		},
		
		/**
		 * Reset password update the new password with respect to user
		 */
		resetPassword : {
			auth:"required",
			async handler(ctx){
				/**
				 * Checks if user exists
				 */
				let userExists = await userModel.findOne({
					_id: ctx.meta.user._id
				})
				
				/**
				 * if user exists new password is updated
				 */
				if(userExists){
					userExists.password = bcrypt.hashSync(ctx.params.password, 10);
					await userExists.save();
					return {sucess:true,message:"Password set successfully"} ;
				}
				else{
					return this.Promise.reject(new MoleculerClientError("Invalid user", 404));
				}
			}
		},

        /**
		 * Get user by JWT token (for API GW authentication)
		 * 
		 * @actions
		 * @param {String} token - JWT token
		 * 
		 * @returns {Object} Resolved user
		 */
		resolveToken: {
			// cache: {
			// 	keys: ["token"],
			// 	ttl: 60 * 60 // 1 hour
			// },			
			params: {
				token: "string"
			},
			handler(ctx) {
				console.log("resolver : ", ctx.params.token);
				return new this.Promise((resolve, reject) => {
					jwt.verify(ctx.params.token, this.settings.JWT_SECRET, (err, decoded) => {
						if (err)
							return reject(err);

						resolve(decoded);
					});

				})
					.then(decoded => {
						if (decoded.id)
							return this.getById(decoded.id);
					});
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
		generateJWT(user) {
			const today = new Date();
			const exp = new Date(today);
			exp.setDate(today.getDate() + 60);

			return jwt.sign({
				id: user._id,
				email: user.email,
				exp: Math.floor(exp.getTime() / 1000)
			}, this.settings.JWT_SECRET);
		},
		transformEntity(user, withToken, token) {
			if (user) {
				if (withToken)
					user.token = token || this.generateJWT(user);
			}

			return { user };
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