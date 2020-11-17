"use strict";

const { ServiceBroker } = require("moleculer");
const projectService = require('../../services/project.service');
const  testData = require('../../test/TestData.json')

projectService.transporter={
    type: "NATS",
    options: {
        url: process.env.NATS_HOST,
        user: "",
        pass: ""
    }
};

describe("test cases for project service", () => {
    let broker = new ServiceBroker({ logger: false,
    transporter: "nats://localhost:4222", });
    broker.createService(projectService);

    beforeAll(() => broker.start());
    afterAll(() => broker.stop());

/**
 *          UNIT TEST CASE FOR addProject action
 */

    /**
     * To test the action by sending project name as a null where it is required field
     */
    it('should throw error Project name missing at addProject', async () => {
      try {
        await broker.call('project.addProject', testData.nullProjectNameAddAction,
         { meta: testData.metaDetailsForValidUser })
      } catch (error) {
        expect(error.message).toEqual("Project name missing");
      }
    });

    /**
     *  To test whether it throws error on adding of existing project name for addProject action
     *  --Here important to be noted that database should have existing Project name which we are passing 
     *  --for testing.
     */
    it('should throw error as we are sending name which already exists at addProject',async ()=>{
          try {
            await broker.call('project.addProject',testData.existingProjectNameError, 
            { meta: testData.metaDetailsForValidUser })
          } catch (error) {
            expect(error.message).toEqual("The Project name already exists")
          }
    }); 

    /**
     * After checking user is Invalid it shoud throw error
     */
    it('should throw error Entity not found for addProject action',async ()=>{
      try {
        await broker.call('project.addProject',
          testData.validProjectDetailsForInvalidUserTesting
        , { meta: testData.metaDetailsForInvalidUser})
      } catch (error) {
        expect(error.message).toEqual("Entity not found")
      }
});

/**
 * throws error when tried to add project with special character.
 */
it('Test to throw error when adding project name with special character at addProject', async ()=>{
  try {
    await broker.call('project.addProject', testData.projectDetailsWithProjectNameWithSpecialCharacter,
     { meta: testData.metaDetailsForValidUser });
  } catch (error) {
    expect(error.code).toBe(500);
  }
})

/**
 * To check if record is been added on appropriate data
 * need to add new projectName everytime
 */
it('Test to add project with appropriate data at addProject',async ()=>{
  try {
  var result =  await broker.call('project.addProject', testData.projectDetailsWithAppropriateData
  , { meta: testData.metaDetailsForValidUser });
    expect(result._id).not.toBe(null);
    expect(result.projectName).toBe(testData.projectDetailsWithAppropriateData.projectName);
    expect(result.description).toBe(testData.projectDetailsWithAppropriateData.description);
    expect(result.type).toBe(testData.projectDetailsWithAppropriateData.type);
    expect(result.createdBy.toString()).toBe(testData.metaDetailsForValidUser.user._id);
  } catch (error) {
    throw error;
  }
});

/**
 *          UNIT TEST CASE FOR getProject ACTION
 */

/**
 * should throw error is user not found while getting records
 */
it('Test should throw error Entity not found as sending invalid user at getProjects',async ()=>{
  try {
  await broker.call('project.getProjects',null,
  { meta: testData.metaDetailsForInvalidUser })
  } catch (error) {
    expect(error.message).toEqual("Entity not found");
  }
});

/**
 * should not return any record if record respect to user is not present
 */
it('should not return any records if it is not present at getProjects', async()=>{
  try {
    await broker.call('project.getProjects',null,
    { meta: testData.metaValidUserDetailsWithNoProject })
  } catch (error) {
    expect(error.message).toBe('Projects not available');
  }
})

/**
 * Should return the record with respective to user which is not marked as delete
 */
it('should get the projects for respective user which is not marked as delete at getProjects', async()=>{
  try {
    var result = await broker.call('project.getProjects',null,
    { meta: testData.metaDetailsForValidUser})
    expect(result.length).not.toBe(0);
    result.forEach(element => {
      expect(element.isDelete).not.toBe(true);
    });
    
  } catch (error) {
    throw error;
  }
})

/**
 *          UNIT TEST CASE FOR updateProject ACTION
 */

/**
 * throw error if user does not exists for updateProject details
 */
it('should throw error Entity not found for updateProject action',async ()=>{
  try {
    await broker.call('project.updateProject',testData.validProjectDetailsForInvalidUserTesting, 
    { meta: testData.metaDetailsForInvalidUser})
  } catch (error) {
    expect(error.message).toEqual("Entity not found")
  }
});

/**
 * should throw and error if project does not exists.
 * --need to add invalid project id
 */
it('should throw error if project does not exists at updateProject',async ()=>{
  try {
  var result =  await broker.call('project.updateProject',testData.inValidProjectDetailsForUpdateAction,
   { meta: testData.metaDetailsForValidUser })
  } catch (error) {
    expect(error.message).toEqual("The Project does not exists")
  }
});

/**
 * should throw error when tried to update project name which already exists in database
 * -- Pass project name which already present in database and which is not same with respective project id
 */
it('should throw error if project Name already exists at updateProject',async ()=>{
  try {
    await broker.call('project.updateProject',testData.sameProjectNameButWithAllOtherValidData,
   { meta: testData.metaDetailsForValidUser})
  } catch (error) {
    expect(error.message).toEqual("The Project name already exists")
  }
});


/**
 * Should throw error with status code 500 when sending the name with special character
 */
it('should throw error on setting project name as a special character at updateProject',async ()=>{
  try {
   await broker.call('project.updateProject',testData.invalidProjectDetailsWithProjectNameAsASpecialCharacter, 
   { meta: testData.metaValidUserDetailsForUpdateProjectDetails})
  } catch (error) {
    expect(error.code).toEqual(500);
  }
});

/**
 * should update the project details for same project id where project name is same.
 */
it('should update same project name as it is at updateProject',async ()=>{
  try {
  var result =  await broker.call('project.updateProject',testData.updateTheSameNoteWithSameProjectName,
    {meta: testData.metaUserDetailsForUpdateProject})
    expect(result.projectName).toBe(testData.updateTheSameNoteWithSameProjectName.projectName);
    expect(result.description).toBe(testData.updateTheSameNoteWithSameProjectName.description);
    expect(result.type).toBe(testData.updateTheSameNoteWithSameProjectName.type);
    expect(result._id.toString()).toBe(testData.updateTheSameNoteWithSameProjectName.projectId);
    expect(result.userId.toString()).toBe(testData.metaUserDetailsForUpdateProject.user._id);
  } catch (error) {
    throw error;
  }
});

/**
 * should succesfully updated on appropriate data
 */
it('should update project details with appropriate data at update Project',async ()=>{
  try {
  var result =  await broker.call('project.updateProject', testData.appropriateDataForUpdateProject,
   { meta:testData.metaValidUserDetails})
    expect(result.projectName).toBe(testData.appropriateDataForUpdateProject.projectName);
    expect(result.description).toBe(testData.appropriateDataForUpdateProject.description);
    expect(result.type).toBe(testData.appropriateDataForUpdateProject.type);
    expect(result._id.toString()).toBe(testData.appropriateDataForUpdateProject.projectId);
    expect(result.userId.toString()).toBe(testData.metaValidUserDetails.user._id);
  } catch (error) {
    throw error;
  }
});

/**
 *            UNIT TEST CASE FOR deleteProject ACTION
 */

/**
 * Should throw message when passes invalid project details
 */
it('should throw error message for invalid project at deleteProject',async ()=>{
  try {
    await broker.call('project.deleteProject', testData.invalidProjectForDeleteAction
    , {meta:testData.invalidUserForDeleteProject})
  } catch (error) {
    expect(error.message).toBe('Project not available');
    expect(error.code).toBe(404); 
  }
})

/**
 * As project should not able to get as project is invalid
 */
it('should throw error message on invalid project as user is not valid at deleteProject', async()=>{
  try {
    await broker.call('project.deleteProject',testData.projectDetailsForDeleteActionForInvalidUser ,
    {meta:testData.metaInvalidUserForDelete})
  } catch (error) {
    expect(error.message).toBe('Project not available');
    expect(error.code).toBe(404);
  }
})

/**
 * return isDelete flag  to true
 */
it('Mark the isDelete flag to true when deleted at deleteProject',async()=>{
  try {
    var result = await broker.call('project.deleteProject',
    testData.validDetailsForDeleteProject
    , {meta:testData.metaValidUserDetails})
    expect(result.isDelete).toBe(true);
    expect(result._id.toString()).toBe(testData.validDetailsForDeleteProject.projectId);
    expect(result.userId.toString()).toEqual(testData.metaValidUserDetails.user._id);
  } catch (error) {
    throw error;
  }
})

/**     
 *              UNIT TEST CASE FOR getProjectById ACTION
 */


 /**
 * Should throw message when passes invalid project details
 */
it('should throw error message for invalid project at getProjectById',async ()=>{
  try {
    await broker.call('project.getProjectById',testData.invalidDetailsForGetProjectById, 
    {meta:testData.metaValidUserDetails})
  } catch (error) {
    expect(error.message).toBe('Project not available');
    expect(error.code).toBe(404); 
  }
})

/**
 * Gets projects on valid UserId and ProjectId
 */
it('Gets the record on valid details at getProjectById', async()=>{
  try {
   var result = await broker.call('project.getProjectById',testData.validProjectDetailsForGetById,
        {meta:testData.metaValidUserDetails});
    expect(result.projectName).not.toBe(null);
  } catch (error) {
    throw error;
  }
})

})

