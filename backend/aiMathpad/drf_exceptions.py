from rest_framework.views import exception_handler
import json

def custom_exception_handler(exc, context):
    # Call the default exception handler first,
    # to get the standard error response
    response = exception_handler(exc, context)
    print('drf-exception : ',exc)
    if response is not None:
        # print(response, response.data)
        # Customize the error message here
        response.data['detail'] = json.dumps({
            k:[str(vi) for vi in v] for k,v in response.data.items()
        })
        print(response.data['detail'])

    return response
