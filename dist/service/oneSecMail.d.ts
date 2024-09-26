import ITempMail, { IMailResult } from "../ITempMail";
declare class OneSecMail implements ITempMail {
    private readonly domain;
    private address;
    constructor(address: string);
    isLive(): Promise<boolean>;
    getMails(limit?: number): Promise<IMailResult[]>;
    getMail(id: number): Promise<IMailResult | null>;
}
export default OneSecMail;
