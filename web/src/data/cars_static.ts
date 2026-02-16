export interface Review {
    title: string;
    url: string;
    thumbnail: string;
    channel: string;
}

export interface Bank {
    name: string;
    rate: number;
    link: string;
    termYears: number;
}

export interface Insurance {
    provider: string;
    link: string;
    description: string;
}

export interface CarStaticData {
    id: string;
    make: string;
    model: string;
    variant: string;
    priceFrom: number; // CZK
    rangeWLTP: number; // km
    battery: number; // kWh
    charging: number; // kW
    image: string;
    bazaarLinks: {
        mobileDe: string;
        autoscout: string;
        carvago: string;
        sauto: string;
    };
    youtubeReviews: Review[];
    financing: Bank[];
    insurance: Insurance[];
}

export const CARS_DATA: CarStaticData[] = [
    {
        id: 'skoda-enyaq',
        make: 'Škoda',
        model: 'Enyaq iV',
        variant: '80 / 85',
        priceFrom: 750000,
        rangeWLTP: 537,
        battery: 77,
        charging: 135,
        image: 'https://cdn.skoda-storyboard.com/2020/09/Enyaq_iV_80_1-scaled.jpg',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/skoda-enyaq/vhc:car,pgn:2,pgs:10,srt:price,sro:asc,ms1:22900_25_,frn:2021,ful:electricity,cnd:used,dmg:true',
            carvago: 'https://carvago.com/cs/auta/skoda/enyaq/elektrina?price-from=400000&price-to=600000&registration-date-from=2021',
            autoscout: 'https://www.autoscout24.cz/',
            sauto: 'https://www.sauto.cz/inzerce/osobni/skoda/enyaq'
        },
        youtubeReviews: [
            { title: 'ŠKODA ENYAQ iV 80 - POV Test Drive', url: 'https://www.youtube.com/watch?v=l9vOJYcqSXs', thumbnail: 'https://img.youtube.com/vi/l9vOJYcqSXs/maxresdefault.jpg', channel: 'fDrive.cz' },
            { title: 'Škoda Enyaq iV Sportline - Range Test', url: 'https://www.youtube.com/watch?v=2tJfFaSBilw', thumbnail: 'https://img.youtube.com/vi/2tJfFaSBilw/maxresdefault.jpg', channel: 'fDrive.cz' }
        ],
        financing: [
            { name: 'Raiffeisenbank', rate: 4.8, link: 'https://www.rb.cz/osobni/pujcky/pujcka-na-auto', termYears: 5 },
            { name: 'ČSOB', rate: 5.1, link: 'https://www.csobleasing.cz/autopujcka', termYears: 5 },
            { name: 'Moneta', rate: 4.6, link: 'https://www.monetaauto.cz/', termYears: 5 }
        ],
        insurance: [
            { provider: 'Kooperativa', link: 'https://www.koop.cz/pojisteni/pojisteni-vozidel/elektromobil', description: 'Specializované pojištění pro EV včetně kabelů a wallboxu.' },
            { provider: 'Allianz', link: 'https://www.allianz.cz/cs_CZ/pojisteni/vozidla/elektromobil.html', description: 'Asistence při vybití, krytí baterie.' },
            { provider: 'Generali', link: 'https://www.generaliceska.cz/povinne-ruceni', description: 'Vyšší limity pro EV při střetu se zvěří.' }
        ]
    },
    {
        id: 'tesla-model-3',
        make: 'Tesla',
        model: 'Model 3',
        variant: 'Long Range / Highland',
        priceFrom: 600000,
        rangeWLTP: 602,
        battery: 75,
        charging: 250,
        image: 'https://tesla-cdn.thron.com/delivery/public/image/tesla/03e533bf-8b1d-463f-9813-9a597aabb560/bvlatuR/std/1200x628/Model-3-Hero-Desktop-LHD',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/tesla-model-3/vhc:car,ms1:135_5_,prx:22500,ful:electricity',
            carvago: 'https://carvago.com/cs/auta/tesla/model-3',
            autoscout: 'https://www.autoscout24.cz/lst/tesla/model-3',
            sauto: 'https://www.sauto.cz/inzerce/osobni/tesla/model-3'
        },
        youtubeReviews: [
            { title: 'Tesla Model 3 Highland - 1000km Test', url: 'https://www.youtube.com/watch?v=szE3XbkPHtQ', thumbnail: 'https://img.youtube.com/vi/szE3XbkPHtQ/maxresdefault.jpg', channel: 'fDrive.cz' }
        ],
        financing: [
            { name: 'Raiffeisenbank', rate: 4.8, link: 'https://www.rb.cz/osobni/pujcky/pujcka-na-auto', termYears: 5 },
            { name: 'Moneta', rate: 4.6, link: 'https://www.monetaauto.cz/', termYears: 5 }
        ],
        insurance: [
            { provider: 'Allianz', link: 'https://www.allianz.cz/cs_CZ/pojisteni/vozidla/elektromobil.html', description: 'Komplexní ochrana pro Tesly.' },
            { provider: 'ČPP', link: 'https://www.cpp.cz/pojisteni-vozidel', description: 'Výhodné povinné ručení.' }
        ]
    },
    {
        id: 'tesla-model-y',
        make: 'Tesla',
        model: 'Model Y',
        variant: 'Long Range',
        priceFrom: 850000,
        rangeWLTP: 533,
        battery: 75,
        charging: 250,
        image: 'https://tesla-cdn.thron.com/delivery/public/image/tesla/8e2df1b9-a4bf-4eb9-beec-2cf5cc77fca0/bvlatuR/std/1200x628/Model-Y-Hero-Desktop-Global',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/tesla-model-y/vhc:car,ms1:135_6_',
            carvago: 'https://carvago.com/cs/auta/tesla/model-y',
            autoscout: 'https://www.autoscout24.cz/lst/tesla/model-y',
            sauto: 'https://www.sauto.cz/inzerce/osobni/tesla/model-y'
        },
        youtubeReviews: [
            { title: 'Tesla Model Y Long Range - Týdenní test', url: 'https://www.youtube.com/watch?v=S014L281W4w', thumbnail: 'https://img.youtube.com/vi/S014L281W4w/maxresdefault.jpg', channel: 'Electro Dad' }
        ],
        financing: [
            { name: 'ČSOB', rate: 5.1, link: 'https://www.csobleasing.cz/autopujcka', termYears: 5 },
            { name: 'Moneta', rate: 4.6, link: 'https://www.monetaauto.cz/', termYears: 5 }
        ],
        insurance: [
            { provider: 'Kooperativa', link: 'https://www.koop.cz', description: 'Pojištění skel a baterie.' },
            { provider: 'Allianz', link: 'https://www.allianz.cz', description: 'Ideální pro dražší vozy.' }
        ]
    },
    {
        id: 'kia-eniro',
        make: 'Kia',
        model: 'e-Niro',
        variant: '64 kWh',
        priceFrom: 550000,
        rangeWLTP: 455,
        battery: 64,
        charging: 77,
        image: 'https://www.kia.com/content/dam/kwcms/kme/global/en/assets/vehicles/niro-ev/discover/kia-niro-ev-my23-discover-header.png',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/kia-niro/vhc:car,ms1:13200_18_,ful:electricity',
            carvago: 'https://carvago.com/cs/auta/kia/niro/elektrina',
            autoscout: 'https://www.autoscout24.cz/lst/kia/niro',
            sauto: 'https://www.sauto.cz/inzerce/osobni/kia/niro'
        },
        youtubeReviews: [
            { title: 'TEST Kia e-Niro 64 kWh - Eso v rukávu', url: 'https://www.youtube.com/results?search_query=TEST+Kia+e-Niro+64+kWh+-+Eso+v+ruk%C3%A1vu', thumbnail: '', channel: 'YouTube Search' }
        ],
        financing: [
            { name: 'Moneta', rate: 4.6, link: 'https://www.monetaauto.cz/', termYears: 5 }
        ],
        insurance: [
            { provider: 'Generali', link: 'https://www.generaliceska.cz', description: 'Sleva za bezpečnostní asistenty.' }
        ]
    },
    {
        id: 'vw-id4',
        make: 'Volkswagen',
        model: 'ID.4',
        variant: 'Pro Performance',
        priceFrom: 700000,
        rangeWLTP: 520,
        battery: 77,
        charging: 135,
        image: 'https://www.volkswagen.cz/idhub/content/dam/onehub_pkw/importers/cz/modely/id/id-4-2021/gallery/1920x1080/01_ID4.jpg',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/volkswagen-id-4/vhc:car,ms1:25200_20_,ful:electricity',
            carvago: 'https://carvago.com/cs/auta/volkswagen/id-4',
            autoscout: 'https://www.autoscout24.cz/lst/volkswagen/id-4',
            sauto: 'https://www.sauto.cz/inzerce/osobni/volkswagen/id-4'
        },
        youtubeReviews: [
            { title: 'Volkswagen ID.4 | Test spotřeby', url: 'https://www.youtube.com/results?search_query=Volkswagen+ID.4+Test+spot%C5%99eby', thumbnail: '', channel: 'YouTube Search' }
        ],
        financing: [],
        insurance: []
    },
    {
        id: 'vw-id3',
        make: 'Volkswagen',
        model: 'ID.3',
        variant: 'Pro S',
        priceFrom: 500000,
        rangeWLTP: 420,
        battery: 58,
        charging: 120,
        image: 'https://www.volkswagen.cz/idhub/content/dam/onehub_pkw/importers/cz/modely/id/id-3-2020/gallery/1920x1080/01_ID3.jpg',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/volkswagen-id-3/vhc:car,ms1:25200_15_,ful:electricity',
            carvago: 'https://carvago.com/cs/auta/volkswagen/id-3',
            autoscout: 'https://www.autoscout24.cz/lst/volkswagen/id-3',
            sauto: 'https://www.sauto.cz/inzerce/osobni/volkswagen/id-3'
        },
        youtubeReviews: [
            { title: 'Volkswagen ID.3 Pro S 77 kWh test', url: 'https://www.youtube.com/results?search_query=Volkswagen+ID.3+Pro+S+77+kWh+dlouhodob%C3%BD+test', thumbnail: '', channel: 'YouTube Search' }
        ],
        financing: [],
        insurance: []
    },
    {
        id: 'hyundai-kona',
        make: 'Hyundai',
        model: 'Kona Electric',
        variant: '64 kWh',
        priceFrom: 500000,
        rangeWLTP: 484,
        battery: 64,
        charging: 77,
        image: 'https://s7g10.scene7.com/is/image/hyundaiautoever/Kona_Electric_OS_PE_2021_Gallery_1_1280x720?wid=1280&hei=720&fmt=jpg',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/hyundai-kona/vhc:car,ms1:11600_41_,ful:electricity',
            carvago: 'https://carvago.com/cs/auta/hyundai/kona/elektrina',
            autoscout: 'https://www.autoscout24.cz/lst/hyundai/kona',
            sauto: 'https://www.sauto.cz/inzerce/osobni/hyundai/kona'
        },
        youtubeReviews: [
            { title: 'Hyundai Kona Electric - půlroční test', url: 'https://www.youtube.com/results?search_query=Hyundai+Kona+Electric+p%C5%AFlro%C4%8Dn%C3%AD+test', thumbnail: '', channel: 'YouTube Search' }
        ],
        financing: [],
        insurance: []
    },
    {
        id: 'hyundai-ioniq5',
        make: 'Hyundai',
        model: 'Ioniq 5',
        variant: 'Long Range AWD',
        priceFrom: 850000,
        rangeWLTP: 460,
        battery: 73,
        charging: 233,
        image: 'https://s7g10.scene7.com/is/image/hyundaiautoever/IONIQ_5_NE_2021_Gallery_1_1280x720?wid=1280&hei=720&fmt=jpg',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/hyundai-ioniq-5/vhc:car,ms1:11600_44_,ful:electricity',
            carvago: 'https://carvago.com/cs/auta/hyundai/ioniq-5',
            autoscout: 'https://www.autoscout24.cz/lst/hyundai/ioniq-5',
            sauto: 'https://www.sauto.cz/inzerce/osobni/hyundai/ioniq-5'
        },
        youtubeReviews: [
            { title: 'Hyundai Ioniq 5 review with 0-60mph test!', url: 'https://www.youtube.com/watch?v=Q6K_J7J3-eU', thumbnail: 'https://img.youtube.com/vi/Q6K_J7J3-eU/maxresdefault.jpg', channel: 'carwow' },
            { title: 'Hyundai Ioniq 5 Review | What Do I Think After Two Years?', url: 'https://www.youtube.com/watch?v=wN287p9qJgM', thumbnail: 'https://img.youtube.com/vi/wN287p9qJgM/maxresdefault.jpg', channel: 'Fully Charged' }
        ],
        financing: [
            { name: 'Raiffeisenbank', rate: 4.8, link: 'https://www.rb.cz/osobni/pujcky/pujcka-na-auto', termYears: 5 }
        ],
        insurance: [
            { provider: 'Kooperativa', link: 'https://www.koop.cz', description: 'Komplexní balíček.' }
        ]
    },
    {
        id: 'kia-ev6',
        make: 'Kia',
        model: 'EV6',
        variant: 'Long Range',
        priceFrom: 900000,
        rangeWLTP: 528,
        battery: 77,
        charging: 240,
        image: 'https://www.kia.com/content/dam/kwcms/kme/global/en/assets/vehicles/ev6/discover/kia-ev6-my22-discover-header.png',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/kia-ev6/vhc:car,ms1:13200_30_,ful:electricity',
            carvago: 'https://carvago.com/cs/auta/kia/ev6',
            autoscout: 'https://www.autoscout24.cz/lst/kia/ev6',
            sauto: 'https://www.sauto.cz/inzerce/osobni/kia/ev6'
        },
        youtubeReviews: [
            { title: 'Kia EV6 2025 – Facelift Test', url: 'https://www.youtube.com/watch?v=jJ1M-w9vB_U', thumbnail: 'https://img.youtube.com/vi/jJ1M-w9vB_U/maxresdefault.jpg', channel: 'Electro Dad' }
        ],
        financing: [
            { name: 'Moneta', rate: 4.6, link: 'https://www.monetaauto.cz/', termYears: 5 }
        ],
        insurance: [
            { provider: 'Allianz', link: 'https://www.allianz.cz', description: 'Pojištění pro EV roku.' }
        ]
    },
    {
        id: 'audi-q4',
        make: 'Audi',
        model: 'Q4 e-tron',
        variant: '40',
        priceFrom: 850000,
        rangeWLTP: 520,
        battery: 77,
        charging: 135,
        image: 'https://mediaservice.audi.com/media/live/50900/fly1400x601n1/f4bca/2022.png',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/audi-q4-e-tron/vhc:car,ms1:1900_40_,ful:electricity',
            carvago: 'https://carvago.com/cs/auta/audi/q4-e-tron',
            autoscout: 'https://www.autoscout24.cz/lst/audi/q4-e-tron',
            sauto: 'https://www.sauto.cz/inzerce/osobni/audi/q4-e-tron'
        },
        youtubeReviews: [
            { title: 'Audi Q4 e-tron (TEST)', url: 'https://www.youtube.com/results?search_query=Audi+Q4+e-tron+TEST+Dostupn%C4%9Bj%C5%A1%C3%AD+elekt%C5%99ina', thumbnail: '', channel: 'YouTube Search' }
        ],
        financing: [],
        insurance: []
    },
    {
        id: 'bmw-i3',
        make: 'BMW',
        model: 'i3',
        variant: '120Ah',
        priceFrom: 400000,
        rangeWLTP: 300,
        battery: 42,
        charging: 50,
        image: 'https://www.bmw.cz/content/dam/bmw/common/all-models/i-series/i3/2018/navigation/bmw-i3-modelfinder-890x501.png',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/bmw-i3/vhc:car,ms1:3500_83_,ful:electricity',
            carvago: 'https://carvago.com/cs/auta/bmw/i3',
            autoscout: 'https://www.autoscout24.cz/lst/bmw/i3',
            sauto: 'https://www.sauto.cz/inzerce/osobni/bmw/i3'
        },
        youtubeReviews: [
            { title: 'BMW i3: Městské posunovadlo?', url: 'https://www.youtube.com/results?search_query=BMW+i3+M%C4%9Bstsk%C3%A9+posunovadlo', thumbnail: '', channel: 'YouTube Search' }
        ],
        financing: [],
        insurance: []
    },
    {
        id: 'renault-megane',
        make: 'Renault',
        model: 'Megane E-Tech',
        variant: 'EV60',
        priceFrom: 650000,
        rangeWLTP: 450,
        battery: 60,
        charging: 130,
        image: 'https://cdn.group.renault.com/ren/master/renault-new-cars/megane-e-tech/design/renault-megane-e-tech-exterior-001.jpg',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/renault-megane-e-tech/vhc:car,ms1:20700_44_,ful:electricity',
            carvago: 'https://carvago.com/cs/auta/renault/megane/elektrina',
            autoscout: 'https://www.autoscout24.cz/lst/renault/megane',
            sauto: 'https://www.sauto.cz/inzerce/osobni/renault/megane-e-tech'
        },
        youtubeReviews: [
            { title: 'Velký TEST Renaultu Mégane E-Tech', url: 'https://www.youtube.com/results?search_query=Renault+M%C3%A9gane+E-Tech+TEST', thumbnail: '', channel: 'YouTube Search' }
        ],
        financing: [],
        insurance: []
    },
    {
        id: 'mercedes-eqa',
        make: 'Mercedes-Benz',
        model: 'EQA',
        variant: '250+',
        priceFrom: 750000,
        rangeWLTP: 531,
        battery: 70,
        charging: 100,
        image: 'https://www.mercedes-benz.cz/content/dam/hq/passengercars/cars/eqa/h243-fl/overview/images/mercedes-benz-eqa-h243-fl-startpage-exterior-1-544x340.jpg',
        bazaarLinks: {
            mobileDe: 'https://www.mobile.de/cz/osobn%C3%AD-v%C5%AFz/mercedes-benz-eqa/vhc:car,ms1:17200_67_,ful:electricity',
            carvago: 'https://carvago.com/cs/auta/mercedes-benz/eqa',
            autoscout: 'https://www.autoscout24.cz/lst/mercedes-benz/eqa',
            sauto: 'https://www.sauto.cz/inzerce/osobni/mercedes-benz/eqa'
        },
        youtubeReviews: [
            { title: 'Mercedes EQA 250+ Test', url: 'https://www.youtube.com/results?search_query=Mercedes+EQA+250+test+cz', thumbnail: '', channel: 'YouTube Search' }
        ],
        financing: [
            { name: 'Raiffeisenbank', rate: 4.8, link: 'https://www.rb.cz/osobni/pujcky/pujcka-na-auto', termYears: 5 }
        ],
        insurance: [
            { provider: 'Allianz', link: 'https://www.allianz.cz', description: 'Premium pojištění pro Mercedes vozy.' }
        ]
    }
];
