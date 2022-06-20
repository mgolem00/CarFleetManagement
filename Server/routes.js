var express = require('express')
var router = express.Router()
const {verifyJwt, verifyAdmin, verifyManager} = require('./jwt');

//USER INTERACTION
const registrationController=require('./controllers/registrationController');
router.post('/registration', registrationController.register);

const loginController=require('./controllers/loginController');
router.post('/login', loginController.login);

const getLoggedRoleController=require('./controllers/getLoggedRoleController');
router.get('/getLoggedRole', getLoggedRoleController.getLoggedRole);

const getLoggedIDController=require('./controllers/getLoggedIDController');
router.get('/getLoggedID', getLoggedIDController.getLoggedID);

const getAllUsersController=require('./controllers/listUsersController');
router.get('/getAllUsers', verifyJwt, getAllUsersController.listUsers);

const deleteUserController=require('./controllers/deleteUserController');
router.delete('/deleteUser', verifyAdmin, deleteUserController.deleteUser);

const updateUserController=require('./controllers/updateUserController');
router.put('/updateUser', verifyAdmin, updateUserController.updateUser);

//VEHICLE INTERACTION
const createVehicleController=require('./controllers/createVehicleController');
router.post('/createVehicle', verifyManager, createVehicleController.createVehicle);

const getAllVehiclesController= require('./controllers/listVehiclesController');
router.get('/getAllVehicles', verifyManager, getAllVehiclesController.listVehicles);

const updateVehicleController=require('./controllers/updateVehicleController');
router.put('/updateVehicle', verifyManager, updateVehicleController.updateVehicle);

const deleteVehicleController=require('./controllers/deleteVehicleController');
router.delete('/deleteVehicle', verifyManager, deleteVehicleController.deleteVehicle);

const retireVehicleController=require('./controllers/retireVehicleController');
router.patch('/retireVehicle', verifyManager, retireVehicleController.retireVehicle);

//VEHICLE USER INTERACTION
const getAvailableVehiclesController=require('./controllers/listAvailableVehiclesController');
router.get('/getAvailableVehicles', verifyManager, getAvailableVehiclesController.listAvailableVehicles);

const giveUserVehicleController=require('./controllers/giveUserVehicleController');
router.post('/giveUserVehicle', verifyManager, giveUserVehicleController.giveUserVehicle);

const takeUserVehicleController=require('./controllers/takeUserVehicleController');
router.patch('/takeUserVehicle', verifyManager, takeUserVehicleController.takeUserVehicle);

//USER MILEAGE INTERACTION
const getUserMileageController=require('./controllers/listUserMileageController');
router.get('/getUserMileage', verifyJwt, getUserMileageController.listUserMileage);

const createUserMileageController=require('./controllers/createUserMileageController');
router.post('/createUserMileage', verifyJwt, createUserMileageController.createUserMileage);

//USER RECEIPT INTERACTION
const getUserReceiptController=require('./controllers/listUserReceiptController');
router.get('/getUserReceipt', verifyJwt, getUserReceiptController.listUserReceipt);

const createUserReceiptController=require('./controllers/createUserReceiptController');
router.post('/createUserReceipt', verifyJwt, createUserReceiptController.createUserReceipt);

//COMPANY MILEAGE INTERACTION
const getCompanyMileageController=require('./controllers/listCompanyMileageController');
router.get('/getCompanyMileage', verifyManager, getCompanyMileageController.listCompanyMileage);

//COMPANY RECEIPT INTERACTION
const getCompanyReceiptController=require('./controllers/listCompanyReceiptController');
router.get('/getCompanyReceipt', verifyManager, getCompanyReceiptController.listCompanyReceipt);

module.exports = router;