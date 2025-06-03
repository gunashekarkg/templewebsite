"use strict";
/* This is the copy of pcal panchangJS*/
// Panchang code
// globals
const d2r = Math.PI/180;
const r2d = 180/Math.PI;
const zn = ["Mesha","Vrushabha","Mithuna","Karkataka","Simha","Kanya","Tula","Vrushchika","Dhanu","Makara","Kumbha","Meena"];
const wd = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const range = [1,31,0,0,-3000,4000,0,23,0,59,-12,12,0,59];
const naks = ["Ashwini","Bharani","Kruthika","Rohini","Mrugasira","Aarudra","Punarwasu","Pushyami","Aslesha","Magha","Pubha","Uttara","Hasta","Chitta","Swati","Visakha","Anuradha","Jyesta","Mula","Purva-Shada","Uttara-Shaada","Sravana","Dhanista","Satabhisha","Purva-Bhadra","Uttara-Bhadra","Revathi"];
const tith =["Prathipadha","Dhvithiya","Thruthiya","Chathurthi","Panchami","Shasti","Sapthami","Ashtami","Navami","Dashami","Ekadasi","Dvadasi","Trayodasi","Chaturdasi","Purnami","Prathipadha","Dhvithiya","Thruthiya","Chathurthi","Panchami","Shasti","Sapthami","Ashtami","Navami","Dashami","Ekadasi","Dvadasi","Trayodasi","Chaturdasi","Amavasya"];
const kar = [ "Bawa", "Balava", "Kaulava", "Taitula", "Garaja", "Vanija", "Vishti", "Shakuni", "Chatushpada", "Nagava", "Kimstughana"];
const yog = ["Vishkambha","Prithi","Ayushman","Saubhagya","Sobhana","Atiganda","Sukarman","Dhrithi","Soola","Ganda","Vridhi","Dhruva","Vyaghata","Harshana","Vajra","Siddhi","Vyatipata","Variyan","Parigha","Siva","Siddha","Sadhya","Subha","Sukla","Bramha","Indra","Vaidhruthi"];
const tipnaks = [2,5,6,0,1,4,3,2,4,5,5,0,2,1,3,6,1,4,4,5,0,3,3,3,5,0,1];
let Lmoon, Lsun, skor, LmoonYoga, LsunYoga, dt;
let ayanamsa = 0;


//---------------------------------------------------------------------------
// Data on the Moon outrage in length.
//---------------------------------------------------------------------------
function corr(mlcor, mscor, fcor, dcor, lcor) {
  this.mlcor = mlcor;
  this.mscor = mscor;
  this.fcor = fcor;
  this.dcor = dcor;
  this.lcor = lcor;
}

function corr2(l, ml, ms, f, d) {
  this.l = l;
  this.ml = ml;
  this.ms = ms;
  this.f = f;
  this.d = d;
}

