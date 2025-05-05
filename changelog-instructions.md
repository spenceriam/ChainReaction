# Changelog Maintenance Instructions for ChainReaction

This document provides detailed instructions for maintaining the `CHANGELOG.md` file throughout the development of the ChainReaction application. Following these guidelines will ensure a comprehensive and useful record of the project's evolution.

## Purpose of the Changelog

The changelog serves several important purposes:
- Communicates changes to users and stakeholders
- Provides a historical record of development
- Helps developers understand what changed between versions
- Assists with debugging and identifying when specific changes were introduced
- Supports release planning and version management

## When to Update the Changelog

Update the changelog when:

1. **Completing a feature** - Document what capability was added and its key aspects
2. **Making API changes** - Note any modifications to interfaces, endpoints, or contracts
3. **Fixing bugs** - Detail what was broken and how it was fixed
4. **Refactoring code** - Explain significant structural changes that might affect others
5. **Changing dependencies** - Record updates to libraries, frameworks, or tools
6. **Modifying UI/UX** - Document user-facing changes to the interface or experience
7. **Implementing performance improvements** - Note optimizations and their impact
8. **Adding or updating documentation** - Record significant documentation changes
9. **Implementing security enhancements** - Note security improvements (without exposing vulnerabilities)

## How to Update the Changelog

### Step 1: Locate the CHANGELOG.md file
The changelog is located in the root directory of the project repository.

### Step 2: Add your entry to the appropriate section
Add new entries at the top of the appropriate category in the "Unreleased" section:

- **Added**: New features that didn't exist before
- **Changed**: Updates or improvements to existing functionality
- **Deprecated**: Features that will be removed in upcoming releases
- **Removed**: Features that were removed in this release
- **Fixed**: Bug fixes
- **Security**: Changes that address vulnerabilities

### Step 3: Write a clear, concise entry
Each entry should:
- Begin with a verb in the present tense (Add, Update, Fix, etc.)
- Be specific about what changed
- Include issue/ticket references when applicable (#123)
- Credit contributors when appropriate (@username)
- Be understandable to users, not just developers

### Step 4: Commit your changes
Include the changelog update in the same commit as your code changes or in a separate commit if updating retroactively.

## Version Release Process

When preparing a new release:

1. **Review the Unreleased section** for completeness and accuracy
2. **Decide on the appropriate version number** based on semantic versioning:
   - MAJOR: Incompatible API changes (1.0.0)
   - MINOR: Added functionality in a backward-compatible manner (0.1.0)
   - PATCH: Backward-compatible bug fixes (0.0.1)
3. **Change the "Unreleased" header** to the new version number and add the release date:
   ```
   ## [1.0.0] - 2025-05-10
   ```
4. **Add a new "Unreleased" section** at the top:
   ```
   ## [Unreleased]
   
   ### Added
   
   ### Changed
   
   ### Deprecated
   
   ### Removed
   
   ### Fixed
   
   ### Security
   ```
5. **Update the version links** at the bottom of the file (if using them)
6. **Commit these changes** with a message like "Prepare release v1.0.0"
7. **Tag the release** in Git with the version number

## Tips for Effective Changelog Entries

### Do:
- ✅ Be specific: "Add word chain validation algorithm" instead of "Add new feature"
- ✅ Include context: "Fix game timer not resetting between rounds (#45)"
- ✅ Group related changes: List all UI improvements together
- ✅ Consider the audience: Write for users, not just for other developers
- ✅ Link to more information when appropriate: "(See docs/scoring.md for details)"

### Don't:
- ❌ Be vague: "Update stuff" or "Fix various bugs"
- ❌ Include technical implementation details that don't affect users
- ❌ Reference temporary internal elements like feature branch names
- ❌ Use jargon that users won't understand
- ❌ Include sensitive information like security vulnerabilities before they're patched

## Example Changelog Entries

### Good Examples:

```markdown
### Added
- Add daily challenge mode with global leaderboard (#23)
- Implement word difficulty scoring based on frequency analysis
- Add tutorial for first-time users with interactive examples

### Changed
- Improve game timer accuracy by switching to requestAnimationFrame
- Update scoring algorithm to reward efficiency (see docs/scoring.md)
- Enhance word validation response time by caching common words

### Fixed
- Fix incorrect calculation of streak bonuses (#45)
- Resolve issue where chain completion wasn't detected with certain word combinations
- Fix layout problems on mobile devices in landscape orientation
```

### Poor Examples:

```markdown
### Added
- New stuff
- Made things better
- Fixed John's code

### Changed
- Updated UI
- Changed some functions
- Modified the algorithm
```

## Automating Changelog Updates

Consider implementing these automation practices:

1. **Pull Request Templates**: Include a changelog section in PR templates
2. **Pre-commit Hooks**: Verify changelog updates during development
3. **CI Checks**: Validate that the changelog has been updated for relevant PRs
4. **Release Scripts**: Automate version updates and changelog formatting during releases

## Additional Resources

- [Keep a Changelog](https://keepachangelog.com/) - The inspiration for our format
- [Semantic Versioning](https://semver.org/) - Version numbering conventions we follow
- [GitHub Release Notes Generator](https://github.com/release-drafter/release-drafter) - Tool for automating release notes

By consistently following these instructions, the ChainReaction changelog will provide valuable documentation of the project's history and make it easier for users and developers to understand changes between versions.
