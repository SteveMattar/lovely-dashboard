//
//
// Average Fuel Consumption
function ld_fuelAvgConsumption() {
    if ( 
        ld_getSim() == 'IRacing' ||
        ld_getSim() == 'RFactor2' ||
        ld_getSim() == 'Automobilista2' ||
        ld_getSim() == 'AC' ||
        ld_getSim() == 'LMU' ||
        ld_getSim() == 'RRRE' ) {
    
        return ld_formatNumberShort( $prop('DataCorePlugin.Computed.Fuel_LitersPerLap') )
    
    } else if ( ld_getSim() == 'F1' ) {
    
        return (($prop('GameRawData.PlayerCarSetup.m_fuelLoad') - $prop('GameRawData.PlayerCarStatusData.m_fuelInTank')) / $prop('CurrentLap')).toFixed(1)
    
    } else {
    
        return ld_formatNumberShort( $prop('DataCorePlugin.GameRawData.Graphics.FuelXLap') )
    
    }
}

//
//
// Fuel Remaining Laps
function ld_fuelRemainingLaps() {
    if ( 
        ld_getSim() == 'IRacing' ||
        ld_getSim() == 'RFactor2' ||
        ld_getSim() == 'Automobilista2' ||
        ld_getSim() == 'AC' ||
        ld_getSim() == 'LMU' ||
        ld_getSim() == 'RRRE' ) {
    
        if ($prop('DataCorePlugin.Computed.Fuel_RemainingLaps')>5 || $prop('DataCorePlugin.Computed.Fuel_RemainingLaps')==0) {
            return Math.round($prop('DataCorePlugin.Computed.Fuel_RemainingLaps'))
        } else {
            return $prop('DataCorePlugin.Computed.Fuel_RemainingLaps').toFixed(1)
        }
    
    
    }  else if ( ld_getSim() == 'F1' ) {
    
        if ($prop('DataCorePlugin.GameRawData.PlayerCarStatusData.m_fuelRemainingLaps')>5 || $prop('DataCorePlugin.GameRawData.PlayerCarStatusData.m_fuelRemainingLaps')==0) {
            return Math.round($prop('DataCorePlugin.GameRawData.PlayerCarStatusData.m_fuelRemainingLaps'))
        } else {
            return $prop('DataCorePlugin.GameRawData.PlayerCarStatusData.m_fuelRemainingLaps').toFixed(1)
        }
        
    } else {
    
        if ($prop('DataCorePlugin.GameRawData.Graphics.fuelEstimatedLaps')>5 || $prop('DataCorePlugin.GameRawData.Graphics.fuelEstimatedLaps')==0) {
            return Math.round($prop('DataCorePlugin.GameRawData.Graphics.fuelEstimatedLaps'))
        } else {
            return $prop('DataCorePlugin.GameRawData.Graphics.fuelEstimatedLaps').toFixed(1)
        }
    
    }
}


