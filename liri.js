
//various requires
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var axios = require("axios");
var moment = require('moment');

//spotify keys
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

//node command placeholders
var command = process.argv[2];
var nodeArgs = process.argv;

//grabs user input for later use
var userSearch = "";

for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        userSearch = userSearch + "+" + nodeArgs[i];
    }

    else {
        userSearch += nodeArgs[i];
    }
};

//Indicates whether or not search parameters have been entered.

if (userSearch === "") {
    console.log("Hmm...")
}

else {
    console.log("You have searched for: " + userSearch);
};

//OMDB functionality
var grabOMDB = function () {

    var movie;

    if (userSearch === "") {
        movie = "Mr. Nobody"
        console.log("You didn't search for anything. How about this?")
    }

    else {
        movie = userSearch;
    }

    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryURL).then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value)
            console.log("RT Rating: " + response.data.Ratings[1].Value)
            console.log("Country of Origin: " + response.data.Country);
            console.log("Languages: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Featuring: " + response.data.Actors);
        }
    );
}

//bands in town functionality
var bandsInTown = function () {

    var queryURL = "https://rest.bandsintown.com/artists/" + userSearch + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(

        function (response) {

            if (response.data.length == 0) {
                console.log("There are no events.");
            }

            else {
                for (i = 0; i < response.data.length; i++) {
                    console.log("Venue Name: " + response.data[i].venue.name);
                    console.log("City: " + response.data[i].venue.city);
                    console.log("Date of Event " + moment(response.data[i].datetime).format("MM/DD/YYYY"));
                    console.log("-----------------");
                }
            }
        }
    );
}

//spotify functionality

var spotSearch = function () {

    var song = "";

    if (userSearch === "") {
        song = "The Sign Ace of Base"
        console.log("You didn't search for anything. How about this?")
    }

    else {
        song = userSearch;
    }

    spotify
        .search({ type: 'track', query: song })
        .then(function (response) {
            console.log("Song: " + response.tracks.items[0].name);
            console.log("Artist: " + response.tracks.items[0].artists[0].name);
            console.log("Album: " + response.tracks.items[0].album.name);
            console.log("Preview Link: " + response.tracks.items[0].preview_url);
        })
        .catch(function (err) {
            console.log("There has been an error. See below:");
            console.log(err);
        });

}

//fs functionality

var doIt = function () {

    fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
            return console.log(error);
        }

        console.log("Let's see what this text file says...")
        console.log(data);
        console.log("Got it. Here we go.")

        var dataArr = data.split(",");

        command = dataArr[0];
        userSearch = dataArr[1];

        runTheProgram();

    });

}

//grabs user command and runs program

var runTheProgram = function () {

    if (command == "movie-this") {
        grabOMDB();
    }
    else if (command == "concert-this") {
        bandsInTown();
    }

    else if (command == "spotify-this-song") {
        spotSearch();
    }

    else if (command == "do-what-it-says") {
        doIt();
    }
    else {
        console.log("hmm try again")
    }

}

runTheProgram();

