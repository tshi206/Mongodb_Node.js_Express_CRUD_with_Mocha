window.onload = function () {

    $.ajax({
        type : 'GET',
        url : '/chars/Mario',
        success: function (data) {
            console.log(data);

            $.ajax({
                type : 'GET',
                url : '/chars/Luigi',
                success: function (data) {
                    console.log(data);

                    $.ajax({
                        type : 'GET',
                        url : '/chars/Peach',
                        success: function (data) {
                            console.log(data)
                        },
                        error: function (jqXHR, textStatus, error) {
                            console.log(error)
                        }
                    })

                },
                error: function (jqXHR, textStatus, error) {
                    console.log(error)
                }
            })

        },
        error: function (jqXHR, textStatus, error) {
            console.log(error)
        }
    })

};