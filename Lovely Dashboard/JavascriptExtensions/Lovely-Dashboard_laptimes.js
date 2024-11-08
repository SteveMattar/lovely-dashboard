//
// Absolute Position Functions

function ld_getLeaderboardPositionFromAbsolutePosition(absolutePosition) {
    // 0: Default
    // 1: By Class
    // 2: Post-It Note (Plugin Required)
    let positionMode = $prop('LovelyPlugin.ld_PositionMode');
    
    if ( positionMode === 2) {
        return pc_GetTeamPropertyFromClassPosition( absolutePosition, 'LeaderboardPosition' ) ?? -1;
    } else if ( positionMode === 1 ) {
        return getopponentleaderboardposition_playerclassonly( absolutePosition );
    } else {
        return absolutePosition;
    }
}

//
//
// Class Position Fucntions
function ld_getLeaderboardPositionFromClassPosition(classPosition) {
    // 0: Default
    // 1: By Class
    // 2: Post-It Note (Plugin Required)
    let positionMode = $prop('LovelyPlugin.ld_PositionMode');
    
    if ( positionMode === 2 ) {
        return pc_GetTeamPropertyFromClassPosition( classPosition, 'LeaderboardPosition' ) ?? -1;
    } else {
        return getopponentleaderboardposition_playerclassonly( classPosition );
    }
}

//
//
// Overall Position Functions
function ld_getLeaderboardPositionFromOverallPosition(overallPosition) {
    // 0: Default
    // 1: By Class
    // 2: Post-It Note (Plugin Required)
    let positionMode = $prop('LovelyPlugin.ld_PositionMode');
    
    if ( positionMode === 2 ) {
        return sc_GetTeamPropertyFromLivePosition( overallPosition, 'LeaderboardPosition' ) ?? -1;
    } else {
        return overallPosition > 0 ? overallPosition : -1;
    }
}

//
//
// Ahead Behind Functions

function ld_getBestLapColorFromAheadBehind(aheadBehind = 0) {
    return ld_getBestLapColorFromLeaderboardPosition( getopponentleaderboardposition_aheadbehind( aheadBehind) );
}

function ld_getBestLapTimeFromAheadBehind(aheadBehind = 0) {
    return ld_getBestLapTimeFromLeaderboardPosition( getopponentleaderboardposition_aheadbehind( aheadBehind) );
}

function ld_getCarNumberFromAheadBehind(aheadBehind = 0) {
    return ld_getCarNumberFromLeaderboardPosition( getopponentleaderboardposition_aheadbehind( aheadBehind) );
}

function ld_getDriverColorFromAheadBehind(aheadBehind = 0) {
    return ld_getDriverColorFromLeaderboardPosition( getopponentleaderboardposition_aheadbehind( aheadBehind) );
}

function ld_getLapDeltaFromAheadBehind(aheadBehind = 0) {
    return ld_getLapDeltaFromLeaderboardPosition( getopponentleaderboardposition_aheadbehind( aheadBehind) );
}

function ld_getLastLapColorFromAheadBehind(aheadBehind = 0) {
    return ld_getLastLapColorFromLeaderboardPosition( getopponentleaderboardposition_aheadbehind( aheadBehind) );
}

function ld_getLastLapTimeFromAheadBehind(aheadBehind = 0) {
    return ld_getLastLapTimeFromLeaderboardPosition( getopponentleaderboardposition_aheadbehind( aheadBehind) );
}

function ld_getNameFromAheadBehind(aheadBehind = 0) {
    return ld_getNameFromLeaderboardPosition( getopponentleaderboardposition_aheadbehind( aheadBehind) );
}

function ld_getPositionFromAheadBehind(aheadBehind = 0) {
    return ld_getPositionFromLeaderboardPosition( getopponentleaderboardposition_aheadbehind( aheadBehind) );
}

function ld_getRelativeGapFromAheadBehind(aheadBehind = 0) {
    return ld_getRelativeGapFromLeaderboardPosition( getopponentleaderboardposition_aheadbehind( aheadBehind) );
}

