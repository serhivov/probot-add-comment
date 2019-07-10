import { FakeIssueApi } from "./fakeissueapi";

export class FakeGithub {
  public comments: string[];
  public commentsAdded: string[];
  public commentsRemoved: string[];
  public issues: FakeIssueApi;

  constructor(comments: string[]) {
    this.comments = comments;
    this.commentsAdded = [];
    this.commentsRemoved = [];
    this.issues = new FakeIssueApi(this);
  }
}
