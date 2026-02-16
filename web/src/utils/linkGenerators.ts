import type { CarStaticData } from '../data/cars_static';

export interface SearchParams {
    priceFrom?: number;
    priceTo?: number;
    yearFrom?: number;
    mileageTo?: number;
}

export interface BazaarLinkGenerator {
    name: string;
    logo?: string; // Optional logo URL or icon name
    generateUrl: (car: CarStaticData, params?: SearchParams) => string;
}

// Helper to normalize strings (remove diacritics, lowercase, replace spaces)
// Helper to normalize strings (remove diacritics, lowercase, replace spaces)
const norm = (str: string) => {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/ /g, '-')
        .replace('enyaq-iv', 'enyaq')  // AS24 uses just "enyaq"
        .replace('id.', 'id-'); // VW ID.4 → id-4
};

export const BazaarLinks: BazaarLinkGenerator[] = [
    {
        name: 'Mobile.de',
        generateUrl: (car, params) => {
            const make = encodeURIComponent(norm(car.make));
            // Mobile.de quirks
            let modelStr = norm(car.model);
            if (modelStr === 'model-3') modelStr = 'model--3';

            const model = encodeURIComponent(modelStr);

            const parts: string[] = [
                `dam=0`,
                `ft=ELECTRICITY`,
                `isSearchRequest=true`,
                `ms=;;;${make};${model}`,
                `s=Car`,
                `sb=p`,
                `vc=Car`
            ];

            // Only add filters if user filled them in
            if (params?.yearFrom) parts.push(`fr=${params.yearFrom}`);
            if (params?.priceFrom) parts.push(`p=${Math.round(params.priceFrom / 25)}:`);
            if (params?.priceTo) parts.push(`p=:${Math.round(params.priceTo / 25)}`);
            if (params?.mileageTo) parts.push(`ml=:${params.mileageTo}`);

            return `https://suchen.mobile.de/fahrzeuge/search.html?${parts.join('&')}`;
        }
    },
    {
        name: 'Sauto.cz',
        generateUrl: (car, params) => {
            const make = norm(car.make);
            const model = norm(car.model);

            const parts: string[] = [`palivo=elektrina`];

            if (params?.priceFrom) parts.push(`cena-od=${params.priceFrom}`);
            if (params?.priceTo) parts.push(`cena-do=${params.priceTo}`);
            if (params?.yearFrom) parts.push(`rok-vyroby-od=${params.yearFrom}`);
            if (params?.mileageTo) parts.push(`najeto-do=${params.mileageTo}`);

            return `https://www.sauto.cz/inzerce/osobni/${make}/${model}?${parts.join('&')}`;
        }
    },
    {
        name: 'Carvago',
        generateUrl: (car, params) => {
            const make = norm(car.make);
            const model = norm(car.model);

            const parts: string[] = [];

            if (params?.yearFrom) parts.push(`registration-date-from=${params.yearFrom}`);
            if (params?.priceFrom) parts.push(`price-from=${params.priceFrom}`);
            if (params?.priceTo) parts.push(`price-to=${params.priceTo}`);
            if (params?.mileageTo) parts.push(`mileage-to=${params.mileageTo}`);

            const qs = parts.length > 0 ? `?${parts.join('&')}` : '';
            return `https://carvago.com/cs/auta/${make}/${model}/elektrina${qs}`;
        }
    },
    {
        name: 'Autoscout24',
        generateUrl: (car, params) => {
            const make = norm(car.make);
            const model = norm(car.model);

            const parts: string[] = [`fuel=E`];

            if (params?.yearFrom) parts.push(`fregfrom=${params.yearFrom}`);
            if (params?.priceFrom) parts.push(`pricefrom=${Math.round(params.priceFrom / 25)}`);
            if (params?.priceTo) parts.push(`priceto=${Math.round(params.priceTo / 25)}`);
            if (params?.mileageTo) parts.push(`kmto=${params.mileageTo}`);

            return `https://www.autoscout24.cz/lst/${make}/${model}?${parts.join('&')}`;
        }
    },
    {
        name: 'Bazoš.cz',
        generateUrl: (car, params) => {
            const query = encodeURIComponent(`${car.make} ${car.model}`);

            const parts: string[] = [
                `hledat=${query}`,
                `rubriky=auto`,
                `kitx=ano`
            ];

            if (params?.priceFrom) parts.push(`cenaod=${params.priceFrom}`);
            if (params?.priceTo) parts.push(`cenado=${params.priceTo}`);

            return `https://auto.bazos.cz/hledat/?${parts.join('&')}`;
        }
    },
    {
        name: 'Sbazar.cz',
        generateUrl: (car, params) => {
            const query = encodeURIComponent(`${car.make} ${car.model}`);

            const parts: string[] = [];

            if (params?.priceFrom) parts.push(`priceFrom=${params.priceFrom}`);
            if (params?.priceTo) parts.push(`priceTo=${params.priceTo}`);

            const qs = parts.length > 0 ? `?${parts.join('&')}` : '';
            return `https://www.sbazar.cz/hledat/${query}${qs}`;
        }
    },
    {
        name: 'AAA Auto',
        generateUrl: (car) => {
            const make = norm(car.make);
            const model = norm(car.model);
            return `https://www.aaaauto.cz/ojeta-auta/${make}/${model}`;
        }
    },
    {
        name: 'Auto ESA',
        generateUrl: (car, params) => {
            const query = encodeURIComponent(`${car.make} ${car.model}`);

            const parts: string[] = [`q=${query}`];

            if (params?.priceFrom) parts.push(`cena-od=${params.priceFrom}`);
            if (params?.priceTo) parts.push(`cena-do=${params.priceTo}`);

            return `https://www.autoesa.cz/hledani?${parts.join('&')}`;
        }
    }
];
