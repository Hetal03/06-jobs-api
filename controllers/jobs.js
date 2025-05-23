const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

// Create a new job
const createJob = async (req, res, next) => {
  try {
    const { company, position } = req.body;

    if (!company || !position) {
      throw new BadRequestError('Company and position are required');
    }

    // Check for duplicate job for the same user
    const existingJob = await Job.findOne({
      company,
      position,
      createdBy: req.user.userId,
    });

    if (existingJob) {
      throw new BadRequestError('Job with the same company and position already exists');
    }

    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job });
  } catch (error) {
    next(error);
  }
};

// Get all jobs for this user
const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
  } catch (error) {
    next(error);
  }
};

// Get a single job by ID
const getJob = async (req, res, next) => {
  try {
    const { id: jobId } = req.params;
    const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId });

    if (!job) {
      throw new NotFoundError(`No job found with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({ job });
  } catch (error) {
    next(error);
  }
};

// Update a job
const updateJob = async (req, res, next) => {
  try {
    const { id: jobId } = req.params;
    const { company, position } = req.body;

    if (!company || !position) {
      throw new BadRequestError('Company and position fields cannot be empty');
    }

    const job = await Job.findOneAndUpdate(
      { _id: jobId, createdBy: req.user.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      throw new NotFoundError(`No job found with id ${jobId}`);
    }

    res.status(StatusCodes.OK).json({ job });
  } catch (error) {
    next(error);
  }
};

// Delete a job
const deleteJob = async (req, res, next) => {
  try {
    const { id: jobId } = req.params;
    const job = await Job.findOneAndRemove({ _id: jobId, createdBy: req.user.userId });

    if (!job) {
      throw new NotFoundError(`No job found with id ${jobId}`);
    }

    //res.status(StatusCodes.OK).send();
       res.status(StatusCodes.OK).json({ msg: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
};
