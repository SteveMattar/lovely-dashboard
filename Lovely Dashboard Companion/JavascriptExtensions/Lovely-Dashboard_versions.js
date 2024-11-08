//
//
// Current Dash Versions
const LovelyDashboardVer = "3.1.1";
const LovelyDashboardCurvedVer = "3.1.1";
const LovelyDashboardTKVer = "3.1.1";
const LovelyDashboardXLVer = "3.1.1";
const LovelyDashboardUXLVer = "3.1.1";
const LovelyOverlayVer = "3.1.1";
const LovelyDashboardCompanionVer = "2.1.1";
const LovelyFlagsVer = "2.1.1";
const LovelyTowerVer = "2.1.1";
const LovelyPitWallVer = "1.1.0";

//
//
// Minimum Software Versions
const shVer = "9.5.1";  
const pluginVer = "1.2.1.0";
const postitVer = "1.0.7.7";

function ld_getVersion(version_data) {
    // Break if error in JSON
    if ( version_data == null || version_data.startsWith('ERROR') ) { return false; }

    // Get current Version Number
    var currentVer = $prop('variable.dashVer');

    // Get Version Numbers
    const latestVer = JSON.parse(JSON.stringify(JSON.parse(version_data)));
    const checkVer = latestVer[$prop('variable.dashName')];
     
    if ( ld_compareVersions( currentVer, checkVer ) == '-1' ) {
        return 'NEW VERSION AVAILABLE: ' + checkVer + ' - Visit lsr.gg/dash'
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
    return $prop('variable.folderName') + " v" + $prop('variable.dashVer') + membershipStatus;
}