const corrMoon = [
new corr( 0, 0, 0, 4, 13.902),
new corr( 0, 0, 0, 2, 2369.912),
new corr( 1, 0, 0, 4, 1.979),
new corr( 1, 0, 0, 2, 191.953),
new corr( 1, 0, 0, 0, 22639.500),
new corr( 1, 0, 0, -2, -4586.465),
new corr( 1, 0, 0, -4, -38.428),
new corr( 1, 0, 0, -6, -0.393),
new corr( 0, 1, 0, 4, -0.289),
new corr( 0, 1, 0, 2, -24.420),
new corr( 0, 1, 0, 0, -668.146),
new corr( 0, 1, 0, -2, -165.145),
new corr( 0, 1, 0, -4, -1.877),
new corr( 0, 0, 0, 3, 0.403),
new corr( 0, 0, 0, 1, -125.154),
new corr( 2, 0, 0, 4, 0.213),
new corr( 2, 0, 0, 2, 14.387),
new corr( 2, 0, 0, 0, 769.016),
new corr( 2, 0, 0, -2, -211.656),
new corr( 2, 0, 0, -4, -30.773),
new corr( 2, 0, 0, -6, -0.570),
new corr( 1, 1, 0, 2, -2.921),
new corr( 1, 1, 0, 0, -109.673),
new corr( 1, 1, 0, -2, -205.962),
new corr( 1, 1, 0, -4, -4.391),
new corr( 1, -1, 0, 4, 0.283),
new corr( 1, -1, 0, 2, 14.577),
new corr( 1, -1, 0, 0, 147.687),
new corr( 1, -1, 0, -2, 28.475),
new corr( 1, -1, 0, -4, 0.636),
new corr( 0, 2, 0, 2, -0.189),
new corr( 0, 2, 0, 0, -7.486),
new corr( 0, 2, 0, -2, -8.096),
new corr( 0, 0, 2, 2, -5.741),
new corr( 0, 0, 2, 0, -411.608),
new corr( 0, 0, 2, -2, -55.173),
new corr( 0, 0, 2, -4, 0.025),
new corr( 1, 0, 0, 1, -8.466),
new corr( 1, 0, 0, -1, 18.609),
new corr( 1, 0, 0, -3, 3.215),
new corr( 0, 1, 0, 1, 18.023),
new corr( 0, 1, 0, -1, 0.560),
new corr( 3, 0, 0, 2, 1.060),
new corr( 3, 0, 0, 0, 36.124),
new corr( 3, 0, 0, -2, -13.193),
new corr( 3, 0, 0, -4, -1.187),
new corr( 3, 0, 0, -6, -0.293),
new corr( 2, 1, 0, 2, -0.290),
new corr( 2, 1, 0, 0, -7.649),
new corr( 2, 1, 0, -2, -8.627),
new corr( 2, 1, 0, -4, -2.740),
new corr( 2, -1, 0, 2, 1.181),
new corr( 2, -1, 0, 0, 9.703),
new corr( 2, -1, 0, -2, -2.494),
new corr( 2, -1, 0, -4, 0.360),
new corr( 1, 2, 0, 0, -1.167),
new corr( 1, 2, 0, -2, -7.412),
new corr( 1, 2, 0, -4, -0.311),
new corr( 1, -2, 0, 2, 0.757),
new corr( 1, -2, 0, 0, 2.580),

new corr( 1, -2, 0, -2, 2.533),
new corr( 0, 3, 0, -2, -0.344),
new corr( 1, 0, 2, 2, -0.992),
new corr( 1, 0, 2, 0, -45.099),
new corr( 1, 0, 2, -2, -0.179),
new corr( 1, 0, -2, 2, -6.382),
new corr( 1, 0, -2, 0, 39.528),
new corr( 1, 0, -2, -2, 9.366),
new corr( 0, 1, 2, 0, 0.415),
new corr( 0, 1, 2, -2, -2.152),
new corr( 0, 1, -2, 2, -1.440),
new corr( 0, 1, -2, -2, 0.384),
new corr( 2, 0, 0, 1, -0.586),
new corr( 2, 0, 0, -1, 1.750),
new corr( 2, 0, 0, -3, 1.225),
new corr( 1, 1, 0, 1, 1.267),
new corr( 1, -1, 0, -1, -1.089),
new corr( 0, 0, 2, -1, 0.584),
new corr( 4, 0, 0, 0, 1.938),
new corr( 4, 0, 0, -2, -0.952),
new corr( 3, 1, 0, 0, -0.551),
new corr( 3, 1, 0, -2, -0.482),
new corr( 3, -1, 0, 0, 0.681),
new corr( 2, 0, 2, 0, -3.996),
new corr( 2, 0, 2, -2, 0.557),
new corr( 2, 0, -2, 2, -0.459),
new corr( 2, 0, -2, 0, -1.298),
new corr( 2, 0, -2, -2, 0.538),
new corr( 1, 1, -2, -2, 0.426),
new corr( 1, -1, 2, 0, -0.304),
new corr( 1, -1, -2, 2, -0.372),
new corr( 0, 0, 4, 0, 0.418),
new corr( 2, -1, 0, -1, -0.352),
];


const corrMoon2 = [
new corr2( 0.127, 0, 0, 0, 6),
new corr2(-0.151, 0, 2, 0, -4),
new corr2(-0.085, 0, 0, 2, 4),
new corr2( 0.150, 0, 1, 0, 3),
new corr2(-0.091, 2, 1, 0, -6),
new corr2(-0.103, 0, 3, 0, 0),
new corr2(-0.301, 1, 0, 2, -4),
new corr2( 0.202, 1, 0, -2, -4),
new corr2( 0.137, 1, 1, 0, -1),
new corr2( 0.233, 1, 1, 0, -3),
new corr2(-0.122, 1, -1, 0, 1),
new corr2(-0.276, 1, -1, 0, -3),
new corr2( 0.255, 0, 0, 2, 1),
new corr2( 0.254, 0, 0, 2, -3),
new corr2(-0.100, 3, 1, 0, -4),
new corr2(-0.183, 3, -1, 0, -2),
new corr2(-0.297, 2, 2, 0, -2),
new corr2(-0.161, 2, 2, 0, -4),
new corr2( 0.197, 2, -2, 0, 0),
new corr2( 0.254, 2, -2, 0, -2),
new corr2(-0.250, 1, 3, 0, -2),
new corr2(-0.123, 2, 0, 2, 2),
new corr2( 0.173, 2, 0, -2, -4),
new corr2( 0.263, 1, 1, 2, 0),
new corr2( 0.130, 3, 0, 0, -1),
new corr2( 0.113, 5, 0, 0, 0),
new corr2( 0.092, 3, 0, 2, -2),
];



