<!--
👋 Hello! As Nova users browse the extensions library, a good README can help them understand what your extension does, how it works, and what setup or configuration it may require.

Not every extension will need every item described below. Use your best judgement when deciding which parts to keep to provide the best experience for your new users.

💡 Quick Tip! As you edit this README template, you can preview your changes by selecting **Extensions → Activate Project as Extension**, opening the Extension Library, and selecting "RuboCop for Nova" in the sidebar.

Let's get started!
-->

<!--
🎈 Include a brief description of the features your extension provides. For example:
-->

# RuboCop for Nova

**RuboCop for Nova** automatically lints all open Ruby files, then reports errors and warnings in Nova's **Issues** sidebar and the editor gutter. Issues can even be automatically fixed or silenced with configurable `--auto-correct` options (see Configuration section below).

## Requirements

<!--
🎈 If your extension depends on external processes or tools that users will need to have, it's helpful to list those and provide links to their installers:
-->

RuboCop for Nova requires some additional tools to be installed on your Mac:

- [RuboCop 0.73.0](https://rubocop.org) or newer

<!--
✨ Providing tips, tricks, or other guides for installing or configuring external dependencies can go a long way toward helping your users have a good setup experience:
-->

_RuboCop can be installed a few different ways, so please check [the documentation](https://docs.rubocop.org/rubocop/1.20/installation.html) on the best method for your environment and/or project._

## Configuration

This extension supports the following configuration options:

- **BYOR (Bring Your Own Rubocop):** - Specify your preferred command for running RuboCop, whether it's from a binstub (`bin/rubocop`), your project's Gemfile (`bundle exec rubocop`), or a global installation (`rubocop`).
- **Auto-correct, 3 Ways:** - Specify whether RuboCop should automatically fix offenses, and at which level of safety: Layout Cops Only, Safe Cops Only, or All Cops.
- **Disable Un-correctable Offenses:** - Allow RuboCop to add `rubocop:todo` comments to lines of code that could not be auto-corrected to quiet instances without ignoring them.

<!--
🎈 If your extension offers global- or workspace-scoped preferences, consider pointing users toward those settings. For example:
-->

To configure global preferences, open **Extensions → Extension Library...** then select RuboCop's **Preferences** tab.

You can also configure preferences on a per-project basis in **Project → Project Settings...**

<!--
👋 That's it! Happy developing!

P.S. If you'd like, you can remove these comments before submitting your extension 😉
-->
