/**
 * Country → City database with GPS coordinates.
 * Covers major Muslim-majority countries + countries with significant Muslim populations.
 * Cities are ordered by population/importance.
 */

export interface CityData {
  nameAr: string;
  nameEn: string;
  latitude: number;
  longitude: number;
}

export interface CountryData {
  nameAr: string;
  nameEn: string;
  cities: CityData[];
}

export const COUNTRIES: CountryData[] = [
  // ─── Tunisia ───
  {
    nameAr: 'تونس',
    nameEn: 'Tunisia',
    cities: [
      { nameAr: 'تونس العاصمة', nameEn: 'Tunis', latitude: 36.8065, longitude: 10.1815 },
      { nameAr: 'صفاقس', nameEn: 'Sfax', latitude: 34.7406, longitude: 10.7603 },
      { nameAr: 'سوسة', nameEn: 'Sousse', latitude: 35.8288, longitude: 10.6405 },
      { nameAr: 'القيروان', nameEn: 'Kairouan', latitude: 35.6781, longitude: 10.0963 },
      { nameAr: 'بنزرت', nameEn: 'Bizerte', latitude: 37.2744, longitude: 9.8739 },
      { nameAr: 'قابس', nameEn: 'Gabès', latitude: 33.8815, longitude: 10.0982 },
      { nameAr: 'أريانة', nameEn: 'Ariana', latitude: 36.8625, longitude: 10.1956 },
      { nameAr: 'القصرين', nameEn: 'Kasserine', latitude: 35.1672, longitude: 8.8365 },
      { nameAr: 'المنستير', nameEn: 'Monastir', latitude: 35.7643, longitude: 10.8113 },
      { nameAr: 'المهدية', nameEn: 'Mahdia', latitude: 35.5047, longitude: 11.0622 },
      { nameAr: 'نابل', nameEn: 'Nabeul', latitude: 36.4561, longitude: 10.7376 },
      { nameAr: 'باجة', nameEn: 'Béja', latitude: 36.7256, longitude: 9.1817 },
      { nameAr: 'جندوبة', nameEn: 'Jendouba', latitude: 36.5011, longitude: 8.7802 },
      { nameAr: 'مدنين', nameEn: 'Medenine', latitude: 33.3549, longitude: 10.5055 },
      { nameAr: 'توزر', nameEn: 'Tozeur', latitude: 33.9197, longitude: 8.1339 },
      { nameAr: 'سيدي بوزيد', nameEn: 'Sidi Bouzid', latitude: 35.0354, longitude: 9.4839 },
      { nameAr: 'تطاوين', nameEn: 'Tataouine', latitude: 32.9297, longitude: 10.4518 },
      { nameAr: 'قفصة', nameEn: 'Gafsa', latitude: 34.425, longitude: 8.7842 },
      { nameAr: 'بن عروس', nameEn: 'Ben Arous', latitude: 36.7533, longitude: 10.2283 },
      { nameAr: 'منوبة', nameEn: 'Manouba', latitude: 36.8081, longitude: 10.0972 },
      { nameAr: 'زغوان', nameEn: 'Zaghouan', latitude: 36.4029, longitude: 10.1429 },
      { nameAr: 'سليانة', nameEn: 'Siliana', latitude: 36.0849, longitude: 9.3708 },
      { nameAr: 'الكاف', nameEn: 'Le Kef', latitude: 36.1826, longitude: 8.7148 },
      { nameAr: 'قبلي', nameEn: 'Kebili', latitude: 33.7072, longitude: 8.971 },
    ],
  },

  /* ──────────────────────────────────────────────────────────
   * NOTE: Other countries are commented out for now.
   * Uncomment as needed to add more locations.
   * ────────────────────────────────────────────────────────── */

  /*
  // ─── Saudi Arabia ───
  {
    nameAr: 'السعودية',
    nameEn: 'Saudi Arabia',
    cities: [
      { nameAr: 'مكة المكرمة', nameEn: 'Makkah', latitude: 21.4225, longitude: 39.8262 },
      { nameAr: 'المدينة المنورة', nameEn: 'Madinah', latitude: 24.4672, longitude: 39.6024 },
      { nameAr: 'الرياض', nameEn: 'Riyadh', latitude: 24.7136, longitude: 46.6753 },
      { nameAr: 'جدة', nameEn: 'Jeddah', latitude: 21.5433, longitude: 39.1728 },
      { nameAr: 'الدمام', nameEn: 'Dammam', latitude: 26.4207, longitude: 50.0888 },
      { nameAr: 'الطائف', nameEn: 'Taif', latitude: 21.2703, longitude: 40.4158 },
      { nameAr: 'تبوك', nameEn: 'Tabuk', latitude: 28.3838, longitude: 36.555 },
      { nameAr: 'بريدة', nameEn: 'Buraydah', latitude: 26.326, longitude: 43.975 },
      { nameAr: 'خميس مشيط', nameEn: 'Khamis Mushait', latitude: 18.3064, longitude: 42.7294 },
      { nameAr: 'أبها', nameEn: 'Abha', latitude: 18.2164, longitude: 42.5053 },
    ],
  },

  // ─── Egypt ───
  {
    nameAr: 'مصر',
    nameEn: 'Egypt',
    cities: [
      { nameAr: 'القاهرة', nameEn: 'Cairo', latitude: 30.0444, longitude: 31.2357 },
      { nameAr: 'الإسكندرية', nameEn: 'Alexandria', latitude: 31.2001, longitude: 29.9187 },
      { nameAr: 'الجيزة', nameEn: 'Giza', latitude: 30.0131, longitude: 31.2089 },
      { nameAr: 'شبرا الخيمة', nameEn: 'Shubra El Kheima', latitude: 30.1286, longitude: 31.2422 },
      { nameAr: 'بورسعيد', nameEn: 'Port Said', latitude: 31.2653, longitude: 32.3019 },
      { nameAr: 'السويس', nameEn: 'Suez', latitude: 29.9668, longitude: 32.5498 },
      { nameAr: 'المنصورة', nameEn: 'Mansoura', latitude: 31.0409, longitude: 31.3785 },
      { nameAr: 'طنطا', nameEn: 'Tanta', latitude: 30.7865, longitude: 31.0004 },
      { nameAr: 'أسيوط', nameEn: 'Asyut', latitude: 27.1809, longitude: 31.1837 },
      { nameAr: 'الأقصر', nameEn: 'Luxor', latitude: 25.6872, longitude: 32.6396 },
    ],
  },

  // ─── Algeria ───
  {
    nameAr: 'الجزائر',
    nameEn: 'Algeria',
    cities: [
      { nameAr: 'الجزائر العاصمة', nameEn: 'Algiers', latitude: 36.7538, longitude: 3.0588 },
      { nameAr: 'وهران', nameEn: 'Oran', latitude: 35.6969, longitude: -0.6331 },
      { nameAr: 'قسنطينة', nameEn: 'Constantine', latitude: 36.365, longitude: 6.6147 },
      { nameAr: 'عنابة', nameEn: 'Annaba', latitude: 36.9, longitude: 7.7667 },
      { nameAr: 'باتنة', nameEn: 'Batna', latitude: 35.556, longitude: 6.1742 },
      { nameAr: 'البليدة', nameEn: 'Blida', latitude: 36.4686, longitude: 2.8289 },
      { nameAr: 'سطيف', nameEn: 'Sétif', latitude: 36.1898, longitude: 5.4108 },
      { nameAr: 'تلمسان', nameEn: 'Tlemcen', latitude: 34.8828, longitude: -1.3167 },
    ],
  },

  // ─── Morocco ───
  {
    nameAr: 'المغرب',
    nameEn: 'Morocco',
    cities: [
      { nameAr: 'الدار البيضاء', nameEn: 'Casablanca', latitude: 33.5731, longitude: -7.5898 },
      { nameAr: 'الرباط', nameEn: 'Rabat', latitude: 34.0209, longitude: -6.8416 },
      { nameAr: 'فاس', nameEn: 'Fès', latitude: 34.0331, longitude: -5.0003 },
      { nameAr: 'مراكش', nameEn: 'Marrakech', latitude: 31.6295, longitude: -7.9811 },
      { nameAr: 'طنجة', nameEn: 'Tangier', latitude: 35.7595, longitude: -5.834 },
      { nameAr: 'أكادير', nameEn: 'Agadir', latitude: 30.4278, longitude: -9.5981 },
      { nameAr: 'مكناس', nameEn: 'Meknès', latitude: 33.8935, longitude: -5.5547 },
      { nameAr: 'وجدة', nameEn: 'Oujda', latitude: 34.6814, longitude: -1.9086 },
    ],
  },

  // ─── Libya ───
  {
    nameAr: 'ليبيا',
    nameEn: 'Libya',
    cities: [
      { nameAr: 'طرابلس', nameEn: 'Tripoli', latitude: 32.9022, longitude: 13.1809 },
      { nameAr: 'بنغازي', nameEn: 'Benghazi', latitude: 32.1194, longitude: 20.0868 },
      { nameAr: 'مصراتة', nameEn: 'Misrata', latitude: 32.3754, longitude: 15.0925 },
      { nameAr: 'سبها', nameEn: 'Sabha', latitude: 27.0377, longitude: 14.4283 },
    ],
  },

  // ─── UAE ───
  {
    nameAr: 'الإمارات',
    nameEn: 'UAE',
    cities: [
      { nameAr: 'دبي', nameEn: 'Dubai', latitude: 25.2048, longitude: 55.2708 },
      { nameAr: 'أبوظبي', nameEn: 'Abu Dhabi', latitude: 24.4539, longitude: 54.3773 },
      { nameAr: 'الشارقة', nameEn: 'Sharjah', latitude: 25.3463, longitude: 55.4209 },
      { nameAr: 'العين', nameEn: 'Al Ain', latitude: 24.1917, longitude: 55.7606 },
      { nameAr: 'عجمان', nameEn: 'Ajman', latitude: 25.4052, longitude: 55.5136 },
    ],
  },

  // ─── Qatar ───
  {
    nameAr: 'قطر',
    nameEn: 'Qatar',
    cities: [
      { nameAr: 'الدوحة', nameEn: 'Doha', latitude: 25.2854, longitude: 51.531 },
      { nameAr: 'الوكرة', nameEn: 'Al Wakrah', latitude: 25.1659, longitude: 51.5979 },
      { nameAr: 'الخور', nameEn: 'Al Khor', latitude: 25.6804, longitude: 51.4969 },
    ],
  },

  // ─── Kuwait ───
  {
    nameAr: 'الكويت',
    nameEn: 'Kuwait',
    cities: [
      { nameAr: 'الكويت العاصمة', nameEn: 'Kuwait City', latitude: 29.3759, longitude: 47.9774 },
      { nameAr: 'حولي', nameEn: 'Hawalli', latitude: 29.3328, longitude: 48.0286 },
      { nameAr: 'السالمية', nameEn: 'Salmiya', latitude: 29.3347, longitude: 48.0758 },
    ],
  },

  // ─── Bahrain ───
  {
    nameAr: 'البحرين',
    nameEn: 'Bahrain',
    cities: [
      { nameAr: 'المنامة', nameEn: 'Manama', latitude: 26.2285, longitude: 50.586 },
      { nameAr: 'المحرق', nameEn: 'Muharraq', latitude: 26.2572, longitude: 50.6119 },
    ],
  },

  // ─── Oman ───
  {
    nameAr: 'عمان',
    nameEn: 'Oman',
    cities: [
      { nameAr: 'مسقط', nameEn: 'Muscat', latitude: 23.588, longitude: 58.3829 },
      { nameAr: 'صلالة', nameEn: 'Salalah', latitude: 17.0151, longitude: 54.0924 },
      { nameAr: 'صحار', nameEn: 'Sohar', latitude: 24.3615, longitude: 56.7455 },
      { nameAr: 'نزوى', nameEn: 'Nizwa', latitude: 22.9333, longitude: 57.5333 },
    ],
  },

  // ─── Jordan ───
  {
    nameAr: 'الأردن',
    nameEn: 'Jordan',
    cities: [
      { nameAr: 'عمّان', nameEn: 'Amman', latitude: 31.9454, longitude: 35.9284 },
      { nameAr: 'الزرقاء', nameEn: 'Zarqa', latitude: 32.0728, longitude: 36.088 },
      { nameAr: 'إربد', nameEn: 'Irbid', latitude: 32.5568, longitude: 35.8469 },
      { nameAr: 'العقبة', nameEn: 'Aqaba', latitude: 29.5321, longitude: 35.0063 },
    ],
  },

  // ─── Palestine ───
  {
    nameAr: 'فلسطين',
    nameEn: 'Palestine',
    cities: [
      { nameAr: 'القدس', nameEn: 'Jerusalem', latitude: 31.7683, longitude: 35.2137 },
      { nameAr: 'غزة', nameEn: 'Gaza', latitude: 31.5017, longitude: 34.4668 },
      { nameAr: 'الخليل', nameEn: 'Hebron', latitude: 31.5326, longitude: 35.0998 },
      { nameAr: 'نابلس', nameEn: 'Nablus', latitude: 32.2211, longitude: 35.2544 },
      { nameAr: 'رام الله', nameEn: 'Ramallah', latitude: 31.9038, longitude: 35.2034 },
    ],
  },

  // ─── Lebanon ───
  {
    nameAr: 'لبنان',
    nameEn: 'Lebanon',
    cities: [
      { nameAr: 'بيروت', nameEn: 'Beirut', latitude: 33.8938, longitude: 35.5018 },
      { nameAr: 'طرابلس', nameEn: 'Tripoli', latitude: 34.4367, longitude: 35.8497 },
      { nameAr: 'صيدا', nameEn: 'Sidon', latitude: 33.5633, longitude: 35.3689 },
    ],
  },

  // ─── Syria ───
  {
    nameAr: 'سوريا',
    nameEn: 'Syria',
    cities: [
      { nameAr: 'دمشق', nameEn: 'Damascus', latitude: 33.5138, longitude: 36.2765 },
      { nameAr: 'حلب', nameEn: 'Aleppo', latitude: 36.2021, longitude: 37.1343 },
      { nameAr: 'حمص', nameEn: 'Homs', latitude: 34.7324, longitude: 36.7137 },
    ],
  },

  // ─── Iraq ───
  {
    nameAr: 'العراق',
    nameEn: 'Iraq',
    cities: [
      { nameAr: 'بغداد', nameEn: 'Baghdad', latitude: 33.3152, longitude: 44.3661 },
      { nameAr: 'البصرة', nameEn: 'Basra', latitude: 30.5085, longitude: 47.7804 },
      { nameAr: 'أربيل', nameEn: 'Erbil', latitude: 36.1912, longitude: 44.0094 },
      { nameAr: 'النجف', nameEn: 'Najaf', latitude: 32.0003, longitude: 44.3362 },
      { nameAr: 'كربلاء', nameEn: 'Karbala', latitude: 32.616, longitude: 44.0249 },
    ],
  },

  // ─── Turkey ───
  {
    nameAr: 'تركيا',
    nameEn: 'Turkey',
    cities: [
      { nameAr: 'إسطنبول', nameEn: 'Istanbul', latitude: 41.0082, longitude: 28.9784 },
      { nameAr: 'أنقرة', nameEn: 'Ankara', latitude: 39.9334, longitude: 32.8597 },
      { nameAr: 'إزمير', nameEn: 'Izmir', latitude: 38.4192, longitude: 27.1287 },
      { nameAr: 'بورصة', nameEn: 'Bursa', latitude: 40.1826, longitude: 29.0665 },
      { nameAr: 'أنطاليا', nameEn: 'Antalya', latitude: 36.8969, longitude: 30.7133 },
      { nameAr: 'قونية', nameEn: 'Konya', latitude: 37.8716, longitude: 32.4847 },
    ],
  },

  // ─── Iran ───
  {
    nameAr: 'إيران',
    nameEn: 'Iran',
    cities: [
      { nameAr: 'طهران', nameEn: 'Tehran', latitude: 35.6892, longitude: 51.389 },
      { nameAr: 'مشهد', nameEn: 'Mashhad', latitude: 36.2972, longitude: 59.6067 },
      { nameAr: 'أصفهان', nameEn: 'Isfahan', latitude: 32.6546, longitude: 51.668 },
      { nameAr: 'تبريز', nameEn: 'Tabriz', latitude: 38.08, longitude: 46.2919 },
      { nameAr: 'شيراز', nameEn: 'Shiraz', latitude: 29.5918, longitude: 52.5837 },
    ],
  },

  // ─── Pakistan ───
  {
    nameAr: 'باكستان',
    nameEn: 'Pakistan',
    cities: [
      { nameAr: 'كراتشي', nameEn: 'Karachi', latitude: 24.8607, longitude: 67.0011 },
      { nameAr: 'لاهور', nameEn: 'Lahore', latitude: 31.5204, longitude: 74.3587 },
      { nameAr: 'إسلام آباد', nameEn: 'Islamabad', latitude: 33.6844, longitude: 73.0479 },
      { nameAr: 'فيصل آباد', nameEn: 'Faisalabad', latitude: 31.4504, longitude: 73.135 },
      { nameAr: 'بيشاور', nameEn: 'Peshawar', latitude: 34.0151, longitude: 71.5249 },
    ],
  },

  // ─── Malaysia ───
  {
    nameAr: 'ماليزيا',
    nameEn: 'Malaysia',
    cities: [
      { nameAr: 'كوالالمبور', nameEn: 'Kuala Lumpur', latitude: 3.139, longitude: 101.6869 },
      { nameAr: 'جورج تاون', nameEn: 'George Town', latitude: 5.4141, longitude: 100.3288 },
      { nameAr: 'جوهور بارو', nameEn: 'Johor Bahru', latitude: 1.4927, longitude: 103.7414 },
    ],
  },

  // ─── Indonesia ───
  {
    nameAr: 'إندونيسيا',
    nameEn: 'Indonesia',
    cities: [
      { nameAr: 'جاكرتا', nameEn: 'Jakarta', latitude: -6.2088, longitude: 106.8456 },
      { nameAr: 'سورابايا', nameEn: 'Surabaya', latitude: -7.2575, longitude: 112.7521 },
      { nameAr: 'باندونغ', nameEn: 'Bandung', latitude: -6.9175, longitude: 107.6191 },
    ],
  },

  // ─── Sudan ───
  {
    nameAr: 'السودان',
    nameEn: 'Sudan',
    cities: [
      { nameAr: 'الخرطوم', nameEn: 'Khartoum', latitude: 15.5007, longitude: 32.5599 },
      { nameAr: 'أم درمان', nameEn: 'Omdurman', latitude: 15.6445, longitude: 32.4777 },
      { nameAr: 'بورتسودان', nameEn: 'Port Sudan', latitude: 19.6158, longitude: 37.2164 },
    ],
  },

  // ─── Mauritania ───
  {
    nameAr: 'موريتانيا',
    nameEn: 'Mauritania',
    cities: [
      { nameAr: 'نواكشوط', nameEn: 'Nouakchott', latitude: 18.0735, longitude: -15.9582 },
    ],
  },

  // ─── Somalia ───
  {
    nameAr: 'الصومال',
    nameEn: 'Somalia',
    cities: [
      { nameAr: 'مقديشو', nameEn: 'Mogadishu', latitude: 2.0469, longitude: 45.3182 },
      { nameAr: 'هرجيسا', nameEn: 'Hargeisa', latitude: 9.56, longitude: 44.065 },
    ],
  },

  // ─── Yemen ───
  {
    nameAr: 'اليمن',
    nameEn: 'Yemen',
    cities: [
      { nameAr: 'صنعاء', nameEn: "Sana'a", latitude: 15.3694, longitude: 44.191 },
      { nameAr: 'عدن', nameEn: 'Aden', latitude: 12.7855, longitude: 45.0187 },
      { nameAr: 'تعز', nameEn: 'Taiz', latitude: 13.5789, longitude: 44.0219 },
    ],
  },

  // ─── France ───
  {
    nameAr: 'فرنسا',
    nameEn: 'France',
    cities: [
      { nameAr: 'باريس', nameEn: 'Paris', latitude: 48.8566, longitude: 2.3522 },
      { nameAr: 'مارسيليا', nameEn: 'Marseille', latitude: 43.2965, longitude: 5.3698 },
      { nameAr: 'ليون', nameEn: 'Lyon', latitude: 45.764, longitude: 4.8357 },
      { nameAr: 'تولوز', nameEn: 'Toulouse', latitude: 43.6047, longitude: 1.4442 },
      { nameAr: 'ستراسبورغ', nameEn: 'Strasbourg', latitude: 48.5734, longitude: 7.7521 },
    ],
  },

  // ─── UK ───
  {
    nameAr: 'بريطانيا',
    nameEn: 'United Kingdom',
    cities: [
      { nameAr: 'لندن', nameEn: 'London', latitude: 51.5074, longitude: -0.1278 },
      { nameAr: 'برمنغهام', nameEn: 'Birmingham', latitude: 52.4862, longitude: -1.8904 },
      { nameAr: 'مانشستر', nameEn: 'Manchester', latitude: 53.4808, longitude: -2.2426 },
      { nameAr: 'ليدز', nameEn: 'Leeds', latitude: 53.8008, longitude: -1.5491 },
      { nameAr: 'غلاسكو', nameEn: 'Glasgow', latitude: 55.8642, longitude: -4.2518 },
    ],
  },

  // ─── Germany ───
  {
    nameAr: 'ألمانيا',
    nameEn: 'Germany',
    cities: [
      { nameAr: 'برلين', nameEn: 'Berlin', latitude: 52.52, longitude: 13.405 },
      { nameAr: 'ميونخ', nameEn: 'Munich', latitude: 48.1351, longitude: 11.582 },
      { nameAr: 'فرانكفورت', nameEn: 'Frankfurt', latitude: 50.1109, longitude: 8.6821 },
      { nameAr: 'كولونيا', nameEn: 'Cologne', latitude: 50.9375, longitude: 6.9603 },
      { nameAr: 'هامبورغ', nameEn: 'Hamburg', latitude: 53.5511, longitude: 9.9937 },
    ],
  },

  // ─── USA ───
  {
    nameAr: 'الولايات المتحدة',
    nameEn: 'United States',
    cities: [
      { nameAr: 'نيويورك', nameEn: 'New York', latitude: 40.7128, longitude: -74.006 },
      { nameAr: 'لوس أنجلوس', nameEn: 'Los Angeles', latitude: 34.0522, longitude: -118.2437 },
      { nameAr: 'شيكاغو', nameEn: 'Chicago', latitude: 41.8781, longitude: -87.6298 },
      { nameAr: 'هيوستن', nameEn: 'Houston', latitude: 29.7604, longitude: -95.3698 },
      { nameAr: 'ديربورن', nameEn: 'Dearborn', latitude: 42.3223, longitude: -83.1763 },
      { nameAr: 'واشنطن', nameEn: 'Washington DC', latitude: 38.9072, longitude: -77.0369 },
    ],
  },

  // ─── Canada ───
  {
    nameAr: 'كندا',
    nameEn: 'Canada',
    cities: [
      { nameAr: 'تورنتو', nameEn: 'Toronto', latitude: 43.6532, longitude: -79.3832 },
      { nameAr: 'مونتريال', nameEn: 'Montreal', latitude: 45.5017, longitude: -73.5673 },
      { nameAr: 'أوتاوا', nameEn: 'Ottawa', latitude: 45.4215, longitude: -75.6972 },
      { nameAr: 'فانكوفر', nameEn: 'Vancouver', latitude: 49.2827, longitude: -123.1207 },
      { nameAr: 'كالغاري', nameEn: 'Calgary', latitude: 51.0447, longitude: -114.0719 },
    ],
  },

  // ─── India ───
  {
    nameAr: 'الهند',
    nameEn: 'India',
    cities: [
      { nameAr: 'مومباي', nameEn: 'Mumbai', latitude: 19.076, longitude: 72.8777 },
      { nameAr: 'دلهي', nameEn: 'Delhi', latitude: 28.7041, longitude: 77.1025 },
      { nameAr: 'حيدر آباد', nameEn: 'Hyderabad', latitude: 17.385, longitude: 78.4867 },
      { nameAr: 'بنغالور', nameEn: 'Bangalore', latitude: 12.9716, longitude: 77.5946 },
      { nameAr: 'لكناو', nameEn: 'Lucknow', latitude: 26.8467, longitude: 80.9462 },
    ],
  },

  // ─── Bangladesh ───
  {
    nameAr: 'بنغلاديش',
    nameEn: 'Bangladesh',
    cities: [
      { nameAr: 'دكا', nameEn: 'Dhaka', latitude: 23.8103, longitude: 90.4125 },
      { nameAr: 'شيتاغونغ', nameEn: 'Chittagong', latitude: 22.3569, longitude: 91.7832 },
    ],
  },

  // ─── Nigeria ───
  {
    nameAr: 'نيجيريا',
    nameEn: 'Nigeria',
    cities: [
      { nameAr: 'لاغوس', nameEn: 'Lagos', latitude: 6.5244, longitude: 3.3792 },
      { nameAr: 'أبوجا', nameEn: 'Abuja', latitude: 9.0579, longitude: 7.4951 },
      { nameAr: 'كانو', nameEn: 'Kano', latitude: 12.0022, longitude: 8.592 },
    ],
  },

  // ─── Senegal ───
  {
    nameAr: 'السنغال',
    nameEn: 'Senegal',
    cities: [
      { nameAr: 'داكار', nameEn: 'Dakar', latitude: 14.7167, longitude: -17.4677 },
      { nameAr: 'طوبى', nameEn: 'Touba', latitude: 14.85, longitude: -15.8833 },
    ],
  },

  // ─── Australia ───
  {
    nameAr: 'أستراليا',
    nameEn: 'Australia',
    cities: [
      { nameAr: 'سيدني', nameEn: 'Sydney', latitude: -33.8688, longitude: 151.2093 },
      { nameAr: 'ملبورن', nameEn: 'Melbourne', latitude: -37.8136, longitude: 144.9631 },
      { nameAr: 'بريزبن', nameEn: 'Brisbane', latitude: -27.4698, longitude: 153.0251 },
    ],
  },
  */
];
