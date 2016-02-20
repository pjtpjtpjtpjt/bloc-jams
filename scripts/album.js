var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>'; 
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        +   '<td class="song-item-number" data-song-number="' + songNumber + '" >' + songNumber + '</td>'
        +   '<td class="song-item-title">' + songName + '</td>'
        +   '<td class="song-item-duration">' + songLength + '</td>'
        + '</tr>';    
    
    var $row = $(template);
    
   var clickHandler = function() {      
	var songNumber = $(this).attr('data-song-number');
  
	if (currentlyPlayingSongNumber !== null) {
		// Revert to song number for currently playing song because user started playing new song.
		var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
		currentlyPlayingCell.html(currentlyPlayingSongNumber);
	}
	if (currentlyPlayingSongNumber !== songNumber) {
		// Switch from Play -> Pause button to indicate new song is playing.
		$(this).html(pauseButtonTemplate);       
		currentlyPlayingSongNumber = songNumber;
        currentSongFromAlbum = currentAlbum.songs[songNumber - 1].name;
        updatePlayerBarSong();        
	} else if (currentlyPlayingSongNumber === songNumber) {
		// Switch from Pause -> Play button to pause currently playing song.
		$(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
		currentlyPlayingSongNumber = null;
	}
};
     
     var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };
    
    updatePlayerBarSong = function(){
        $('.song-name').text(currentSongFromAlbum);
        $('.artist-song-mobile').text(currentAlbum.name + ' - ' + currentSongFromAlbum);
        $('.artist-name').text(currentAlbum.name);
        $('.main-controls .play-pause').html(playerBarPauseButton);
    };
    
    $row.on('click','.song-item-number',clickHandler);
    $row.hover(onHover,offHover); 
    return $row;
};


var setCurrentAlbum = function(album) {
    
    currentAlbum = album;
    
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


var trackIndex = function(currentAlbum,songName) {
for(i = 0; i < currentAlbum.songs.length; i++) {
  if(currentAlbum.songs[i].name === currentSongFromAlbum){
      return i;
        }
    }
};

var nextPreviousSong = function() {
    
    if (currentSongFromAlbum === null) {
        return;
    } else {
    
        trackIndex(currentAlbum);
    
        var previousTrack;
        var nextTrack;
      
        if (i === 0){
        previousTrack = currentAlbum.songs[currentAlbum.songs.length-1].name;
        previousTrackNumber =  currentAlbum.songs.length-1   
        nextTrack = currentAlbum.songs[i+1].name
        nextTrackNumber = i+1
            } else if (i === currentAlbum.songs.length-1) {
        previousTrack = currentAlbum.songs[i-1].name;
        previousTrackNumber = i-1
        nextTrack = currentAlbum.songs[0].name
        nextTrackNumber = 0
            } else {
        previousTrack = currentAlbum.songs[i-1].name
        previousTrackNumber = i-1
        nextTrack = currentAlbum.songs[i+1].name
        nextTrackNumber = i+1
        };
    }
    
    if(this.className === "next"){
        currentlyPlayingSongNumber = nextTrackNumber
        currentSongFromAlbum = nextTrack 
        updatePlayerBarSong();     
     
    } else {
        currentlyPlayingSongNumber = previousTrackNumber
        currentSongFromAlbum = previousTrack
        updatePlayerBarSong();
      
       
    }  
    
    
    
};
    
  


var individualAlbum = document.getElementsByClassName('album-cover-art');
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(nextPreviousSong);
    $nextButton.click(nextPreviousSong);
 });
    








