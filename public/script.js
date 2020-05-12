logout = function(){
    fetch("/logout").then(() => {
        window.location.reload()
    })
}