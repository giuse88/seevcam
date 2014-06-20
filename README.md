Install Guide
===

Virtualenv
---

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


