const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authentication');

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobs');

// Protect these routes with authMiddleware
router.route('/')
  .get(authMiddleware, getAllJobs)
  .post(authMiddleware, createJob);

router.route('/:id')
  .get(authMiddleware, getJob)
  .patch(authMiddleware, updateJob)
  .delete(authMiddleware, deleteJob);

module.exports = router;



/*const express = require('express');
const router = express.Router();


const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require('../controllers/jobs');

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
*/