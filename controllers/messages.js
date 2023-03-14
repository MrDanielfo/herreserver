const Message = require("../models/message");

const getAllMessages = async (req, res = response) => {
  const userId = req.uid;
  const messagesFrom = req.params.from;

  // console.log(userId);
  const last30 = await Message.find({
    $or: [
      { from: userId, to: messagesFrom },
      { from: messagesFrom, to: userId },
    ],
  })
    .sort({ createdAt: "desc" })
    .limit(30);
  console.log(last30);
  res.status(200).json({
    ok: true,
    msg: "Go ahead",
    userId,
    messagesFrom,
  });
};

module.exports = {
  getAllMessages,
};
