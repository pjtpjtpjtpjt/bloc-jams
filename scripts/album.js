var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>',
    pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>',
    playerBarPlayButton = '<span class="ion-play"></span>',
    playerBarPauseButton = '<span class="ion-pause"></span>',
    $previousButton = $('.main-controls .previous'),
    $nextButton = $('.main-controls .next'),
    $playerBarPlayPauseButton = $('.main-controls .play-pause'),
    $albumTitle = $('.album-view-title'),
    $albumArtist = $('.album-view-artist'),
    $albumReleaseInfo = $('.album-view-release-info'),
    $albumImage = $('.album-cover-art'),
    $albumSongList = $('.album-view-song-list');

var createSongRow = function (songNumber, songName, songLength) {
    var template =
        '<tr class="album-view-song-item">'
        +   '<td class="song-item-number" data-song-number="' + songNumber + '" >' + songNumber + '</td>'
        +   '<td class="song-item-title">' + songName + '</td>'
        +   '<td class="song-item-duration">' + songLength + '</td>'
        + '</tr>';
    
    var $row = $(template);
                             
    var clickHandler = function () {
        var songNumber = parseInt($(this).attr('data-song-number'),0);
        
        if (currentlyPlayingSongNumber !== null ){
            var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        
        if (currentlyPlayingSongNumber !== songNumber){
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            getSongNumberCell(currentlyPlayingSongNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            $('.player-bar .seek-bar').find('.fill').width(currentVolume);
            $('.player-bar .seek-bar').find('.thumb').css({left: currentVolume});
        }
        
        else if (currentlyPlayingSongNumber === songNumber) {
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
     
    var onHover = function (event) { 
         var songNumberCell = $(this).find('.song-item-number'),
          songNumber = parseInt(songNumberCell.attr('data-song-number'));
        
        if (songNumber !== currentlyPlayingSongNumber){
            $(songNumberCell).html(playButtonTemplate);
        }
    };

    var offHover = function (event) {
        var songNumberCell = $(this).find('.song-item-number'),
         songNumber = parseInt(songNumberCell.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber) {
           songNumberCell.html(songNumber);
        }
    };
    
    updatePlayerBarSong = function () {
        $('.song-name').text(currentSongFromAlbum);
        $('.artist-song-mobile').text(currentAlbum.name + ' - ' + currentSongFromAlbum);
        $('.artist-name').text(currentAlbum.name);
        $('.main-controls .play-pause').html(playerBarPauseButton);
    };

    $row.on('click', '.song-item-number', clickHandler);
    $row.hover(onHover, offHover); 
    return $row;
};

var setCurrentAlbum = function (album) { 
    currentAlbum = album;

    $albumTitle.text(album.name);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src',album.albumArtUrl);
    
    $albumSongList.empty();
    
    for(i = 0; i < album.songs.length; i++) {
        
        var totalMinutes = ( Math.floor(album.songs[i].duration/60) ),
            totalSeconds = Math.floor(album.songs[i].duration - (totalMinutes * 60));
        totalSeconds  = totalSeconds < 10? '0' + totalSeconds : totalSeconds;
        album.songs[i].duration = totalMinutes + ':' + totalSeconds
        
        var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].duration);
        $albumSongList.append($newRow);
    }
};

var filterTimeCode = function (activeTime,totalTime) {
    var activeMinutes = (Math.floor(activeTime/60)),
        activeSeconds = Math.floor( activeTime - (activeMinutes * 60));
    activeSeconds  = activeSeconds < 10? '0' + activeSeconds : activeSeconds;
    
    var totalMinutes = ( Math.floor(totalTime/60) ),
        totalSeconds = Math.floor(totalTime - (totalMinutes * 60));
    totalSeconds  = totalSeconds < 10? '0' + totalSeconds : totalSeconds;
    
    $('.current-time').html(activeMinutes + ':' + activeSeconds);
    $('.total-time').html(totalMinutes + ':' + totalSeconds);
}


var updateSeekBarWhileSongPlays = function () {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function (event) {
            var seekBarFillRatio = this.getTime() / this.getDuration(),
                $seekBar = $('.seek-control .seek-bar');
            filterTimeCode(this.getTime(),this.getDuration());
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
    }
}

var updateSeekPercentage = function ($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
}

var setupSeekBars = function () {
    var $seekBars = $('.player-bar .seek-bar');
    
    var specificSeekControlFill = function($specificlSeekControl, seekBarFillRatio) {
        if(currentSoundFile === null) {
            return;
        } 
        
        else { 
            if($specificlSeekControl[0].className === 'control-group volume'){
                setVolume(seekBarFillRatio * 100);
            }
            
            else {
                seek(currentSoundFile.getDuration() * seekBarFillRatio);
            }
        }; 
    };
    
    $seekBars.click(function (event) {
        var $specificlSeekControl = $(this).parent();
        var offsetX = event.pageX - $(this).offset().left, 
            barWidth = $(this).width(), 
            seekBarFillRatio = offsetX / barWidth;
        updateSeekPercentage($(this), seekBarFillRatio);        
        specificSeekControlFill($specificlSeekControl, seekBarFillRatio);
    });
    
    $seekBars.find('.thumb').mousedown(function (event) {
        var $seekBar = $(this).parent();
        var $specificlSeekControl = $seekBar.parent();
        $(document).bind('mousemove.thumb', function (event){
            var offsetX = event.pageX - $seekBar.offset().left,
             barWidth = $seekBar.width(),
             seekBarFillRatio = offsetX / barWidth;
            updateSeekPercentage($seekBar, seekBarFillRatio);
            specificSeekControlFill($specificlSeekControl, seekBarFillRatio);
        });
        
        $(document).bind('mouseup.thumb', function () {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
}

var setSong = function (songNumber) {
    if (currentSoundFile){
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

var seek = function (time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
}

var setVolume = function (volume){
    if (currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
}

var getSongNumberCell = function (number) {
    songNumberCell = $('.song-item-number').get(parseInt(currentlyPlayingSongNumber-1),0);
}

var trackIndex = function (currentAlbum,songName) {
for(i = 0; i < currentAlbum.songs.length; i++) {
  if(currentAlbum.songs[i].name === currentSongFromAlbum){
      return i;
        }
    }
};

var nextPreviousSong = function () {
    if (currentSongFromAlbum === null) {
        return;
    } else {
        trackIndex(currentAlbum);
        var previousTrack,
            nextTrack;
      
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
    
    if (this.className === "next"){
        $(songNumberCell).html(currentlyPlayingSongNumber);
        currentlyPlayingSongNumber = nextTrackNumber
        currentSongFromAlbum = nextTrack
        setSong(nextTrackNumber);
        updatePlayerBarSong();
        getSongNumberCell(currentlyPlayingSongNumber);
        $(songNumberCell).html(pauseButtonTemplate);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
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
        updateSeekBarWhileSongPlays();
    }  
};

var togglePlayFromPlayerBar = function (){
    currentSoundFile.togglePlay();
    if (currentSoundFile.isPaused()){                    
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
    
var individualAlbum = document.getElementsByClassName('album-cover-art'),
songListContainer = document.getElementsByClassName('album-view-song-list')[0],
songRows = document.getElementsByClassName('album-view-song-item'),
currentAlbum = null,
currentlyPlayingSongNumber = null,
currentSongFromAlbum = null,
currentSoundFile = null,
currentVolume = 80;

$(document).ready(function () {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(nextPreviousSong);
    $nextButton.click(nextPreviousSong);
    $playerBarPlayPauseButton.click(togglePlayFromPlayerBar);
});
    








