export const Languages: {
    [key: string]: string
} = {
    'zh-CN|zh-cn|zh|ZH|cn|CN': 'zh-CN',
    'zh-TW|zh-HK|zh-hk|zh-tw|hk|tw|TW': 'zh-TW',
    'en|en-US': 'en',
    co: 'co',
    hr: 'hr',
    cs: 'cs',
    da: 'da',
    nl: 'nl',
    af: 'af',
    sq: 'sq',
    am: 'am',
    ar: 'ar',
    hy: 'hy',
    az: 'az',
    eu: 'eu',
    be: 'be',
    bn: 'bn',
    bs: 'bs',
    bg: 'bg',
    ca: 'ca',
    ceb: 'ceb',
    eo: 'eo',
    et: 'et',
    fi: 'fi',
    fr: 'fr',
    fy: 'fy',
    gl: 'gl',
    ka: 'ka',
    de: 'de',
    el: 'el',
    gu: 'gu',
    ht: 'ht',
    ha: 'ha',
    haw: 'haw',
    iw: 'iw',
    hi: 'hi',
    hmn: 'hmn',
    hu: 'hu',
    is: 'is',
    ig: 'ig',
    id: 'id',
    ga: 'ga',
    it: 'it',
    ja: 'ja',
    jw: 'jw',
    kn: 'kn',
    kk: 'kk',
    km: 'km',
    ko: 'ko',
    ku: 'ku',
    ky: 'ky',
    lo: 'lo',
    la: 'la',
    lv: 'lv',
    lt: 'lt',
    lb: 'lb',
    mk: 'mk',
    mg: 'mg',
    ms: 'ms',
    ml: 'ml',
    mt: 'mt',
    mi: 'mi',
    mr: 'mr',
    mn: 'mn',
    my: 'my',
    ne: 'ne',
    no: 'no',
    ny: 'ny',
    ps: 'ps',
    fa: 'fa',
    pl: 'pl',
    pt: 'pt',
    pa: 'pa',
    ro: 'ro',
    ru: 'ru',
    sm: 'sm',
    gd: 'gd',
    sr: 'sr',
    st: 'st',
    sn: 'sn',
    sd: 'sd',
    si: 'si',
    sk: 'sk',
    sl: 'sl',
    so: 'so',
    es: 'es',
    su: 'su',
    sw: 'sw',
    sv: 'sv',
    tl: 'tl',
    tg: 'tg',
    ta: 'ta',
    te: 'te',
    th: 'th',
    tr: 'tr',
    uk: 'uk',
    ur: 'ur',
    uz: 'uz',
    vi: 'vi',
    cy: 'cy',
    xh: 'xh',
    yi: 'yi',
    yo: 'yo',
    zu: 'zu',
}

export const findLanguage = (lang: string) => {
    const result = Object.keys(Languages).find(match => new RegExp(`^(${match})$`, 'i').test(lang))
    if (result) { return Languages[result] }
    return 'zh-CN'
}
