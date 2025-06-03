import { DateTime } from 'luxon';
import { calculateSunMoonPositions, calculateTimePeriods } from './astroUtils';
//import Panchang from '@/libs/panchangJS/PanchangESM.js'; // Use Panchang.js if ESM fails
import Panchang from '@/libs/panchangJS/Panchang.js';
/**import {
  getSunMoonInfo,
  getRahukalamYamagandamGulikai,
  getAbhijitMuhurta,
  getLagna
} from '@/libs/panchangJS/Panchang.js';**/

export class HinduCalendar {
  constructor(date = new Date(), latitude = 53.755, longitude = 9.656) {
    this.date = new Date(date);
    this.latitude = latitude;
    this.longitude = longitude;
    this.timezone = 'Europe/Berlin';
  }
  

  async calculateAll() {
    try {
      const berlinTime = DateTime.fromJSDate(this.date).setZone(this.timezone);
      const utcOffset = berlinTime.offset / 60;

      // 🌞 Sunrise/Sunset
      const sunData = calculateSunMoonPositions(this.date, this.latitude, this.longitude);
      const timePeriods = calculateTimePeriods(sunData.sunrise, sunData.sunset, this.date);

      this.sunrise = sunData.sunrise;
      this.sunset = sunData.sunset;
      this.rahukalam = timePeriods.rahukalam;
      this.yamagandam = timePeriods.yamagandam;
      this.gulikai = timePeriods.gulikai;
      this.abhijit = timePeriods.abhijit;

      // 🌙 Actual Panchang from library
      /**const panchang = new Panchang({
        date: this.date,
        latitude: this.latitude,
        longitude: this.longitude,
        timezone: utcOffset
      });**/

      /**const panchang = new Panchang();
      panchang.calculate(this.date);**/

      const panchang = new Panchang();
      panchang.calculate(this.date, this.latitude, this.longitude, this.timezone);
      // Log everything to debug
      console.log('🧭 Panchang Object:',panchang ); 
      //console.log('🧭 sunMoon :', getSunMoonInfo(this.date, this.latitude, this.longitude, this.timezone));
      //console.log('🧭 inauspicious :', getRahukalamYamagandamGulikai(this.date, this.latitude, this.longitude, this.timezone));
      //console.log('🧭 abhijit :', getAbhijitMuhurta(this.date, this.latitude, this.longitude));
      //console.log('🧭 lagna :', getLagna(this.date, this.latitude, this.longitude, this.timezone));

      //await panchang.calculate();

      this.tithi = panchang.Tithi?.name || '';
      this.suryaNakshatra = panchang.SuryaNakshatra?.name || '';   // FIXED
      this.chandraNakshatra = panchang.Nakshatra?.name || '';
      this.yoga = panchang.Yoga?.name || '';                        // FIXED
      this.karana = panchang.Karna?.name || '';
      this.paksha = panchang.Paksha || '';                          // FIXED
      this.ritu = panchang.Ritu || '';                              // FIXED
      this.ayana = panchang.Ayanamsa?.name || '';                  // Already working
      this.samvatsara = panchang.Samvatsara || '';                  // FIXED
      this.lagna = panchang.Lagna?.sign || '';
      this.festivals = panchang.Festivals || [];

      function calculatePanchangam(dateString, lat, lon) {
  const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date passed to Panchangam');
    }

    try {
      const panchangData = getSunMoonInfo(date, lat, lon);
      console.log('Panchang_getmoon:', panchangData);
      return panchangData;
    } catch (err) {
      console.error('Panchang calculation failed:', err.message);
      throw err;
    }
  }


      console.log('Full Panchang object:', panchang);
    } catch (error) {
      console.error("HinduCalendar Error:", error);
    }
  }
}
