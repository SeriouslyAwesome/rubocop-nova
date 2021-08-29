const RuboCopOffense = require("./RuboCopOffense");

class RuboCopProcess {
  constructor() {
    this.command = "rubocop";
    this.processOptions = {
      cwd: nova.workspace.path,
      shell: true,
      stdio: "pipe"
    }
  }

  async inspect(file, args) {
    return new Promise(resolve => {
      const processArgs = [this.command, "--format=json", args, file].flat();

      this.run(processArgs, this.generateOffenses, resolve);
    });
  }

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
      } else {
        const result = callback.apply(this, [output, errorOutput]);
        resolve(result);
      }
    });

    process.start();
  }

  generateOffenses(output, errorOutput) {
    if (errorOutput) {
      console.warn("RuboCop WARNING: " + errorOutput);
    }

    try {
      const data = JSON.parse(output);
      const rawOffenses = data["files"][0]["offenses"];

      this.offenses = rawOffenses.map(rawOffense => new RuboCopOffense(rawOffense));

      return this.offenses
    } catch(error) {
      console.error("RuboCop WARNING: " + error);
    }
  }
}

module.exports = RuboCopProcess;
