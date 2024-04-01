const express = require('express');
const router = express.Router();

const { createAddress, deleteAddress, getAllAddresses, updateAddress } = require('../controllers/addressController');

router.route('/address/create').post(createAddress);
router.route('/address/delete/:id').delete(deleteAddress);
router.route('/address/getAll').get(getAllAddresses);
router.route('/address/update/:id').put(updateAddress);

module.exports = router;