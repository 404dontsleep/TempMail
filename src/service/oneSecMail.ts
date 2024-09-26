import ITempMail, { IMailResult } from "../ITempMail";
import axios from "axios";
class OneSecMail implements ITempMail {
  private readonly domain = "1secmail.com";
  private address: string;
  constructor(address: string) {
    this.address = address;
  }
  async isLive(): Promise<boolean> {
    try {
      await axios.get(
        `https://www.1secmail.com/api/v1/?action=getMessages&login=${this.address}&domain=${this.domain}`
      );
      return true;
    } catch (error) {
      return false;
    }
  }
  async getMails(limit?: number): Promise<IMailResult[]> {
    const result: IMailResult[] = [];
    try {
      const response = await axios.get(
        `https://www.1secmail.com/api/v1/?action=getMessages&login=${this.address}&domain=${this.domain}`
      );
      const ids: number[] = response.data.map(
        (mail: { id: number }) => mail.id
      );
      result.push(
        ...(
          await Promise.all(ids.slice(0, limit).map((id) => this.getMail(id)))
        ).filter((mail) => mail !== null)
      );
    } catch (error) {
      console.error("OneSecMail error: ", error);
    }
    return result;
  }
  async getMail(id: number): Promise<IMailResult | null> {
    try {
      const response = await axios.get(
        `https://www.1secmail.com/api/v1/?action=readMessage&login=${this.address}&domain=${this.domain}&id=${id}`
      );
      const res: IMailResult = {
        id: id.toString(),
        body: response.data.body,
        from: response.data.from,
        subject: response.data.subject,
        date: response.data.date,
      };
      return res;
    } catch (error) {
      console.error("OneSecMail error: ", error);
    }
    return null;
  }
}

export default OneSecMail;
