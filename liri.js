// require("dotenv").config();

// var keys = require("./keys.js");
// var spotify = new Spotify(keys.spotify);

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

function inputConcat(){
    if (process.argv.length > 3){
        for(var i=3; i<process.argv.length; i++){
            if (process.argv[i+1] != null){
                value = value.concat(" ");
                value = value.concat(process.argv[i+1]);
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
    case "movie-this":
        if (process.argv[3] == null){
            omdb("Mr. Nobody");
        } else {
            omdb(value);
        }
        break;
    default:
        console.log("Hello?");
}

function omdb(input) {
    axios.get("http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy").then(
        function (response) {
            console.log('\n   Title: ' + response.data.Title);
            console.log('   Year: ' + response.data.Year);
            console.log('   IMDB Rating: '+ response.data.imdbRating);
            console.log('   Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value);
            console.log('   Produced: ' + response.data.Country);
            console.log('   Language: ' + response.data.Language);
            console.log('   Plot: ' + response.data.Plot);
            console.log('   Actors: ' + response.data.Actors);
        }
    );
}