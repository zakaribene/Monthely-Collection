const Member = require('../models/Member');
const Payment = require('../models/Payment');
const auditLog = require('../utils/auditLogger');

// @desc    Get all members
// @route   GET /api/members
// @access  Private
const getMembers = async (req, res, next) => {
  try {
    const members = await Member.find({});
    res.json(members);
  } catch (error) {
    next(error);
  }
};

// @desc    Get member details with payment history
// @route   GET /api/members/:id
// @access  Private
const getMemberDetails = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      res.status(404);
      return next(new Error('Member not found'));
    }

    const history = await Payment.find({ member: member._id }).populate('paymentMethod').sort({ year: -1, month: -1 });

    res.json({
      member,
      history
    });
  } catch (error) {
    next(error);
  }
};

const createMember = async (req, res, next) => {
  try {
    const photo = req.file ? `/uploads/members/${req.file.filename}` : '';
    const member = await Member.create({
      ...req.body,
      photo
    });

    if (member) {
      // Automatically create pending payment for current month
      const now = new Date();
      await Payment.create({
        member: member._id,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        amount: member.monthlyAmount,
        status: 'pending'
      });

      await auditLog(req.user.username, 'create', 'Member', `Created member ${member.fullName}`);
      res.status(201).json(member);
    } else {
      res.status(400);
      next(new Error('Invalid member data'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update member
// @route   PUT /api/members/:id
// @access  Private
const updateMember = async (req, res, next) => {
  try {
    const member = await Member.findById(req.params.id);
    if (member) {
      member.fullName = req.body.fullName || member.fullName;
      member.phone = req.body.phone || member.phone;
      member.address = req.body.address || member.address;
      member.monthlyAmount = req.body.monthlyAmount || member.monthlyAmount;

      if (req.file) {
        member.photo = `/uploads/members/${req.file.filename}`;
      }

      const updatedMember = await member.save();
      await auditLog(req.user.username, 'update', 'Member', `Updated member ${member.fullName}`);
      res.json(updatedMember);
    } else {
      res.status(404);
      next(new Error('Member not found'));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private
const deleteMember = async (req, res, next) => {
  const { id } = req.params;

  try {
    const member = await Member.findById(id);
    if (member) {
      await Payment.deleteMany({ member: id }); // Delete all payments for this member
      await member.deleteOne();

      await auditLog(req.user.username, 'delete', 'Member', `Deleted member ${member.fullName} and their payments`);
      res.json({ message: 'Member and associated payments removed' });
    } else {
      res.status(404);
      next(new Error('Member not found'));
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { getMembers, getMemberDetails, createMember, updateMember, deleteMember };
