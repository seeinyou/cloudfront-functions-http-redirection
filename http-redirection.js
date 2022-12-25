/**
 * The CloudFront cloud for redirection
 * 
 * It redirects URL like www.example.com/api/v1/* to api.example.com/api/v1/*
 * 
 * NOTE: This example function is for a viewer request event trigger. 
 * Choose viewer request for event trigger when you associate this function with a distribution. 
 * 
 */
function handler(event) {
    var protocol  = 'https://'
    var newDomain = 'new.example.com';  // Please use your new domain
    var regRule   = '^\/api\/v1\/'; // Please use your matching rule
    
    var request = event.request;
    var orgUri  = event.request.uri;
    var orgHeaders = event.request.headers; // Keep original headers

    var httpStatusCode = 307;   // New response HTTP CODE
    
    var regex = new RegExp(regRule); // HTTP Path matching rule
    var regexResult = regex.test(orgUri);
    
    if (regexResult) {  //Redirect the request when matches
        var newLocation = protocol + newDomain + orgUri;

        if (Object.keys(request.querystring).length > 0) {   // Formats parameters
            var queryStr = Object.keys(request.querystring).map(key => key + '=' + request.querystring[key]['value']).join('&');
            newLocation += '?' + queryStr;  //Appends to newLocation
        }

        // Add CloudFront function headers
        var newHeaders = {
            'cloudfront-functions': { value: 'generated-by-CloudFront-Functions' },
            'location': { value: newLocation }
        }

        var response = {
            statusCode: httpStatusCode,
            statusDescription: 'Temporary Redirect',
            headers: newHeaders
        };

        return response;    // Return the response object when redirection required.
    }

    return request; // Return the original event.request object for normal process.
}