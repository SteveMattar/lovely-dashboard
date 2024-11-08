const folderName = $prop('variable.folderName');
const delayRingColor = ['#FF0029A6','#FFB58100','#FFA60000'];
const ACC_carList_singleLightsstage = [];

// Current Dash Versions
const isPrivate = true;
const LovelyDashboardVer = "2.7.6.3";
const LovelyDashboardCurvedVer = "2.7.6.3";
const LovelyDashboardTKVer = "2.7.6.3";
const LovelyDashboardXLVer = "2.7.6.3";
const LovelyDashboardUXLVer = "2.7.6.3";
const LovelyOverlayVer = "2.7.6.3";
const LovelyDashboardCompanionVer = "1.2.0.3";
const LovelyFlagsVer = "1.5.0.4";
const LovelyTowerVer = "1.5.0.3";
const LovelyPitWallVer = "1.0.0";

// Minimum Software Versions
const shVer = "9.4.6";
const pluginVer = "1.0.2.0";
const postitVer = "1.0.7.4";

//
//
// NO editing below this line
//
//

// Default Theme Colors
var json_colors;
if ( folderName == "Lovely Dashboard TK Edition" ) {
    json_colors = readtextfile('./DashTemplates/'+folderName+'/JavascriptExtensions/Lovely-Dashboard_colors-tk.json');
} else {
    json_colors = readtextfile('./DashTemplates/'+folderName+'/JavascriptExtensions/Lovely-Dashboard_colors.json');
}

const ld_colors = JSON.parse(JSON.stringify(JSON.parse(json_colors)));

// Theming
function ld_getTheme() {
    const trueDarkColor = $prop('LovelyPlugin.ld_TrueDarkModeColor');
    return trueDarkColor+1;
}
function ld_theme(token) {
    // 0: Default Theme
    // 1: Red Theme
    // 2: Blue Theme
    // 3: Purple Theme
    // 4: Orange Theme
    const theme = ( ld_trueDarkMode() ) ? ld_getTheme() : '0';
    if (!ld_colors || ld_colors == null) { return 'Lime'; };
    return ld_colors[theme][token];
}
function ld_themeImage(token) {
    const theme = ( ld_trueDarkMode() ) ? ld_getTheme() : '0';
    return token+'-'+theme;
}

// Get Settings
function ld_getSettings(setting) {
    if ( $prop('LovelyPlugin.Version') ) {
        return $prop('LovelyPlugin.ld_'+setting);
    }
}

// Players Data
function ld_GetPlayerName() {
    const driverName = ld_getSettings('driverName');
    const name = $prop('DataCorePlugin.GameData.PlayerName');
    return ld_formatName(name, driverName);
}
function ld_GetPlayerCarLogo () {
    const carName = $prop('DataCorePlugin.GameData.CarModel');
    const carBrand = carName.split(' ');
    return 'logo-' + lcase(carBrand[0]) + '-yellow';
}
function ld_GetPlayerBestLapTime() {
    if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) ==  0 ) {
        return '--:--.---';
    } else {
        return $prop('DataCorePlugin.GameData.BestLapTime');
    }
}
function ld_GetPlayerLastLapTime() {
    if ( timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) ==  0 ) {
        return '--:--.---';
    } else {
        return $prop('DataCorePlugin.GameData.LastLapTime');
    }
}
function ld_GetPlayerBestColor() {
    if ( driverdeltatobest(getplayerleaderboardposition()) == 0 ) {
        return ld_theme('ld_uiFastest');
    } else {
        return ld_theme('ld_uiSlower');
    }
}

function ld_GetDriverName(position) {
    const driverName = ld_getSettings('driverName');
    if (drivername(position)) {
        const name = tcase(drivername(position));
        return ld_formatName(name, driverName);
    } else {
        return '';
    } 
}

function ld_getDriverClassIndex(position) {
    var driverClassName = drivercarclass( position );
    for (i=1; i<= getleaderboardcarclasscount(); i++) {
        if ( getleaderboardcarclassname(i) == driverClassName ) {
            var driverClassIndex =  i;
        }
    }
    return driverClassIndex;
}

function ld_GetRelDriverName(relPosition) {
    // Data expected is 'Ahead_01', 'Behind_00'
    // -> PersistantTrackerPlugin.DriverAhead_01_Name
    const driverName = ld_getSettings('driverName');
    if ( $prop('PersistantTrackerPlugin.Driver'+relPosition+'_Name') ) {
        const name = $prop('PersistantTrackerPlugin.Driver'+relPosition+'_Name');
        return ld_formatName(name, driverName);
    } else {
        return '';
    }
}

function ld_GetRelBestLapTime(relPosition) {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.Driver'+relPosition+'_BestLapTime')) ==  0 ) {
        return '--:--.---';
    } else {
        return $prop('PersistantTrackerPlugin.Driver'+relPosition+'_BestLapTime');
    }
}

function ld_GetRelLastLapTime(relPosition) {
    if ( timespantoseconds($prop('PersistantTrackerPlugin.Driver'+relPosition+'_LastLapTime')) ==  0 ) {
        return '--:--.---';
    } else {
        return $prop('PersistantTrackerPlugin.Driver'+relPosition+'_LastLapTime');
    }
}

function ld_GetRelBestColor(relPosition) {
    if ( driverdeltatobest($prop('PersistantTrackerPlugin.Driver'+relPosition+'_Position')) == 0 ) {
        return ld_theme('ld_uiFastest');
    } else {
        return ld_theme('ld_uiTitle');
    }
}

