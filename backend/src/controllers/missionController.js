exports.getDailyMissions = async (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      { _id: '1', title: 'Login to GSP', description: 'Log in to the platform today', points: 10, isCompleted: true },
      { _id: '2', title: 'Join a Club', description: 'Explore and join a new club', points: 50, isCompleted: false },
    ]
  });
};

exports.completeMission = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mission completed successfully'
  });
};