//
//
// Leaderboard Position Functions

function ld_getBestLapColorFromLeaderboardPosition(leaderboardPosition) {
    let bestLapTime = driverbestlap( leaderboardPosition );
    
    if ( timespantoseconds( bestLapTime ) > 0 ) {
        if ( leaderboardPosition === getbestlapopponentleaderboardposition() ) {
            return ld_theme('ld_uiFastest');
        } else {
            return ld_theme('ld_uiTitle');
        }
    } else {
        return ld_theme('ld_uiLabel');
    }
}

function ld_getBestLapTimeFromLeaderboardPosition(leaderboardPosition) {
    let bestLapTime = driverbestlap( leaderboardPosition );

    if ( bestLapTime !== null ) {
        if ( timespantoseconds(bestLapTime) ===  0 ) {
            return '--:--.---';
        } else {
            return bestLapTime;
        }
    } else {
        return '';
    }
}

function ld_getCarNumberFromLeaderboardPosition(leaderboardPosition) {
    let carNumber = drivercarnumber( leaderboardPosition );

    if ( carNumber !== null && carNumber != "") {
        return '#' + carNumber;
    } else {
        return null;
    }
}

function ld_getDriverColorFromLeaderboardPosition(leaderboardPosition) {
    let playerLeaderboardPosition = getplayerleaderboardposition();

    if ( leaderboardPosition === null || leaderboardPosition === -1 ) { return null };   

    if ( leaderboardPosition === playerLeaderboardPosition ) {
        return ld_theme('ld_tableDriver');
    }
    
    let opponentLap = drivercurrentlap( leaderboardPosition );
    let playerLap = drivercurrentlap( playerLeaderboardPosition );

    if ( opponentLap > 0 && playerLap > 0 && !ld_isQuali() ) {
        let gapToPlayer = drivergaptoplayer( leaderboardPosition );
        let relativeGapToPlayer = driverrelativegaptoplayer( leaderboardPosition );
        let opponentLapHighPrecision = drivercurrentlaphighprecision( leaderboardPosition );
        let playerLapHighPrecision = drivercurrentlaphighprecision( playerLeaderboardPosition );
        let laps = Math.abs( opponentLapHighPrecision - playerLapHighPrecision );
        if ( gapToPlayer < 0 && ( laps > 1 || relativeGapToPlayer >= 0 ) ) {
            return ld_theme('ld_tableAhead');
        } else if ( gapToPlayer > 0 && ( laps > 1 || relativeGapToPlayer <= 0 ) ) {
            return ld_theme('ld_tableBehind');
        } else {
            return ld_theme('ld_tableOpponent');
        }
    } else {
        return ld_theme('ld_tableOpponent');
    }
}

function ld_getLapDeltaFromLeaderboardPosition(leaderboardPosition) {
    return drivercurrentlap( leaderboardPosition ) - drivercurrentlap( getplayerleaderboardposition() ) + 'L';
}

function ld_getLastLapColorFromLeaderboardPosition(leaderboardPosition) {
    let lastLapTime = driverlastlap( leaderboardPosition );

    if ( timespantoseconds( lastLapTime ) > 0 ) {
        if ( timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) ) - timespantoseconds( lastLapTime ) >= 0 ) {
            return ld_theme('ld_uiFastest');
        } else {
            return ld_theme('ld_uiTitle');
        }
    } else {
        return ld_theme('ld_uiLabel');
    }
}

function ld_getLastLapTimeFromLeaderboardPosition(leaderboardPosition) {
    let lastLapTime = driverlastlap( leaderboardPosition );

    if ( lastLapTime !== null ) {
        if ( timespantoseconds( lastLapTime ) ===  0 ) {
            return '--:--.---';
        } else {
            return lastLapTime;
        }
    } else {
        return '';
    }
}

function ld_getNameFromLeaderboardPosition(leaderboardPosition) {
    let name = drivername( leaderboardPosition );

    if ( name !== null ) {
        return ld_formatName(name);
    } else {
        return '';
    }
}

