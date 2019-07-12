import { Context } from "probot";
import { IComment } from "./models";

export async function handle(
  context: Context,
  comments: IComment[]
): Promise<void> {
  const label = context.payload.label;
  const labeled = context.payload.action === "labeled";
  const issueNumber = context.issue().number;
  const owner = context.issue().owner;
  const repo = context.issue().repo;
  const logger = context.log.child({
    owner: owner,
    repo: repo,
    app: "probot-add-comment"
  });

  for (const c of comments) {
    if (label.name === c.label) {
      logger.debug(`label matches config: ${label.name}`);
      if (labeled) {
        logger.debug(`looking for comment: ${c.comment}`);
        const commentId = await getCommentId(context, c.comment);
        if (commentId === null) {
          await context.github.issues
            .createComment(context.issue({ body: c.comment }))
            .catch((err: any) => {
              throw new Error(
                `Couldn't add comment for issue: ${issueNumber}, error: ${err}`
              );
            });
          logger.debug(`created comment: ${c.comment}`);
        }
        continue;
      } else {
        logger.debug("pruning comments");
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
