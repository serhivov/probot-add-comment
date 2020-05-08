import { Application, Context } from "probot";
import { ConfigManager } from "probot-config-manager";
import { handle } from "./handler";
import { IConfig, schema } from "./models";

module.exports = async (app: Application) => {
  const events = [
    "issues.labeled",
    "issues.unlabeled",
    "pull_request.labeled",
    "pull_request.unlabeled"
  ];
  const configManager = new ConfigManager<IConfig>("comment.yml", {}, schema);

  app.log.info("probot-add-comment loaded");
  app.on(events, async (context: Context) => {
    const inumber = context.issue().number;
    const repo = context.issue().repo;
    const owner = context.issue().owner;

    const logger = context.log.child({
      owner: owner,
      repo: repo,
      issue: inumber,
      app: "probot-add-comment"
    });
    logger.debug("Getting Config");
    const config = await configManager.getConfig(context).catch(err => {
      context.log.error(err);
      return {} as IConfig;
    });

    let eventType = config.issues;
    if ("pull_request" === context.event) {
      eventType = config.pulls;
    }

    if (eventType) {
      logger.debug("Config exists");
      logger.debug(config);
      await handle(context, eventType!).catch(err => {
        context.log.error(err);
      });
      logger.debug("Handled");
    }
  });

  app.on("*", async context => {
    context.log({ event: context.event, action: context.payload.action });
  });
};