//
//
// Finish Line
function ld_fuelToFinish() {

    let estTotalLaps // Estimated laps left for the race
    let fuelRequired // Fuel requried for the entire race
    let reFuel // Re Fuel amount, if required
    let timeAgainst // Best or Last lap
    let totalLaps // Total laps for lap based races
    let remainingLaps // Remaining laps for lap based races


    if ( $prop('DataCorePlugin.CurrentGame') == 'IRacing' ) {
        if ($prop('DataCorePlugin.GameRawData.SessionData.SessionInfo.Sessions01.IsLimitedSessionLaps')) { 
            // Lap based
            totalLaps = $prop('DataCorePlugin.GameRawData.Telemetry.SessionLapsRemain')
            remainingLaps = totalLaps + (1-$prop('DataCorePlugin.GameRawData.Telemetry.LapDistPct'))
            fuelRequired = remainingLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap')
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel')
            return (reFuel < 0) ? Math.abs(reFuel) : 0
        } else {
            // Time based
            if ( $prop('DataCorePlugin.GameRawData.Telemetry.LapBestLapTime') == '-1' ) {
                timeAgainst = $prop('DataCorePlugin.GameRawData.Telemetry.LapLastLapTime')
            } else {
                timeAgainst = $prop('DataCorePlugin.GameRawData.Telemetry.LapBestLapTime')
            }
            estTotalLaps = $prop('DataCorePlugin.GameRawData.Telemetry.SessionTimeRemain') / timeAgainst;
            fuelRequired = estTotalLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap')
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel')
            return (reFuel < 0) ? Math.abs(reFuel) : 0
        }
    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {
        if ( $prop('TotalLaps') > 0) {
            // Lap Based
            totalLaps = $prop('DataCorePlugin.GameData.RemainingLaps')
            remainingLaps = totalLaps + (1-$prop('DataCorePlugin.GameRawData.Telemetry.LapDistPct'))
            fuelRequired = remainingLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap');
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
            if (reFuel < 0) {
                return Math.abs(reFuel)
            } else {
                return 0
            }
        } else {
            // Time Based
            if ( $prop('DataCorePlugin.GameRawData.mSessionFastestLapTime') == '-1' ) {
                timeAgainst = $prop('DataCorePlugin.GameRawData.mLastLapTime')
            } else {
                timeAgainst = $prop('DataCorePlugin.GameRawData.mSessionFastestLapTime')
            }
            estTotalLaps = timespantoseconds($prop('DataCorePlugin.GameData.SessionTimeLeft')) / timeAgainst
            fuelRequired = estTotalLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap')
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel')
            if (reFuel < 0) {
                return Math.abs(reFuel)
            } else {
                return 0
            }
        }
    } else if ( ld_getSim() == 'RRRE' ) {
        if ( $prop('TotalLaps') > 0) {
            // Lap Based
            //totalLaps = $prop('DataCorePlugin.GameData.RemainingLaps');
            remainingLaps = $prop('DataCorePlugin.GameData.RemainingLaps');
            fuelRequired = remainingLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap');
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
            
            if (reFuel < 0) {
                return Math.abs(reFuel)
            } else {
                return 0
            }
        
        } else {
            // Time Based
            if ( timespantoseconds(driverbestlap(getbestlapopponentleaderboardposition())) == 0 ) {
                timeAgainst = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime'));
            } else {
                timeAgainst = timespantoseconds(driverbestlap(getbestlapopponentleaderboardposition()));
            }
            estTotalLaps = timespantoseconds($prop('DataCorePlugin.GameData.SessionTimeLeft')) / timeAgainst
            fuelRequired = estTotalLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap')
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel')
            if (reFuel < 0) {
                return Math.abs(reFuel)
            } else {
                return 0
            }
        }

    } else if ( ld_getSim() == 'Automobilista2' ) {
        
        if ( $prop('DataCorePlugin.GameRawData.mLapsInEvent') > 0) {
            // Lap Based
            totalLaps = $prop('DataCorePlugin.GameData.RemainingLaps')
            remainingLaps = totalLaps + (1-$prop('DataCorePlugin.GameRawData.Telemetry.LapDistPct'))
            fuelRequired = remainingLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap');
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
            
            if (reFuel < 0) {
                return Math.abs(reFuel)
            } else {
                return 0
            }
        
        } else {
            // Time Based
            if ( $prop('DataCorePlugin.GameRawData.mSessionFastestLapTime') == '-1' ) {
                timeAgainst = $prop('DataCorePlugin.GameRawData.mLastLapTime')
            } else {
                timeAgainst = $prop('DataCorePlugin.GameRawData.mSessionFastestLapTime')
            }
            estTotalLaps = timespantoseconds($prop('DataCorePlugin.GameData.SessionTimeLeft')) / timeAgainst
            fuelRequired = estTotalLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap')
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel')
            if (reFuel < 0) {
                return Math.abs(reFuel)
            } else {
                return 0
            }
        }
    } else if ( ld_getSim() == 'F1' ) {
        
        if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) == 0 && timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) == 0 ) {
            return '-'
        }
        
        if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) == 0 ) {
            timeAgainst = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime'));
        } else {
            timeAgainst = timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime'));
        }
        
        estTotalLaps = $prop('GameRawData.PacketSessionData.m_sessionTimeLeft') / timeAgainst;
        
        fuelRequired = estTotalLaps * ($prop('GameRawData.PlayerCarSetup.m_fuelLoad')-$prop('GameRawData.PlayerCarStatusData.m_fuelInTank'))/$prop('CurrentLap');
        
        reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
        
        if (reFuel < 0) {
            return Math.abs(reFuel)
        } else {
            return 0
        }

    } else {

        if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) == 0 ) {
            timeAgainst = $prop('DataCorePlugin.GameRawData.Graphics.iLastTime')
        } else {
            timeAgainst = $prop('DataCorePlugin.GameRawData.Graphics.iBestTime')
        }
        
        estTotalLaps = $prop('DataCorePlugin.GameRawData.Graphics.SessionTimeLeft') / timeAgainst
        fuelRequired = estTotalLaps * $prop('DataCorePlugin.GameRawData.Graphics.FuelXLap')
        reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel')
        
        return (reFuel < 0) ? Math.abs(reFuel) : 0
        
    }

}

