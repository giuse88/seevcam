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
export PROJECT_HOME=$HOME/'directory-you-do-development-in'
source /usr/local/bin/virtualenvwrapper.sh
```
to create a new virtualenv:
```sh
mkvirtualenv django_project
```
And to activate/deactivate the virtualenv use `workon django_project` and `deactivate`.

Virtualenvs are saved on Mac into `/Users/[user_name]/.virtualenvs/[env_name]/`, check it with `echo $VIRTUAL_ENV/$` inside the virtualenv.


Requirements and Dependencies
===

Environments
---
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

Settings
---
```sh
# Run the shell with the settings/'environment.py' configuration
python manage.py shell --settings=seeVcam.settings.[environment]
```

```sh
# Run the server with the settings/'environment.py' configuration
python manage.py runserver --settings=seeVcam.settings.[environment]
```
If you wish to avoid using the --settings in EVERY command:
```sh
# reach the virtualenv
cd `/Users/[user_name]/.virtualenvs/[env_name]/`

# access the activate file
vi bin/activate

# add the following
DJANGO_SETTINGS_MODULE="seeVcam.settings.local"
export DJANGO_SETTINGS_MODULE
```
when you run the server you should see something like the following:

```sh
$ ./manage.py runserver 8080
Validating models...

0 errors found
June 21, 2014 - 11:23:39
Django version 1.6.5, using settings 'seeVcam.settings.local'
Starting development server at http://127.0.0.1:8080/
Quit the server with CONTROL-C.
```
*Note that "seeVcam.settings.local" has to be modified to match the correct environment.*

Install PostgreSQL
===
Guide to setup PostgreSQL for Mac can be found [here][1]
First you need to install PostgreSQL. easiest way via Homebrew, (more information about the formula [here][postgres_recipe]).

```sh
# install the binary
brew install postgresql
```

Then it is necessary to install `psycopg2` which is the PostgreSQL adapter for the Python as follows, or use the requirements installation.

```sh
# install the adapter
pip install psycopg2
```

```sh
# init it
initdb /usr/local/var/postgres

# Start Postgresql Server manually
pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start

# create your database
createdb seeVcamDb

# Stop Postgresql Server manually
pg_ctl -D /usr/local/var/postgres stop -s -m fast
```

```sh
# to access the database console.
psql seeVcamDb
```
*NOTE: This configuration shouldn't require username and password for the database becayse in [the mentioned link][1] we assign rights to the db as for the user in the system.*



[1]:https://gist.github.com/panuta/1852087
[postgres_recipe]:http://braumeister.org/formula/postgresql
[Migration issues]:http://stackoverflow.com/questions/14645675/cant-perform-data-migrations-using-django-1-5-custom-user-class