![](https://github.com/orthodoc/binder/workflows/CI/badge.svg?branch=dev)

\*\* Steps to reproduce

Basic

- `npm i -g @ionic/cli`
- `ionic start binder sidemenu --type=angular`
- `cd binder`
- Create a new project in github by name: binder
- `git remote add origin git@github.com:orthodoc/binder.git`
- `git push -u origin master`
- `git checkout -b dev`
- `git push -u origin dev`
- Github settings: Make dev branch the default branch. Set up rule to protect the master branch: Require status checks before merging, require signed commits and make sure rule applies to all admins as well.

Commitizen

- `npm i -D commitizen`
- `npx commitizen init cz-conventional-changelog --save-dev --save-exact`
- `npx git-cz`

Husky

- `npm i -D husky`
- Use husky to run git-cz as a pre commit git hook

Prettier

- `npm i -D prettier pretty-quick`

NPM run scripts

- `npm i -D npm-run-all`
- `angular.json`: Add ci configuration for test and add `{"progress": false, "watch": false}
- Add ci-test to scripts: `ng test --configuration=ci`
- Use husky to use prettier / lint / ci-test as a pre commit hook

Replace protractor with Cypress

- `ng add @briebug/cypress-schematic`
- Set up `cypress.json` in the root folder
- Add cypress screenshots and videos to `.gitignore`
- Uncomment the import of commands in the support folder (under cypress folder)
- `angular.json`: Add ci configuration for e2e and add `{"devServerTarget":"app:serve:ci", "headless":true, "watch: false}
- Add ci-e2e to scripts" `ng e2e --configuration=ci`
- Add ci-e2e to pre commit hook
- Add `.prettierrc` to accept singleQuotes

Github actions

- Set up the ci.yml file at `.github/workflows`
- Add `.github/workflows/*.yml` to `.prettierignore`

