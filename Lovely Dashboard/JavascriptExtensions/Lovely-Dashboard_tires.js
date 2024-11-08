//
//
// Tire Temperatures
// Returns the Tire Temperature Values per Sim
function ld_getTireTemps() {

    // 
    // [Celsius,Fahrenheit,Kelvin]
    // Generic Tyre Temps
    let coldTireTemp = [50,122,323];
    let optimumTireTemp = [85,185,358];
    let hotTireTemp = [120,248,393];

    // ACC
    if ( ld_getSim() == 'ACC' ) {
        if ( $prop('GameRawData.Graphics.TyreCompound') == 'wet_compound' ) {
            // Wet Temps
            coldTireTemp = [10,50,283];
            optimumTireTemp = [50,122,323];
            hotTireTemp = [100,212,373];
        } else {
            // Dry Temps
            coldTireTemp = [50,122,323];
            optimumTireTemp = [85,185,358];
            hotTireTemp = [120,248,393];
        }
    }

    // Race Room Racing Experience
    if ( ld_getSim() == 'RRRE') {
        let coldTireTempC = $prop('DataCorePlugin.GameRawData.TireTemp.FrontLeft.ColdTemp');
        let optimumTireTempC = $prop('DataCorePlugin.GameRawData.TireTemp.FrontLeft.OptimalTemp');
        let hotTireTempC = $prop('DataCorePlugin.GameRawData.TireTemp.FrontLeft.HotTemp');
        coldTireTemp = [
            coldTireTempC,
            ld_convertTemp(coldTireTempC,'C','F'),
            ld_convertTemp(coldTireTempC,'C','K')];
        optimumTireTemp = [
            optimumTireTempC,
            ld_convertTemp(optimumTireTempC,'C','F'),
            ld_convertTemp(optimumTireTempC,'C','K')];
        hotTireTemp = [
            hotTireTempC,
            ld_convertTemp(hotTireTempC,'C','F'),
            ld_convertTemp(hotTireTempC,'C','K')];
    }

    // F1 Compounds
    if ( ld_getSim() == 'F1' ) {
        if ( 
            // C1
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 20 &&
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 9 &&
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 14
        ) {
            coldTireTemp = [85,185,358];
            optimumTireTemp = [105,221,378];
            hotTireTemp = [125,257,398];
        } else if (
            // C2
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 19 ||
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 9 ||
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 13
        ) {
            coldTireTemp = [82,179,355];
            optimumTireTemp = [102,215,375];
            hotTireTemp = [122,251,395];
        } else if (
            // C3
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 18 ||
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 9 ||
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 12
        ) {
            coldTireTemp = [80,176,353];
            optimumTireTemp = [100,212,373];
            hotTireTemp = [120,248,393];
        } else if (
            // C4
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 17 ||
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 9 ||
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 11
        ) {
            coldTireTemp = [77,170,350];
            optimumTireTemp = [97,206,370];
            hotTireTemp = [117,242,390];
        } else if(
            // C5
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 16 ||
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 9 ||
            $prop('GameRawData.PlayerCarStatusData.m_actualTyreCompound') == 11
        ) {
            coldTireTemp = [75,167,348];
            optimumTireTemp = [95,203,368];
            hotTireTemp = [115,239,388];
        } else if (
            // Intermmediate
            $prop('GameRawData.PlayerCarStatusData.m_visualTyreCompound') == 7
        ) {
            coldTireTemp = [65,149,338];
            optimumTireTemp = [85,185,358];
            hotTireTemp = [105,221,378];
        } else if (
            // Full Wet
            $prop('GameRawData.PlayerCarStatusData.m_visualTyreCompound') == 8 ||
            $prop('GameRawData.PlayerCarStatusData.m_visualTyreCompound') == 15
        ) {
            coldTireTemp = [55,131,328];
            optimumTireTemp = [75,167,348];
            hotTireTemp = [95,203,368];
        }
    }

    return {
        'low':coldTireTemp,
        'optimum':optimumTireTemp,
        'high':hotTireTemp
    }

}

//
//
// Tire Pressures
// Returns the Tire Pressure Values per Sim
function ld_getTirePressures() {

    // 
    // [Psi, Kpa, Bar]
    // Generic Tyre Pressures
    let lowTirePressure = [24.5,168.9,1.68];
    let optimumTirePressure = [26.5,182.7,1.82];
    let highTirePressure = [28.5,196.5,1.96];

    // ACC
    if ( ld_getSim() == 'ACC' ) {
        if ( $prop('GameRawData.Graphics.TyreCompound') == 'wet_compound' ) {
            // Wet Temps
            lowTirePressure = [27.5,189.6,1.89];
            optimumTirePressure = [30.2,208.2,2.08];
            highTirePressure = [33.5,230.9,2.30];
        } else {
            // Dry Temps
            lowTirePressure = [24.5,168.9,1.68];
            optimumTirePressure = [26.5,182.7,1.82];
            highTirePressure = [28.5,196.5,1.96];
        }
    }

    return {
        'low':lowTirePressure,
        'optimum':optimumTirePressure,
        'high':highTirePressure
    }
}