function ld_GetRelDriverColor(relPosition) {
    // Data expected is 'Ahead_01', 'Behind_00'
    
    let driver_lap = timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ));
    if (driver_lap > 0 && !ld_isQuali()) {
        let leaderboardPosition = $prop('PersistantTrackerPlugin.Driver' + relPosition + '_Position');
        let gapToPlayer = drivergaptoplayer(leaderboardPosition);
        let relativeGapToPlayer = driverrelativegaptoplayer(leaderboardPosition);
        let opponentLapHighPrecision = drivercurrentlaphighprecision(leaderboardPosition);
        let playerLapHighPrecision = drivercurrentlaphighprecision(getplayerleaderboardposition());
        let laps = Math.abs(opponentLapHighPrecision - playerLapHighPrecision);

        if (gapToPlayer < 0 && (laps > 1 || relativeGapToPlayer >= 0)) {
            return ld_theme('ld_tableAhead');
        } else if (gapToPlayer > 0 && (laps > 1 || relativeGapToPlayer <= 0)) {
            return ld_theme('ld_tableBehind');
        } else {
            return ld_theme('ld_tableOpponent');
        }
    } else {
        return ld_theme('ld_tableOpponent');
    }
}

function ld_GetRelCarLogo (relPosition) {
    // Data expected is 'Ahead_01', 'Behind_00'
    // -> PersistantTrackerPlugin.DriverAhead_01_CarName
    // -> PersistantTrackerPlugin.DriverAhead_01_Position
    let carName;
    ( !$prop('PersistantTrackerPlugin.Driver'+relPosition+'_CarName') ) ? carName = 'none' : carName = $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CarName');
    const carBrand = carName.split(' ');
    let color = '';
    const driver_gap = drivergaptoplayer( $prop('PersistantTrackerPlugin.Driver'+relPosition+'_Position'));
    const driver_lap = timespantoseconds(driverlastlap( $prop('DataCorePlugin.GameData.BestLapOpponentPosition') ));
    if (driver_lap > 0 && $prop('DataCorePlugin.GameData.SessionTypeName') == 'Race') {
        if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameData.CurrentLap') >= 2 ) {
            color = '-red' // 2+ Laps Ahead;
        } else if (
            $prop('PersistantTrackerPlugin.Driver'+relPosition+'_CurrentLap') - $prop('DataCorePlugin.GameData.CurrentLap') <= -2 ) {
            color = '-blue' // 2- Laps Behind;
        } else {
            if ( driver_lap + driver_gap < (driver_lap * 0.15) ) {
                color = '-red' // Ahead;
            } else if ( driver_lap + driver_gap > driver_lap+(driver_lap * 0.85) ) {
                color = '-blue' // Behind;
            } else {
                color = '' // Same Lap;
            }
        }
    } else {
        color = '';
    }
    return 'logo-' + lcase(carBrand[0]) + color;
}

function ld_getGapTrackOpponentAhead() {
    // 0: Simhub
    // 1: Post it Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_GapTimeMode');

    if ( timingMode == 1) {
        return ld_formatTimeShort(sc_GetTeamPropertyFromAheadBehind(-1, 'RelativeGapToPlayer'));
    } else {
        return ld_formatTimeShort(driverrelativegaptoplayer(getopponentleaderboardposition_aheadbehind(-1)));
    }
}
function ld_getGapTrackOpponentBehind() {
    // 0: Simhub
    // 1: Post it Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_GapTimeMode');

    if ( timingMode == 1) {
        return ld_formatTimeShort(sc_GetTeamPropertyFromAheadBehind(1, 'RelativeGapToPlayer'));
    } else {
        return ld_formatTimeShort(driverrelativegaptoplayer(getopponentleaderboardposition_aheadbehind(1)));
    }
}

function ld_getGapClassOpponentAhead() {
    // 0: Simhub
    // 1: Post it Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_GapTimeMode');
    
    if ( timingMode == 1) {
        return ld_formatTimeShort(pc_GetTeamPropertyFromRelativePosition(-1, 'GapToPlayer'));
    } else {
        let myPosInClass = driverclassposition( getplayerleaderboardposition() );
        let oppInClass = myPosInClass - 1;
        let oppInLeaderboard = getopponentleaderboardposition_playerclassonly(oppInClass);
        return ( oppInLeaderboard == -1 ) ? null : '-' + ld_formatNumberShort( Math.abs(driverrelativegaptoplayer( oppInLeaderboard )) );
    }
}
function ld_getGapClassOpponentBehind() {
    // 0: Simhub
    // 1: Post it Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_GapTimeMode');
    
    if ( timingMode == 1) {
        return ld_formatTimeShort(pc_GetTeamPropertyFromRelativePosition(1, 'GapToPlayer'));
    } else {
        let myPosInClass = driverclassposition( getplayerleaderboardposition() );
        let oppInClass = myPosInClass + 1;
        let oppInLeaderboard = getopponentleaderboardposition_playerclassonly(oppInClass);
        return ( oppInLeaderboard == -1 ) ? null : '+' + ld_formatNumberShort( Math.abs(driverrelativegaptoplayer( oppInLeaderboard )) );
    }
}
function ld_getLapsClassOpponentAhead() {
    let myPosInClass = driverclassposition( getplayerleaderboardposition() );
    let oppInClass = myPosInClass - 1;
    let oppInLeaderboard = getopponentleaderboardposition_playerclassonly(oppInClass);
    return ( oppInLeaderboard == -1 ) ? null : '-' + Math.abs(drivercurrentlap( oppInLeaderboard ) - drivercurrentlap( getplayerleaderboardposition() )) + 'L';
}
function ld_getLapsClassOpponentBehind() {
    let myPosInClass = driverclassposition( getplayerleaderboardposition() );
    let oppInClass = myPosInClass + 1;
    let oppInLeaderboard = getopponentleaderboardposition_playerclassonly(oppInClass);
    return ( oppInLeaderboard == -1 ) ? null : '+' + Math.abs(drivercurrentlap( oppInLeaderboard ) - drivercurrentlap( getplayerleaderboardposition() )) + 'L';
}

function ld_formatName (name, mode) {
    if (name!=null) {
        name = name.replace('�0', 'E'); // replace unicode characters
        const full_name = name.split(' ');
        if ( full_name.length > 1 ) { // Check name for more than two parts (firstname & lastname)
            const first_name = full_name.shift();
            const last_name = full_name;
            if (mode == 1) {
                return first_name + ' ' + last_name.join(" ").substr(0,1) + '.';
            } else if (mode == 2) {
                return first_name + ' ' + last_name.join(" ");
            } else {
                return first_name.substr(0,1) + '. ' + last_name.join(" ");
            }
        } else {
            return name;
        }
    } else {
        return '';
    }
}


