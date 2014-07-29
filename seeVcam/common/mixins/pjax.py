import os

from django.views.generic.base import TemplateResponseMixin


class PJAXResponseMixin(TemplateResponseMixin):
    pjax_template_name = None
    pjax_suffix = "pjax"
    pjax_url = True

    def get_template_names(self):
        names = super(PJAXResponseMixin, self).get_template_names()
        if self.request.META.get('HTTP_X_PJAX', False):
            if self.pjax_template_name:
                names = [self.pjax_template_name]
            else:
                names = self._pjaxify_template_var(names)
        return names

    def get(self, request, *args, **kwargs):
        response = super(PJAXResponseMixin, self).get(request, *args, **kwargs)
        if self.pjax_url :
            response['X-PJAX-URL'] = self.request.path
        return response

    def _pjaxify_template_var(self, template_var):
        if isinstance(template_var, (list, tuple)):
            template_var = type(template_var)(self._pjaxify_template_name(name) for name in template_var)
        elif isinstance(template_var, basestring):
            template_var = self._pjaxify_template_name(template_var)
        return template_var

    def _pjaxify_template_name(self, name):
        container = self.request.META.get('HTTP_X_PJAX_CONTAINER', False)
        if container is not False:
            name = _add_suffix(name, clean_container_name(container))
        return _add_suffix(name, self.pjax_suffix)


#################################################
#               HELPER METHODS                  #
#################################################


def clean_container_name(name):
    return name.replace('#', '')


def _add_suffix(name, suffix):
    if "." in name:
        file_name, file_extension = os.path.splitext(name)
        name = "{0}-{1}{2}".format(file_name, suffix, file_extension)
    else:
        name += "-{0}".fomat(suffix)
    return name