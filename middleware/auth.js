import jwt from 'jsonwebtoken';

const protect = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res
      .status(401)
      .json({ status: 'failure', message: 'no token - access denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ status: 'failure', message: 'token invalid or expired' });
  }
};

export default protect;
