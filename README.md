Install Guide
===

Virtualenv
===

```sh
pip install virtualenvwrapper
```

After you have installed it, add the following lines to your shell's start-up file (.zshrc, .bashrc, .profile, etc).
I added them to `~/.bash_profile`, remember you have to reload the startup file `source ~/.bash_profile`

```sh
export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/directory-you-do-development-in
source /usr/local/bin/virtualenvwrapper.sh
```
to create a new virtualenv:
```sh
mkvirtualenv django_project
```
And to activate/deactivate the virtualenv use `workon django_project` and `deactivate`.


Requirements and Dependencies
===
We define 4 enviroments, each has its own requirement file.
- local: local development
- staging:
- production:
- test and ci: we might need to add specific requirements file for test and continuous integration server(django-jenkins).

Requirments are in the requirements/'environment_name'.txt file. To update the requirements file:
```sh
pip freeze > requirements/'environment_name'.txt
```

Install Dependencies
---
Depending on where you are installing dependencies:

In development:
```sh
pip install -r requirements/local.txt
```
For production:
```sh
pip install -r requirements/production.txt
```
*note: many Platforms as a Services expect a requirements.txt file in the root of projects, in this case we will have to adjust requirements config*