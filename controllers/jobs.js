const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

// Create a new job
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

// Get all jobs for this user
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).json({ count: jobs.length, jobs });
};

// ✅ Add this missing function
const getJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId, createdBy: req.user.userId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

// Update a job
const updateJob = async (req, res) => {
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
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

// Delete a job
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: req.user.userId });
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send();
};

// ✅ Export everything
module.exports = {
  createJob,
  getAllJobs,
  getJob,        // ← This was missing
  updateJob,
  deleteJob,
};
