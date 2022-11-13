import jsonwebtoken from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // ambil header authorization
  const authHeader = req.headers["authorization"];

  // ambil token dari header
  const token = authHeader && authHeader.split(" ")[1];

  // validasi token
  if (token == null) return res.sendStatus(401); // 401 = unauthorization

  // varify token
  jsonwebtoken.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      // jika error
      if (err) return res.sendStatus(403); // 403 = forbiden

      // verify email
      req.email = decoded.email;

      next();
    }
  );
};
