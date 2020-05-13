logout = function(){
    fetch("/logout").then(() => {
        window.location.reload()
    })
}

disableHours = function(day){

    console.log("Trying !")
    var openHours = document.querySelector('input[id^='+day+'_open');
    var closeHours = document.querySelector('input[id^='+day+'_close');
    var openHoursDisabled = openHours.getAttribute("disabled") == 'true' ? true : false;

    if(openHoursDisabled == true) {
        openHours.removeAttribute("disabled");
        openHours.setAttribute("required", true);
        closeHours.removeAttribute("disabled");
        closeHours.setAttribute("required", true);
    }
    else {
        openHours.removeAttribute("required");
        openHours.setAttribute("disabled", true);
        closeHours.removeAttribute("required");
        closeHours.setAttribute("disabled", true);
    }
}