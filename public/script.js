logout = function(){
    fetch("/logout").then(() => {
        window.location.reload()
    })
}

disableHours = function(day){
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

buildServiceCards = function(services) {
    var serviceContainer = document.getElementById("serviceListContainer");

    serviceItems = JSON.parse(services).items;
    serviceItems.forEach((item)=> {
        var serviceItem = document.createElement("div");
        serviceItem.setAttribute("class", "service-item-container")

        var serviceItemTop = document.createElement("div");
        serviceItemTop.setAttribute("class", "service-item-part");
        
        var titleDiv = document.createElement("div");
        titleDiv.setAttribute("class", "service-item-title-block");
        
        var serviceName = document.createElement("p");
        serviceName.setAttribute("class", "service-item-title");
        serviceName.appendChild(document.createTextNode(item.name));
        
        var serviceNameChevron = document.createElement("i");
        serviceNameChevron.setAttribute("data-feather", "chevron-down");
        serviceNameChevron.setAttribute("class", "service-item-arrow-down");
        serviceNameChevron.setAttribute("id", item.id+"-chevron");

        titleDiv.appendChild(serviceName);
        titleDiv.appendChild(serviceNameChevron);

        var trashContainer = document.createElement("button");
        trashContainer.setAttribute("class", "trashButton");
        trashContainer.addEventListener("click", function() {
            deleteService(item.id);
        })

        var trashIcon = document.createElement("i");
        trashIcon.setAttribute("class", "trashIcon");
        trashIcon.setAttribute("data-feather", "trash-2");

        trashContainer.appendChild(trashIcon);

        var serviceItemBottom = document.createElement("div");
        serviceItemBottom.setAttribute("id", item.id);
        serviceItemBottom.setAttribute("name", item.name);
        serviceItemBottom.setAttribute("class", "service-item-hidden");
        titleDiv.addEventListener("click", function() {
            toggleService(item.id);
        })

        var serviceAddress = document.createElement("p");
        serviceAddress.setAttribute("class", "service-item-content")
        var addressText = document.createTextNode(item.address.number+" "+item.address.street+", "+item.address.zip+" "+item.address.city);
        serviceAddress.appendChild(addressText);

        // var serviceHoursContainer = document.createElement("div");
        // serviceHoursContainer.setAttribute("class", "service-item-part");
        // var serviceHours = generateHours(item.hours)

        // serviceHoursContainer.appendChild(serviceHours);

        serviceItemBottom.appendChild(serviceAddress);
        serviceItemTop.appendChild(titleDiv);
        serviceItemTop.appendChild(trashContainer);

        serviceItem.appendChild(serviceItemTop);
        serviceItem.appendChild(serviceItemBottom);

        serviceContainer.appendChild(serviceItem);
    })
}

toggleService = function(serviceID) {
    var element = document.getElementById(serviceID);
    var elementChevron = document.getElementById(serviceID+"-chevron");

    let className = element.getAttribute("class");
    if(className === "service-item-show") {
        element.classList.remove("service-item-show");
        element.classList.add("service-item-hidden");
        elementChevron.classList.remove("service-item-arrow-up");
        elementChevron.classList.add("service-item-arrow-down");
    }
    else if(className === "service-item-hidden") {
        element.classList.remove("service-item-hidden");
        element.classList.add("service-item-show");
        elementChevron.classList.remove("service-item-arrow-down");
        elementChevron.classList.add("service-item-arrow-up");
    }
}

deleteService = function(serviceID) {
    console.log("DELETINNGGG...")
    let urlToDelete = "/delete/" + serviceID
    fetch(urlToDelete, {
        method: "DELETE"
    })
    .then(response => response.json())
    .then((response) => {
        if(response.status == 200) {
            window.location.reload()
        }
        else {
            alert("Erreur : Impossible de supprimer");
        }
    })
    .catch((error) => {
        console.log(error);
    })
}

toggleRotateChevron = function(element) {
    console.log("Toggle Rotate :", element)
    if(element.className === "service-item-arrow-down") {
        element.classList.remove("service-item-arrow-down")
        element.classList.add("service-item-arrow-up");
    }
    else {
        element.classList.remove("service-item-arrow-up")
        element.classList.add("service-item-arrow-down");
    }
}

// generateHours = (hours) => {
//     var entries = Object.entries(hours.hours)
//     entries.map((entry) => {
//         // console.log("Entries", entry)
//         var itemDay = entry[0]
//         var item = entry[1];
//         if(item.isClosed) {
//             console.log("Closed on " + itemDay);
//         } else {
//             console.log(itemDay + " from " + item.value[0] + " to " + item.value[1]);
//         }
//     })
// }