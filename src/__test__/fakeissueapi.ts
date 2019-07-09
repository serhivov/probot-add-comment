import { FakeGithub } from "./fakegithub";

export class FakeIssueApi {
      private top: FakeGithub;

      constructor(top: FakeGithub) {
        this.top = top;
      }

      public async createComment(params: {owner: string, repo: string, issue_number: number, body: string}) {
        this.top.commentsAdded.push(params.body);
        this.top.comments.push(params.body);
        return new Promise((resolve) => {
          resolve({
            data: [],
          });
        });
      }

      public async deleteComment(params: {owner: string, repo: string, issue_number: number, comment_id: number}) {
        const comment = this.top.comments[params.comment_id];
        this.top.commentsRemoved.push(comment);
        delete this.top.comments[params.comment_id];
        return new Promise((resolve) => {
          resolve({
            data: [],
          });
        });
      }

      public async listComments(params: {owner: string, repo: string, issue_number: number}) {
        return new Promise((resolve) => {
          const comments: Array<{ id: number, body: string }> = [];
          for (let i = 0; i < this.top.comments.length; i++) {
            if (this.top.comments[i]) {
              comments.push({ id: i, body: this.top.comments[i]});
            }
          }
          resolve({
            data: comments,
          });
        });
      }
    }
