const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Candidate = require('../models/candidate');
const { jwtAuthMiddleware, generateToken } = require('../jwt');

/* ================= Admin Check ================= */
const checkAdminRole= async(userId) =>{
  try {
    const user = await User.findById(userId); 
    return user.role === 'admin';
  } catch (error) {
    console.error('Error checking admin role:', error);
    return false;
  }
}

/* ================= CREATE CANDIDATE ================= */
router.post('/',jwtAuthMiddleware, async (req, res) => {
  try {
    if (!await checkAdminRole(req.user.id)) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const data = req.body;

    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    res.status(201).json({ message: 'Candidate created successfully', candidate: response });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ================= UPDATE CANDIDATE ================= */
router.put('/:candidateID',jwtAuthMiddleware, async (req, res) => {
  try {
    if(!await checkAdminRole(req.user.id)) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }
    const candidateID = req.params.candidateID;
    const updateCandidateData = req.body;

    const updatedCandidate = await Candidate.findByIdAndUpdate(candidateID, updateCandidateData, { new: true }
    );
    if (!updatedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate updated successfully', candidate: updatedCandidate });

  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/* ================= DELETE CANDIDATE ================= */
router.delete('/:candidateID',jwtAuthMiddleware, async (req, res) => {
  try {
    if (!await checkAdminRole(req.user.id)) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const candidateID = req.params.candidateID;
    const deletedCandidate = await Candidate.findByIdAndDelete(candidateID);
    if (!deletedCandidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }
    res.status(200).json({ message: 'Candidate deleted successfully', candidate: deletedCandidate });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//lets start voting for a candidate
router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
  try {
    const candidateID = req.params.candidateID;
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    const user = await User.findById(req.user.id);
    if (user.isVoted) {
      return res.status(400).json({ message: 'User has already voted' });
    }
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admins are not allowed to vote' });
    }

    candidate.votes.push(user._id);
    candidate.voteCount++;
    candidate.voteCount = candidate.votes.length;
    await candidate.save();
    user.isVoted = true;
    await user.save();
    res.status(200).json({ message: 'Vote cast successfully', candidate });
  } catch (error) {
    console.error('Error voting for candidate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

// vote counting for a candidate
router.get('/vote/count', async (req, res) => {
  try {

    const candidates = (await Candidate.find()).sort({ voteCount: 'desc' });
    const record = candidates.map(candidate => ({
      id: candidate._id,
      name: candidate.name,
      voteCount: candidate.voteCount
    }));
    res.status(200).json({ message: 'Vote count retrieved successfully', candidates: record });
  } catch (error) {
    console.error('Error retrieving vote count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/candidates', async (req, res) => {
  //list of candidates
  try {
    const candidates = await Candidate.find();
    res.status(200).json({ message: 'Candidates retrieved successfully', candidates });
  } catch (error) {
    console.error('Error retrieving candidates:', error);
    res.status(500).json({ error: 'Internal server error' });
  } 
});

module.exports = router;
