import * as Config from '../util/config'
import * as jwt from 'jsonwebtoken'
import moment from 'moment'

export const AuthenticateMemberAndGuest = async (req: any, res: any, next: any) => {
    const authHeader = req.get("Authorization")
    if(authHeader){
        const token = authHeader.split(' ')[1]
        let decodedToken: any
        if(token){
            try {
                decodedToken = await jwt.verify(token, `${Config.secretKey}`)
                if(moment().unix() > decodedToken.exp){
                    return res.status(401).json({
                        status: false,
                        message: 'error',
                        description: 'token was expired.'
                    })
                }
                req.authMember = decodedToken;
                next()
            } catch(error) {
                next()
            }
        }
    }else{
        next()
    }
}