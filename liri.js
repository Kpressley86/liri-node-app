// REQUIRE .env FILE //
require("dotenv").config();

// REQUIRES //
let request = require("request");
const moment = require('moment');
const fs = require("fs");
const keys = require("./keys.js");
const Spotify = require("node-spotify-api");


const spotify = new Spotify(keys.spotify);

// API'S //
let omdb = (keys.omdb);
let bandsintown = (keys.bandsintown);


// USER INPUT //
let userInput = process.argv[2];
let userQuery = process.argv.slice(3).join(" ");


// APP LOGIC
function userCommand(userInput, userQuery) {
    // make a decision based on the command
    switch (userInput) {
        case "concert-this":
            concertThis();
            break;
        case "spotify-this":
            spotifyThisSong();
            break;
        case "movie-this":
            movieThis();
            break;
        case "do-this":
            doThis(userQuery);
            break;
        default:
            console.log("Unable To Process Information!");
            break;
    }
}

userCommand(userInput, userQuery);

function concertThis() {
    console.log(`\n - - - - -\n\nSEARCHING ...${userQuery}'s next show...`);
    request("https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=" + bandsintown, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // JSON FORMAT //
            let userBand = JSON.parse(body);
            // PARSE DATA AND USE FOR LOOP TO ACCESS DATA PATH //
            if (userBand.length > 0) {
                for (i = 0; i < 1; i++) {

                    console.log(`\nCheck it out!...\n\nArtist: ${userBand[i].lineup[0]} \nVenue: ${userBand[i].venue.name}\nVenue Location: ${userBand[i].venue.latitude},${userBand[i].venue.longitude}\nVenue City: ${userBand[i].venue.city}, ${userBand[i].venue.country}`)

                    // MOMENT.JS //
                    let concertDate = moment(userBand[i].datetime).format("MM/DD/YYYY hh:00 A");
                    console.log(`Date and Time: ${concertDate}\n\n- - - - -`);
                };
            } else {
                console.log('Unable to find you the information you are looking for!');
            };
        };
    });
};

function spotifyThisSong() {
    console.log(`\n - - - - -\n\nSEARCHING ..."${userQuery}"`);

    // "ACE OF BASE" IF QUERY IS BLANK //
    if (!userQuery) {
        userQuery = "the sign ace of base"
    };

    // SPOTIFY SEARCH //
    spotify.search({
        type: 'track',
        query: userQuery,
        limit: 1
    }, function (error, data) {
        if (error) {
            return console.log('Error occurred: ' + error);
        }
        // DATA TO DISPLAY //
        let spotifyArr = data.tracks.items;

        for (i = 0; i < spotifyArr.length; i++) {
            console.log(`\nGreat choice...\n\nArtist: ${data.tracks.items[i].album.artists[0].name} \nSong: ${data.tracks.items[i].name}\nAlbum: ${data.tracks.items[i].album.name}\nSpotify link: ${data.tracks.items[i].external_urls.spotify}\n\n - - - - -`)
        };
    });
}

function movieThis() {
    console.log(`\n - - - - -\n\nSEARCHING ..."${userQuery}"`);
    if (!userQuery) {
        userQuery = "mr nobody";
    };
    request("http://www.omdbapi.com/?t=" + userQuery + "&apikey=86fe999c", function (error, response, body) {
        let userMovie = JSON.parse(body);

        // ROTTEN TOMATOES RATING //
        let ratingsArr = userMovie.Ratings;
        if (ratingsArr.length > 2) { }

        if (!error && response.statusCode === 200) {
            console.log(`\nThat's my favorite movie too!...\n\nTitle: ${userMovie.Title}\nCast: ${userMovie.Actors}\nReleased: ${userMovie.Year}\nIMDb Rating: ${userMovie.imdbRating}\nRotten Tomatoes Rating: ${userMovie.Ratings[1].Value}\nCountry: ${userMovie.Country}\nLanguage: ${userMovie.Language}\nPlot: ${userMovie.Plot}\n\n- - - - -`)
        } else {
            return console.log("Movie not found. Error:" + error)
        };
    })
};

function doThis() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log("Error:" + error);
        }
        let dataArr = data.split(",");

        // TAKE OBJECTS FROM RANDOM.TXT TO PASS AS PARAMETERS //
        userInput = dataArr[0];
        userQuery = dataArr[1];
        userCommand(userInput, userQuery);
    });
};