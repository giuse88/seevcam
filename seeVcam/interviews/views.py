from django.shortcuts import render

# Create your views here.

def int_list(request):
    template = 'interviews/int_list.html'
    context = {}
    return render(request, template, context)