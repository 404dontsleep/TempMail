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
class EmailFake {
    constructor(address, domain) {
        this.address = address;
        this.domain = domain;
    }
    isLive() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield axios_1.default.post(`https://emailfake.com/check_adres_validation3.php`, `usr=${this.address}&dmn=${this.domain}`);
                if (data && "status" in data && data.status === "good")
                    return true;
            }
            catch (error) { }
            return false;
        });
    }
    getMails(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const allIds = yield this.getAllIds(limit);
            const result = (yield Promise.all(allIds.map((id) => this.getMail(id)))).filter((mail) => mail !== null);
            return result;
        });
    }
    getAllIds(limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = ["-1"];
            try {
                const { data } = yield axios_1.default.get(`https://emailfake.com/${this.domain}/${this.address}/`, {
                    headers: {
                        Cookie: `surl=${this.domain}/${this.address};`,
                    },
                });
                if (data) {
                    const regex = new RegExp(`https://emailfake.com/${this.domain}/${this.address}/([a-z0-9]{32})`, "gm");
                    while (true) {
                        const match = regex.exec(data);
                        if (match) {
                            result.push(match[1]);
                            regex.lastIndex++;
                        }
                        else {
                            break;
                        }
                    }
                }
            }
            catch (error) {
                console.error("EmailFake error: ", error);
            }
            return result.splice(0, limit);
        });
    }
    getMail() {
        return __awaiter(this, arguments, void 0, function* (id = "-1") {
            try {
                const cookieStr = `${this.domain}/${this.address}/${id === "-1" ? "" : id}`;
                const { data } = yield axios_1.default.get(`https://emailfake.com/${cookieStr}`, {
                    headers: {
                        Cookie: `surl=${cookieStr};`,
                    },
                });
                const _subRegex = /To: <\/span><span>(.*?)<\/span>.*From: <\/span><span>(.*?)<.*Subject:.*?inherit;">(.*?)<.*Received:.*<span>(.*?)<span/gm;
                const _regex = /<div class="e7m mess_bodiyy">(.*?)<\/div><div class="e7m border-right"><\/div>/gm;
                const subMatch = _subRegex.exec(data);
                const match = _regex.exec(data);
                if (match && subMatch) {
                    return {
                        id,
                        body: match[1],
                        from: subMatch[1],
                        subject: subMatch[3],
                        date: subMatch[4],
                    };
                }
            }
            catch (error) {
                console.error("EmailFake error: ", error);
            }
            return null;
        });
    }
}
exports.default = EmailFake;
