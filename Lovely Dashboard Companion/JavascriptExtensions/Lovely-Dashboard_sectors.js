
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