//
//
// Brake Temperatures
// Returns the Brake Temperature Values per Sim
function ld_getBrakeTemps() {
    
    // 
    // [Celsius,Fahrenheit,Kelvin]
    // Generic Brake Temps
    let coldBrakeTemp = [150,302,423];
    let optimumBrakeTemp = [550,1022,823];
    let hotBrakeTemp = [1000,1832,1273];

    // ACC
    if ( ld_getSim() == 'ACC' ) {
        coldBrakeTemp = [150,302,423];
        optimumBrakeTemp = [550,1022,823];
        hotBrakeTemp = [1000,1832,1273];
    }

    // Race Room Racing Experience
    if ( ld_getSim() == 'RRRE') {
        let coldBrakeTempC = $prop('DataCorePlugin.GameRawData.BrakeTemp.FrontLeft.ColdTemp');
        let optimumBrakeTempC = $prop('DataCorePlugin.GameRawData.BrakeTemp.FrontLeft.OptimalTemp');
        let hotBrakeTempC = $prop('DataCorePlugin.GameRawData.BrakeTemp.FrontLeft.HotTemp');
        coldBrakeTemp = [
            coldBrakeTempC,
            ld_convertTemp(coldBrakeTempC,'C','F'),
            ld_convertTemp(coldBrakeTempC,'C','K')];
        optimumBrakeTemp = [
            optimumBrakeTempC,
            ld_convertTemp(optimumBrakeTempC,'C','F'),
            ld_convertTemp(optimumBrakeTempC,'C','K')];
        hotBrakeTemp = [
            hotBrakeTempC,
            ld_convertTemp(hotBrakeTempC,'C','F'),
            ld_convertTemp(hotBrakeTempC,'C','K')];
    }

    // F1
    if ( ld_getSim() == 'F1' ) {
        coldBrakeTemp = [300,572,573];
        optimumBrakeTemp = [600,1112,873];
        hotBrakeTemp = [1100,2012,1373];
    }

    return {
        'low':coldBrakeTemp,
        'optimum':optimumBrakeTemp,
        'high':hotBrakeTemp
    }
}


//
//
// Tires Temp Colour
function ld_getTireTempColor(tire) {
    // Expected 'TyreTemperatureFrontLeft'

    let tireTemp = ld_getTireTemps();
    let coldTireTemp = tireTemp['low'];
    let optimumTireTemp = tireTemp['optimum'];
    let hotTireTemp = tireTemp['high'];

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


//
//
// Brakes
function ld_getBrakeTempColor(brake) {
    // Expected 'BrakeTemperatureFrontLeft'

    let brakeTemp = ld_getBrakeTemps();
    let coldBrakeTemp = brakeTemp['low'];
    let optimumBrakeTemp = brakeTemp['optimum'];
    let hotBrakeTemp = brakeTemp['high'];

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
// Tires Pressure
function ld_getTirePressureColor(tire) {
    // Expected 'TyrePressureFrontLeft'
    // Psi, Kpa, Bar

    let tirePressure = ld_getTirePressures();
    let lowTirePressure = tirePressure['low'];
    let optimumTirePressure = tirePressure['optimum'];
    let highTirePressure = tirePressure['high'];

    let pressureUnit = 0;
    if ( $prop('TyrePressureUnit') == 'Kpa' ) {
        pressureUnit = 1;
    } else if ( $prop('TyrePressureUnit') == 'Bar' ) {
        pressureUnit = 2;
    }
    return mapthreecolors( 
        $prop(tire),
        lowTirePressure[pressureUnit], optimumTirePressure[pressureUnit], highTirePressure[pressureUnit],
        ld_theme('ld_uiTempCold'),
        ld_theme('ld_uiTempOptimum'),
        ld_theme('ld_uiTempHot')
    )
}
//
//
// Tires Pressure Values
function ld_getTirePressureValue() {
    // Psi, Kpa, Bar

    let tirePressure = ld_getTirePressures();
    let lowTirePressure = tirePressure['low'];
    let optimumTirePressure = tirePressure['optimum'];
    let highTirePressure = tirePressure['high'];

    let pressureUnit = 0;
    if ( $prop('TyrePressureUnit') == 'Kpa' ) {
        pressureUnit = 1;
    } else if ( $prop('TyrePressureUnit') == 'Bar' ) {
        pressureUnit = 2;
    }
    
    return {
        'low':lowTirePressure[pressureUnit],
        'optimum':optimumTirePressure[pressureUnit],
        'high':highTirePressure[pressureUnit]
    }
}


//
//
// Tire Compound
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
    
    if ( ld_getSim() == 'Automobilista2' ) {
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
    } else if ( ld_getSim() == 'ACC' ) {
        if ( $prop('GameRawData.Graphics.TyreCompound') == 'wet_compound') {
            return 'WET ' + $prop('GameRawData.Graphics.currentTyreSet');
        } else {
            return 'DRY ' + $prop('GameRawData.Graphics.currentTyreSet');
        }
    } else {
        return 'SET ' + $prop('GameRawData.Graphics.currentTyreSet');
    }
}

//
//
// Trie Slip or Lock
function ld_tireSlipLock(tire) {
    let wheelSlip;
    let wheelSpeed;

    if ( ld_getSim() == 'Automobilista2' ) {
        wheelSlip = ( $prop('DataCorePlugin.GameRawData.mTyreGrip'+tire) < 0.1 ) ? 2 : 0;
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        wheelSlip = $prop('DataCorePlugin.GameRawData.mTyreSlipSpeed'+tire);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( ld_getSim() == 'F1' ) {
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
    let wheelSlip;
    let wheelSpeed;

    if ( ld_getSim() == 'Automobilista2' ) {
        wheelSlip = ( $prop('DataCorePlugin.GameRawData.mTyreGrip'+tire) < 0.1 ) ? 2 : 0;
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        wheelSlip = $prop('DataCorePlugin.GameRawData.mTyreSlipSpeed'+tire);
        wheelSpeed = $prop('DataCorePlugin.GameRawData.Physics.WheelAngularSpeed'+tire);
        
    } else if ( ld_getSim() == 'F1' ) {
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