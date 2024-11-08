
//
//
// Track Data
function ld_trackData() {
    if ( $prop('DataCorePlugin.CurrentGame') != null && $prop('DataCorePlugin.GameData.TrackId') != null ) {
        var json_track = null;
        var track_data = null;
        let getGameId = $prop('DataCorePlugin.CurrentGame').toLowerCase();
        let getTrackId = $prop('DataCorePlugin.GameData.TrackId').replace(/\s/g, '').toLowerCase();
        let getTrackUrl = 'https://raw.githubusercontent.com/Lovely-Sim-Racing/lovely-track-data/main/data/'+getGameId+'/'+getTrackId+'.json';
        if( json_track == null ){
            json_track = downloadstringasync( 81920, getTrackUrl ); //async
            if ( json_track != null && !json_track.startsWith('ERROR') ){
                track_data = JSON.parse(JSON.stringify(JSON.parse(json_track)));
            }
            root['currentTrack'] = getTrackId;
        }
        if ( root['currentTrack'] != getTrackId ) { json_track = null; }
        if ( json_track != null && track_data == null ) {
            return null;
        } else {
            return track_data;
        }
    } else {
        return null;
    }
}

function ld_getTrackName(trackData) {
    if ( trackData ) {
        return trackData.name
    } else {
        if ( ld_getSim()=='ACC') {
            if ($prop('DataCorePlugin.GameRawData.Track.TrackName')) {
                return tcase($prop('DataCorePlugin.GameRawData.Track.TrackName'))
            } else {
                return ''
            }
        } else if ( ld_getSim()=='IRacing') {
            if ($prop('DataCorePlugin.GameRawData.SessionData.WeekendInfo.TrackDisplayName')) {
                return $prop('DataCorePlugin.GameRawData.SessionData.WeekendInfo.TrackDisplayName')
            } else {
                return ''
            }
        } else if ( ld_getSim()=='AC') {
            if ($prop('DataCorePlugin.GameRawData.Track.TrackInfo.name')) {
                return $prop('DataCorePlugin.GameRawData.Track.TrackInfo.name')
            } else {
                return ''
            }
        } else {
            if ($prop('DataCorePlugin.GameData.TrackName')) {
                return $prop('DataCorePlugin.GameData.TrackName')
            } else {
                return ''
            }
        }
    }
}

function ld_getTrackSegment(trackData) {
    if ( !trackData || trackData == undefined ) { return null }
    const trackTurns = trackData.turn;
    const trackStraights = trackData.straight;
    let currentPosition = drivertrackpositionpercent( getplayerleaderboardposition() );
    let margin = 0.01;

    // Get Turns first
    for ( const turn in trackTurns ) {
        if (trackTurns[turn].start && trackTurns[turn].end) {
            if ( currentPosition >= (trackTurns[turn].start) && currentPosition <= (trackTurns[turn].end) ) {
                return trackTurns[turn].name;
            }
        } else {
            if ( currentPosition >= (trackTurns[turn].marker - margin) && currentPosition <= (trackTurns[turn].marker + margin) ) {
                return trackTurns[turn].name;
            }
        }
    }
    // Then get straights
    for ( const straight in trackStraights ) {
        if (trackStraights[straight].start && trackStraights[straight].end) {
            if ( currentPosition >= (trackStraights[straight].start) && currentPosition <= (trackStraights[straight].end) ) {
                return trackStraights[straight].name;
            }
        }
    }
    return null;
}

function ld_getTrackTurn(trackData) {
    if ( !trackData || trackData == undefined ) { return null }
    const trackTurns = trackData.turn;
    let currentPosition = drivertrackpositionpercent( getplayerleaderboardposition() );
    let margin = 0.01;

    // Get Turns first
    for ( const turn in trackTurns ) {
        if (trackTurns[turn].start && trackTurns[turn].end) {
            if ( currentPosition >= (trackTurns[turn].start) && currentPosition <= (trackTurns[turn].end) ) {
                return parseInt(turn) + 1;
            }
        } else {
            if ( currentPosition >= (trackTurns[turn].marker - margin) && currentPosition <= (trackTurns[turn].marker + margin) ) {
                return parseInt(turn) + 1;
            }
        }
    }
    return null;
}