import { Context } from "probot";
import { IComment } from "./models";

export async function handle(
  context: Context,
  comments: IComment[]
): Promise<void> {
  const label = context.payload.label;
  const labeled = context.payload.action === "labeled";
  const issueNumber = context.issue().number;

  for (const c of comments) {
    if (label.name === c.label) {
      if (labeled) {
        const commentId = await getCommentId(context, c.comment);
        if (commentId === null) {
          await context.github.issues
            .createComment(context.issue({ body: c.comment }))
            .catch((err: any) => {
              throw new Error(
                `Couldn't add comment for issue: ${issueNumber}, error: ${err}`
              );
            });
        }
        continue;
      } else {
        await pruneComments(context, c.comment);
        continue;
      }
    }
  }
}

async function getCommentId(
  context: Context,
  comment: string
): Promise<number | null> {
  return await context.github.issues
    .listComments(context.issue())
    .then(resp => {
      const allComments: Array<{ id: number; body: string }> = resp.data;
      for (const c of allComments) {
        if (c.body === comment) {
          return c.id;
        }
      }
      return null;
    })
    .catch((err: any) => {
      throw new Error(
        `Couldn't list comments for issue: ${
          context.issue().number
        }, error: ${err}`
      );
    });
}

async function pruneComments(context: Context, comment: string): Promise<void> {
  let id = await getCommentId(context, comment);
  if (id !== null) {
    await context.github.issues
      .deleteComment(context.issue({ comment_id: id! }))
      .catch(err => {
        throw new Error(
          `Couldn't delete comment: ${id} for issue: ${
            context.issue().number
          }, error: ${err}`
        );
      });
  }
}
