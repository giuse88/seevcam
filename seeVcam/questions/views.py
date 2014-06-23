from django.shortcuts import render

# Create your views here.
def quest_list(request):
    template = 'questions/quest_list.html'
    context = {}
    return render(request, template, context)