function ld_getPositionFromLeaderboardPosition(leaderboardPosition) {
    // 0: Default
    // 1: By Class
    // 2: Post-It Note (Plugin Required)
    let positionMode = $prop('LovelyPlugin.ld_PositionMode');
    let position;
    
    if ( positionMode === 2 ) {
        position = sc_GetTeamPropertyFromLeaderboardPosition( leaderboardPosition, 'LivePositionInClass' );
    } else if ( positionMode === 1 ) {
        position = driverclassposition( leaderboardPosition );
    } else {
        position = leaderboardPosition;
    }

    if ( position !== null) {
        return position;
    } else {
        return '';
    }
}

function ld_getOverallBestLapFromLeaderboardPosition() {
    // 0: Default
    // 1: By Class
    // 2: Post-It Note (Plugin Required)
    let positionMode = $prop('LovelyPlugin.ld_PositionMode');
    
    if ( getbestlapopponentleaderboardposition_playerclassonly() === null || getbestlapopponentleaderboardposition() === null ) { return null; }

    if ( positionMode === 2 ) {
        return driverbestlap( getbestlapopponentleaderboardposition_playerclassonly() );
    } else if ( positionMode === 1 ) {
        return driverbestlap( getbestlapopponentleaderboardposition_playerclassonly() );
    } else {
        return driverbestlap( getbestlapopponentleaderboardposition() );
    }
    
}

function ld_getPositionInClassFromLeaderboardPosition(leaderboardPosition) {
    // 0: Default
    // 1: By Class
    // 2: Post-It Note (Plugin Required)
    let positionMode = $prop('LovelyPlugin.ld_PositionMode');
    let positionInClass;
    
    if ( positionMode === 2 ) {
        positionInClass = sc_GetTeamPropertyFromLeaderboardPosition( leaderboardPosition, 'LivePositionInClass' );
    } else {
        positionInClass = driverclassposition( leaderboardPosition );
    }

    if ( positionInClass !== null) {
        return positionInClass;
    } else {
        return '';
    }
}

function ld_getPositionsGainedFromLeaderboardPosition(leaderboardPosition) {
    // 0: Default
    // 1: By Class
    // 2: Post-It Note (Plugin Required)
    let positionMode = $prop('LovelyPlugin.ld_PositionMode');
    
    if ( positionMode === 2 ) {
        return sc_GetTeamPropertyFromLeaderboardPosition( leaderboardPosition, 'PositionsGainedInClass' );
    } else if ( positionMode === 1 ) {
        return driverpositiongainclass( leaderboardPosition );
    } else {
        return driverpositiongain( leaderboardPosition );
    }
}

function ld_getRelativeGapFromLeaderboardPosition(leaderboardPosition) {
    // 0: Simhub
    // 1: Post-It Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_GapTimeMode');

    if ( timingMode === 1) {
        return ld_formatTimeShort( sc_GetTeamPropertyFromLeaderboardPosition( leaderboardPosition, 'RelativeGapToPlayer' ) );
    } else {
        return ld_formatTimeShort( driverrelativegaptoplayer( leaderboardPosition) );
    }
}

//
//
// Relative Position Functions

