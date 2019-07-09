import { Context } from "probot";
import { IComment } from "./models";

export async function handle(context: Context, comments: IComment[]): Promise<void | Error> {
  const label = context.payload.label;
  const labels = context.payload.issue.labels;
  const issueNumber = context.issue().number;

  for (const c of comments) {
    if (label.name === c.label) {
      if (labelWasAdded(label, labels)) {
        await context.github.issues.createComment(context.issue({ body: c.comment }))
        .catch((err: any) => {
          throw new Error(`Couldn't add comment for issue: ${issueNumber}, error: ${err}`);
        });
        continue;
      } else {
        await pruneComments(context, c.comment);
        continue;
      }
    }
  }
}

function labelWasAdded(label: { name: string }, labels: Array<{ name: string }>): boolean {
  let labelAdded = false;
  for (const l of labels) {
    if (l.name === label.name) {
      labelAdded = true;
      break;
    }
  }
  return labelAdded;
}

async function pruneComments(context: Context, comment: string): Promise<void | Error> {
  const allComments: Array<{id: number, body: string }> =
    await context.github.issues.listComments(context.issue())
  .then((resp) => {
    return resp.data;
  })
  .catch((err: any) => {
    throw new Error(`Couldn't list comments for issue: ${context.issue().number}, error: ${err}`);
  });

  for (const c of allComments) {
    if (c.body === comment) {
      await context.github.issues.deleteComment(context.issue({ comment_id: c.id }))
      .catch((err) => {
        throw new Error(`Couldn't delete comment: ${c.id} for issue: ${context.issue().number}, error: ${err}`);
      });
    }
  }
}
