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
- Add ci-test to scripts: `ng test --watch false --browsers=ChromeHeadless`
- Use husky to use prettier / lint / ci-test as a pre commit hook

Replace protractor with Cypress

- `ng add @briebug/cypress-schematic --addCypressTestScripts`
- Change the scripts: `cy:open` to `npx cypress open` and `cy:run` to `npx cypress run --browser chrome`
- Set up `cypress.json` in the root folder
- Add cypress screenshots and videos to `.gitignore`
- Uncomment the import of commands in the support folder
- `npm i -D start-server-and-test`
- Add ci-e2e to scripts" `start-server-and-test start http-get://localhost:4200 cy:run`
- Add ci-e2e to pre commit hook
- Add `.prettierrc` to accept singleQuotes