function ld_getDriverDeltaFromRelativePosition(relativePosition = 0, classOnly = false) {
    return driverdeltatoplayer( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getBestLapColorFromRelativePosition(relativePosition = 0, classOnly = false) {
    return ld_getBestLapColorFromLeaderboardPosition( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getBestLapTimeFromRelativePosition(relativePosition = 0, classOnly = false) {
    return ld_getBestLapTimeFromLeaderboardPosition( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getCarNumberFromRelativePosition(relativePosition = 0, classOnly = false) {
    return ld_getCarNumberFromLeaderboardPosition( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getDriverColorFromRelativePosition(relativePosition = 0, classOnly = false) {
    return ld_getDriverColorFromLeaderboardPosition( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getLapDeltaFromRelativePosition(relativePosition = 0, classOnly = false) {
    return ld_getLapDeltaFromLeaderboardPosition( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getLastLapColorFromRelativePosition(relativePosition = 0, classOnly = false) {
    return ld_getLastLapColorFromLeaderboardPosition( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getLastLapTimeFromRelativePosition(relativePosition = 0, classOnly = false) {
    return ld_getLastLapTimeFromLeaderboardPosition( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getLeaderboardPositionFromRelativePosition(relativePosition, classOnly = false) {
    // 0: Default
    // 1: By Class
    // 2: Post-It Note (Plugin Required)
    let positionMode = $prop('LovelyPlugin.ld_PositionMode');
    
    if ( positionMode === 2) {
        if ( classOnly === true ) {
            return pc_GetTeamPropertyFromRelativePosition( relativePosition, 'LeaderboardPosition' ) ?? -1;
        } else {
            return sc_GetTeamPropertyFromRelativePosition( relativePosition, 'LeaderboardPosition' ) ?? -1;
        }
    } else {
        if ( classOnly === true ) {
            let positionInClass = driverclassposition( getplayerleaderboardposition() );
        
            return getopponentleaderboardposition_playerclassonly( positionInClass + relativePosition );
        } else {
            return getplayerleaderboardposition() + relativePosition;
        }
    }
}

function ld_getNameFromRelativePosition(relativePosition = 0, classOnly = false) {
    return ld_getNameFromLeaderboardPosition( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getPositionFromRelativePosition(relativePosition = 0, classOnly = false) {
    return ld_getPositionFromLeaderboardPosition( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getPositionInClassFromRelativePosition(relativePosition = 0, classOnly = false) {
    return ld_getPositionInClassFromLeaderboardPosition( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getRelativeGapFromRelativePosition(relativePosition = 0, classOnly = false) {
    return ld_getRelativeGapFromLeaderboardPosition( ld_getLeaderboardPositionFromRelativePosition( relativePosition, classOnly ) );
}

function ld_getClassOpponentsDistanceGraph() {
    if ( $prop('PlayerClassOpponentsCount') < 1 ) {
        return ld_themeImage( 'direction-bg' );
    }

    let leaderboardPositionAhead = ld_getLeaderboardPositionFromRelativePosition( -1, true );
    let leaderboardPositionBehind = ld_getLeaderboardPositionFromRelativePosition( 1, true );

    var behindDistance = Math.round(
        ( 
            driverrelativedistancetoplayer( leaderboardPositionBehind ) / 
                (
                    driverrelativedistancetoplayer( leaderboardPositionBehind ) + Math.abs( driverrelativedistancetoplayer( leaderboardPositionAhead ) )
                )
        ) * 100
    )

    if ( ld_isIncreasing( behindDistance ) === true ) {
        return ld_themeImage( 'direction-up' );
    } else if ( ld_isIncreasing( behindDistance ) === false ) {	
        return ld_themeImage( 'direction-down' );
    } else { 
        return ld_themeImage( 'direction-bg' );
    }
}

function ld_getTrackOpponentsDistanceGraph() {
    if ( $prop('OpponentsCount') < 1 ) {
        return ld_themeImage( 'direction-bg' );
    }

    let leaderboardPositionAhead = getopponentleaderboardposition_aheadbehind( -1 );
    let leaderboardPositionBehind = getopponentleaderboardposition_aheadbehind( 1 );

    var behindDistance = Math.round(
        ( 
            driverrelativedistancetoplayer( leaderboardPositionBehind ) / 
                (
                    driverrelativedistancetoplayer( leaderboardPositionBehind ) + Math.abs( driverrelativedistancetoplayer( leaderboardPositionAhead ) )
                )
        ) * 100
    )

    if ( ld_isIncreasing( behindDistance ) == true ) {
        return ld_themeImage( 'direction-up' );
    } else if ( ld_isIncreasing( behindDistance ) == false ) {	
        return ld_themeImage( 'direction-down' );
    } else { 
        return ld_themeImage( 'direction-bg' );
    }
}

//
//
// Estimated Lap
function ld_getEstimatedLapTime() {
    // 0: Default
    // 1: Simhub
    // 2: Post-It Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');

    if (timingMode == 2) {
        if ( timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) > 0 ) {
            return sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime');
        } else {
            return $prop('CurrentLapTime');
        }
    } else if ( timingMode == 1 ) {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) > 0 ) {
            return $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub');
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            return $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased');
        } else {
            return $prop('CurrentLapTime');
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) > 0 ) {
            return $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased');
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            return $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased');
        } else {
            return $prop('CurrentLapTime');
        }
    }
}

function ld_getEstimatedDelta() {
    // 0: Default
    // 1: Simhub
    // 2: Post-It Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');
    let timeDiffMine = null;

    if ( timingMode == 2 ) {
        if ( timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) > 0 ) {
            timeDiffMine = timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        } else {
            timeDiffMine = 0;
        }
    } else if ( timingMode == 1 ) {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) > 0 ) {
            if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) > 0 ) {
                timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub_EstimatedDelta')) > 0 ) {
                timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub_EstimatedDelta'));
            } else {
                timeDiffMine = 0;
            }
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') );
        } else {
            timeDiffMine = 0;
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) > 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') );
        } else {
            timeDiffMine = 0;
        }
    }

    return ld_formatTime(timeDiffMine);
}

function ld_getEstimatedLabel() {
    // 0: Default
    // 1: Simhub
    // 2: Post-It Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');

    if (timingMode == 2) {
        if ( timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) > 0 ) {
            return 'ESTIMATED LAP';
        } else {
            return 'CURRENT LAP';
        }
    } else if (timingMode == 1) {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) > 0 ) {
            return 'ESTIMATED LAP';
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            return 'ESTIMATED LAP (ALL TIME:                     )';
        } else {
            return 'CURRENT LAP';
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) > 0 ) {
            return 'ESTIMATED LAP';
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            return 'ESTIMATED LAP (ALL TIME:                     )';
        } else {
            return 'CURRENT LAP';
        }
    }
}

function ld_getEstimatedLabelShow() {
    // 0: Default
    // 1: Simhub
    // 2: Post-It Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');

    if (timingMode == 2) {
        return false;
    } else if ( timingMode == 1 ) {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) > 0 ) {
            return false;
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            return true;
        } else {
            return false;
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) > 0 ) {
            return false;
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            return true;
        } else {
            return false;
        }
    }
}

function ld_timeDiff(timeDiffMine, timeDiffOverall) {
    if ( timeDiffMine == null & timeDiffOverall == null) {
        return ld_theme('ld_uiLabel');
    } else if ( timeDiffMine > 0 ) {
        return ld_theme('ld_uiSlower');
    } else {
        if ( timeDiffOverall > 0 ) {
            return ld_theme('ld_uiFaster');
        } else {
            return ld_theme('ld_uiFastest');
        }
    }
}

function ld_getEstimatedColour() {
    // 0: Default
    // 1: Simhub
    // 2: Post-It Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');
    let timeDiffMine = null;
    let timeDiffOverall = null;

    if ( timingMode == 2 ) {
        if ( timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) > 0 ) {
            timeDiffMine = timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            timeDiffOverall = timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        } 
    } else if ( timingMode == 1 ) {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) > 0 ) {
            if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) > 0 ) {
                timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            } else {
                timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub_EstimatedDelta'));
            }
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') );
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) > 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') );
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        }
    }

    if ( ld_getSim() == 'IRacing' ) {
        // Calculate Off Tracks
        if( root["offTrack"] == null ) {
            root["offTrack"] = 0;
        }
        if ( $prop('DataCorePlugin.GameRawData.Telemetry.PlayerTrackSurface') == 0 ) {
            // irsdk_NotInWorld -1
            // irsdk_OffTrack 0
            // irsdk_InPitStall 1
            // irsdk_AproachingPits 2
            // irsdk_OnTrack 3
            root["offTrack"]++;
        }
        if ( $prop('DataCorePlugin.GameData.TrackPositionPercent') < 0.01 ) {
            root["offTrack"] = 0;
        }
        if ( root["offTrack"] > 0 && $prop('DataCorePlugin.GameData.SessionTypeName') != 'Race') {
            return ld_theme('ld_uiInvalid');
        } else {
            return ld_timeDiff(timeDiffMine, timeDiffOverall);
        }
    } else if ( ld_getSim() == 'Automobilista2') {
        if ( $prop('DataCorePlugin.GameRawData.mLapInvalidated') == false ) {
            return ld_timeDiff(timeDiffMine, timeDiffOverall);
        } else {
            return ld_theme('ld_uiInvalid');
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        return ld_timeDiff(timeDiffMine, timeDiffOverall);
    } else if ( ld_getSim() == 'AC' ) {
        return ld_timeDiff(timeDiffMine, timeDiffOverall);
    } else if ( ld_getSim() == "F1" ) {
        fastestLap = timespantoseconds(isnull(driverbestlap(getbestlapopponentleaderboardposition()), '0:00.000'));
        if ( $prop('GameRawData.PlayerLapData.m_currentLapInvalid') == 0) {
            return ld_timeDiff(timeDiffMine, timeDiffOverall);
        } else {
            return ld_theme('ld_uiInvalid');
        }
    } else if ( ld_getSim() == "RRRE" ) {
        if ( $prop('DataCorePlugin.GameData.LapInvalidated') == false ) {
            return ld_timeDiff(timeDiffMine, timeDiffOverall);
        } else {
            return ld_theme('ld_uiInvalid');
        }
    } else {
        if ( $prop('DataCorePlugin.GameRawData.Graphics.isValidLap') == 1 ) {
            return ld_timeDiff(timeDiffMine, timeDiffOverall);
        } else {
            return ld_theme('ld_uiInvalid');
        }
    }
}

