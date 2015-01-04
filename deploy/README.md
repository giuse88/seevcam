## Deploy Tasks
####deploy/global
This tasks are global tasks not necessary linked to a shipit event that can be launch manually.
- setup:  Creates empty virtualenv and activates it.
- will add more.

####deploy/tasks
- npm_install: Install npm packages.
- bower_install: Install bower packages.
- env_update: Install environment dependencies from requirements file.
- minify: Run grunt for less and requirejs tasks.

## Workflow tasks
- ####deploy
  - deploy:init
    - Emit event "deploy".
  - deploy:fetch
    - Create workspace.
    - Initialize repository.
    - Add remote.
    - Fetch repository.
    - Checkout commit-ish.
    - Merge remote branch in local branch.
    - Emit event "fetched".
  - deploy:update
    - Create and define release path.
    - Remote copy project.
    - Emit event "updated".
  - deploy:publish
    - Update symlink.
    - Emit event "published".
        - #####npm_install
        - #####bower_install
        - #####minify
        - #####env_update
  - deploy:clean
    - Remove old releases.
    - Emit event "cleaned".

- ####rollback
  - rollback:init
    - Define release path.
    - Emit event "rollback".
  - deploy:publish
    - Update symlink.
    - Emit event "published".
  - deploy:clean
    - Remove old releases.
    - Emit event "cleaned".