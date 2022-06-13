const express = require('express');    //Express Web Server 
const fs = require('fs-extra');       //File System - for file manipulation
const path = require('path');     //used for file path
const { exec } = require('child_process');

var app = express();
app.use(express.static(path.join(__dirname, 'file_store')));

let filelist = [];
let numCameras = 0; //Count, not port numbers. [ports start at 0]

fs.readdir(__dirname, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
        if(file.includes(".png"))
        {
            filelist.push(file);
            //console.log(file);
        }
    }
});

const cameraSetup = () => {
    exec("cameraSetup.py", (error, stdout, stderr) => {
        //console.log(`cSetp error: ${error}  stdout: ${stdout}   stderr: ${stderr}`);
        if(!error)
        {
            let cameraSetupResponse = undefined;
            try {
                cameraSetupResponse = JSON.parse(stdout);
            } catch (err) {
                console.log(err);
            }
            if(cameraSetupResponse.status == 'success')
            {
                console.log(`Camera setup complete. detected # cameras: ${cameraSetupResponse.cameras}`);
                numCameras = cameraSetupResponse.cameras;
            }
            
        }
        else {
            console.log(error);
        }
    });
}// TODO: Make api call to get revised number of cameras attached [hotplug support]

//Call camera setup on startup
cameraSetup();

app.get('/', (req,res) => {
    res.sendFile(__dirname+"/index.html")
});

app.get('/web.js', (req,res) => {
    res.sendFile(__dirname+"/web.js")
});

app.get('/imgs', (req, res) => {
    res.send({
        filelist
    });
});

app.get('/takeAPic', (req, res) => {

    console.log("Ping");
    exec("cameraInterface.py", (error, stdout, stderr) => {
        //console.log(`error: ${error}  stdout: ${stdout}   stderr: ${stderr}`);

        if(!error)
        {
            let cameraInterfaceResponse = undefined;
            try {
                cameraInterfaceResponse = JSON.parse(stdout);
            } catch (err) {
                console.log(err);
            }
            if(cameraInterfaceResponse.status == 'success')
            {
                console.log(`Camera interface execution complete. New photo name: ${cameraInterfaceResponse.fileName}`);
                filelist.push(cameraInterfaceResponse.fileName);
                res.send({
                    file: cameraInterfaceResponse.fileName
                });
            }
        }
        else {
            console.log(error)
        }
    });
});

app.get('/runSetup', (req, res) => {
    cameraSetup();//TODO: exec is async, make this actually work
    res.send({
        count: numCameras
    });
});

app.get('/imgs/*', (req, res) => {
    console.log(filelist);
    console.log(req.url.replace("/imgs/", ""));
    console.log(filelist.includes(req.url.replace("/imgs/", "")));
    if(filelist.includes(req.url.replace("/imgs/", "")))
    {
        res.sendFile(__dirname + "\\" + req.url.replace("/imgs/", ""));
    }
    else {
        res.status(403).send("<h1>403</h1><br />Only existing .png files will be sent in response to this query.");
    }
    
});


  var server = app.listen(8035, () => {
    console.log('Listening on port %d', server.address().port);

});