function ld_getEstimatedTextColour() {
    // 0: Default
    // 1: Simhub
    // 2: Post-It Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');
    let timeDiffMine = null;
    let timeDiffOverall = null;

    if ( timingMode == 2 ) {
        if ( timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) > 0 ) {
            timeDiffMine = timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            timeDiffOverall = timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        }
    } else if ( timingMode == 1 ) {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) > 0 ) {
            if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) > 0 ) {
                timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            } else {
                timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub_EstimatedDelta'));
            }
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') );
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) > 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) > 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') );
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        }
    }

    if ( ld_getSim() == 'IRacing' ) {
        // Calculate Off Tracks
        if( root["offTrack"] == null ) {
            root["offTrack"] = 0;
        }
        if ( $prop('DataCorePlugin.GameRawData.Telemetry.PlayerTrackSurface') == 0 ) {
            // irsdk_NotInWorld -1
            // irsdk_OffTrack 0
            // irsdk_InPitStall 1
            // irsdk_AproachingPits 2
            // irsdk_OnTrack 3
            root["offTrack"]++;
        }
        if ( $prop('DataCorePlugin.GameData.TrackPositionPercent') < 0.01 ) {
            root["offTrack"] = 0;
        }
        if ( root["offTrack"] > 0 && $prop('DataCorePlugin.GameData.SessionTypeName') != 'Race') {
            return ld_theme('ld_uiInvalidText'); // red bg
        } else {
            return ld_theme('ld_uiTimingText');
        }
    } else if ( ld_getSim() == 'Automobilista2') {
        if ( $prop('DataCorePlugin.GameRawData.mLapInvalidated') == false ) {
            return ld_theme('ld_uiTimingText') ;
        } else {
            return ld_theme('ld_uiInvalidText'); // red bg
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        return ld_theme('ld_uiTimingText');
    } else if ( ld_getSim() == 'AC' ) {
        return ld_theme('ld_uiTimingText');
    } else if ( ld_getSim() == "F1" ) {
        fastestLap = timespantoseconds(isnull(driverbestlap($prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1), '0:00.000'));
        if ( ! timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) > 0) {
            return ld_theme('ld_uiInvalidText');
        } else if ( $prop('GameRawData.PlayerLapData.m_currentLapInvalid') == false) {
            return ld_theme('ld_uiTimingText');
        } else {
            return ld_theme('ld_uiInvalidText'); // red bg
        }
    } else if ( ld_getSim() == "RRRE" ) {
        if ( $prop('DataCorePlugin.GameData.LapInvalidated') == false ) {
            return ld_theme('ld_uiTimingText');
        } else {
            return ld_theme('ld_uiInvalidText'); // red bg
        }
    } else {
        if ( $prop('DataCorePlugin.GameRawData.Graphics.isValidLap') == true ) {
            return ld_theme('ld_uiTimingText');
        } else {
            return ld_theme('ld_uiInvalidText'); // red bg
        }
    }
}

