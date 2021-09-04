const RuboCopProcess = require("./RuboCopProcess");

/** Primary interface for interacting with RuboCop from within Nova. **/
class RuboCop {
  /** Initialize RuboCop **/
  constructor() {
    this.baseCommand = this.getConfig("SeriouslyAwesome.rubocop-nova.base-command");
    this.process = new RuboCopProcess(this.baseCommand)
    this.issueCollection = new IssueCollection();
    this.version = this.process.version;
  }

  /**
   * Calls the RuboCop command on appropriate files and returns a collection of Issue instances for Nova to present to the user.
   * @param {Editor} - An instance of the Nova text editor
   * @return {Array} - An array of Nova Issue instances
   */
  provideIssues(editor) {
    const file = editor.document.path;
    const options = this.argumentsFromConfig();

    let issues = [];

    this.process.inspect(file, options).then((offenses) => {
      offenses.forEach(offense => {
        issues.push(offense.toNovaIssue());
      });

      this.issueCollection.set(editor.document.uri, issues);
      return issues;
    });
  }

  /**
   * Determines primary command arguments to pass to RuboCop based on the user's Nova preferences.
   * Available configuration options are determined in ./configuration-options.json.
   * @return {Array} - An array of command argument flags
   */
  argumentsFromConfig() {
    let args = [];

    const autoCorrect = this.getConfig("SeriouslyAwesome.rubocop-nova.autocorrect");
    const disableUncorrectable = this.getConfig("SeriouslyAwesome.rubocop-nova.disable-uncorrectable");

    if (autoCorrect) {
      args.push(autoCorrect);
      if (disableUncorrectable) args.push("--disable-uncorrectable");
    }

    return args;
  }

  /**
   * Fetches user preferences from Nova, with workspace preferences taking priority over general extension preferences.
   * @param {String} name - The name of the configuration setting to retrieve, as labelled in ./configuration-options.json
   * @return {(String|Boolean)} - The value of the user preference from Nova.
   */
  getConfig(name) {
    const workspaceConfig = nova.workspace.config.get(name) ? nova.workspace.config.get(name) : null;
    const extensionConfig = nova.config.get(name);

    return workspaceConfig === null ? extensionConfig : workspaceConfig;
  }
}

nova.assistants.registerIssueAssistant("ruby", new RuboCop(), { event: "onSave" });