//
//
// Tires

function ld_getAvgValue(getAvgForProp, lapAvg) {
    let ld_getAverage = function (array) {
        let total = 0;
        let count = 0;
        array.forEach(function(item, index) {
            total += item;
            count++;
        });
        return total / count;
    }
    if(root["currentLap"] == null){
        root["currentLap"] = $prop('DataCorePlugin.GameData.CurrentLap');/*  */
    }
    let prop = $prop(getAvgForProp);
    if(root['prop']==null){
        root['prop'] = [];
    }
    if (!$prop('DataCorePlugin.GamePaused') && !$prop('DataCorePlugin.GameData.IsInPitLane') && !$prop('DataCorePlugin.GameRawData.Graphics.IsSetupMenuVisible') && prop != 0) {
        if ($prop('DataCorePlugin.GameData.CurrentLap') - root["currentLap"] < lapAvg && root['prop'].length <= 349) {
            root['prop'].push(prop);
        } else {
            root['prop'].push(prop);
            root['prop'].shift();
        }
    }
    if ($prop('DataCorePlugin.GameData.IsInPitLane') && $prop('DataCorePlugin.GameRawData.Graphics.IsSetupMenuVisible')) {
        root["currentLap"] = null; // Reset laps;
        prop = 0; // Reset Tyre;
    }
    if (  $prop('LovelyPlugin.ld_TiresLapAvgReset') ) {
        root['prop'] = [];
    }
    return ( Number.isNaN(ld_getAverage(root['prop'])) ) ? '0' : ld_getAverage(root['prop']);
}

function ld_getAvgTireTempColor(tire) {
    // Expected 'TyreTemperatureFrontLeft'
    let tempUnit = 0;
    if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Fahrenheit' ) {
        tempUnit = 1;
    } else if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Kelvin' ) {
        tempUnit = 2;
    }
    const lapAvg = ld_getSettings('tiresLapAvg');
    return mapthreecolors( 
        ld_getAvgValue(tire, lapAvg),
        coldTireTemp[tempUnit], optimumTireTemp[tempUnit], hotTireTemp[tempUnit],
        ld_theme('ld_uiTempCold'),
        ld_theme('ld_uiTempOptimum'),
        ld_theme('ld_uiTempHot')
    )
}

function ld_getTireTempColor(tire) {
    // Expected 'TyreTemperatureFrontLeft'
    let tempUnit = 0;
    if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Fahrenheit' ) {
        tempUnit = 1;
    } else if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Kelvin' ) {
        tempUnit = 2;
    }
    return mapthreecolors( 
        $prop(tire),
        coldTireTemp[tempUnit], optimumTireTemp[tempUnit], hotTireTemp[tempUnit],
        ld_theme('ld_uiTempCold'),
        ld_theme('ld_uiTempOptimum'),
        ld_theme('ld_uiTempHot')
    )
}

function ld_getTireCompound() {
    function getTyreCompound() {
        var tyreCompoundId = $prop('GameRawData.PlayerCarStatusData.m_visualTyreCompound')
        switch (tyreCompoundId) {
            case 16:
            case 20:
                return 'SOFT'
            case 17:
            case 21:
                return 'MED'
            case 18:
            case 22:
                return 'HARD'
            case 7:
                return 'INTER'
            case 8:
            case 15:
                return 'WET'
            case 19:
                return 'S.S'
            default:
                return 'SET'
        }
    }
    
    if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {
        return ucase($prop('DataCorePlugin.GameRawData.mTyreCompound01.value'))
    } else if ( ld_getSim() == 'F1' ) {
        return getTyreCompound() + ' ' + ($prop('DataCorePlugin.GameRawData.PlayerCarStatusData.m_tyresAgeLaps') + 1) + 'L'
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        if ( $prop('DataCorePlugin.GameRawData.CurrentPlayerTelemetry.mFrontTireCompoundIndex') == 0 ) {
            return 'SOFT';
        } else if ( $prop('DataCorePlugin.GameRawData.CurrentPlayerTelemetry.mFrontTireCompoundIndex') == 1 ) {
            return 'MED';
        } else if ( $prop('DataCorePlugin.GameRawData.CurrentPlayerTelemetry.mFrontTireCompoundIndex') == 2 ) {
            return 'HARD';
        } else {
            return 'WET';
        }
    } else if ( ld_getSim() == 'IRacing') {
        let compoundID = $prop('GameRawData.Telemetry.PlayerTireCompound');
        let compoundIDPlanned = $prop('GameRawData.Telemetry.PitSvTireCompound');
        if ( $prop('DataCorePlugin.GameData.CarId') == 'mercedesw13' ) {
            if ((compoundID == 0) && (compoundIDPlanned == 1)) { compoundText = 'SFT→MED'; }
            if ((compoundID == 0) && (compoundIDPlanned == 2)) { compoundText = 'SFT→HARD'; }
            if ((compoundID == 1) && (compoundIDPlanned == 0)) { compoundText = 'MED→SFT'; } 
            if ((compoundID == 1) && (compoundIDPlanned == 2)) { compoundText = 'MED→HRD'; } 
            if ((compoundID == 2) && (compoundIDPlanned == 0)) { compoundText = 'HRD→SFT'; } 
            if ((compoundID == 2) && (compoundIDPlanned == 1)) { compoundText = 'HRD→MED'; } 
            if ((compoundID == 0) && (compoundIDPlanned == 0)) { compoundText = 'SOFT'; }
            if ((compoundID == 1) && (compoundIDPlanned == 1)) { compoundText = 'MED'; }
            if ((compoundID == 2) && (compoundIDPlanned == 2)) { compoundText = 'HARD'; }
        } else {
            if ((compoundID == 0) && (compoundIDPlanned == 1)) { compoundText = 'DRY→WET'; }
            if ((compoundID == 1) && (compoundIDPlanned == 0)) { compoundText = 'WET→DRY'; } 
            if ((compoundID == 0) && (compoundIDPlanned == 0)) { compoundText = 'DRY'; }
            if ((compoundID == 1) && (compoundIDPlanned == 1)) { compoundText = 'WET'; }
        }
        return compoundText;
    } else {
        if ($prop('GameRawData.Graphics.TyreCompound') != 'wet_compound') {
            return 'DRY ' + $prop('GameRawData.Graphics.currentTyreSet');
        } else {
            return 'WET ' + $prop('GameRawData.Graphics.currentTyreSet');
        }
    }
}

