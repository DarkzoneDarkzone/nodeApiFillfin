import { DBconnect } from "../util/dbconnect";
let sql: string

export class OrderService extends DBconnect {
    constructor() {
        super()
    }
    updateOrderProduct = async(member_id: any) => {
        return this.onUpdate('orders_product', 'incart', `member_id = ${member_id} AND incart = "yes"`, 'no')
    }
}