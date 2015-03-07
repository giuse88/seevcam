from demo.create_interviews import create_interviews


def create_demo(user):
    user.delete_uploaded_files()
    create_interviews(user)

