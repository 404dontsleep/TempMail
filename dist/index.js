"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailFake_1 = require("./service/emailFake");
const oneSecMail_1 = require("./service/oneSecMail");
exports.default = { OneSecMail: oneSecMail_1.default, EmailFake: emailFake_1.default };
