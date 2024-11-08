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
// Generic Helpers
function sh_RadiansToDegrees(radians) {
    let pi = 3.14159;
    return radians * 180 / pi;
}

function ld_changed(delay, value) {
	root['ld_time'] = Math.floor($prop('DataCorePlugin.CustomExpression.CurrentDateTime').getTime())/1000;
	root['ld_oldstate'] = root['ld_oldstate'] == null ? value : root['ld_newstate'];
	root['ld_newstate'] = value;
	if (root['ld_newstate'] != root['ld_oldstate']) {
		root['ld_triggerTime'] = root['ld_time'];
	}
	return root['ld_triggerTime'] == null ? false : root['ld_time'] - root['ld_triggerTime'] <= delay/1000;
}

function ld_formatName (name) {
    if (name!=null) {
        
        name = name.replace('�0', 'E'); // replace unicode characters
        let full_name = name.split(' ');
        let formatMode = $prop('LovelyPlugin.ld_DriverName');

        if ( full_name.length > 1 ) { // Check name for more than two parts (firstname & lastname)
            const first_name = full_name.shift();
            const last_name = full_name;
            if (formatMode == 1) {
                return first_name + ' ' + last_name.join(" ").substr(0,1) + '.';
            } else if (formatMode == 2) {
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
    } else if ( ld_getSim() == 'RRRE' ) {
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

function ld_convertTemp(value,source='C',target='F') {
    // Default Value is in Celsius/*  */
    if ( source == 'C') {
        if ( target == 'F' ) {
            return (value * 9/5) + 32; // Convert to Fahrenheit
        } else if ( target == 'K' ) {
            return value + 273.15; // Convert to Kelvin
        } else {
            return value
        }
    } else if ( source == 'F') {
        if ( target == 'C' ) {
            return (value - 32) * 5/9; // Convert to Celsius
        } else if ( target == 'K' ) {
            return (value - 32) * 5/9 + 273.15; // Convert to Kelvin
        } else {
            return value
        }
    } else if ( source == 'K') {
        if ( target == 'C' ) {
            return value - 273.15; // Convert to Celsius
        } else if ( target == 'F' ) {
            return (value - 273.15) * 9/5 + 32; // Convert to Fahrenheit
        } else {
            return value
        }
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
        case "RRRE": 
            return "RRRE";
        default:
            return "generic";
    }
}

function ld_alertDelay(status, delay) {
    const alertStatus = $prop('LovelyPlugin.ld_'+status);
    const alertDelay = $prop('LovelyPlugin.ld_'+delay);

    if ( alertStatus == 0 ) { return 0 }
    if ( ld_getSim() == 'IRacing' ) {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && $prop('DataCorePlugin.GameRawData.Telemetry.LapCurrentLapTime') < alertDelay/1000 && timespantoseconds($prop('DataCorePlugin.GameRawData.Telemetry.LapCurrentLapTime')) != 0 ) {
            return true
        } else {
            return false
        }
    } else if ( ld_getSim() == 'Automobilista2' ) {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime')) < (alertDelay/1000) && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime')) != 0 ) {
            return true
        } else {
            return false
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 < alertDelay && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 != 0) {
            return true
        } else {
            return false
        }
    } else if ( ld_getSim() == "F1") {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 < alertDelay && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 != 0) {
            return true
        } else {
            return false
        }
    } else if ( ld_getSim() == "RRRE") {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 < alertDelay && timespantoseconds($prop('DataCorePlugin.GameData.CurrentLapTime'))*1000 != 0) {
            return true
        } else {
            return false
        }
    } else {
        if ( $prop('DataCorePlugin.GameData.CompletedLaps') > 1 && $prop('DataCorePlugin.GameRawData.Graphics.iCurrentTime') < alertDelay && $prop('DataCorePlugin.GameRawData.Graphics.iCurrentTime') != 0 ) {
            return true
        } else {
            return false
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

function ld_boardScroll(boardHeight, startAfter = 3) {
    // 0: Default
    // 1: By Class
    // 2: Post-It Note (Plugin Required)
    let positionMode = $prop('LovelyPlugin.ld_PositionMode');
    let currentPos;

    if ( positionMode === 2 ) {
        currentPos = sc_GetTeamPropertyFromLeaderboardPosition( getplayerleaderboardposition(), 'LivePositionInClass' );
    } else if ( positionMode === 1 ) {
        currentPos = driverclassposition( getplayerleaderboardposition() );
    } else {
        currentPos = getplayerleaderboardposition();
    }

    //
    // boardHeight = Number of rows
    let maxScroll = $prop('OpponentsCount')-boardHeight;
    let midPos = Math.round(boardHeight/2 + startAfter);
    let maxPos = Math.round(boardHeight/2);
    // maxScroll can't be smaller than 'startAfter'
    maxScroll = ( maxScroll < startAfter ) ? startAfter : maxScroll;
    if ( currentPos > midPos ) {
        if (maxScroll < currentPos - maxPos) {
            scrollPos = maxScroll;
        } else {
            scrollPos = currentPos - maxPos;
        }
    } else {
        scrollPos = startAfter; // Start board after 'startAfter'' ...
    }
    return scrollPos;
}

function ld_scrollTicker(width, speed, fontSize, padding, text) {
    // width: The width of the scrolling area
    // speed: Control the scrol speed (1: slow, 5: fast)
    // padding: Add a safe margin on teh left hand side of the scroll
    // text: Text to scroll
    let titleLength = text.length * fontSize;

    if ( width-padding > titleLength ) {
        return padding; // Don't scrol if title is smaller thatn available area
    }

    if(root["scrollTitle"] == null){
        root["scrollTitle"] = width;
    }

    root["scrollTitle"] = root["scrollTitle"]-speed;

    if ( root["scrollTitle"] <= (titleLength - padding) * -1 ) {
        return root["scrollTitle"] = width;
    } else {
        return root["scrollTitle"];
    }
}

function ld_isToday(date1, date2) {
	var date1_month = date1.getMonth();
	var date1_day = date1.getDate();
	var date1_year = date1.getFullYear();
	var date2_month = date2.getMonth();
	var date2_day = date2.getDate();
	var date2_year = date2.getFullYear();
	return ( date1_month == date2_month && date1_day == date2_day && date1_year == date2_year ) ? true : false;
}

function ld_isValidDate(stringDate) {
    return !isNaN(Date.parse(stringDate));
}

function ld_isSessionTimeLimited() {
    if ( ld_getSim() == 'RRRE' ) {
        return ( $prop('DataCorePlugin.GameRawData.SessionTimeRemaining') > 0 ) ? true : false;
    } else if ( ld_getSim() == 'LMU' || ld_getSim() == 'RFactor2' ) {
        return ( $prop('DataCorePlugin.GameData.TotalLaps') == 0 ) ? true : false;
    } else {
        return ld_isValidDate($prop('DataCorePlugin.GameData.SessionTimeLeft'));
    }

    /*
    return  $prop('DataCorePlugin.GameData.RemainingLaps') + ' / ' +
            $prop('DataCorePlugin.GameData.TotalLaps') + ' / ' + 
            $prop('DataCorePlugin.GameData.SessionTimeLeft') + ' / ' + 
            $prop('DataCorePlugin.GameRawData.SessionTimeRemaining')
    */

    //return ( 
    //    ld_isValidDate($prop('DataCorePlugin.GameData.SessionTimeLeft'))
    //) ? true : false
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
    const analytics = $prop('LovelyPlugin.ld_Analytics');
    if ( analytics ) {
        const url = 'https://api.lsr.gg/analytics/tracking.php?';
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
    const analytics = $prop('LovelyPlugin.ld_Analytics');
    if ( analytics ) {
        const url = 'https://api.lsr.gg/analytics/tracking.php?';
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

