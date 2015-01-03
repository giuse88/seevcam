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
export VIRTUALENVWRAPPER_PYTHON='directory-python-executable-file' (e.g. /usr/local/bin/python2 )
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
Local, Staging, Production, (Test and CI, we might need to add specific requirements file for test and continuous integration server(django-jenkins)).

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

Install MySql
===
Easiest way to install Mysql is via Homebrew.
```sh
# install the binary
brew install mysql
```
After this it is necessary to install the Sql adapter. From [here][mysql_driver] the suggested way it is to install [mysqlclient][mysqlclient]
```sh
# install the binary
brew install mysqlclient
```
Once mysql and the mysql adapter are installed we need to run the mysql server, create a database and a user who can access it, to do so (note that the following command can be optimized, will update later):
```sh
#launch the server, this can be optimized to start with the machine
$ mysqld
[...]
2014-12-26 23:29:45 24641 [Note] mysqld: ready for connections.
Version: '5.6.21'  socket: '/tmp/mysql.sock'  port: 3306  Homebrew
```
then launch
```sh
$ mysql --user=root mysql
```
```SQL
mysql> CREATE DATABASE 'seevcamdb'
mysql> CREATE USER 'seevcam'@'localhost' IDENTIFIED BY 'seevcam';
mysql> GRANT ALL PRIVILEGES ON * . * TO 'seevcam'@'localhost';
```

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


Migrations
===

```sh
# create a new app
python manage.py startapp 'yourappname'

# to create the intial or after a change to a model
python manage.py makemigrations [yourappname]

# migration for the app
python manage.py migrate [yourappname]
```
For data migration or custom migrations we can create an empty migration to edit

```sh
python manage.py makemigrations --empty yourappname
```

##Deployment (with [shipit])

###key management
Every team member who needs to deploy from his local machine must have an rsa key, this key needs to make it to the remote server and be added to its own line of the deploy user's `~/.ssh/authorized_keys` file so that the local user can ssh as deployment user and launch commands.

```sh
# create a key if you don't have one already
me@localhost $ ssh-keygen -t rsa -C 'me@my_email_address.com'

# check if your key is loaded in the ssh agent
me@localhost $ ssh-add -l

# if no key loaded, load it (passphrase might be asked when you add a key)
me@localhost $ ssh-add

# to echo the content of the key
me@localhost $ ssh-add -L
```
Now we have to login as root into the remote server, create the deployment user
```sh
# create Deployment user on the server:
adduser seevcam
# add your local key to the deployment user authorized_keys
root@remote $ mkdir /home/seevcam/.ssh
root@remote $ cat my_local_key.pub >> /home/seevcam/.ssh/authorized_keys
root@remote $ chown -R seevcam:seevcam /home/seevcam/.ssh
root@remote $ chmod 700 /home/seevcam/.ssh
root@remote $ chmod 600 /home/seevcam/.ssh/authorized_keys
```
Now you can ssh as deployment user into the remote server and create che destination folder for the deployment. The remote server is now configured.

###Shipit

```sh
# First of all we need Grunt and Shipit
npm install --save-dev grunt grunt-shipit
```

Utilities
===
When porting from python 2.x to python 3.x I got the error:
` ImportError: bad magic number in [...]`, the reason is that the magic number comes from UNIX-type systems where the first few bytes of a file held a marker indicating the file type. Python puts a similar marker into its pyc files when it creates them
The quick solution is to remove all the .pyc files in the folder structure and let the new interpreter create the correct compiled versions. You can run the following command, you can run it without the ` -delete` option first to get the list.
```sh 
find . -name "*.bak" -type f -delete
```

[1]:https://gist.github.com/panuta/1852087
[postgres_recipe]:http://braumeister.org/formula/postgresql
[Migration issues]:http://stackoverflow.com/questions/14645675/cant-perform-data-migrations-using-django-1-5-custom-user-class
[mysql_driver]:https://docs.djangoproject.com/en/1.7/ref/databases/#mysql-db-api-drivers
[mysqlclient]:https://pypi.python.org/pypi/mysqlclient
[shipit]:http://www.therightcode.net/deploy-nodejs-application-using-shipit/