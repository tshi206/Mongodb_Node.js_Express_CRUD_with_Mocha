window.onload = function () {

    // implement ajax requests using predefined Promises returned by Jquery methods
    $.get('/chars/Mario').then((data) => {
        console.log(data);
        return $.get('/chars/Luigi')
    }).then((data) => {
        console.log(data);
        return $.get('/chars/Peach')
    }).then(console.log).catch(err => {throw err})


    // below is a vanilla JS implementation using ES6 Promise
    /*
    function vanillaAjaxWithPromise(url) {
        return new Promise(function (resolve, reject) {
            let http = new XMLHttpRequest();
            // if true, make async request, otherwise make synchronous request
            http.open('GET', url, true);
            // http.onload listens to the successful response being delivered
            http.onload = function () {
                if (http.status === 200){
                    resolve(JSON.parse(http.response))
                }else {
                    reject(http.statusText)
                }
            };
            // http.onerror listens to any error returned by the request
            http.onerror = function () {
                reject(http.statusText)
            };
            http.send();
        });
    }

    vanillaAjaxWithPromise('/chars/Mario')
        .then(console.log)
        .then(() => {return vanillaAjaxWithPromise('/chars/Luigi')})
        .then(console.log)
        .then(() => {return vanillaAjaxWithPromise('/chars/Peach')})
        .then(console.log)
        .catch(err => {throw err})
    */
};