var express = require('express');
var router = express.Router();
var userModel = require('../schemas/user')
var ResHelper = require('../helper/ResponseHelper');
var userValidator = require('../validators/user');
var { validationResult } = require('express-validator');




router.post('/login', async function (req, res, next) {
  var result = await userModel.GetCre(req.body.username, req.body.password);
  console.log(result);
  if (result.error) {
    ResHelper.RenderRes(res, false, result.error);
  } else {
    ResHelper.RenderRes(res, true, result.getJWT());
  }
});
router.post('/register', userValidator.checkChain(), async function (req, res, next) {
  var result = validationResult(req);
  if (result.errors.length > 0) {
    ResHelper.RenderRes(res, false, result.errors);
    return;
  }
  try {
    var newUser = new userModel({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      role: ["user"]
    })
    await newUser.save();
    ResHelper.RenderRes(res, true, newUser.getJWT())
  } catch (error) {
    ResHelper.RenderRes(res, false, error)
  }
});


module.exports = router;