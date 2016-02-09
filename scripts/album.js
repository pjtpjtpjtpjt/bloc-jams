
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
        + '</tr>'
        ;    
    
    return template;
};

var setCurrentAlbum = function(album) {
    
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
   
    
    albumTitle.firstChild.nodeValue = album.name;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);
        
    albumSongList.innerHTML = '';
    
       
    for(i = 0; i < album.songs.length; i++) {
        albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
    }
    
};


function rotateAlbums(){
    count++    
    if(count >= everyAlbum.length) {
        count = 0
    };        
    setCurrentAlbum(everyAlbum[count]);
    extraLoad();
};


var individualAlbum = document.getElementsByClassName('album-cover-art');
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null;

var findParentByClassName = function(element, targetClass) {
    var currentParent = element.parentElement;
    while (currentParent.className != targetClass) {
        currentParent = currentParent.parentElement;
    }
    return currentParent;
};


var getSongItem = function(element) {
    switch (element.className) {
        case 'album-song-button':
        case 'ion-play':
        case 'ion-pause':
            return findParentByClassName(element, 'song-item-number');
        case 'album-view-song-item':
            return element.querySelector('.song-item-number');
        case 'song-item-title':
        case 'song-item-duration':
            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
        case 'song-item-number':
            return element;
        default:
            return;
    }  
};

 var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);  
 
      if (currentlyPlayingSong === null) {
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
         songItem.innerHTML = playButtonTemplate;
         currentlyPlayingSong = null;
     } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
         var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
         currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
         songItem.innerHTML = pauseButtonTemplate;
         currentlyPlayingSong = songItem.getAttribute('data-song-number');
     }
 };


 window.onload = function() {
     setCurrentAlbum(albumPicasso);

     songRows.addEventListener('click', findParentByClassName(songRows.children,'album-view-song-item'), false);     
     
     count = 0
     individualAlbum[count].addEventListener('click',rotateAlbums);      
     
     songListContainer.addEventListener('mouseover', function(event) {
         if (event.target.parentElement.className === 'album-view-song-item'){
         event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate; 
         }
     });
     
     extraLoad = function(){
     for(i=0; i < songRows.length; i++){         
         songRows[i].addEventListener('mouseleave', function(event) {
           var songItem = getSongItem(event.target);
             var songItemNumber = songItem.getAttribute('data-song-number');

             if (songItemNumber !== currentlyPlayingSong) {
                 songItem.innerHTML = songItemNumber;
             }
         });
        }
     }
     extraLoad();
     
     
     songRows[i].addEventListener('click', function(event) {
             clickHandler(event.target);
         });
     
 };
    








