
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var everyAlbum = [
    
albumPicasso = {
    name: 'The Colors',
    artist: 'Pablo Picasso',
    label: 'Cubism',
    year: '1881',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        {name: 'Blue', length: '4:26'},
        {name: 'Green', length: '3:14'},
        {name: 'Red', length: '5:01'},
        {name: 'Pink', length: '3:21'},
        {name: 'Magenta', length: '2:15'}
    ]    
},

albumMarconi = {
    name: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
        {name: 'Hello, Operator?', length: '1:01'},
        {name: 'Ring, ring, ring', length: '5:01'},
        {name: 'Fits in your pocket', length: '3:21'},
        {name: 'Can you hear me now?', length: '3:14'},
        {name: 'Wrong phone number', length: '2:15'}
    ]
},


albumSmith = {
    name: 'The Cure Greatest Hits',
    artist: 'Robert Smith',
    label: 'Fiction',
    year: '1979',
    albumArtUrl: 'assets/images/album_covers/11.png',
    songs: [
        {name: 'Stranger', length: '12:01'},
        {name: 'Like Cockatoos', length: '2:23'},
        {name: 'Fascination Street', length: '5:17'},
        {name: 'Love Song', length: '1:01'},
        {name: 'A Forest', length: '3:45'}
    ]
}

];                        


var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        +   '<td class="song-item-number" data-song-number="' + songNumber + '" >' + songNumber + '</td>'
        +   '<td class="song-item-title">' + songName + '</td>'
        +   '<td class="song-item-duration">' + songLength + '</td>'
        + '</tr>';    
    
    var $row = $(template);
     
    var onHover = function(event){
        console.log('setting play button template')
        this.firstChild.innerHTML = playButtonTemplate;

    };
    var offHover = function(event){
        console.log('setting template')
        this.innerHTML = template;
    };
    
    var clickHandler = function(event){ 
             
    
        this.innerHTML = pauseButtonTemplate;
         console.log(this.innerHTML);
       event.stopPropagation();
    };
    
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover,offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
    
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');

    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src',album.albumArtUrl);
    
    
    $albumSongList.empty();
    
    for(i = 0; i < album.songs.length; i++) {
       var $newRow = createSongRow(i + 1,album.songs[i].name, album.songs[i].length);
        $albumSongList.append($newRow);
    }
    
};


var individualAlbum = document.getElementsByClassName('album-cover-art');
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');


var currentlyPlayingSong = null;



$(document).ready(function() {

     setCurrentAlbum(albumPicasso);
      
 });
    








