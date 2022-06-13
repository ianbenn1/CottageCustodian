fetch("/imgs")
    .then(response => response.json())
    .then(data => {
        let filelist = data.filelist.reverse();
        console.log(filelist[0]);
        document.querySelector("#latest-img").src = `/imgs/${filelist[0]}`;
        let formattedDateTime = filelist[0].substring(0, filelist[0].indexOf("t")-1) + " " + filelist[0].substring(filelist[0].indexOf("t")+1).replaceAll(/-/ig, ":").replace('.png', '');
        document.querySelector("#latest-img-timestamp").innerHTML = formattedDateTime;
    });

fetch("/runSetup")
    .then(response => response.json())
    .then(data => {
        for (let i = 0; i < data.count; i++)
        {
            document.querySelector('#cameraSelector').innerHTML += `<option value="${i}">Camera ${i+1}</option>`;
        }
        document.querySelector('#cameraSelector').dataset.totalcameras = data.count;
    });

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

const runSetup = () => {
    fetch("/runSetup")
    .then(response => response.json())
    .then(data => {
        alert(`Detected ${data.count} camera${data.count > 1 ? 's' : ''}`)
        //TODO: Do something with camera data
    });
};

const changeView = (event) => {
//multicam-view
    if(event.target.dataset.currentview == 'single') 
    {
        document.querySelector('#latest-img').style.visibility = 'hidden';
        let camcount = document.querySelector('#cameraSelector').dataset.totalcameras;
        console.log(Math.ceil(Math.sqrt(camcount)));
        for(let i = 0; i < Math.round(Math.sqrt(camcount)); i++)
        {
            document.querySelector('#multicam-view').innerHTML += `<div id="multicam-inner${i}" style="display: flex;" ></div>`;
            for(let j = 0; j < Math.ceil(Math.sqrt(camcount)); j++)
            {
                document.querySelector(`#multicam-inner${i}`).innerHTML += `<div data-num="${i}-${j}" style="border: 1px solid red; height: 150px; width: 150px"></div>`
            }
            
        }
        document.querySelector('#view-switch').innerHTML = "View single";
        event.target.dataset.currentview = 'multi';
    }
    else {
        document.querySelector('#latest-img').style.visibility = 'visible';
        document.querySelector('#view-switch').innerHTML = "View all";
        document.querySelector('#multicam-view').innerHTML = "";
        event.target.dataset.currentview = 'single';
    }
};