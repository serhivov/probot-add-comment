import { Application, Context } from "probot";
import { ConfigManager } from "./config";
import { handle } from "./handler";
import { IConfig, schema } from "./models";

module.exports = async (app: Application) => {
  const events = ["issues.labeled", "issues.unlabeled"];
  const configManager = new ConfigManager<IConfig>("comment.yml", {}, schema);

  app.on(events, async (context: Context) => {
    context.log("Grabbing Config");
    const config = await configManager.getConfig(context).catch(err => {
      context.log.error(err);
      return {} as IConfig;
    });
    if (config.comments) {
      context.log(
        `Handling issue: ${context.issue().number}, ${context.issue().owner} ${
          context.issue().repo
        }`
      );
      await handle(context, config.comments!).catch(err => {
        context.log.error(err);
      });
    }
  });

  app.on("*", async context => {
    context.log({ event: context.event, action: context.payload.action });
  });
};
