const RuboCopProcess = require("./RuboCopProcess");

// exports.activate = function() {
//     nova.workspace.onDidAddTextEditor((editor) => {
//       // Do work when the extension is activated
//       if (editor.document.syntax !== "ruby") return;
//
//       const file = editor.document.uri
//       const RuboCop = new RubocopProcess(file, []);
//
//       RuboCop.run();
//
//       editor.onWillSave(editor => RuboCop.run(););
//       editor.onDidStopChanging(editor => RuboCop.run(););
//       editor.document.onDidChangeSyntax(document => {
//         if (editor.document.syntax !== "ruby") RuboCop.run(););
//       });
//
//     });
//
// }
//
// exports.deactivate = function() {
//     // Clean up state before the extension is deactivated
// }


class RuboCop {
  constructor() {
    this.process = new RuboCopProcess()
    this.issueCollection = new IssueCollection();
    this.commandArguments = this.argumentsFromConfig();
    this.version = this.process.version;
  }

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

  argumentsFromConfig() {
    // Available options are determined in ./configuration-options.json:
    // ["", "--fix-layout", "--auto-correct", "--auto-correct-all"]
    const autoCorrect = this.config("seriouslyawesome.rubocop.autocorrect");

    // Boolean. Requires the above to be set to a non-empty value.
    const disableUncorrectable = this.config("seriouslyawesome.rubocop.disable-uncorrectable");

    let args = [];

    if (autoCorrect) {
      args.push(autoCorrect);
      if (disableUncorrectable) args.push("--disable-uncorrectable");
    }

    return args;
  }

  config(name) {
    const workspaceConfig = nova.workspace.config.get(name) ? nova.workspace.config.get(name) : null;
    const extensionConfig = nova.config.get(name);

    return workspaceConfig === null ? extensionConfig : workspaceConfig;
  }
}

nova.assistants.registerIssueAssistant("ruby", new RuboCop(), { event: "onSave" });

