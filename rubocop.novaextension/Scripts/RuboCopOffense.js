class RuboCopOffense {
  constructor(offense) {
    this.severity = offense["severity"];
    this.cop = offense["cop_name"];
    this.message = offense["message"];
    this.column = offense["location"]["start_column"];
    this.line = offense["location"]["start_line"];
    this.endColumn = offense["location"]["last_column"] + 1;
    this.endLine = offense["location"]["last_line"];
  }

  toNovaIssue() {
    const issue = new Issue();

    issue.source = "RuboCop";
    issue.code = this.cop;
    issue.severity = this._issueSeverityOptions[this.severity];
    issue.message = this.message;
    issue.line = this.line;
    issue.endLine = this.endLine;
    issue.column = this.column;
    issue.endColumn = this.endColumn;

    return issue;
  }

  get _issueSeverityOptions() {
    const severityOptions = {
      "fatal": IssueSeverity.Error,
      "error": IssueSeverity.Error,
      "warning": IssueSeverity.Warning,
      "refactor": IssueSeverity.Hint,
      "convention": IssueSeverity.Hint,
      "info": IssueSeverity.Info
    };

    return severityOptions;
  }
}

module.exports = RuboCopOffense;
