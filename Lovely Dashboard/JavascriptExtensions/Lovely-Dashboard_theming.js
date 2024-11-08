const folderName = $prop('variable.folderName');
const delayRingColor = ['#FF0029A6','#FFB58100','#FFA60000']; // Used for Pit Wall

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

//
//
// Theming
function ld_getTheme() {
    const trueDarkColor = $prop('LovelyPlugin.ld_TrueDarkModeColor');
    return trueDarkColor+1; // Bump one up because 0 is Default
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

function ld_nightMode () {
    let nightMode = $prop('LovelyPlugin.ld_NightMode');
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
                return ( $prop('DataCorePlugin.GameRawData.Graphics.LightsStage') > 1 || trueDarkMode ) ? true : false;
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

function ld_getDriverLogoFromAheadBehind(aheadBehind = 0) {
    return ld_getDriverLogoFromLeaderboardPosition( getopponentleaderboardposition_aheadbehind( aheadBehind) );
}

function ld_getDriverLogoFromLeaderboardPosition(leaderboardPosition) {

    if ( leaderboardPosition === null || leaderboardPosition === -1 ) { return null };

    let carName = drivercarname( leaderboardPosition );
    let carBrand = carName.split(' ').shift().toLowerCase();
    let color = '';
    let playerLeaderboardPosition = getplayerleaderboardposition();

    carBrand = ( carLogos.includes(carBrand) ) ? carBrand : 'default';

    if ( leaderboardPosition === playerLeaderboardPosition ) {
        color = '-driver';
    } else {
    
        let opponentLap = drivercurrentlap( leaderboardPosition );
        let playerLap = drivercurrentlap( playerLeaderboardPosition );

        if ( opponentLap > 0 && playerLap > 0 && !ld_isQuali() ) {
            let gapToPlayer = drivergaptoplayer( leaderboardPosition );
            let relativeGapToPlayer = driverrelativegaptoplayer( leaderboardPosition );
            let opponentLapHighPrecision = drivercurrentlaphighprecision( leaderboardPosition );
            let playerLapHighPrecision = drivercurrentlaphighprecision( playerLeaderboardPosition );
            let laps = Math.abs( opponentLapHighPrecision - playerLapHighPrecision );
            if ( gapToPlayer < 0 && ( laps > 1 || relativeGapToPlayer >= 0 ) ) {
                color = '-ahead';
            } else if ( gapToPlayer > 0 && ( laps > 1 || relativeGapToPlayer <= 0 ) ) {
                color = '-behind';
            } else {
                color = '-opponent';
            }
        } else {
            color = '-opponent';
        }
    }

    let api_url;
    if ( $prop('variable.dashName') == "LovelyDashboardTK" && !ld_trueDarkMode() ) {
        api_url = 'https://api.lsr.gg/assets/car-logos/tk-edition/';
    } else {
        api_url = 'https://api.lsr.gg/assets/car-logos/';
    }
    return ld_themeImage(api_url + 'logo-' + carBrand + color) + '.png';

    // return ld_themeImage('logo-' + carBrand + color);
}