//
//
// Refuel
function ld_fuelToRefuel() {
    let estTotalLaps; // Estimated laps left for the race
    let fuelRequired; // Fuel requried for the entire race
    let reFuel; // Re Fuel amount, if required
    let timeAgainst; // Best or Last lap
    let carMaxFuel; // Max Fuel Capacity
    let totalLaps; // Total laps for lap based races
    let remainingLaps; // Remaining laps for lap based races

    if ( ld_getSim() == 'IRacing' ) {
        
        if ($prop('DataCorePlugin.GameRawData.SessionData.SessionInfo.Sessions01.IsLimitedSessionLaps')) { 
            // Lap based	
            carMaxFuel = $prop('DataCorePlugin.GameData.CarSettings_MaxFUEL');
            totalLaps = $prop('DataCorePlugin.GameRawData.Telemetry.SessionLapsRemain')
            remainingLaps = totalLaps + (1-$prop('DataCorePlugin.GameRawData.Telemetry.LapDistPct'))
            fuelRequired = remainingLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap');
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
            
            if (reFuel > 0) {
                if (reFuel >= carMaxFuel) {
                    return carMaxFuel
                } else {
                    return Math.abs(reFuel)
                }
            } else {
                return 0
            }

        
        } else { 
        
            // Time based
            if ( $prop('DataCorePlugin.GameData.BestLapTime')=='00:00:00' ) {
                timeAgainst = $prop('DataCorePlugin.GameRawData.Telemetry.LapLastLapTime')
            } else {
                timeAgainst = $prop('DataCorePlugin.GameRawData.Telemetry.LapBestLapTime')
            }
            
            carMaxFuel = $prop('DataCorePlugin.GameData.CarSettings_MaxFUEL')
            estTotalLaps = $prop('DataCorePlugin.GameRawData.Telemetry.SessionTimeRemain') / timeAgainst;
            fuelRequired = estTotalLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap')
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel')
            
            if (reFuel > 0) {
                if (reFuel >= carMaxFuel) {
                    return carMaxFuel
                } else {
                    return Math.abs(reFuel)
                }
            } else {
                return 0
            }

        
        }

    } else if ( ld_getSim() == 'RFactor2' || ld_getSim() == 'LMU' ) {

        if ( $prop('TotalLaps') > 0) {
            // Lap Based
            carMaxFuel = $prop('DataCorePlugin.GameData.CarSettings_MaxFUEL');
            totalLaps = $prop('DataCorePlugin.GameData.TotalLaps');
            fuelRequired = totalLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap');
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
            if (reFuel > 0) {
                if (reFuel >= carMaxFuel) {
                    return carMaxFuel
                } else {
                    return Math.abs(reFuel)
                }
            } else {
                return 0
            }
        } else {
            // Time Based
            if ( $prop('DataCorePlugin.GameRawData.mSessionFastestLapTime') == '-1' ) {
                timeAgainst = $prop('DataCorePlugin.GameRawData.mLastLapTime')
            } else {
                timeAgainst = $prop('DataCorePlugin.GameRawData.mSessionFastestLapTime')
            }
            carMaxFuel = $prop('DataCorePlugin.GameData.MaxFuel');
            estTotalLaps = timespantoseconds($prop('DataCorePlugin.GameData.SessionTimeLeft')) / timeAgainst
            fuelRequired = estTotalLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap')
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
            if (reFuel > 0) {
                if (reFuel >= carMaxFuel) {
                    return carMaxFuel
                } else {
                    return Math.abs(reFuel)
                }
            } else {
                return 0
            }
        }

    } else if ( ld_getSim() == 'RRRE' ) {

        if ( $prop('TotalLaps') > 0) {
            // Lap Based
            carMaxFuel = $prop('DataCorePlugin.GameData.CarSettings_MaxFUEL');
            totalLaps = $prop('DataCorePlugin.GameData.TotalLaps');
            fuelRequired = totalLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap');
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
            if (reFuel > 0) {
                if (reFuel >= carMaxFuel) {
                    return carMaxFuel
                } else {
                    return Math.abs(reFuel)
                }
            } else {
                return 0
            }
        } else {
            // Time Based
            if ( timespantoseconds(driverbestlap(getbestlapopponentleaderboardposition())) == 0 ) {
                timeAgainst = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime'));
            } else {
                timeAgainst = timespantoseconds(driverbestlap(getbestlapopponentleaderboardposition()));
            }
            carMaxFuel = $prop('DataCorePlugin.GameData.MaxFuel');
            estTotalLaps = timespantoseconds($prop('DataCorePlugin.GameData.SessionTimeLeft')) / timeAgainst
            fuelRequired = estTotalLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap')
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
            if (reFuel > 0) {
                if (reFuel >= carMaxFuel) {
                    return carMaxFuel
                } else {
                    return Math.abs(reFuel)
                }
            } else {
                return 0
            }
        }

    } else if ( ld_getSim() == 'Automobilista2' ) {

        if ( $prop('DataCorePlugin.GameRawData.mLapsInEvent') > 0) {
            // Lap Based
            carMaxFuel = $prop('DataCorePlugin.GameData.CarSettings_MaxFUEL');
            totalLaps = $prop('DataCorePlugin.GameData.TotalLaps');
            fuelRequired = totalLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap');
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
            if (reFuel > 0) {
                if (reFuel >= carMaxFuel) {
                    return carMaxFuel
                } else {
                    return Math.abs(reFuel)
                }
            } else {
                return 0
            }
        } else {
            // Time Based
            if ( $prop('DataCorePlugin.GameRawData.mSessionFastestLapTime') == '-1' ) {
                timeAgainst = $prop('DataCorePlugin.GameRawData.mLastLapTime')
            } else {
                timeAgainst = $prop('DataCorePlugin.GameRawData.mSessionFastestLapTime')
            }
            carMaxFuel = $prop('DataCorePlugin.GameData.MaxFuel');
            estTotalLaps = timespantoseconds($prop('DataCorePlugin.GameData.SessionTimeLeft')) / timeAgainst
            fuelRequired = estTotalLaps * $prop('DataCorePlugin.Computed.Fuel_LitersPerLap')
            reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
            if (reFuel > 0) {
                if (reFuel >= carMaxFuel) {
                    return carMaxFuel
                } else {
                    return Math.abs(reFuel)
                }
            } else {
                return 0
            }
        }

    } else if ( ld_getSim() == 'F1' ) {
        
        if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) == 0 && timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime')) == 0 ) {
            return '-'
        }
        
        if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) == 0 ) {
            timeAgainst = timespantoseconds($prop('DataCorePlugin.GameData.LastLapTime'));
        } else {
            timeAgainst = timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime'));
        }
        
        carMaxFuel = $prop('DataCorePlugin.GameData.MaxFuel');
        
        estTotalLaps = $prop('GameRawData.PacketSessionData.m_sessionTimeLeft') / timeAgainst;
        
        fuelRequired = estTotalLaps * ($prop('GameRawData.PlayerCarSetup.m_fuelLoad')-$prop('GameRawData.PlayerCarStatusData.m_fuelInTank'))/$prop('CurrentLap');
        
        
        reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel');
        
        if (reFuel > 0) {
            if (reFuel >= carMaxFuel) {
                return carMaxFuel
            } else {
                return Math.abs(reFuel)
            }
        } else {
            return 0
        }

    } else {

        if ( timespantoseconds($prop('DataCorePlugin.GameData.BestLapTime')) == 0 ) {
            timeAgainst = $prop('DataCorePlugin.GameRawData.Graphics.iLastTime')
        } else {
            timeAgainst = $prop('DataCorePlugin.GameRawData.Graphics.iBestTime')
        }
        
        carMaxFuel = $prop('DataCorePlugin.GameData.MaxFuel')
        estTotalLaps = $prop('DataCorePlugin.GameRawData.Graphics.SessionTimeLeft') / timeAgainst
        fuelRequired = estTotalLaps * $prop('DataCorePlugin.GameRawData.Graphics.FuelXLap')
        reFuel = fuelRequired - $prop('DataCorePlugin.GameData.Fuel')
        
        if (reFuel > 0) {
            if (reFuel >= carMaxFuel) {
                return carMaxFuel
            } else {
                return Math.abs(reFuel)
            }
        } else {
            return 0
        }
        
    }
}