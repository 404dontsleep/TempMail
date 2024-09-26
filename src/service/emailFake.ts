import axios from "axios";
import ITempMail, { IMailResult } from "../ITempMail";

export default class EmailFake implements ITempMail {
  private domain: string;
  private address: string;
  constructor(address: string, domain: string) {
    this.address = address;
    this.domain = domain;
  }
  async isLive(): Promise<boolean> {
    try {
      const { data } = await axios.post(
        `https://emailfake.com/check_adres_validation3.php`,
        `usr=${this.address}&dmn=${this.domain}`
      );
      if (data && "status" in data && data.status === "good") return true;
    } catch (error) {}
    return false;
  }
  async getMails(limit?: number): Promise<IMailResult[]> {
    const allIds = await this.getAllIds(limit);
    const result: IMailResult[] = (
      await Promise.all(allIds.map((id) => this.getMail(id)))
    ).filter((mail) => mail !== null);
    return result;
  }
  async getAllIds(limit?: number): Promise<string[]> {
    const result: string[] = ["-1"];
    try {
      const { data } = await axios.get(
        `https://emailfake.com/${this.domain}/${this.address}/`,
        {
          headers: {
            Cookie: `surl=${this.domain}/${this.address};`,
          },
        }
      );
      if (data) {
        const regex = new RegExp(
          `https://emailfake.com/${this.domain}/${this.address}/([a-z0-9]{32})`,
          "gm"
        );
        while (true) {
          const match = regex.exec(data);
          if (match) {
            result.push(match[1]);
            regex.lastIndex++;
          } else {
            break;
          }
        }
      }
    } catch (error) {
      console.error("EmailFake error: ", error);
    }
    return result.splice(0, limit);
  }
  async getMail(id: string = "-1"): Promise<IMailResult | null> {
    try {
      const cookieStr = `${this.domain}/${this.address}/${
        id === "-1" ? "" : id
      }`;
      const { data } = await axios.get(`https://emailfake.com/${cookieStr}`, {
        headers: {
          Cookie: `surl=${cookieStr};`,
        },
      });
      const _subRegex =
        /To: <\/span><span>(.*?)<\/span>.*From: <\/span><span>(.*?)<.*Subject:.*?inherit;">(.*?)<.*Received:.*<span>(.*?)<span/gm;
      const _regex =
        /<div class="e7m mess_bodiyy">(.*?)<\/div><div class="e7m border-right"><\/div>/gm;
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
    } catch (error) {
      console.error("EmailFake error: ", error);
    }
    return null;
  }
}
