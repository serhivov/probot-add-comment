import { FakeIssueApi } from "./fakeissueapi";

export class FakeGithub {
  public comments: string[];
  public commentsAdded: string[];
  public commentsRemoved: string[];
  public event: string;
  public issues: FakeIssueApi;
  public pullRequests: FakeIssueApi;

  constructor(comments: string[], event: string = "issues") {
    this.comments = comments;
    this.commentsAdded = [];
    this.commentsRemoved = [];
    this.event = event;
    this.issues = new FakeIssueApi(this);
    this.pullRequests = new FakeIssueApi(this); // comments in a PR are related to the underlying issue
  }
}
