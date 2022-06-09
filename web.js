fetch("/imgs")
    .then(response => response.json())
    .then(data => {
        let filelist = data.filelist.sort();
        console.log(filelist[0]);
        document.querySelector("#latest-img").src = `/imgs/${filelist[0]}`;
        let formattedDateTime = filelist[0].substring(0, filelist[0].indexOf("t")-1) + " " + filelist[0].substring(filelist[0].indexOf("t")+1).replaceAll(/-/ig, ":").replace('.png', '');
        document.querySelector("#latest-img-timestamp").innerHTML = formattedDateTime;
    })

const grabnewshot = () => {
    document.querySelector(".lds-dual-ring").style.visibility = "visible";
    fetch("/takeAPic")
    .then(response => response.json())
    .then(data => {
        console.log(data.file);
        document.querySelector(".lds-dual-ring").style.visibility = "hidden";
        document.querySelector("#latest-img").src = `/imgs/${data.file}`;
        let formattedDateTime = data.file.substring(0, data.file.indexOf("t")-1) + " " + data.file.substring(data.file.indexOf("t")+1).replaceAll(/-/ig, ":").replace('.png', '');
        document.querySelector("#latest-img-timestamp").innerHTML = formattedDateTime;
    });
};