function ld_tireSlipLock(tire) {
    var wheelSlip;
    var wheelSpeed;
    var tire = tire;

    if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {
        wheelSlip = ( $prop('DataCorePlugin.GameRawData.mTyreGrip'+tire) < 0.1 ) ? 2 : 0;
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' || $prop('DataCorePlugin.CurrentGame') == 'LMU' ) {
        wheelSlip = $prop('DataCorePlugin.GameRawData.mTyreSlipSpeed'+tire);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( $prop('DataCorePlugin.CurrentGame').startsWith('F120') ) {
        if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 > 25) {
            return ld_themeImage('slip');
        } else if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 < -50) {
            return ld_themeImage('lock');
        } else {
            return null;
        }

    } else { // Default
        wheelSlip = $prop('DataCorePlugin.GameRawData.Physics.WheelSlip'+tire);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
    }

    if ( wheelSlip > 1 ) {
        if ( ld_isIncreasing($prop('DataCorePlugin.GameData.SpeedLocal')) ) {
            return ld_themeImage('slip');
        } else if ( wheelSpeed == 0 ) {
            return ld_themeImage('lock');
        } else {  
            return null;
        }
    } else {  
        return null;
    }
}

function ld_tireSlipLockColor(tire) {
    var wheelSlip;
    var wheelSpeed;
    var tire = tire;

    if ( $prop('DataCorePlugin.CurrentGame') == 'Automobilista2' ) {
        wheelSlip = ( $prop('DataCorePlugin.GameRawData.mTyreGrip'+tire) < 0.1 ) ? 2 : 0;
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( $prop('DataCorePlugin.CurrentGame') == 'RFactor2' || $prop('DataCorePlugin.CurrentGame') == 'LMU' ) {
        wheelSlip = $prop('DataCorePlugin.GameRawData.mTyreSlipSpeed'+tire);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( $prop('DataCorePlugin.CurrentGame').startsWith('F120') ) {
        if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 > 25) {
            return ld_theme('ld_uiBlue');
        } else if ($prop('GameRawData.PlayerMotionData.m_wheelSlip03') * 100 < -50) {
            return ld_theme('ld_uiYellow');
        } else {
            return ld_theme('ld_uiTitle');
        }

    } else { // Default
        wheelSlip = $prop('DataCorePlugin.GameRawData.Physics.WheelSlip'+tire);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
    }

    if ( wheelSlip > 1 ) {
        if ( ld_isIncreasing($prop('DataCorePlugin.GameData.SpeedLocal')) ) {
            return ld_theme('ld_uiBlue');
        } else if ( wheelSpeed == 0 ) {
            return ld_theme('ld_uiYellow');
        } else {  
            return ld_theme('ld_uiTitle');
        }
    } else {  
        return ld_theme('ld_uiTitle');
    }
}


//
//
// Brakes
function ld_getAvgBrakeTempColor(brake) {
    // Expected 'TyreTemperatureFrontLeft'
    let tempUnit = 0;
    if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Fahrenheit' ) {
        tempUnit = 1;
    } else if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Kelvin' ) {
        tempUnit = 2;
    }
    const lapAvg = ld_getSettings('tiresLapAvg');
    const resetKey = ld_getSettings('tireLapAvgResetKey');
    return mapthreecolors( 
        ld_getAvgValue(brake, lapAvg, resetKey),
        coldBrakeTemp[tempUnit], optimumBrakeTemp[tempUnit], hotBrakeTemp[tempUnit],
        ld_theme('ld_uiTempCold'),
        ld_theme('ld_uiTempOptimum'),
        ld_theme('ld_uiTempHot')
    )
}

function ld_getBrakeTempColor(brake) {
    // Expected 'TyreTemperatureFrontLeft'
    let tempUnit = 0;
    if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Fahrenheit' ) {
        tempUnit = 1;
    } else if ( $prop('DataCorePlugin.GameData.TemperatureUnit') == 'Kelvin' ) {
        tempUnit = 2;
    }
    return mapthreecolors( 
        $prop(brake),
        coldBrakeTemp[tempUnit], optimumBrakeTemp[tempUnit], hotBrakeTemp[tempUnit],
        ld_theme('ld_uiTempCold'),
        ld_theme('ld_uiTempOptimum'),
        ld_theme('ld_uiTempHot')
    )
}


//
//
// Estimated Lap
function ld_getEstimatedLapTime() {
    // 0: Default
    // 1: Simhub
    // 2: Post it Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');

    if (timingMode == 2) {
        if ( timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) != 0 ) {
            return sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime');
        } else {
            return $prop('CurrentLapTime');
        }
    } else if ( timingMode == 1 ) {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) != 0 ) {
            return $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub');
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
            return $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased');
        } else {
            return $prop('CurrentLapTime');
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
            return $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased');
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
            return $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased');
        } else {
            return $prop('CurrentLapTime');
        }
    }
}