function daysInMonth(m,y) {
const g_days = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
if (((y % 4 == 0) && (y % 100 != 0)) || (y % 400 == 0)) g_days[1] = 29;
return g_days[m];
}


//-----------------------------------------------------------------------------------
// Calculating geotsent p avoid longitude Moon and angular sector p News.
// (2 sec accuracy. longitude)
//-----------------------------------------------------------------------------------
function moon(jd) {
  let tdays = jd - 2415020;
  let t = tdays / 36525;
  let t2 = t * t;
  let t3 = t * t * t;

  let ob = 23.452294 - 0.0130125 * t - 0.00000164 * t2 + 0.000000503 * t3;
  let l = 270.4337361 + 13.176396544528099 * tdays - 5.86 * t2 / 3600 + 0.0068 * t3 / 3600;
  let d = 350.7374861110581 + 445267.1142166667 * t - t2 * 1.436111132303874e-3 + 0.0000018888889 * t3;
  let pe = 334.329556 + 14648522.52 * t / 3600 - 37.17 * t2 / 3600 - 0.045 * t3 / 3600;
  let ms = 358.4758333333334 + 35999.04974999958 * t - t2 * 1.500000059604645e-4 - t3 * 3.3333333623078e-6;
  let ml = fix360(l - pe);
  let om = 259.183275 - 6962911.23 * t / 3600 + 7.48 * t2 / 3600 + 0.008 * t3 / 3600;
  let f = fix360(l - om);

  const r2rad = 360.0 * d2r;
  const tb = tdays * 1e-12;
  const t2c = tdays * tdays * 1e-16;

  const a1 = Math.sin(r2rad * (0.53733431 - 10104982 * tb + 191 * t2c));
  const a2 = Math.sin(r2rad * (0.71995354 - 147094228 * tb + 43 * t2c));
  const c2 = Math.cos(r2rad * (0.71995354 - 147094228 * tb + 43 * t2c));
  const a3 = Math.sin(r2rad * (0.14222222 + 1536238 * tb));
  const a4 = Math.sin(r2rad * (0.48398132 - 147269147 * tb + 43 * t2c));
  const c4 = Math.cos(r2rad * (0.48398132 - 147269147 * tb + 43 * t2c));
  const a5 = Math.sin(r2rad * (0.52453688 - 147162675 * tb + 43 * t2c));
  const a6 = Math.sin(r2rad * (0.84536324 - 11459387 * tb));
  const a7 = Math.sin(r2rad * (0.23363774 + 1232723 * tb + 191 * t2c));
  const a8 = Math.sin(r2rad * (0.5875 + 9050118 * tb));
  const a9 = Math.sin(r2rad * (0.61043085 - 67718733 * tb));

  const dlm = 0.84 * a3 + 0.31 * a7 + 14.27 * a1 + 7.261 * a2 + 0.282 * a4 + 0.237 * a6;
  const dpm = -2.1 * a3 - 2.076 * a2 - 0.840 * a4 - 0.593 * a6;
  const dkm = 0.63 * a3 + 95.96 * a2 + 15.58 * a4 + 1.86 * a5;
  const dls = -6.4 * a3 - 0.27 * a8 - 1.89 * a6 + 0.20 * a9;

  let dgc = (-4.318 * c2 - 0.698 * c4) / 3600.0 / 360.0;
  dgc = (1.000002708 + 139.978 * dgc);

  ml = d2r * (ml + (dlm - dpm) / 3600.0);
  ms = d2r * (ms + dls / 3600.0);
  f = d2r * (f + (dlm - dkm) / 3600.0);
  d = d2r * (d + (dlm - dls) / 3600.0);

  let lk = 0, lk1 = 0;
  const i1corr = 1.0 - 6.8320e-8 * tdays;
  const i2corr = dgc * dgc;

  for (let i = 0; i < 93; i++) {
    let arg = corrMoon[i].mlcor * ml + corrMoon[i].mscor * ms + corrMoon[i].fcor * f + corrMoon[i].dcor * d;
    let sinarg = Math.sin(arg);
    if (corrMoon[i].mscor !== 0) {
      sinarg *= i1corr;
      if (corrMoon[i].mscor === 2 || corrMoon[i].mscor === -2) sinarg *= i1corr;
    }
    if (corrMoon[i].fcor !== 0) sinarg *= i2corr;
    lk += corrMoon[i].lcor * sinarg;
  }

  for (let i = 0; i < 27; i++) {
    let arg = corrMoon2[i].ml * ml + corrMoon2[i].ms * ms + corrMoon2[i].f * f + corrMoon2[i].d * d;
    lk1 += corrMoon2[i].l * Math.sin(arg);
  }

  let dlid = 0;
  dlid += 0.822 * Math.sin(r2rad * (0.32480 - 0.0017125594 * tdays));
  dlid += 0.307 * Math.sin(r2rad * (0.14905 - 0.0034251187 * tdays));
  dlid += 0.348 * Math.sin(r2rad * (0.68266 - 0.0006873156 * tdays));
  dlid += 0.662 * Math.sin(r2rad * (0.65162 + 0.0365724168 * tdays));
  dlid += 0.643 * Math.sin(r2rad * (0.88098 - 0.0025069941 * tdays));
  dlid += 1.137 * Math.sin(r2rad * (0.85823 + 0.0364487270 * tdays));
  dlid += 0.436 * Math.sin(r2rad * (0.71892 + 0.0362179180 * tdays));
  dlid += 0.327 * Math.sin(r2rad * (0.97639 + 0.0001734910 * tdays));

  l = l + nutation(jd) + (dlm + lk + lk1 + dlid) / 3600.0;
  LmoonYoga = l;
  l = fix360(l);

  let vl = 13.176397;
  vl += 1.434006 * Math.cos(ml);
  vl += 0.280135 * Math.cos(2 * d);
  vl += 0.251632 * Math.cos(2 * d - ml);
  vl += 0.09742 * Math.cos(2 * ml);
  vl -= 0.052799 * Math.cos(2 * f);
  vl += 0.034848 * Math.cos(2 * d + ml);
  vl += 0.018732 * Math.cos(2 * d - ms);
  vl += 0.010316 * Math.cos(2 * d - ms - ml);
  vl += 0.008649 * Math.cos(ms - ml);
  vl -= 0.008642 * Math.cos(2 * f + ml);
  vl -= 0.007471 * Math.cos(ms + ml);
  vl -= 0.007387 * Math.cos(d);
  vl += 0.006864 * Math.cos(3 * ml);
  vl += 0.00665 * Math.cos(4 * d - ml);
  vl += 0.003523 * Math.cos(2 * d + 2 * ml);
  vl += 0.003377 * Math.cos(4 * d - 2 * ml);
  vl += 0.003287 * Math.cos(4 * d);
  vl -= 0.003193 * Math.cos(ms);
  vl -= 0.003003 * Math.cos(2 * d + ms);
  vl += 0.002577 * Math.cos(ml - ms + 2 * d);
  vl -= 0.002567 * Math.cos(2 * f - ml);
  vl -= 0.001794 * Math.cos(2 * d - 2 * ml);
  vl -= 0.001716 * Math.cos(ml - 2 * f - 2 * d);
  vl -= 0.001698 * Math.cos(2 * d + ms - ml);
  vl -= 0.001415 * Math.cos(2 * d + 2 * f);
  vl += 0.001183 * Math.cos(2 * ml - ms);
  vl += 0.00115 * Math.cos(d + ms);
  vl -= 0.001035 * Math.cos(d + ml);
  vl -= 0.001019 * Math.cos(2 * f + 2 * ml);
  vl -= 0.001006 * Math.cos(ms + 2 * ml);

  skor = vl;
  return l;
}


