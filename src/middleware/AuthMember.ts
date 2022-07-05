import * as Config from '../util/config'
import * as jwt from 'jsonwebtoken'
import moment from 'moment'
import 'moment/locale/th'

export const AuthenticateMember = async (req: any, res: any, next: any) => {
    const authHeader = req.get("Authorization")
    if(!authHeader){
        return res.status(401).json({
            message: 'Not Authenticated.'
        })
    }
    /* receive bearer token from header */
    const token = authHeader.split(' ')[1]
    let decodedToken: any
    /* if having token */
    if(token != null){
        try {
            /* verify token for get data and check expire token */
            decodedToken = await jwt.verify(token, `${Config.secretKey}`)
            /* if token was expired */
            if(moment().unix() > decodedToken.exp){
                return res.status(401).json({
                    status: false,
                    message: 'error',
                    description: 'token was expired.'
                })
            }
            /* data keep for use when update data in database */
            req.authMember = decodedToken;
            next()
        } catch(error) {
            return res.status(401).json({ 
                status: false, 
                message:'error', 
                description: "authentication failed, token was expired!"
            })
        }
    }
    /* if don't have correct token */
    if(!decodedToken) {
        return res.status(401).json({
            status: false, 
            message:'error', 
            description: "Invalid credentials"
        })
    }
}