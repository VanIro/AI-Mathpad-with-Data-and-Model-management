from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # Call the default exception handler first,
    # to get the standard error response
    response = exception_handler(exc, context)
    print('drf-exception : ',response)
    if response is not None:
        # Customize the error message here
        response.data['detail'] = str(exc)

    return response
