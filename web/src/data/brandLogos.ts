// Brand catalog data — primary source for the catalog homepage
// Models listed here are for display; only some have detailed data in cars_static.ts

// Import logos
import type { FunctionComponent, SVGProps } from "react";

import SkodaLogo from "../assets/logos/skoda_logo_pencil.svg?react";
import TeslaLogo from "../assets/logos/tesla_logo_pencil.svg?react";
import KiaLogo from "../assets/logos/kia_logo_pencil.svg?react";
import HyundaiLogo from "../assets/logos/hyundai_logo_pencil.svg?react";
import VWLogo from "../assets/logos/volkswagen_logo_pencil.svg?react";
import BMWLogo from "../assets/logos/bmw_logo_pencil.svg?react";
import AudiLogo from "../assets/logos/audi_logo_pencil.svg?react";
import MercedesLogo from "../assets/logos/mercedes_logo_pencil.svg?react";
import RenaultLogo from "../assets/logos/renault_logo_pencil.svg?react";
import VolvoLogo from "../assets/logos/volvo_logo_pencil.svg?react";
import MGLogo from "../assets/logos/mg_logo_pencil.svg?react";
import DaciaLogo from "../assets/logos/dacia_logo_pencil.svg?react";

export interface BrandModel {
    name: string;
    badge?: string; // e.g. "novinka!", "předobjednávky", "7místné"
}

export interface BrandInfo {
    make: string;
    displayName: string;
    textLogo: string;
    // Strictly SVG component
    logoComponent: FunctionComponent<SVGProps<SVGSVGElement>>;
    accentColor: string;
    description: string;
    segment: 'mainstream' | 'premium' | 'budget';
    models: BrandModel[];
}

export const BRAND_CATALOG: BrandInfo[] = [
    {
        make: 'Škoda',
        displayName: 'Škoda',
        textLogo: 'Š',
        logoComponent: SkodaLogo,
        accentColor: '#4ba82e',
        description: 'Kompaktní až rodinné SUV',
        segment: 'mainstream',
        models: [
            { name: 'Elroq', badge: 'novinka!' },
            { name: 'Enyaq' },
            { name: 'Enyaq Coupé' },
            { name: 'Epiq', badge: 'předobjednávky' },
        ]
    },
    {
        make: 'Volkswagen',
        displayName: 'VW',
        textLogo: 'VW',
        logoComponent: VWLogo,
        accentColor: '#001e50',
        description: 'Hatchback, SUV, MPV',
        segment: 'mainstream',
        models: [
            { name: 'ID.3' },
            { name: 'ID.4' },
            { name: 'ID.5' },
            { name: 'ID.7', badge: 'vlajková loď' },
            { name: 'ID. Buzz' },
        ]
    },
    {
        make: 'Hyundai',
        displayName: 'Hyundai',
        textLogo: 'H',
        logoComponent: HyundaiLogo,
        accentColor: '#002c5f',
        description: 'Mix kategorií',
        segment: 'mainstream',
        models: [
            { name: 'Ioniq 5' },
            { name: 'Ioniq 6' },
            { name: 'Kona Electric' },
            { name: 'Inster', badge: 'městské' },
        ]
    },
    {
        make: 'Kia',
        displayName: 'Kia',
        textLogo: 'K',
        logoComponent: KiaLogo,
        accentColor: '#05141f',
        description: 'Crossovery, velká SUV',
        segment: 'mainstream',
        models: [
            { name: 'EV6' },
            { name: 'EV9', badge: '7místné' },
            { name: 'EV3' },
            { name: 'Niro EV' },
        ]
    },
    {
        make: 'Tesla',
        displayName: 'Tesla',
        textLogo: 'T',
        logoComponent: TeslaLogo,
        accentColor: '#cc0000',
        description: 'Crossovery, sedany',
        segment: 'mainstream',
        models: [
            { name: 'Model Y' },
            { name: 'Model 3', badge: 'Highland' },
            { name: 'Model S' },
            { name: 'Model X' },
        ]
    },
    {
        make: 'Renault',
        displayName: 'Renault',
        textLogo: 'R',
        logoComponent: RenaultLogo,
        accentColor: '#efdf00',
        description: 'Stylové crossovery',
        segment: 'mainstream',
        models: [
            { name: 'Mégane E-Tech' },
            { name: 'Scenic E-Tech' },
            { name: 'Renault 5 E-Tech' },
        ]
    },
    {
        make: 'MG',
        displayName: 'MG',
        textLogo: 'MG',
        logoComponent: MGLogo,
        accentColor: '#c1272d',
        description: 'Cenově dostupné, sportovní',
        segment: 'mainstream',
        models: [
            { name: 'MG4 Electric' },
            { name: 'MG5', badge: 'kombi' },
            { name: 'ZS EV' },
            { name: 'Cyberster' },
        ]
    },
    {
        make: 'Volvo',
        displayName: 'Volvo',
        textLogo: 'V',
        logoComponent: VolvoLogo,
        accentColor: '#003057',
        description: 'Skandinávský design, bezpečnost',
        segment: 'mainstream',
        models: [
            { name: 'EX30' },
            { name: 'EX40', badge: 'dříve XC40' },
            { name: 'EX90' },
            { name: 'EX60' },
        ]
    },

    // ── PREMIUM SEGMENT ─────────────────────────────────
    {
        make: 'BMW',
        displayName: 'BMW',
        textLogo: 'B',
        logoComponent: BMWLogo,
        accentColor: '#0066b1',
        description: 'Prémiové sedany a SUV',
        segment: 'premium',
        models: [
            { name: 'i4' },
            { name: 'iX3', badge: 'nová generace' },
            { name: 'iX1' },
            { name: 'iX' },
            { name: 'i5' },
            { name: 'i7' },
        ]
    },
    {
        make: 'Mercedes-Benz',
        displayName: 'Mercedes',
        textLogo: 'M',
        logoComponent: MercedesLogo,
        accentColor: '#333333',
        description: 'Luxusní segment',
        segment: 'premium',
        models: [
            { name: 'EQA' },
            { name: 'EQB' },
            { name: 'EQE' },
            { name: 'EQS' },
            { name: 'CLA', badge: 'nová generace' },
        ]
    },
    {
        make: 'Audi',
        displayName: 'Audi',
        textLogo: 'A',
        logoComponent: AudiLogo,
        accentColor: '#bb0a30',
        description: 'Prémiové SUV',
        segment: 'premium',
        models: [
            { name: 'Q4 e-tron' },
            { name: 'Q6 e-tron' },
            { name: 'Q8 e-tron' },
            { name: 'e-tron GT' },
        ]
    },

    // ── BUDGET SEGMENT ──────────────────────────────────
    {
        make: 'Dacia',
        displayName: 'Dacia',
        textLogo: 'D',
        logoComponent: DaciaLogo,
        accentColor: '#646b52',
        description: 'Nejlevnější městské auto',
        segment: 'budget',
        models: [
            { name: 'Spring' },
        ]
    },
];
