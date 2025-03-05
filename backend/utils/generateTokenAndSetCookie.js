import jwt from "jsonwebtoken";
export const generateTokenAndSetCookie = (res, id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15d" });
    res.cookie(
        "token", 
        token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite : "Strict",
        maxAge: 15 * 24 * 60 * 60 * 1000

});



    return token;
}