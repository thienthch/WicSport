const express = require('express');
const router = express.Router();
const { authMiddleWare, authUserMiddleWare } = require('../middleware/authMiddleware');
const OrderController = require('../controller/OrderController');

router.post('/create', authUserMiddleWare, OrderController.createOrder)



module.exports = router