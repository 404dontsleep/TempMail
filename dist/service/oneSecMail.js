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
const axios_1 = require("axios");
class OneSecMail {
    constructor(address) {
        this.domain = "1secmail.com";
        this.address = address;
    }
    isLive() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield axios_1.default.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${this.address}&domain=${this.domain}`);
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    getMails(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            try {
                const response = yield axios_1.default.get(`https://www.1secmail.com/api/v1/?action=getMessages&login=${this.address}&domain=${this.domain}`);
                const ids = response.data.map((mail) => mail.id);
                result.push(...(yield Promise.all(ids.slice(0, limit).map((id) => this.getMail(id)))).filter((mail) => mail !== null));
            }
            catch (error) {
                console.error("OneSecMail error: ", error);
            }
            return result;
        });
    }
    getMail(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`https://www.1secmail.com/api/v1/?action=readMessage&login=${this.address}&domain=${this.domain}&id=${id}`);
                const res = {
                    id: id.toString(),
                    body: response.data.body,
                    from: response.data.from,
                    subject: response.data.subject,
                    date: response.data.date,
                };
                return res;
            }
            catch (error) {
                console.error("OneSecMail error: ", error);
            }
            return null;
        });
    }
}
exports.default = OneSecMail;