function ld_getEstimatedDelta() {
    // 0: Default
    // 1: Simhub
    // 2: Post it Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');

    if (timingMode == 2) {
        if ( timespantoseconds( sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedDelta')) != 0 ) {
            return ld_formatTime( sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedDelta'));
        } else {
            return ld_formatTime( 0 );
        }
    } else if (timingMode == 1) {
        if ( timespantoseconds( $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) != 0 ) {
            return ld_formatTime( $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub_EstimatedDelta'));
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
            return ld_formatTime( timespantoseconds( $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') ) );
        } else {
            return ld_formatTime( 0 );
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
            return ld_formatTime( timespantoseconds( $prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') ) );
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
            return ld_formatTime( timespantoseconds( $prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') ) );
        } else {
            return ld_formatTime( 0 );
        }
    }
}

function ld_getEstimatedLabel() {
    // 0: Default
    // 1: Simhub
    // 2: Post it Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');

    if (timingMode == 2) {
        if ( timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) != 0 ) {
            return 'ESTIMATED LAP';
        } else {
            return 'CURRENT LAP';
        }
    } else if (timingMode == 1) {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) != 0 ) {
            return 'ESTIMATED LAP';
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
            return 'ESTIMATED LAP (ALL TIME:                     )';
        } else {
            return 'CURRENT LAP';
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
            return 'ESTIMATED LAP';
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
            return 'ESTIMATED LAP (ALL TIME:                     )';
        } else {
            return 'CURRENT LAP';
        }
    }
}

function ld_getEstimatedLabelShow() {
    // 0: Default
    // 1: Simhub
    // 2: Post it Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');

    if (timingMode == 2) {
        return false;
    } else if ( timingMode == 1 ) {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) != 0 ) {
            return false;
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
            return true;
        } else {
            return false;
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
            return false;
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
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
    // 2: Post it Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');
    let timeDiffMine = null;
    let timeDiffOverall = null;

    if ( timingMode == 2 ) {
        if ( timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) != 0 ) {
            timeDiffMine = timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            timeDiffOverall = timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        }
    } else if ( timingMode == 1 ) {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) != 0 ) {
            if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) != 0 ) {
                timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            } else {
                timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub_EstimatedDelta'));
            }
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') );
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
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
            root["offTrack"]++;
        }
        if ( $prop('DataCorePlugin.GameData.TrackPositionPercent') < 0.001 ) {
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
    } else if ( ld_getSim() == 'AssettoCorsa' ) {
        return ld_timeDiff(timeDiffMine, timeDiffOverall);
    } else if ( ld_getSim() == "F1" ) {
        fastestLap = timespantoseconds(isnull(driverbestlap($prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1), '0:00.000'));
        if ( $prop('GameRawData.PlayerLapData.m_currentLapInvalid') == 0) {
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
    // 2: Post it Note (Plugin Required)
    let timingMode = $prop('LovelyPlugin.ld_EstimatedTimeMode');
    let timeDiffMine = null;
    let timeDiffOverall = null;

    if ( timingMode == 2 ) {
        if ( timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) != 0 ) {
            timeDiffMine = timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            timeDiffOverall = timespantoseconds(sc_GetTeamPropertyFromRelativePosition(0, 'EstimatedLapTime')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        }
    } else if ( timingMode == 1 ) {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) != 0 ) {
            if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) != 0 ) {
                timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            } else {
                timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub_EstimatedDelta'));
            }
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBasedSimhub')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( $prop('PersistantTrackerPlugin.AllTimeBest') );
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        }
    } else {
        if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) != 0 ) {
            timeDiffMine = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( $prop('DataCorePlugin.GameData.BestLapTime') );
            timeDiffOverall = timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_SessionBestBased')) - timespantoseconds( driverbestlap( getbestlapopponentleaderboardposition() ) );
        } else if ( timespantoseconds($prop('PersistantTrackerPlugin.EstimatedLapTime_AllTimeBestBased')) != 0 ) {
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
            root["offTrack"]++;
        }
        if ( $prop('DataCorePlugin.GameData.TrackPositionPercent') < 0.001 ) {
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
    } else if ( ld_getSim() == 'AssettoCorsa' ) {
        return ld_theme('ld_uiTimingText');
    } else if ( ld_getSim() == "F1" ) {
        fastestLap = timespantoseconds(isnull(driverbestlap($prop('DataCorePlugin.GameData.BestLapOpponentPosition')+1), '0:00.000'));
        if ( ! timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) > 0) {
            return ld_theme('ld_uiInvalidText');
        } else if ( $prop('GameRawData.PlayerLapData.m_currentLapInvalid') == 0) {
            return ld_theme('ld_uiTimingText');
        } else {
            return ld_theme('ld_uiInvalidText'); // red bg
        }
    } else {
        if ( $prop('DataCorePlugin.GameRawData.Graphics.isValidLap') == 1 ) {
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

//
//
// Sectors
function ld_sectorCount() {
    return $prop('DataCorePlugin.GameData.SectorsCount');
}

function ld_sectorSegmentWidth(sector) {
    if ( sector == ld_sectorCount() ) {
        return 160 / ld_sectorCount();
    } else {
        return 160 / ld_sectorCount() - 1;
    }
}

function ld_sectorSegmentPos(sector) {
    return (160 / ld_sectorCount() ) * (sector-1);
}


function ld_sectorSegmentColor(sector) {
    var timeDiff = timespantoseconds( currentlapgetsectortime(sector, false) ) - 
                timespantoseconds( bestsectortime(sector, false) );
    var timeDiffOverall = timespantoseconds( currentlapgetsectortime(sector, false) ) - 
                timespantoseconds( getbestsplittime(sector) );
    if (sector >= $prop('DataCorePlugin.GameData.CurrentSectorIndex') ) {
        return ld_theme('ld_uiNeutral');
    } else if ( timeDiffOverall <= 0 ) {
        return ld_theme('ld_uiFastest');
    } else if (timeDiff <= 0) {
        return ld_theme('ld_uiFaster');
    } else {
        return ld_theme('ld_uiSlower');
    }
}
function ld_sectorLastSegmentColor(sector) {
    var timeDiff = timespantoseconds( lastlapgetsectortime(sector, false) ) - 
                timespantoseconds( bestsectortime(sector, false) );
    var timeDiffOverall = timespantoseconds( lastlapgetsectortime(sector, false) ) - 
                timespantoseconds( getbestsplittime(sector) );
    if ( timeDiffOverall == 0 ) {
        return ld_theme('ld_uiFastest');
    } else if (timeDiff <= 0) {
        return ld_theme('ld_uiFaster');
    } else {
        return ld_theme('ld_uiSlower');
    }
}

function ld_driverSectorSegmentColor(driver, sector) {
    var timeDiff = timespantoseconds( driversectorcurrentlap( driver, sector, false) ) - 
                    timespantoseconds( driversectorbest( driver, sector, false) );
    var timeDiffOverall = timespantoseconds( driversectorcurrentlap( driver, sector, false) ) - 
                timespantoseconds( getbestsplittime( sector ) );
    if (sector >= drivercurrentsector( driver ) ) {
        return ld_theme('ld_uiNeutral');
    } else if ( timeDiffOverall <= 0 ) {
        return ld_theme('ld_uiFastest');
    } else if (timeDiff <= 0) {
        return ld_theme('ld_uiFaster');
    } else {
        return ld_theme('ld_uiSlower') ;
    }
}

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


//
//
// Car Class Data
function ld_getCarClass(carClassName) {
    var json_class = null;
    var class_data = null;
    if ( carClassName == null || carClassName == '' ) { return '---' };
    var carClassName = carClassName.trim();
    let getCarClassURL = 'https://raw.githubusercontent.com/Lovely-Sim-Racing/lovely-car-classes/main/data/car-classes.json';
    if( json_class == null ){
        json_class = downloadstring( 81920, getCarClassURL ); // Non Async
        if ( json_class != null && !json_class.startsWith('ERROR') ){
            class_data = JSON.parse(JSON.stringify(JSON.parse(json_class)));
        }
    }
    return ( class_data[carClassName] == null ) ? carClassName : class_data[carClassName];
}

function ld_getCarClassNameSize(carClassName) {
    if ( carClassName == null || carClassName == '' ) { return 17 };
    if ( carClassName.length <= 3 ) {
        return 17
    } else if ( carClassName.length == 4 ) {
        return 15
    } else  {
        return 13
    }
}

//
//
// General Vehicle Functions 
function ld_pitLimiterOn() {
    return ( $prop('DataCorePlugin.GameData.PitLimiterOn') ) ? true : false;
    //return ( $prop('DataCorePlugin.GameData.PitLimiterOn') || $prop('DataCorePlugin.GameRawData.Physics.PitLimiterOn') ) ? 1 : 0
}

function ld_isLaunchMode() {
    function isRace(sessionType) {
        return sessionType == 10 || sessionType == 11 || sessionType == 12
    }
    function is_Launch_Mode ()
    {
        if (isRace($prop('GameRawData.PacketSessionData.m_sessionType')))
        {
            if ($prop('DataCorePlugin.GameData.NewData.Clutch') > 50 && $prop('DataCorePlugin.GameData.NewData.SpeedKmh') <= 10)
                return true;
            else 
                return false;		
        }
        else
            return false;	
    }
    return is_Launch_Mode()
}

// P2P
function ld_p2pCount() {
    return $prop('DataCorePlugin.GameRawData.Telemetry.PlayerP2P_Count') + 's';
}


// Engine
function ld_getIgnitionState() {
    return ( $prop('DataCorePlugin.GameData.EngineIgnitionOn') ) ? true : false;
}

function ld_getEngineState() {
    if ( ld_getSim() == 'LMU' ) {
        return ( 
            $prop('DataCorePlugin.GameData.EngineStarted') ||
            $prop('DataCorePlugin.GameRawData.CurrentPlayerTelemetry.mElectricBoostMotorState') > 0 
        ) ? true : false
    } else {
        return ( 
            $prop('DataCorePlugin.GameData.EngineStarted') 
        ) ? true : false
    }
}

function ld_getElectricState() {
    if ( ld_getSim() == 'LMU' ) {
        return (
            $prop('DataCorePlugin.GameRawData.CurrentPlayerTelemetry.mElectricBoostMotorState') > 0 
        ) ? true : false
    } else {
        return false;
    }
}

//
//
// Generic
function ld_changed(delay, value) {
	root['ld_time'] = Math.floor($prop('DataCorePlugin.CustomExpression.CurrentDateTime').getTime())/1000;
	root['ld_oldstate'] = root['ld_oldstate'] == null ? value : root['ld_newstate'];
	root['ld_newstate'] = value;
	if (root['ld_newstate'] != root['ld_oldstate']) {
		root['ld_triggerTime'] = root['ld_time'];
	}
	return root['ld_triggerTime'] == null ? false : root['ld_time'] - root['ld_triggerTime'] <= delay/1000;
}


function ld_isQuali() {
    if ( ld_getSim() == 'IRacing' ) {
        return ( 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Open Qualify' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Lone Qualify' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Open Practice' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Practice' || 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Offline Testing'
        ) ? true : false;
    } else if ( ld_getSim() == 'Automobilista2' ) {
        return ( 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='QUALIFY' ||
            $prop('DataCorePlugin.GameData.SessionTypeName')=='PRACTICE'
        ) ? true : false;
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        return ( 
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Qualify' ||
            $prop('DataCorePlugin.GameData.SessionTypeName')=='Practice'
        ) ? true : false;
    } else if ( ld_getSim() == "F1" ) {
        return ( 
            $prop('GameRawData.PacketSessionData.m_sessionType') < 10
            // 0 = unknown, 1 = P1, 2 = P2, 3 = P3, 4 = Short P, 5 = Q1
            // 6 = Q2, 7 = Q3, 8 = Short Q, 9 = OSQ, 10 = R, 11 = R2
            // 12 = Time Trial
        ) ? true : false;
    } else {
        return ( 
            ucase($prop('DataCorePlugin.GameData.SessionTypeName')) =='QUALIFY' ||
            ucase($prop('DataCorePlugin.GameData.SessionTypeName')) =='PRACTICE'
        ) ? true : false;
    }
}

function ld_getSim() {
    let currentGame = $prop('DataCorePlugin.CurrentGame');
    switch (currentGame) {
        case "AssettoCorsaCompetizione": 
            return "ACC";
        case "AssettoCorsa": 
            return "AC";
        case "IRacing": 
            return "IRacing";
        case "Automobilista2": 
            return "Automobilista2";
        case "RFactor2": 
            return "RFactor2";
        case "LMU": 
            return "LMU";
        case "F12020":
        case "F12021":
        case "F12022":
        case "F12023":
        case "F12024":
            return "F1";
        default:
            return "generic";
    }
}

function ld_alertDelay(status, delay) {
    const alertStatus = ld_getSettings(status)
    const alertDelay = ld_getSettings(delay)

    if ( alertStatus == 0 ) { return 0 }
    if ( ld_getSim() == 'IRacing' ) {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && $prop('DataCorePlugin.GameRawData.Telemetry.LapCurrentLapTime') < alertDelay/1000 && timespantoseconds($prop('DataCorePlugin.GameRawData.Telemetry.LapCurrentLapTime')) != 0 ) {
            return 1
        } else {
            return 0
        }
    } else if ( ld_getSim() == 'Automobilista2' ) {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime')) < (alertDelay/1000) && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime')) != 0 ) {
            return 1
        } else {
            return 0
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 < alertDelay && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 != 0) {
            return 1
        } else {
            return 0
        }
    } else if ( ld_getSim() == "F1") {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 < alertDelay && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 != 0) {
            return 1
        } else {
            return 0
        }
    } else {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && $prop('DataCorePlugin.GameRawData.Graphics.iCurrentTime') < alertDelay && $prop('DataCorePlugin.GameRawData.Graphics.iCurrentTime') != 0 ) {
            return 1
        } else {
            return 0
        }
    }
}



