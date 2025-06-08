// temple-frontend/src/utils/hindicalendar.js
import { DateTime } from 'luxon';
import { calculateSunMoonPositions, calculateTimePeriods } from './astroUtils';
import Panchang from './Panchang.js';

export class HinduCalendar {
  constructor(date = new Date(), latitude = 53.755, longitude = 9.656) {
    this.date = new Date(date);
    this.latitude = latitude;
    this.longitude = longitude;
    this.timezone = 'Europe/Berlin';
    this.timezoneOffset = 2;
    this.hasDetailedData = false;
  }

  async calculateAll() {
    try {
      const berlinTime = DateTime.fromJSDate(this.date).setZone(this.timezone);
      const utcOffset = berlinTime.offset / 60;

      // Calculate basic astronomical data
      const sunData = calculateSunMoonPositions(this.date, this.latitude, this.longitude);
      const timePeriods = calculateTimePeriods(sunData.sunrise, sunData.sunset, this.date);

      // Initialize and calculate Panchang
      const panchang = new Panchang();
      panchang.calculate(this.date, this.latitude, this.longitude, this.timezone);

      // ===== CORE PANCHANG DATA =====
      this.Day = panchang.Day || {};
      this.Tithi = panchang.Tithi || {};
      this.Nakshatra = panchang.Nakshatra || {};
      this.Karna = panchang.Karna || {};
      this.Yoga = panchang.Yoga || {};
      this.paksha = panchang.Paksha || '';
      this.ritu = panchang.Ritu || '';
      this.samvatsara = panchang.Samvatsara || '';
      this.ayana = panchang.Ayana || '';
      
      // ===== ASTRONOMICAL DATA =====
      this.SunTimes = {
        sunrise: panchang.SunTimes?.sunrise || sunData.sunrise,
        sunset: panchang.SunTimes?.sunset || sunData.sunset
      };
      
      this.MoonTimes = {
        moonrise: panchang.MoonTimes?.moonrise || null,
        moonset: panchang.MoonTimes?.moonset || null
      };
      
      this.DayLength = panchang.DayLength || {
        day: this.calculateDuration(this.SunTimes.sunrise, this.SunTimes.sunset),
        night: this.calculateNightDuration(this.SunTimes.sunset, this.SunTimes.sunrise)
      };

      // ===== AUSPICIOUS/INAUSPICIOUS TIMES =====
      this.InauspiciousTimes = {
        rahukalam: panchang.InauspiciousTimes?.rahukalam || timePeriods.rahukalam,
        yamagandam: panchang.InauspiciousTimes?.yamagandam || timePeriods.yamagandam,
        gulikai: panchang.InauspiciousTimes?.gulikai || timePeriods.gulikai
      };
      
      this.AuspiciousTimes = {
        abhijit: panchang.AuspiciousTimes?.abhijit || timePeriods.abhijit
      };

      // ===== ZODIAC & PLANETARY DATA =====
      this.Raasi = panchang.Raasi || {};
      this.SuryaNakshatra = panchang.SuryaNakshatra || {};
      this.Ayanamsa = panchang.Ayanamsa || {};
      this.Lagna = panchang.Lagna || {};
      this.LagnaTimings = panchang.LagnaTimings || [];
      
      // ===== TIME-BASED CALCULATIONS =====
      this.Choghadiya = {
        day: panchang.Choghadiya?.day || this.calculateDayChoghadiya(this.SunTimes.sunrise, this.SunTimes.sunset),
        night: panchang.Choghadiya?.night || this.calculateNightChoghadiya(this.SunTimes.sunset, this.SunTimes.sunrise)
      };
      
      this.Hora = {
        day: panchang.Hora?.day || this.calculateDayHora(this.SunTimes.sunrise, this.SunTimes.sunset),
        night: panchang.Hora?.night || this.calculateNightHora(this.SunTimes.sunset, this.SunTimes.sunrise)
      };

      // ===== CALENDAR SYSTEMS =====
      this.SamvatYears = panchang.SamvatYears || this.calculateSamvatYears(this.date.getFullYear());
      this.SolarTithi = panchang.SolarTithi || {};

      // ===== FESTIVALS =====
      this.Festivals = panchang.Festivals || [];
      
      // Check if we have detailed data for the "More Info" button
      this.hasDetailedData = this.Choghadiya.day.length > 0 || 
                          this.Hora.day.length > 0 || 
                          this.LagnaTimings.length > 0;

      // Simplified properties for easy access
      this.tithi = this.Tithi.name || '';
      this.suryaNakshatra = this.SuryaNakshatra.name || '';
      this.chandraNakshatra = this.Nakshatra.name || '';
      this.yoga = this.Yoga.name || '';
      this.karana = this.Karna.name || '';
      this.lagna = this.Lagna.sign || '';
      this.sunrise = this.SunTimes.sunrise;
      this.sunset = this.SunTimes.sunset;

      //console.log('Full Panchang object:', panchang);
      console.log('Panchang calculation complete:', {
        date: this.date,
        location: `${this.latitude}, ${this.longitude}`,
        hasDetailedData: this.hasDetailedData
      });

    } catch (error) {
      console.error("HinduCalendar calculation failed:", error);
      throw error;
    }
  }