//----------------------------------------------------------------------
// Calculating geotsent p avoid longitude Sun.
// (the acuracy of 1 sec . longitude)
//----------------------------------------------------------------------
function sun(jd) {
    const d2r = Math.PI / 180;
    const r2d = 180 / Math.PI;

    // Days from 1900
    const tdays = jd - 2415020;
    const t = tdays / 36525;
    const t2 = t * t;
    const t3 = t * t * t;

    // Mean longitude of the Sun
    let ls = 279.696678 + 0.9856473354 * tdays + (1.089 / 3600) * t2;

    // Perihelion (longitude of perigee) of the Sun
    const pes = 101.220833 + (6189.03 / 3600) * t + (1.63 / 3600) * t2 + (0.012 / 3600) * t3;

    // Mean anomaly of the Sun
    const ms = fix360(ls - pes + 180);

    // Geometric anomaly (corrected)
    let g = ms;
    g += (0.266 * Math.sin(d2r * (31.8 + 119.0 * t)));
    g += (6.40 * Math.sin(d2r * (231.19 + 20.2 * t)));
    g += ((1.882 - 0.016 * t) * Math.sin(d2r * (57.24 + 150.27 * t)));
    g /= 3600;
    g += ms;

    // Eccentricity of Earth's orbit
    const ex = 0.01675104 - 0.0000418 * t - 0.000000126 * t2;

    // Solve Kepler's Equation to get the eccentric anomaly `u`
    const u = kepler(g, ex, 0.0000003);

    // Compute the true anomaly
    let truanom;
    const b = Math.sqrt((1 + ex) / (1 - ex));
    if (Math.abs(Math.PI - u) < 1e-10) {
        truanom = u;
    } else {
        truanom = 2.0 * Math.atan(b * Math.tan(u / 2));
    }
    truanom = fix360(truanom * r2d);

    // Periodic corrections
    const u1 = (153.23 + 22518.7541 * t) * d2r;
    const u2 = (216.57 + 45037.5082 * t) * d2r;
    const u3 = (312.69 + 32964.3577 * t) * d2r;
    const u4 = (350.74 + 445267.1142 * t - 0.00144 * t2) * d2r;
    const u5 = (315.6 + 893.3 * t) * d2r;
    const u6 = (353.4 + 65928.7155 * t) * d2r;

    let dl = 0.00134 * Math.cos(u1);
    dl += 0.00154 * Math.cos(u2);
    dl += 0.00200 * Math.cos(u3);
    dl += 0.00179 * Math.sin(u4);
    dl += 0.20200 * Math.sin(u5) / 3600;

    let dr = 0.00000543 * Math.sin(u1);
    dr += 0.00001575 * Math.sin(u2);
    dr += 0.00001627 * Math.sin(u3);
    dr += 0.00003076 * Math.cos(u4);
    dr += 0.00000927 * Math.sin(u6);

    // True longitude of the Sun
    let il = ls + dl + truanom - ms;

    // Solar aberration correction
    const r1 = 1.0000002 * (1 - ex * ex) / (1 + ex * Math.cos(d2r * truanom));
    const rs = r1 + dr;
    const ab = (20.496 * (1 - ex * ex) / rs) / 3600;

    // Final apparent longitude with nutation and aberration
    const nut = nutation(jd); // This function must be defined separately
    ls = il + nut - ab;
    return fix360(ls);
}

