const RuboCopOffense = require("./RuboCopOffense");

/** Provides the main interface for invoking RuboCop from within Nova. */
class RuboCopProcess {
  /**
   * Prepares the interface with the RuboCop shell command.
   * @param {string} baseCommand - The command used to invoke RuboCop, as specified by the user's preferences
   */
  constructor(baseCommand) {
    this.command = this.sanitizeCommand(baseCommand);
    this.processOptions = {
      cwd: nova.workspace.path,
      shell: true,
      stdio: "pipe"
    }
  }

  /**
   * @param {String} file - The relative path to the file to inspect
   * @param {Array} args - The array of additional command argument flags to pass to RuboCop
   * @return {Promise}
   */
  async inspect(file, args) {
    return new Promise(resolve => {
      // Smash all the argument components into a single, flattened array.
      const processArgs = [this.command, "--format=json", args, file].flat();

      // Run the RuboCop command
      this.run(processArgs, this.generateOffenses, resolve);
    });
  }

  /**
   * @param {Array} args - The array of command arguments expected by Nova's Process class
   * @param {Function} callback - A function to be invoked upon success to handle the output of the RuboCop command
   * @param {Function} resolve - A function invoked to return the results of the callback function back to the promise
   * @return {void}
   */
  run(args, callback, resolve) {
    const options = this.processOptions;
    options.args = [args].flat();

    console.log(`Running Rubocop on ${args.slice(-1)}`);

    const process = new Process("/usr/bin/env", options)
    let output = "";
    let errorOutput = "";

    process.onStdout(line => output += line);
    process.onStderr(line => errorOutput += line);
    process.onDidExit(status => {
      if (status >= 2) {
        console.log("RuboCop ERROR: " + errorOutput);
        this.displayErrorNotification(errorOutput);
      } else {
        const result = callback.apply(this, [output, errorOutput]);
        resolve(result);
      }
    });

    process.start();
  }

  /**
   * @param {String} output - A string containing the JSON output of the RuboCop command
   * @param {String} errorOutput - A string containing any error messages output by RuboCop
   * @return {Array} - An array of RuboCopOffense instances parsed from the supplied JSON in output
   */
  generateOffenses(output, errorOutput) {
    if (errorOutput) console.warn("RuboCop ERROR: " + errorOutput);

    try {
      const data = JSON.parse(output);
      const rawOffenses = data["files"][0]["offenses"];

      this.offenses = rawOffenses.map(rawOffense => new RuboCopOffense(rawOffense));

      return this.offenses
    } catch(error) {
      console.error("RuboCop Extension ERROR: " + error);
    }
  }

  /**
   * Cleans and formats the user-supplied base command string for use in Nova's Process class
   * @param {String} command - The command used to invoke RuboCop, as specified by the user's preferences
   * @return {Array} - An array of words used to invoke RuboCop, without command arguments or flags
   */
  sanitizeCommand(command) {
    // Strip command arguments/flags from user input
    let sanitizedCommand = command.trim().replace(/(\--.+)/, "");

    // Split the remaining string into an array of words, e.g. ["bundle", "exec", "rubocop"]
    let commandWordsArray = sanitizedCommand.split(" ");

    // Strip out empty elements
    commandWordsArray = commandWordsArray.filter(function(el) { return el; });

    return commandWordsArray;
  }

  displayErrorNotification(error) {
    const request = new NotificationRequest("rubocop-error");
    request.title = "RuboCop Encountered an Error:";
    request.body = `${error}\nPlease check your configuration.`;
    request.actions = [nova.localize("Dismiss"), nova.localize("Project Settings")];

    const notificationPromise = nova.notifications.add(request);

    notificationPromise.then((response) => {
      if (response.actionIdx === 1) nova.workspace.openConfig();
    }).catch((error) => {
      console.error("RuboCop Extension ERROR: " + error);
    });
  }
}

module.exports = RuboCopProcess;
