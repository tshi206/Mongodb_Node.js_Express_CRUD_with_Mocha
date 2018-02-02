window.onload = () => {

    // Generator can be defined anonymously simply as 'function* (...){...}'
    // however afaik the arrow syntax is NOT allowed in defining anonymous generators
    function* myGen() {

        let mario = yield $.get('/chars/Mario');
        console.log(mario);
        let luigi = yield $.get('/chars/Luigi');
        console.log(luigi);
        let peach = yield $.get('/chars/Peach');
        console.log(peach);

    }

    // Libraries such as Q and Bluebird provide many built-in generator wrappers.
    // Instead of making your own wrapper, check those libraries out for higher
    // abstractions.
    function genWrap(someGen){

        // someGen() causes the generator to turn into ready state.
        // This is different from ordinary function invocation
        // as the execution flow of generators are 'pausible' due to yielding
        let gen = someGen();
        
        function handle(yielded) {
            if (!yielded.done) {
                yielded.value.then(data => {
                    return handle(gen.next(data))
                })
            }
        }

        return handle(gen.next())

    }

    // fire the genWrap
    genWrap(myGen)

};