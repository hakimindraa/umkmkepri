export interface RegencyOption {
  id: string;
  name: string;
  alias: string;
  description: string;
}

export const KEPRI_REGIONS: RegencyOption[] = [
  {
    id: 'batam',
    name: 'Kota Batam',
    alias: 'Batam',
    description: 'Pusat industri, perdagangan, dan kerajinan modern Kepulauan Riau.',
  },
  {
    id: 'tanjungpinang',
    name: 'Kota Tanjungpinang',
    alias: 'Tanjungpinang',
    description: 'Ibu kota Provinsi Kepri, kaya kuliner khas dan sejarah Melayu.',
  },
  {
    id: 'bintan',
    name: 'Kabupaten Bintan',
    alias: 'Bintan',
    description: 'Terkenal dengan kriya pesisir, batik khas, dan hasil laut unggulan.',
  },
  {
    id: 'karimun',
    name: 'Kabupaten Karimun',
    alias: 'Karimun',
    description: 'Bumi Berazam dengan aneka olahan laut, kerupuk, dan jajanan khas.',
  },
  {
    id: 'lingga',
    name: 'Kabupaten Lingga',
    alias: 'Lingga',
    description: 'Bunda Tanah Melayu, terkenal dengan tenun, sagu, dan kuliner tradisional.',
  },
  {
    id: 'natuna',
    name: 'Kabupaten Natuna',
    alias: 'Natuna',
    description: 'Gugusan pulau terdepan dengan ikon Kerupuk Atom dan olahan ikan tongkol segar.',
  },
  {
    id: 'anambas',
    name: 'Kabupaten Kepulauan Anambas',
    alias: 'Anambas',
    description: 'Kepulauan eksotis penghasil luti gendang, mi tarempa, dan hasil laut premium.',
  },
];

export const INITIAL_CATEGORIES = [
  {
    name: 'Kuliner & Makanan Ringan',
    slug: 'kuliner-makanan-ringan',
    description: 'Kerupuk atom, luti gendang, otak-otak, olahan ikan, dan kue tradisional.',
    iconName: 'Utensils',
  },
  {
    name: 'Hasil Laut & Olahan Ikan',
    slug: 'hasil-laut-olahan-ikan',
    description: 'Ikan bilis/teri asin, cumi kering, abon tongkol, dan keripik laut segar.',
    iconName: 'Fish',
  },
  {
    name: 'Kriya & Kerajinan Tangan',
    slug: 'kriya-kerajinan-tangan',
    description: 'Miniatur jong, anyaman pandan, cenderamata kulit kerang/gonggong.',
    iconName: 'Sparkles',
  },
  {
    name: 'Fashion & Batik Kepri',
    slug: 'fashion-batik-kepri',
    description: 'Batik motif gonggong, songket Melayu, tenun Lingga, dan busana lokal.',
    iconName: 'Shirt',
  },
  {
    name: 'Pertanian & Perkebunan Lokal',
    slug: 'pertanian-perkebunan-lokal',
    description: 'Sagu Lingga, cengkeh Natuna, madu hutan kelulut, dan aneka hasil kebun.',
    iconName: 'Wheat',
  },
  {
    name: 'Jasa & Kreatif UMKM',
    slug: 'jasa-kreatif-umkm',
    description: 'Desain kustom, sablon lokal, fotografi, dan jasa kreatif pendukung.',
    iconName: 'Briefcase',
  },
];
