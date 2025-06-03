import * as SunCalc from 'suncalc';
import { DateTime } from 'luxon';

export function calculateSunMoonPositions(date, lat, lng) {
  try {
    // Convert to local time in Elmshorn
    const localDate = DateTime.fromJSDate(date).setZone('Europe/Berlin').toJSDate();
    
    const times = SunCalc.getTimes(localDate, lat, lng);
    const sunPos = SunCalc.getPosition(localDate, lat, lng);
    const moonPos = SunCalc.getMoonPosition(localDate, lat, lng);
    const moonIllum = SunCalc.getMoonIllumination(localDate);
    
    return {
      sunrise: times.sunrise,
      sunset: times.sunset,
      sunPosition: {
        azimuth: sunPos.azimuth * 180 / Math.PI,
        altitude: sunPos.altitude * 180 / Math.PI
      },
      moonPosition: {
        azimuth: moonPos.azimuth * 180 / Math.PI,
        altitude: moonPos.altitude * 180 / Math.PI,
        phase: moonIllum.phase,
        fraction: moonIllum.fraction
      }
    };
  } catch (error) {
    console.error("Error calculating positions:", error);
    return {
      sunrise: new Date(date.setHours(5, 0, 0, 0)),
      sunset: new Date(date.setHours(21, 0, 0, 0)),
      sunPosition: { azimuth: 0, altitude: 0 },
      moonPosition: { azimuth: 0, altitude: 0, phase: 0, fraction: 0 }
    };
  }
}

export function calculateTimePeriods(sunrise, sunset, date) {
  // Convert to local time
  const localDate = DateTime.fromJSDate(date).setZone('Europe/Berlin');
  const weekday = localDate.weekday - 1; // 0-6 for Sunday-Saturday
  
  // Calculate daytime duration in hours
  const dayDuration = (sunset - sunrise) / (1000 * 60 * 60);
  
  // Rahukalam calculation (traditional method)
  const rahukalamStart = [10.5, 9, 7.5, 6, 4.5, 3, 1.5][weekday];
  const rahukalamDuration = 1.5;
  
  // Yamagandam calculation
  const yamagandamStart = [1.5, 10.5, 9, 7.5, 6, 4.5, 3][weekday];
  
  // Gulikai calculation
  const gulikaiStart = [4.5, 3, 1.5, 10.5, 9, 7.5, 6][weekday];
  
  // Convert to actual times
  const rahukalam = {
    start: new Date(sunrise.getTime() + rahukalamStart * dayDuration / 12 * 60 * 60 * 1000),
    end: new Date(sunrise.getTime() + (rahukalamStart + rahukalamDuration) * dayDuration / 12 * 60 * 60 * 1000)
  };
  
  const yamagandam = {
    start: new Date(sunrise.getTime() + yamagandamStart * dayDuration / 12 * 60 * 60 * 1000),
    end: new Date(sunrise.getTime() + (yamagandamStart + rahukalamDuration) * dayDuration / 12 * 60 * 60 * 1000)
  };
  
  const gulikai = {
    start: new Date(sunrise.getTime() + gulikaiStart * dayDuration / 12 * 60 * 60 * 1000),
    end: new Date(sunrise.getTime() + (gulikaiStart + rahukalamDuration) * dayDuration / 12 * 60 * 60 * 1000)
  };
  
  // Abhijit Muhurta (noon - 24 minutes to noon + 24 minutes)
  const noon = new Date(sunrise.getTime() + dayDuration / 2 * 60 * 60 * 1000);
  const abhijit = {
    start: new Date(noon.getTime() - 24 * 60 * 1000),
    end: new Date(noon.getTime() + 24 * 60 * 1000)
  };
  
  return { rahukalam, yamagandam, gulikai, abhijit };
}