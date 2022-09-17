from threading import current_thread
_requests = {}


class RequestMiddleware(object):
    def process_request(self, request):
        _requests[current_thread()] = request


def get_user():
    chk = current_thread()
    if chk not in _requests:
         return chk
    return _requests[chk]
    # return str(request.user)
