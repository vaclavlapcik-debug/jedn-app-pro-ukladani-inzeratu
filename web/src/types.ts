export interface CostBreakdownWarning {
    type: 'heat_pump_missing' | 'high_mileage' | 'low_soh';
    text: string;
}

export interface CostBreakdown {
    base_price_eur: number;
    vat_adjustment_eur: number;
    final_price_eur: number;
    base_czk: number;
    logistics_czk: number;
    tires_czk: number;
    service_czk: number;
    total_czk: number;
    warnings: CostBreakdownWarning[];
}

export interface ExternalLink {
    url: string;
    label: string;
    type: 'video' | 'article' | 'forum' | 'other';
}

export interface TestDriveData {
    distance: number;
    startSoc: number;
    endSoc: number;
    consumption: number;
    calculatedCapacity?: number;
    calculatedSoh?: number;
    testDate?: string;
}

export interface Car {
    id: string;
    // Core fields
    model: string;
    link?: string;
    url?: string;

    price_czk?: number;
    real_price_czk?: number;
    price_eur?: number;

    mileage?: number;
    year?: number;
    fuel?: string;
    transmission?: string;
    power?: string;
    power_kw?: number;

    location?: string;
    image?: string;
    image_url?: string;

    description?: string;
    date_added?: string;
    timestamp?: any;

    // Analysis fields
    expert_score?: number;
    arbitrage_profit?: number;
    soh?: number;
    range_wltp?: number;

    warnings?: string[];
    features?: string[];
    deal_status?: string;
    negotiation_draft_en?: string;

    // Enhanced Data Model
    notes?: string;
    tags?: string[];
    externalLinks?: ExternalLink[];
    testDriveData?: TestDriveData;

    // Expert Analysis from Gemini
    audit_verdict?: string;
    audit_reasons?: string[];
    negotiation_draft?: string;

    // EV Expert Audit — rozšířené atributy
    owners?: number;
    seller_name?: string;
    country?: string;
    seller_type?: 'dealer' | 'private';

    // Scrollytelling Calculator
    cost_breakdown?: CostBreakdown;
}
