"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankService = void 0;
const dbconnect_1 = require("../util/dbconnect");
let sql;
class BankService extends dbconnect_1.DBconnect {
    constructor() {
        super();
        this.queryBankAccountAll = () => __awaiter(this, void 0, void 0, function* () {
            sql = `SELECT bank_account.*, 
                    bank_provider.name as bank_name, 
                    bank_provider.short_name as bank_shortname, 
                    bank_provider.image 
                FROM bank_account 
                JOIN bank_provider ON (bank_account.bank_provider_id = bank_provider.id);`;
            return this.findAll(sql, []);
        });
    }
}
exports.BankService = BankService;