//----------------------------------------------------------------------------
// cal start and end of tithi (len = 12)and karana (len = 6)
//----------------------------------------------------------------------------
function tithi(jd, n1, tzone, len)
{
const s_t = {};
let flag;
let jdt = jd;
const knv = Math.floor(((jd - 2415020) / 365.25) * 12.3685);

for (let itit = n1; itit < (n1 + 2); ++itit) {
const aspect = len * itit; // sun n moon in the early tithi
flag = 0;
if (aspect == 0) {jdt = novolun(jd, knv); flag = 1;}
if (aspect == 360) {jdt = novolun(jd, (knv+1)); flag = 1;}
while (flag < 1) {
const Lsun0 = sun(jdt);
const Lmoon0 = moon(jdt);
const a = fix360(Lsun0 + aspect); // pt should be where luna
let asp1 = a - Lmoon0; // assymptots of the moon to ur point
if (asp1 > 180) asp1 -= 360;
if (asp1 < -180) asp1 += 360;
flag = 1;

if (Math.abs(asp1) > 0.001) {jdt += (asp1 / (skor - 1)); flag = 0;}
}
if (itit == n1) s_t.start = calData(jdt + (tzone - dt)/24);
if (itit == (n1 + 1)) s_t.end=calData(jdt + (tzone - dt)/24);
}
return s_t;
}


//----------------------------------------------------------------------------
// cal entry and exit moon in nakshatra
//----------------------------------------------------------------------------
function nakshatra(jd, n_naksh, tzone)
{
const s_t = {};
let flag;
let jdt = jd;

for (let inak = n_naksh; inak < (n_naksh + 2); ++inak) {
const n1 = fix360(inak*80/6); // co-ordinate start of nakshatra
flag = 0;
while (flag < 1) {
const Lmoon0 = fix360(moon(jdt) + ayanamsa);
let asp1 = n1 - Lmoon0; // distance frm moon before nakshatra(degree)
if (asp1 > 180) asp1 -= 360;
if (asp1 < -180) asp1 += 360;
flag = 1;
if (Math.abs(asp1) > 0.001) {jdt += (asp1 / skor); flag = 0;}
}
if (inak == n_naksh) s_t.start = calData(jdt + (tzone - dt)/24);
if (inak == (n_naksh + 1)) s_t.end = calData(jdt + (tzone - dt)/24);
}
return s_t;
}


