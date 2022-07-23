import { sequelize } from './../util/database'
import { Op } from 'sequelize'
import * as Config from '../util/config'
import 'moment/locale/th'
import moment from 'moment'
import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'

/** for test socket */
import { SIO } from './../util/Sockets'

export class ChatController {

}
