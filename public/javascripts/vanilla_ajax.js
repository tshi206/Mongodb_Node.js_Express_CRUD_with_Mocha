window.onload = function () {

    /* Ready States

    0 - request not initialized
    1 - request has been set up
    2 - request has been sent
    3 - request is in process
    4 - request is complete (response received)

     */

    let http = new XMLHttpRequest();

    http.onreadystatechange = function () {
        // readyState === 4 meaning the response has been delivered
        if (http.readyState === 4 && http.status === 200) {
            //console.log(JSON.parse(http.response))
        }
    };
    // if true, make async request, otherwise make synchronous request
    http.open('GET', "/chars/Mario", true);
    http.send();

    /*
    The following implements the same async request using Jquery.
    Jquery's implementation provides a much higher abstraction over vanilla JS.
     */
    $.get('/chars/Mario', function (data) {
        console.log(data);
    });
    console.log('This is an async call hence non-blocking')

};