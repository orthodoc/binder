** Steps to reproduce

* `npm i -g @ionic/cli`
* `ionic start binder sidemenu --type=angular`
* `cd binder`
* Create a new project in github by name: binder
* `git remote add origin git@github.com:orthodoc/binder.git`
* `git push -u origin master`
* `git checkout -b dev`
* `git push -u origin dev`
* Github settings: Make dev branch the default branch. Set up rule to protect the master branch: Require status checks before merging, require signed commits and make sure rule applies to all admins as well.