//----------------------------------------------------------------------------
// cal begin and end of yoga
//----------------------------------------------------------------------------
function yoga(jd, zyoga, tzone)
{
const s_t = {};
let flag;
let jdt = jd;
let z = zyoga;
const nn_yoga = new Array(2);
nn_yoga[0] = Math.floor(z * 6 / 80) * 80 / 6;
nn_yoga[1] = (Math.floor(z * 6 / 80) + 1) * 80 / 6;
for (let iyog = 0; iyog < 2; ++iyog) {
flag = 0;
while (flag < 1) {
const Lsun0 = sun(jdt);
const Lmoon0 = moon(jdt);
const dmoonYoga = (LmoonYoga + ayanamsa - 491143.07698973856);
const dsunYoga = (LsunYoga + ayanamsa - 36976.91240579201);
//alert(LmoonYoga+"\r"+LsunYoga+"\r"+ayanamsa);
z = dmoonYoga + dsunYoga;
const asp1 = nn_yoga[iyog] - z;
flag = 1;
if (Math.abs(asp1) > 0.001) {jdt += (asp1 / (skor + 1.0145616633)); flag = 0;}
//if (Math.abs(asp1) > 0.001) {jdt += (asp1 / skor) + (58.13 * Math.sin(asp1*d2r)); flag = 0;}
}
if (iyog == 0) s_t.start= calData(jdt + (tzone - dt)/24);
if (iyog == 1) s_t.end=  calData(jdt + (tzone - dt)/24);
}
return s_t;
}


//-----------------------------------------------------------------------------
//cal time in the near past novoluna (err less then 2 min)
//-----------------------------------------------------------------------------
function novolun(jd, knv) {
    let t = (jd - 2415020) / 36525;
    let t2 = t * t;
    let t3 = t2 * t;

    let jdnv = 2415020.75933 + 29.53058868 * knv + 0.0001178 * t2 - 0.000000155 * t3;
    jdnv += 0.00033 * Math.sin((166.56 + 132.87 * t - 0.009173 * t2) * d2r);

    let m = 359.2242 + 29.10535608 * knv - 0.0000333 * t2 - 0.00000347 * t3;
    let ml = 306.0253 + 385.81691806 * knv + 0.0107306 * t2 + 0.00001236 * t3;
    let f = 21.2964 + 390.67050646 * knv - 0.0016528 * t2 - 0.00000239 * t3;

    m *= d2r;
    ml *= d2r;
    f *= d2r;

    let djd = (0.1734 - 0.000393 * t) * Math.sin(m);
    djd += 0.0021 * Math.sin(2 * m);
    djd -= 0.4068 * Math.sin(ml);
    djd += 0.0161 * Math.sin(2 * ml);
    djd -= 0.0004 * Math.sin(3 * ml);
    djd += 0.0104 * Math.sin(2 * f);
    djd -= 0.0051 * Math.sin(m + ml);
    djd -= 0.0074 * Math.sin(m - ml);
    djd += 0.0004 * Math.sin(2 * f + m);
    djd -= 0.0004 * Math.sin(2 * f - m);
    djd -= 0.0006 * Math.sin(2 * f + ml);
    djd += 0.001 * Math.sin(2 * f - ml);
    djd += 0.0005 * Math.sin(m + 2 * ml);

    return jdnv + djd;
}

//-----------------------------------------------------
// decision equation kepler (in rad)
//-----------------------------------------------------
function kepler(m, ex, err)
{
//val u0, delta;

m *= d2r;
let u0 = m;
err *= d2r;
let delta = 1;
while (Math.abs(delta) >= err) {
delta = (m + ex * Math.sin(u0) - u0) / (1 - ex * Math.cos(u0));
u0 += delta;
}
return u0;
}

//-----------------------------------------------------
// cal nutation in len
//-----------------------------------------------------
function nutation(jd) {
    let t = (jd - 2415020) / 36525;
    let t2 = t * t;

    let ls = 279.6967 + 36000.7689 * t + 0.000303 * t2;
    let l = 270.4341639 + 481267.8831417 * t - 0.0011333333 * t2;
    let ms = 358.4758333333334 + 35999.04974999958 * t - 0.00015 * t2;
    let ml = 296.1046083333757 + 477198.8491083336 * t + 0.0091916667 * t2;
    let d = 350.7374861110581 + 445267.1142166667 * t - 0.0014361111 * t2;
    let om = 259.1832750002543 - 1934.142008333206 * t + 0.0020777778 * t2;

    ls *= d2r;
    l *= d2r;
    ms *= d2r;
    ml *= d2r;
    d *= d2r;
    om *= d2r;

    let nut = (-17.2327 - 0.01737 * t) * Math.sin(om);
    nut += 0.2088 * Math.sin(2 * om);
    nut += 0.0675 * Math.sin(ml);
    nut -= 0.0149 * Math.sin(ml - d * d);
    nut -= 0.0342 * Math.sin(l * l - om);
    nut += 0.0114 * Math.sin(l * l - ml);
    nut -= 0.2037 * Math.sin(l * l);
    nut -= 0.0261 * Math.sin(l * l + ml);
    nut += 0.0124 * Math.sin(ls * ls - om);
    nut += 0.0214 * Math.sin(ls * ls - ms);
    nut -= 1.2729 * Math.sin(ls * ls);
    nut -= 0.0497 * Math.sin(ls * ls + ms);
    nut += 0.1261 * Math.sin(ms);

    return nut / 3600;
}