function ld_formatTime(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.000', true);
	} else if (time > -100 && time < 100) {
		return format(time, '00.00', true);
	} else if (time > -1000 && time < 1000) {
		return format(time, '000.0', true);
	} else {
		return format(time, '000', true);
	}
}

function ld_formatTimeShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.00', true);
	} else if (time > -100 && time < 100) {
		return format(time, '00.0', true);
	} else {
		return format(time, '000', true);
	}
}

function ld_formatTimeVeryShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.0', true);
	} else if (time > -100 && time < 100) {
		return format(time, '00', true);
	} else {
		return format(time, '00', true);
	}
}

function ld_formatNumber(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.000', false);
	} else if (time > -100 && time < 100) {
		return format(time, '00.00', false);
	} else if (time > -1000 && time < 1000) {
		return format(time, '000.0', false);
	} else {
		return format(time, '000', false);
	}
}

function ld_formatNumberShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.00', false);
	} else if (time > -100 && time < 100) {
		return format(time, '00.0', false);
	} else {
		return format(time, '000', false);
	}
}

function ld_formatNumberVeryShort(time) {
    if (time > -10 && time < 10) {
		return format(time, '0.0', false);
	} else if (time > -100 && time < 100) {
		return format(time, '00', false);
	} else {
		return format(time, '00', false);
	}
}

