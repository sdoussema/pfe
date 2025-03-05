import jwt from "jsonwebtoken";

export const ProtectRoute = (req, res, next) => {
    const token = req.cookies.token ;

    console.log("Received Token:", token); // Debugging

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: "Invalid token" });
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ success: false, message: "Invalid token or expired" });
    }
};
