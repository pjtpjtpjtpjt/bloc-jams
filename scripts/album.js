var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>'; 
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playerBarPlayPauseButton = $('.main-controls .play-pause');

var createSongRow = function(songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        +   '<td class="song-item-number" data-song-number="' + songNumber + '" >' + songNumber + '</td>'
        +   '<td class="song-item-title">' + songName + '</td>'
        +   '<td class="song-item-duration">' + songLength + '</td>'
        + '</tr>';    
    
    var $row = $(template);
                             
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'),0);
        
        if(currentlyPlayingSongNumber !== null ){
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if(currentlyPlayingSongNumber !== songNumber){
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            getSongNumberCell(currentlyPlayingSongNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
        }
        else if (currentlyPlayingSongNumber === songNumber){
            currentSoundFile.togglePlay();
            if(currentSoundFile.isPaused()){                    
                currentSoundFile.pause();
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            } 
            else {
                currentSoundFile.play();
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            }
        }
    };
     
    var onHover = function(event) { 
         var songNumberCell = $(this).find('.song-item-number');
         var songNumber = parseInt(songNumberCell.attr('data-song-number'));         
         if(songNumber != currentlyPlayingSongNumber){
            $(songNumberCell).html(playButtonTemplate);
         }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));
        if(songNumber !== currentlyPlayingSongNumber){
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

var setSong = function(songNumber){
    if(currentSoundFile){
        currentSoundFile.stop();        
    }
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber-1].name;
    currentSoundFile = new buzz.sound(currentAlbum.songs[songNumber-1].audioUrl, {
         formats: [ 'mp3' ],
         preload: true
     });
    setVolume(currentVolume);
};

var setVolume = function(volume){
    if(currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
}

var getSongNumberCell = function(number){
    songNumberCell = $('.song-item-number').get(parseInt(currentlyPlayingSongNumber-1),0);
}

var trackIndex = function(currentAlbum,songName) {
for(i = 0; i < currentAlbum.songs.length; i++) {
  if(currentAlbum.songs[i].name === currentSongFromAlbum){
      return i;
        }
    }
};

var nextPreviousSong = function() {
    if(currentSongFromAlbum === null) {
        return;
    } else {
        trackIndex(currentAlbum);
        var previousTrack;
        var nextTrack;
      
        if (i === 0){
        previousTrack = currentAlbum.songs[currentAlbum.songs.length-1].name;
        previousTrackNumber =  currentAlbum.songs.length
        nextTrack = currentAlbum.songs[i+1].name
        nextTrackNumber = 2
        } 
        else if (i === currentAlbum.songs.length-1) {
        previousTrack = currentAlbum.songs[i-1].name;
        previousTrackNumber = currentAlbum.songs.length-1
        nextTrack = currentAlbum.songs[0].name
        nextTrackNumber = 1
        }
        else {
        previousTrack = currentAlbum.songs[i-1].name
        previousTrackNumber = i
        nextTrack = currentAlbum.songs[i+1].name
        nextTrackNumber = i+2
        };
    }
    
    if(this.className === "next"){
        $(songNumberCell).html(currentlyPlayingSongNumber);
        currentlyPlayingSongNumber = nextTrackNumber
        currentSongFromAlbum = nextTrack
        setSong(nextTrackNumber);
        updatePlayerBarSong();
        getSongNumberCell(currentlyPlayingSongNumber);
         $(songNumberCell).html(pauseButtonTemplate);
        currentSoundFile.play();
    }
    else {
        $(songNumberCell).html(currentlyPlayingSongNumber);
        currentlyPlayingSongNumber = previousTrackNumber
        currentSongFromAlbum = previousTrack
        setSong(previousTrackNumber);
        updatePlayerBarSong();
        getSongNumberCell(currentlyPlayingSongNumber);
        $(songNumberCell).html(pauseButtonTemplate);
        currentSoundFile.play();
    }  
};

var togglePlayFromPlayerBar = function(){
    currentSoundFile.togglePlay();
    if(currentSoundFile.isPaused()){                    
        currentSoundFile.pause();
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        $(songNumberCell).html(playButtonTemplate);
    }
    else {
        currentSoundFile.play();
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        $(songNumberCell).html(pauseButtonTemplate);
    }
    
}
    
var individualAlbum = document.getElementsByClassName('album-cover-art');
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(nextPreviousSong);
    $nextButton.click(nextPreviousSong);
    $playerBarPlayPauseButton.click(togglePlayFromPlayerBar);
});
    








