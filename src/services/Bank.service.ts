import { DBconnect } from "../util/dbconnect";
let sql: string

export class BankService extends DBconnect {
    constructor() {
        super()
    }
    queryBankAccountAll = async () => {
        sql = `SELECT bank_account.*, 
                    bank_provider.name as bank_name, 
                    bank_provider.short_name as bank_shortname, 
                    bank_provider.image 
                FROM bank_account 
                JOIN bank_provider ON (bank_account.bank_provider_id = bank_provider.id);`
        return this.findAll(sql, [])
    }
}