function ld_truncateString(str, num) {
    if (str.length > num) {
        return str.slice(0, num) + "...";
    } else {
        return str;
    }
}

function ld_isIncreasing(value) {
    if(root['value']==null){
        root['value'] = [];
    }
    let expect = root['value'] - value;
    root['value'].push(value);
    if (root['value'].length > 1) {
        root['value'].shift();
    }
    return (expect < 0) ? true : false;
}

function ld_sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function ld_boardScroll(boardHeight) {
    //
    // I'm assuming all calculations will start after P3
    // boardHeight = Number of rows
    let maxScroll = $prop('OpponentsCount')-boardHeight;
    let currentPos = $prop('Position');
    let midPos = Math.round(boardHeight/2 + 3);
    let maxPos = Math.round(boardHeight/2);
    // maxScroll can't be smaller than 3 (P3)
    maxScroll = ( maxScroll < 3 ) ? 3 : maxScroll;
    if ( currentPos > midPos ) {
        if (maxScroll < currentPos - maxPos) {
            scrollPos = maxScroll;
        } else {
            scrollPos = currentPos - maxPos;
        }
    } else {
        scrollPos = 3; // Start board after P3 ...
    }
    return scrollPos;
}

function ld_boardScrollClass(boardHeight) {
    //
    // I'm assuming all calculations will start after P3
    // boardHeight = Number of rows
    let maxScroll = $prop('DataCorePlugin.GameData.PlayerClassOpponentsCount')-boardHeight;
    let currentPos = $prop('DataCorePlugin.GameRawData.Telemetry.PlayerCarClassPosition');
    let midPos = Math.round(boardHeight/2 + 3);
    let maxPos = Math.round(boardHeight/2);
    // maxScroll can't be smaller than 3 (P3)
    maxScroll = ( maxScroll < 3 ) ? 3 : maxScroll;
    if ( currentPos > midPos ) {
        if (maxScroll < currentPos - maxPos) {
            scrollPos = maxScroll;
        } else {
            scrollPos = currentPos - maxPos;
        }
    } else {
        scrollPos = 3; // Start board after P3 ...
    }
    return scrollPos;
}

