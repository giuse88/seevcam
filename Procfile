web: cd gunicorn --pid=../tmp/gunicorn.pid -b :8000 seeVcam.wsgi -w 2 --log-level debug --log-file=../log/django.log -n seevcam
nginx: sudo nginx -c $PWD/config/nginx/nginx.conf -p $PWD
