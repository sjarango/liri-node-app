require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var moment = require('moment');
moment().format();

var command = process.argv[2];
var value = process.argv[3];

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
inputConcat();

var axios = require("axios");

switch (command) {
    case "help":
        help();
        break;
    case "concert-this":
        if (process.argv[3] == null) {
            console.log("\nPlease follow correct format ->> concert-this <artist/band name here>");
            break;
        } else {
            concert(value);
            break;
        }
    case "spotify-this-song":
        if (process.argv[3] == null) {
            songSearch("The Sign");
            break;
        } else {
            songSearch(value);
            break;
        }
    case "movie-this":
        if (process.argv[3] == null) {
            omdb("Mr. Nobody");
        } else {
            omdb(value);
        }
        break;
    default:
        console.log("Hello?");
}

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