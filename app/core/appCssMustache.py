import requests


def read_mustache(file):
  r = requests.get(file, allow_redirects=True)
  return r.content

css=read_mustache("https://s3.amazonaws.com/storage.xspaceapp.com/css/appCss.mustache")
