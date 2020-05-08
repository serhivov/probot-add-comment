import { Context } from "probot";

export class FakeContext extends Context<any> {
  public payload: any;
  public github: any;
  public name: string;
  public id: string;
  public repo: any;
  public log: any;
  public event: any;
  public isBot: any;
  public config: any;

  constructor(payload: any, github: any, configMethod: any, log = console) {
    super(payload, github, {} as any);
    this.payload = payload;
    this.github = github;
    this.config = configMethod;
    this.name = github.event;
    this.id = "test";
    this.log = {
      child: (x: any) => {
        return {
          debug: (y: any) => {
            return;
          }
        };
      }
    };
  }

  public issue<T>(
    object: T
  ): { number: any } & { owner: string; repo: string } & T {
    return Object.assign({ owner: "test", repo: "test", number: 1 }, object);
  }
}