function ld_getPreviousColour () {
    let timeDiffMine = null;
    let timeDiffOverall = null;

    if ( timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) == 0 ) {
        return ld_theme('ld_uiNeutral');
    }
    if ( ld_getSim() == 'IRacing' ) {
        timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiSlower');
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiFaster');
            } else {
                return ld_theme('ld_uiFastest');
            }
        }
    } else if ( ld_getSim() == 'AssettoCorsaCompetizione' ) {
        timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiSlower');
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiFaster');
            } else {
                return ld_theme('ld_uiFastest');
            }
        }
    } else if ( ld_getSim() == 'Automobilista2' ) {
        timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiSlower');
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiFaster');
            } else {
                return ld_theme('ld_uiFastest');
            }
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiSlower');
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiFaster');
            } else {
                return ld_theme('ld_uiFastest');
            }
        }
    } else {
        if ( timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) == 0 ) {
            return ld_theme('ld_uiNeutral');
        } else  { //if (!$prop('LapInvalidated'))
            timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiSlower');
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiFaster');
                } else {
                    return ld_theme('ld_uiFastest');
                }
            }
        }
    }
}

function ld_getPreviousTextColour () {
    let timeDiffMine = null;
    let timeDiffOverall = null;

    if ( ld_getSim() == 'IRacing' ) {
		timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
		timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
		if ( timeDiffMine > 0 ) {
			return ld_theme('ld_uiTimingText'); // Yellow
		} else {
			if ( timeDiffOverall > 0 ) {
				return ld_theme('ld_uiTimingText'); // Green
			} else {
				return ld_theme('ld_uiTimingText'); // Purple
			}
		}
    } else if ( ld_getSim() == 'AssettoCorsaCompetizione' ) {
        timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiTimingText'); // Yellow
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiTimingText'); // Green
            } else {
                return ld_theme('ld_uiTimingText'); // Purple
            }
        }
    } else if ( ld_getSim() == 'Automobilista2' ) {
        timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiTimingText'); // Yellow
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiTimingText'); // Green
            } else {
                return ld_theme('ld_uiTimingText'); // Purple
            }
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
        timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        if ( timeDiffMine > 0 ) {
            return ld_theme('ld_uiTimingText'); // Yellow
        } else {
            if ( timeDiffOverall > 0 ) {
                return ld_theme('ld_uiTimingText'); // Green
            } else {
                return ld_theme('ld_uiTimingText'); // Purple
            }
        }
    } else {
        if ( ! timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) > 0) {
            return ld_theme('ld_uiTimingText');
        } else { // if (!$prop('LapInvalidated'))
            timeDiffMine = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            timeDiffOverall = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
            if ( timeDiffMine > 0 ) {
                return ld_theme('ld_uiTimingText'); // Yellow
            } else {
                if ( timeDiffOverall > 0 ) {
                    return ld_theme('ld_uiTimingText'); // Green
                } else {
                    return ld_theme('ld_uiTimingText'); // Purple
                }
            }
        }
    }
}
