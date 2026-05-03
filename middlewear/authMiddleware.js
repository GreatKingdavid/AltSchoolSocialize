const { verifyAccessToken } = require('../utils/jwtUtils');

const protect = (req, res, next) => {
 //  Get the "token" from the Header
 const authHeader = req.headers.authorization;

 if (!authHeader || !authHeader.startsWith('Bearer')) {
 return res.status(401).json({ message: "unauthorized request!" });
 }

 //  Extract the actual token string
 const token = authHeader.split(' ')[1];

 //   (Verify the Token)
 // This uses the Secret Key from your .env
 const decoded = verifyAccessToken(token);

 if (!decoded) {
 return res.status(401).json({ message: "This pass is fake or expired. Go back to login!" });
 }

 //  ATTACH THE USER ID
 // I told the ID from inside the token and put it in 'req.user'
 // Now the Controller knows EXACTLY who is making the request.
 req.user = decoded.id;

 //  MOVE TO THE NEXT PERSON (The Controller)
 next();
};

module.exports = { protect };