//-----------------------------------------------------
// Calculation ayanamsa (degrees)
//-----------------------------------------------------
function calcayan(jd) {
   const t = (jd - 2415020) / 36525;
// avg node len moon
   const om = 259.183275 - 1934.142008333206 * t + 0.0020777778 * t * t + 0.0000022222222 * t * t * t;
// avg len sun
   const ls = 279.696678 + 36000.76892 * t + 0.0003025 * t * t;
   let aya = 17.23 * Math.sin(om * Math.PI / 180) + 1.27 * Math.sin(2 * ls * Math.PI / 180);
   aya -= (5025.64 + 1.11 * t) * t;
   aya = (aya - 80861.27) / 3600.0; // 84038.27 = Fagan-Bradley, 80861.27 = Lahiri
   return aya;
}

//------------------------------------------------------------------------------------------
// cal date by number of date mon and year
//------------------------------------------------------------------------------------------
function mdy2julian(m, d, y) {
    const im = 12 * (y + 4800) + m - 3;
    let j = (2 * (im % 12) + 7 + 365 * im) / 12;
    j = Math.floor(j) + d + Math.floor(im / 48) - 32083;
    if (j > 2299171) j += Math.floor(im / 4800) - Math.floor(im / 1200) + 38;
    return j - 0.5;
}

function dTime(jd) {
  const efdt = [124, 85, 62, 48, 37, 26, 16, 10, 9, 10, 11, 11, 12, 13, 15, 16, 17, 17, 13.7, 12.5, 12, 7.5, 5.7, 7.1, 7.9, 1.6, -5.4, -5.9, -2.7, 10.5, 21.2, 24, 24.3, 29.2, 33.2, 40.2, 50.5, 56.9, 65.7, 75.5];

  const date = calData(jd);
  const kyear = date.getFullYear();
  const kmon = date.getMonth() + 1; // getMonth() is 0-based
  const kday = date.getDate();

  const dgod = kyear + (kmon - 1) / 12 + (kday - 1) / 365.25;
  const t = (jd - 2378497) / 36525;

  let dt;

  if (dgod >= 1620 && dgod < 2010) {
    const i1 = Math.floor((dgod - 1620) / 10);
    const di = dgod - (1620 + i1 * 10);
    dt = efdt[i1] + ((efdt[i1 + 1] - efdt[i1]) * di) / 10;
  } else {
    if (dgod >= 2010) {
      dt = 25.5 * t * t - 39;
    } else if (dgod >= 948 && dgod < 1620) {
      dt = 25.5 * t * t;
    } else {
      dt = 1361.7 + 320 * t + 44.3 * t * t;
    }
  }

  return dt / 3600; // convert seconds to hours
}


//------------------------------------------------------------------------------------------
// cal date on calendar date
//------------------------------------------------------------------------------------------
function calData(jd) {
    const z1 = jd + 0.5;
    const z2 = Math.floor(z1);
    const f = z1 - z2;
    let a = z2;
    if (z2 >= 2299161) {
        const alf = Math.floor((z2 - 1867216.25) / 36524.25);
        a = z2 + 1 + alf - Math.floor(alf / 4);
    }
    const b = a + 1524;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);
    const days = b - d - Math.floor(30.6001 * e) + f;
    const kday = Math.floor(days);
    const kmon = (e < 13.5) ? e - 1 : e - 13;
    const kyear = (kmon > 2.5) ? c - 4716 : c - 4715;
    const hh1 = (days - kday) * 24;
    const khr = Math.floor(hh1);
    const kminf = (hh1 - khr) * 60;
    const kmin = Math.floor(kminf);
    const ksek = Math.floor((kminf - kmin) * 60);
    return new Date(kyear, kmon - 1, kday, khr, kmin, ksek);
}

