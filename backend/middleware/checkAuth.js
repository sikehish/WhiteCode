const jwt= require('jsonwebtoken')

exports.checkAuth = (req, res, next) => {
    const {authorization: auth} = req.headers;

    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ status:"fail",message: 'Unauthorized access. Bearer token not provided.' });
    }
  
    const token = auth.split(' ')[1]; // Format: Bearer 'token'
  
    if (!token) {
      return res.status(401).json({ status:"fail",message: 'Unauthorized access. Invalid Bearer token.' });
    }
  
    try {
        const { id } = jwt.verify(token, process.env.JWT_KEY);
        console.log(token, process.env.JWT_KEY)

        if (!id) return res.status(401).json({ status:"fail",message: "User doesn't exist" });

        req.user = id;
        next();
      }catch (error) {
        console.log(error);
        res.status(401).json({ status:"fail", message: "Unauthorized request" });
      }
  };