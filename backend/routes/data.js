const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middlewares/auth')

const { getData,
    postData,
    deleteData,
    updateData,
    resetData } = require('../controllers/dataController');

router.route('/data/:id').get(getData);
router.route('/post').post(postData)
router.route('/delete/:id').delete(deleteData);
router.route('/update/:id').put(updateData);
router.route('/reset/:id').get(isAuthenticatedUser, resetData)

module.exports = router;