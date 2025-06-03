// src/libs/panchangjs/PanchangESM.js

import PanchangClass from './Panchang';

// Patch it if the original exports = PanchangClass
const Panchang = PanchangClass.default || PanchangClass;

export default Panchang;