  // ===== HELPER METHODS =====
  
  calculateDuration(start, end) {
    if (!start || !end) return '--:--';
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  calculateNightDuration(sunset, sunriseNextDay) {
    if (!sunset || !sunriseNextDay) return '--:--';
    const nextDay = new Date(sunriseNextDay);
    nextDay.setDate(nextDay.getDate() + 1);
    return this.calculateDuration(sunset, nextDay);
  }

  calculateSamvatYears(year) {
    return {
      vikram: year + 57,
      saka: year - 78,
      kali: year + 3101,
      gujarati: year + 56
    };
  }

  calculateDayChoghadiya(sunrise, sunset) {
    // Default implementation if PanchangJS doesn't provide this
    const periods = ['Shubh', 'Rog', 'Udveg', 'Char', 'Labh', 'Amrit', 'Kaal', 'Shubh'];
    return this.calculateTimeSlots(periods, sunrise, sunset, 8);
  }

  calculateNightChoghadiya(sunset, sunriseNextDay) {
    const periods = ['Amrit', 'Char', 'Rog', 'Kaal', 'Labh', 'Udveg', 'Shubh', 'Amrit'];
    return this.calculateTimeSlots(periods, sunset, sunriseNextDay, 8);
  }

  calculateDayHora(sunrise, sunset) {
    const rulers = ['Surya', 'Shukra', 'Budha', 'Chandra', 'Shani', 'Guru', 'Mangal'];
    return this.calculateTimeSlots(rulers, sunrise, sunset, 12);
  }

  calculateNightHora(sunset, sunriseNextDay) {
    const rulers = ['Chandra', 'Shani', 'Guru', 'Mangal', 'Surya', 'Shukra', 'Budha'];
    return this.calculateTimeSlots(rulers, sunset, sunriseNextDay, 12);
  }

  calculateTimeSlots(labels, startTime, endTime, divisions) {
    const slots = [];
    const start = new Date(startTime);
    const end = new Date(endTime);
    const duration = (end - start) / divisions;
    
    for (let i = 0; i < divisions; i++) {
      const startSlot = new Date(start.getTime() + i * duration);
      const endSlot = new Date(start.getTime() + (i + 1) * duration);
      const labelIndex = i % labels.length;
      
      slots.push({
        name: labels[labelIndex],
        ruler: labels[labelIndex], // For Hora
        start: startSlot,
        end: endSlot
      });
    }
    
    return slots;
  }

  formatTime(date) {
    if (!date) return '--:--';
    return DateTime.fromJSDate(date).toFormat('HH:mm');
  }

  formatDuration(start, end) {
    return `${this.formatTime(start)} - ${this.formatTime(end)}`;
  }
}