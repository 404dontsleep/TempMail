interface IMailResult {
  id: string;
  body: string;
  from?: string;
  subject?: string;
  date?: string;
}
interface ITempMail {
  isLive(): Promise<boolean>;
  getMails(limit?: number): Promise<IMailResult[]>;
}

export default ITempMail;
export { IMailResult };
