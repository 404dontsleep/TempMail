import ITempMail, { IMailResult } from "../ITempMail";
export default class EmailFake implements ITempMail {
    private domain;
    private address;
    constructor(address: string, domain: string);
    isLive(): Promise<boolean>;
    getMails(limit?: number): Promise<IMailResult[]>;
    getAllIds(limit?: number): Promise<string[]>;
    getMail(id?: string): Promise<IMailResult | null>;
}
