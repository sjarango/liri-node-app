require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var moment = require('moment');
moment().format();

const fs = require('fs');
const axios = require("axios");

var command = process.argv[2];
var value = process.argv[3];

// function to show how application works
function help() {
    console.group('\nHelp Menu:');
    console.log('To run program correctly please type "node liri.js" to run the program then the correct commands.');
    console.log('The commands are as follows: ');
    console.log('   concert-this        <artist/band name here>');
    console.log('   spotify-this-song   <song name here>');
    console.log('   movie-this          <movie name here>');
    console.log('   do-what-it-says');
    console.groupEnd();
}

// concats user input after argv[2] command agrument into one string to be read/used for inputting into API's
function inputConcat() {
    if (process.argv.length > 3) {
        for (var i = 3; i < process.argv.length; i++) {
            if (process.argv[i + 1] != null) {
                value = value.concat(" ");
                value = value.concat(process.argv[i + 1]);
            }
        }
    }
}

// executes functions
inputConcat();
userInputs(command, value);

// main function, using user's input to run specific API/Operation 
function userInputs(userOption, inputParameter){
    switch (userOption) {
        case "help":
            help();
            break;
        case "concert-this":
            if (inputParameter == null) {
                console.log("\nPlease follow correct format ->> concert-this <artist/band name here>");
                break;
            } else {
                concert(inputParameter);
                break;
            }
        case "spotify-this-song":
            if (inputParameter == null) {
                songSearch("The Sign");
                break;
            } else {
                songSearch(inputParameter);
                break;
            }
        case "movie-this":
            if (inputParameter == null) {
                omdb("Mr. Nobody");
                break;
            } else {
                omdb(inputParameter);
                break;
            }
        case "do-what-it-says":
            whatItSays();
            break;
        default:
            console.log("Hello?");
    }
}

// function for concert info: Bands in Town
function concert(input) {
    axios.get("https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp").then(
        function (response) {

            for (var i = 0; i < response.data.length; i++) {
                console.log("\nName of Venue: " + response.data[i].venue.name);
                if (response.data[i].venue.region === "") {
                    console.log("Venue Location: " + response.data[i].venue.city);
                } else {
                    console.log("Venue Location: " + response.data[i].venue.city + ", " + response.data[i].venue.region);
                }
                var date = response.data[i].datetime;
                var time = moment(date).format("MM/DD/YYYY");
                console.log("Date of the event: " + time);
            }
        }
    );
}

// function for song search: Spotify
function songSearch(input) {
    //console.log(input);
    spotify.search(
        {
            type: 'track',
            query: input
        },
        function(err, data) {
            if(err){
                return console.log('Error occurred ' + err);
            }
            //console.log(data);
            var songs = data.tracks.items;

            for(var i = 0; i < songs.length; i++){
                console.log(i);
                console.log("Song name: " + songs[i].name);
                console.log("Preview song: " + songs[i].preview_url);
                console.log("Album: " + songs[i].album.name);
                if (songs[i].artists.length > 1){
                    let artists = "Artist(s): ";
                    for(var n = 0; n < songs[i].artists.length; n++){
                        artists = artists.concat(songs[i].artists[n].name);
                        if(songs[i].artists[n+1] != null){
                            artists = artists.concat(", ");
                        }
                    }
                    console.log(artists);
                } else{
                    console.log("Artist(s): " + songs[i].artists[0].name);
                }
                
            }
        });
}

// function for movie search: OMDB
function omdb(input) {
    axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log('\n   Title: ' + response.data.Title);
            console.log('   Year: ' + response.data.Year);
            console.log('   IMDB Rating: ' + response.data.imdbRating);
            console.log('   Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value);
            console.log('   Produced: ' + response.data.Country);
            console.log('   Language: ' + response.data.Language);
            console.log('   Plot: ' + response.data.Plot);
            console.log('   Actors: ' + response.data.Actors);
        }
    );
}

// function to read out of random.txt file
function whatItSays(){
    fs.readFile("random.txt", "utf8", function(err, data){
        if(err){
            return console.log(err);
        } else {
            var dataArray = data.split(",");
            userInputs(dataArray[0], dataArray[1]);
        }
    });
}