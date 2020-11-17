"use strict";

const { ServiceBroker } = require("moleculer");
const userService = require("../../services/user.service");
const  testData = require('../../test/TestData.json')

describe("Test 'user' service", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.createService(userService);

	beforeAll(() => broker.start());
    afterAll(() => broker.stop());
    

    /**
      *  UNIT TEST CASES TO TEST LOGIN ACTION
      */   
	describe("Test 'user.login' action", () => {
        /**
         * Sending null email details to throw error for invalid parameter
         */
        it("should return with error with blank email", () => {
			 broker.call("user.login",testData.loginWithNullEmail).then(res=>{
            }
            ,err=>{
                expect(err.message).toBe('Parameters validation error!')
                expect(err.code).toBe(422);
            })
        });

        /**
         * Sending invalid email details to throw error for invalid parameter
         */
        it("should return with error with invalid  email", async () => {
			await broker.call("user.login",testData.loginWithInvalidEmail).then(res=>{
            }
            ,err=>{
                expect(err.message).toBe('Parameters validation error!');
                expect(err.code).toBe(422);
            })
        });
        
        /**
         * Throws error when tried to send null password
         */
        it("should return with error with blank password", () => {
			return broker.call("user.login",testData.loginWithNullPassword).then(res=>{
            }
            ,err=>{
                expect(err.message).toBe('Parameters validation error!');
                expect(err.code).toBe(422);
            })
        });

        /**
         * Should throw error message on passing unregistered email and password
         */
        it("should return with error with wrong email and password ", () => {
			return broker.call("user.login",testData.loginWithWrongCredentials).then(res=>{
            }
            ,err=>{
                expect(err.message).toBe('Email or password is invalid!');
                expect(err.code).toBe(401);
            })
        });

        /**
         *  Test throw error on valid email details and invalid password
         */
        it("should return with error with valid email and wrong password ", () => {
			return broker.call("user.login",testData.loginWithWrongPassword).then(res=>{
            }
            ,err=>{
                expect(err.code).toBe(401);
                expect(err.message).toBe('Wrong password!');
            })
        });
       
        /**
         * throw error when tried to Login with suspended account
         */
        it("should return with error about account suspension ", () => {
			return broker.call("user.login",testData.loginWithSuspendedAccount).then(res=>{
            }
            ,err=>{
                expect(err.code).toBe(401);
                expect(err.message).toBe('Account is suspended');
            })
        });

        /**
         * User should able to login with valid credentials which will return token
         */
		it("should return with login", () => {
			return broker.call("user.login",testData.loginWithValidCredentials).then(res=>{
                expect(res.email).toBe(testData.loginWithValidCredentials.user.email);
                expect(res.token).not.toBe(null);
            })
		});

    });
    
/**
 *  UNIT TEST CASES FOR REGISTRATION ACTION FROM USER SERVICE
 */

    describe('Test user.registration action',()=>{

        /**
         * Should throw error on blank email id passed
         */
        it("should return error with blank email", () => {
            broker.call("user.register",testData.registerWithNullEmail).then(res=>{
           }
           ,err=>{
               expect(err.message).toBe('Parameters validation error!')
               expect(err.code).toBe(422);
           })
       });

       /**
         * Throws error when tried to send null password
         */
        it("should return with error with blank password", () => {
			return broker.call("user.register",testData.registerWithNullPassword).then(res=>{
            }
            ,err=>{
                expect(err.message).toBe('Parameters validation error!');
                expect(err.code).toBe(422);
            })
        });

        /**
         * Sending invalid email details to throw error for invalid parameter
         */
        it("should return with error with invalid  email", async () => {
			await broker.call("user.register",testData.registerWithInvalidEmail).then(res=>{
            }
            ,err=>{
                expect(err.message).toBe('Parameters validation error!');
                expect(err.code).toBe(422);
            })
        });

        /**
         * Existing email Id should not able to register again
         */
        it("should return error on registering with existing email Id",async ()=>{
            try {
                 await broker.call('user.register', testData.regsiterWithExistingEmailId);
            } catch (error) {
                expect(error.message).toBe('Email is exist!');
                expect(error.code).toBe(422);                
            }
            
        })

    })

    /**
     *  UNIT TEST CASES FOR TESTING FORGOT PASSWORD
     */
    describe('Testing forgot password', ()=>{

        /**
         * Throws error on try to forgot password for invalid user
         */
        it('Should throw error if user is not registered',async ()=>{
            try {
                await broker.call('user.forgotPassword',testData.forgotPasswordWithNotExistingEmailId);    
            } catch (error) {
                expect(error.message).toBe('The email address you entered is not register with us.');
                expect(error.code).toBe(404);
            }
            
        })

        /**
         * Successful email with token is been to sent to valid user whoes email is passed
         */
        it('should able to send email with token to reset password',async ()=>{
            try {
                var result = await broker.call('user.forgotPassword', testData.forgotPasswordWithValidDetails);
                expect(result.message).toBe('Email has been sent to registered Email Id');
            } catch (error) {
                throw error;
            }
        });

        /***
         *  UNIT TEST CASES FOR RESET PASSWORD ACTION
         */

        /**
         * Passing invalid details to throw error of invalid user
         */
        it('Should throw error when passes invalid user id', async ()=>{
            try {
                await broker.call('user.resetPassword',{
                    "password":testData.testingNewPassword
                },{meta:testData.metaDetailsForInvalidUser})
            } catch (error) {
                expect(error.message).toBe('Invalid user');
                expect(error.code).toBe(404);
            }
        })

        /**
         *  Should able to successfully update password with respect to user on passing of valid user details
         */
        it('should successfully update new password on valid details', async()=>{
            try {
                var response = await broker.call('user.resetPassword',testData.resetPasswordWithValidData
                , {meta:testData.metaDetailsForValidUser})
                expect(response.message).toBe('Password set successfully');
            } catch (error) {
                throw error;
            }
        })
    })
});