function ld_nightMode () {
    let nightMode = ld_getSettings('nightMode');
    if ( nightMode ) {
        if ( ld_getSim() == 'ACC' ) { // ACC
            return ($prop('DataCorePlugin.GameRawData.Graphics.LightsStage') > 0 ) ? true : false;
        } else if ( ld_getSim() == 'Automobilista2' ) { // AMS2
            let mCarFlags = $prop('DataCorePlugin.GameRawData.mCarFlags');
            return ( mCarFlags.toString(2).substr(-1) == 1 ) ? true : false;
        } else if  ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) { // rF2  or LMU
            return ( $prop('DataCorePlugin.GameRawData.CurrentPlayer.mHeadlights') > 0 ) ? true : false;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function ld_trueDarkMode () {
    let trueDarkMode = $prop('LovelyPlugin.ld_TrueDarkModeState');
    let trueDarkModeNative = $prop('LovelyPlugin.ld_TrueDarkModeNative');
    if ( 
        $prop('variable.dashName') == 'LovelyPitWall' ||
        $prop('variable.dashName') == 'LovelyFlags' ||
        $prop('variable.dashName') == 'LovelySponsors' ||
        $prop('variable.dashName') == 'LovelyTower' ||
        $prop('variable.dashName') == 'LovelyOverlay'
    ) { return false; }

    if ( $prop('LovelyPlugin.ld_TrueDarkModeEnabled') ) {
        if ( trueDarkModeNative ) {
            if ( ld_getSim() =='Automobilista2') { // Automobilista 2
                let mCarFlags = $prop('DataCorePlugin.GameRawData.mCarFlags');
                var amsLights = ( mCarFlags.toString(2).substr(-1) == 1 ) ? true : false;
                return ( amsLights || trueDarkMode ) ? true : false;
            } /* else if  ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) { // rF2  or LMU
                return ( $prop('DataCorePlugin.GameRawData.CurrentPlayer.mHeadlights') >= trueDarkModeNative || $prop('variable.trueDarkMode') ) ? true : false;
            } */
            else if ( ld_getSim() == "ACC" ) { // Default and ACC
                if ( ACC_carList_singleLightsstage.includes( $prop('DataCorePlugin.GameData.CarId') ) ) {
                    return ( $prop('DataCorePlugin.GameRawData.Graphics.LightsStage') > 0 || trueDarkMode ) ? true : false;
                } else {
                    return ( $prop('DataCorePlugin.GameRawData.Graphics.LightsStage') > 1 || trueDarkMode ) ? true : false;
                }
            } else {
                return ( $prop('DataCorePlugin.GameRawData.Graphics.LightsStage') > 0 || trueDarkMode ) ? true : false;
            }
        } else {
            return trueDarkMode;
        }
    } else {
        return false;
    }
}

function ld_compactNumber(number) {
    if (number < 1000) {
        return number;
    } else if (number >= 1000 && number < 1_000_000) {
        return (number / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    } else if (number >= 1_000_000 && number < 1_000_000_000) {
        return (number / 1_000_000).toFixed(1).replace(/\.0$/, "") + "m";
    } else if (number >= 1_000_000_000 && number < 1_000_000_000_000) {
        return (number / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "b";
    } else if (number >= 1_000_000_000_000 && number < 1_000_000_000_000_000) {
        return (number / 1_000_000_000_000).toFixed(1).replace(/\.0$/, "") + "tr";
    }
}

function ld_compareVersions(local,remote) {
    let x=local.split('.').map(e=> parseInt(e));
    let y=remote.split('.').map(e=> parseInt(e));
    let z = "";

    // Make both versions numbers equal length
    while (y.length-x.length != 0) {
        if (y.length > x.length) {
            x.push(0)
        } else {
            y.push(0)
        }
    }

    for(i=0;i<x.length;i++) {
        if(x[i] === y[i]) {
            z+="e";
        } else
        if(x[i] > y[i]) {
            z+="m";
        } else {
            z+="l";
        }
    }
    if (!z.match(/[l|m]/g)) {
      return 0;
    } else if (z.split('e').join('')[0] == "m") {
      return 1;
    } else {
      return -1;
    }
}

function ld_analytics(screen) {
    const analytics = ld_getSettings('analytics');
    if ( analytics ) {
        const url = 'https://dash.ohmylovely.com/analytics/tracking.php?';
        let params = {
                sim: $prop('DataCorePlugin.CurrentGame'),
                app: $prop('variable.dashName'),
                ver: $prop('variable.dashVer'),
                screen: screen
            };
        var esc = encodeURIComponent;
        const query = Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('&');
        return url+query
    } else {
        return ''
    }
}

function ld_analyticsMFM(screen, mfmScreen) {
    const analytics = ld_getSettings('analytics');
    if ( analytics ) {
        const url = 'https://dash.ohmylovely.com/analytics/tracking.php?';
        let params = {
            sim: $prop('DataCorePlugin.CurrentGame'),
            app: $prop('variable.dashName'),
            ver: $prop('variable.dashVer'),
            screen: screen,
            mfm: $prop('variable.positionMFM'),
            mfmScreen: mfmScreen
        };
        var esc = encodeURIComponent;
        const query = Object.keys(params)
            .map(k => esc(k) + '=' + esc(params[k]))
            .join('& ');
        return url+query
    } else {
        return null
    }
}

function ld_getVersion(version_data) {
    // Break if error in JSON
    if ( version_data == null || version_data.startsWith('ERROR') ) { return false; }

    // Get current Version Number
    var currentVer = $prop('variable.dashVer');

    // Get Version Numbers
    const latestVer = JSON.parse(JSON.stringify(JSON.parse(version_data)));
    const checkVer = latestVer[$prop('variable.dashName')];
    const checkBetaVer = latestVer['beta'][$prop('variable.dashName')];

    // Check if currentVer is Beta
    const isPrivate = $prop('variable.isPrivate');

    if ( isPrivate && ld_compareVersions( currentVer, checkBetaVer ) == '-1' ) {
        return 'NEW PRIVATE VERSION AVAILABLE: ' + checkBetaVer + ' - Visit lsr.gg/discord'
    } else if ( ld_compareVersions( currentVer, checkVer ) == '-1' ) {
        return 'NEW VERSION AVAILABLE: ' + checkVer + ' - Visit lsr.gg/update'
    } else {
        return false; // Nothing New
    }

    // local = remote : 0 // Local version is the latest
    // local > remote : 1 // Local version is ahead of the latest
    // local < remote : -1 // New version available
}

function ld_displayVersion() {
    let membership = $prop('LovelyPlugin.ld_MembershipStatus');
    let membershipStatus = '';
    switch ( membership ) {
        case 5:
            membershipStatus = ' (Starter Member)';
            break;
        case 6:
            membershipStatus = ' (Pro Member)';
            break;
        case 7:
            membershipStatus = ' (Gold Member)';
            break;
        default: 
            membershipStatus = '';
    }
    const isPrivate = ( $prop('variable.isPrivate') ) ? membershipStatus : "";
    return $prop('variable.folderName') + " v" + $prop('variable.dashVer') + isPrivate
}