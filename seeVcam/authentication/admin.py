from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from demo.create_demo import create_demo

from .models import SeevcamUser


def message_user_format(rows_updated, action):
    if rows_updated == 1:
        message_bit = "1 user was"
    else:
        message_bit = "%s user were" % rows_updated
    return "{0} successfully {1}".format(message_bit, action)


class UserCreationForm(forms.ModelForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = SeevcamUser

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def clean_email(self):
        email = self.cleaned_data['email']
        if SeevcamUser.objects.filter(email=email).count() != 0:
            raise forms.ValidationError("User %s already exist" % email)
        return email

    def save(self, commit=True):
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    password = ReadOnlyPasswordHashField(label="Password",
                                         help_text=("Raw passwords are not stored, so there is no way to see "
                                                    "this user's password, but you can change the password "
                                                    "using <a href=\"password/\">this form</a>."))

    class Meta:
        model = SeevcamUser

    def clean_password(self):
        return self.initial["password"]


class SeevcamUserAdmin(UserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm

    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'country', 'company', 'timezone')
    list_filter = ('is_staff', 'company')

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'country', 'company', 'timezone')
        }),
        ('Permissions', {
            'fields': ('is_staff', 'is_active')
        }),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')
        }),
        ('Personal info', {
            'fields': ('first_name', 'last_name', 'country', 'company', 'timezone')
        }),
        ('Permissions', {
            'fields': ('is_staff', 'is_active')
        }),
    )
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    filter_horizontal = ()

    actions = ["delete_selected", "make_inactive", "make_active", "make_demo"]

    def delete_selected(self, request, queryset):
        user_deleted = 0
        for obj in queryset:
            obj.delete()
            user_deleted += 1
        self.message_user(request, message_user_format(user_deleted, "deleted"))
    delete_selected.short_description = "Delete selected users"

    def make_active(self, request, queryset):
        rows_updated = queryset.update(is_active=True)
        self.message_user(request, message_user_format(rows_updated, "activated"))
    make_active.short_description = "Activate selected users"

    def make_inactive(self, request, queryset):
        rows_updated = queryset.update(is_active=False)
        self.message_user(request, message_user_format(rows_updated, "deactivated"))
    make_inactive.short_description = "Deactivate selected users"

    def make_demo(self, request, queryset):
        user_updated = 0
        for user in queryset:
            create_demo(user)
            user_updated += 1
        self.message_user(request, message_user_format(user_updated, "populated"))
    make_demo.short_description = "Create demo for selected users"


admin.site.register(SeevcamUser, SeevcamUserAdmin)
admin.site.unregister(Group)