//------------------------------------------------------------------------------------------
// transalation deg logitudinal in degrees,min and sec
//------------------------------------------------------------------------------------------
function lon2dmsz(x) {
    x = Math.abs(x);
    const z = Math.floor(x / 30);
    const d = Math.floor(x % 30);
    const ss0 = Math.round((x - Math.floor(x)) * 3600);
    const m = Math.floor(ss0 / 60);
    const s = ss0 % 60;
    return `${d} ${m}'${s}"`;
}


//------------------------------------------------------------------------------------------
// translation degrees in deg, min and sec
//------------------------------------------------------------------------------------------
function lon2dms(x) {
    x = Math.abs(x);
    const d = Math.floor(x);
    const ss0 = Math.round((x - d) * 3600);
    const m = Math.floor(ss0 / 60);
    const s = ss0 % 60;
    return `${d} ${m}'${s}"`;
}

//------------------------------------------------------------------------------------------
// fixing the angle within 360 degrees
//------------------------------------------------------------------------------------------
function fix360(v)
{
while(v < 0.0)v += 360.0;
while(v > 360.0)v -= 360.0;
return v;
}

//------------------------------------------------------------------------------------------
// Day of the Week
//------------------------------------------------------------------------------------------
function weekDay(jd)
{
// Julian date for the begin of the day
let jd0 = Math.floor(jd) + 0.5;
if (jd < jd0)jd0 -= 1;

// day
const jdn = jd0 + 1.5;
const dn1 = Math.floor(jdn / 7) * 7;
return Math.floor(jdn - dn1);
}

class Panchang {
  constructor() {
    this.Day = {};
    this.Tithi = {};
    this.Nakshatra = {};
    this.Karna = {};
    this.Yoga = {};
    this.Ayanamsa = {};
    this.Raasi = {};
    this.version = "0.2";
  }

  calculate(d, cb) {
    const day = d.getDate();
    const mon = d.getMonth() + 1;
    const year = d.getFullYear();
    let hr = d.getHours() + d.getMinutes() / 60;
    const tzone = -d.getTimezoneOffset() / 60;

    const dayhr = day + hr / 24;
    const jdlt = mdy2julian(mon, dayhr, year);
    const n_wday = weekDay(jdlt);
    this.Day.name = wd[n_wday];

    const jd0 = mdy2julian(mon, day, year);
    const jdut = jd0 + (hr - tzone) / 24;
    const dt = dTime(jdut);
    const jd = jdut + dt / 24;

    const ayanamsa = calcayan(jd);
    const Lmoon = moon(jd);
    const Lsun = sun(jd);

    const dmoonYoga = LmoonYoga + ayanamsa - 491143.07698973856;
    const dsunYoga = LsunYoga + ayanamsa - 36976.91240579201;
    const zyoga = dmoonYoga + dsunYoga;

    let n_yoga = (zyoga * 6) / 80;
    while (n_yoga < 0) n_yoga += 27;
    while (n_yoga > 27) n_yoga -= 27;

    const yogaIndex = Math.floor(n_yoga);
    const s_yoga = yoga(jd, zyoga, tzone);

    const Lmoon0 = fix360(Lmoon + ayanamsa);
    const nakshIndex = Math.floor((Lmoon0 * 6) / 80);
    const s_naksh = nakshatra(jd, nakshIndex, tzone);

    let moonT = Lmoon;
    let sunT = Lsun;
    if (moonT < sunT) moonT += 360;
    const tithiIndex = Math.floor((moonT - sunT) / 12);
    const s_tithi = tithi(jd, tithiIndex, tzone, 12);

    moonT = Lmoon;
    sunT = Lsun;
    if (moonT < sunT) moonT += 360;
    const nk = Math.floor((moonT - sunT) / 6);
    let n_karana;
    if (nk === 0) n_karana = 10;
    else if (nk >= 57) n_karana = nk - 50;
    else n_karana = (nk - 1) % 7;

    const s_karana = tithi(jd, nk, tzone, 6);
    const z = Math.floor(Math.abs(fix360(Lmoon + ayanamsa)) / 30);

    this.Ayanamsa.name = lon2dms(ayanamsa);
    this.Raasi.name = zn[z];

    this.Nakshatra.name = naks[nakshIndex];
    this.Nakshatra.start = s_naksh.start;
    this.Nakshatra.end = s_naksh.end;

    this.Karna.name = kar[n_karana];
    this.Karna.start = s_karana.start;
    this.Karna.end = s_karana.end;

    this.Yoga.name = yog[yogaIndex];
    this.Yoga.start = s_yoga.start;
    this.Yoga.end = s_yoga.end;

    this.Tithi.name = tith[tithiIndex];
    this.Tithi.start = s_tithi.start;
    this.Tithi.end = s_tithi.end;

    if (typeof cb === "function") cb();
  }
}

export default Panchang;