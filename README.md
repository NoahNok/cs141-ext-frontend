# CS141 Coursework 1 - Extension
This is the front end for my extension, this is publicly accessible [here](https://lac-solver.noahdhollowell.co.uk/)

This is just some simple HTML, CSS & JS to provide a cheap and cheerful interface to use.

It is a mess on mobile so I wouldn't attempt it :)

## Running
To run it you just need to sit it on any webserver that can serve static content,
You can also just load it directly by clicking on the HTML file

## Server Request URL
Since we are making a request cross site we have a CORS issue.
Spock doesn't always apply the cors header for some reason. In this case its using the backend hosted on my server, however if you have the local server code you can modify the **code.js** file to change the url to a local one