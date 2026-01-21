import jwt from 'jsonwebtoken'

export const tokenGenerator=(userId)=>{
    if(!userId){
        throw new Error("Cannot get userId");  
    }

    if(!process.env.JWT_SECRET){
        throw new Error("JWT Secret is not defined")
    }

    return jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        {expiresIn:"7d"}
    );
}