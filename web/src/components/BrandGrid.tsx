import React, { useState, useMemo } from 'react';
import { ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import type { CarStaticData } from '../data/cars_static';
import { BRAND_CATALOG } from '../data/brandLogos';
import type { BrandInfo } from '../data/brandLogos';
import { BrandIcon } from './BrandIcon';

interface BrandGridProps {
    cars: CarStaticData[];
    onSelectCar: (car: CarStaticData) => void;
}

// Segment labels and their display order
const SEGMENTS = [
    { key: 'mainstream' as const, label: 'Populární značky', icon: '⚡' },
    { key: 'premium' as const, label: 'Prémiový segment', icon: '✦' },
    { key: 'budget' as const, label: 'Cenově dostupné', icon: '💰' },
];

export const BrandGrid: React.FC<BrandGridProps> = ({ cars, onSelectCar }) => {
    const [expandedBrand, setExpandedBrand] = useState<string | null>(null);

    // Index cars_static by make+model for quick lookup
    const carIndex = useMemo(() => {
        const idx: Record<string, CarStaticData> = {};
        for (const car of cars) {
            // Match by model name (fuzzy — checks if model name is contained)
            idx[`${car.make}|${car.model}`] = car;
        }
        return idx;
    }, [cars]);

    const findDetailedCar = (brand: BrandInfo, modelName: string): CarStaticData | undefined => {
        // Try exact match first
        const exact = carIndex[`${brand.make}|${modelName}`];
        if (exact) return exact;
        // Try partial match (e.g. "Mégane E-Tech" vs "Megane E-Tech")
        return cars.find(c =>
            c.make === brand.make &&
            (c.model.includes(modelName) || modelName.includes(c.model))
        );
    };

    const handleBrandClick = (make: string) => {
        setExpandedBrand(prev => prev === make ? null : make);
    };

    // Group brands by segment
    const brandsBySegment = useMemo(() => {
        const grouped: Record<string, BrandInfo[]> = {};
        for (const seg of SEGMENTS) {
            grouped[seg.key] = BRAND_CATALOG.filter(b => b.segment === seg.key);
        }
        return grouped;
    }, []);

    return (
        <div className="space-y-10">
            {SEGMENTS.map((segment) => {
                const brandsInSegment = brandsBySegment[segment.key];
                if (!brandsInSegment || brandsInSegment.length === 0) return null;

                return (
                    <div key={segment.key}>
                        {/* Segment Header */}
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-lg">{segment.icon}</span>
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                {segment.label}
                            </h3>
                            <div className="flex-1 h-px bg-gray-200 ml-2" />
                        </div>

                        {/* Brand Logos Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {brandsInSegment.map((brand) => {
                                const isExpanded = expandedBrand === brand.make;
                                return (
                                    <button
                                        key={brand.make}
                                        onClick={() => handleBrandClick(brand.make)}
                                        className={`
                                            relative group flex flex-col items-center gap-2 p-4 rounded-2xl
                                            transition-all duration-300 cursor-pointer text-left brand-card
                                            ${isExpanded
                                                ? 'bg-white shadow-lg scale-[1.03] brand-card-expanded'
                                                : 'bg-white/70 hover:bg-white shadow-sm hover:shadow-md hover:scale-[1.03]'
                                            }
                                        `}
                                        /* eslint-disable-next-line */
                                        style={{ '--brand-color': brand.accentColor } as React.CSSProperties}
                                    >
                                        {/* Logo Circle */}
                                        <div
                                            className={`
                                                w-14 h-14 rounded-full flex items-center justify-center
                                                brand-logo-circle overflow-hidden relative
                                                transition-all duration-300
                                                ${isExpanded ? 'scale-110 brand-logo-glow' : 'group-hover:scale-110'}
                                            `}
                                        >
                                            <BrandIcon
                                                component={brand.logoComponent}
                                                accentColor={brand.accentColor}
                                                className="w-full h-full p-2"
                                            />
                                        </div>

                                        {/* Brand Name + Description */}
                                        <div className="text-center min-w-0">
                                            <span className="text-sm font-bold text-gray-900 block leading-tight">
                                                {brand.displayName}
                                            </span>
                                            <span className="text-[10px] text-gray-400 leading-tight block mt-0.5 truncate max-w-[120px]">
                                                {brand.description}
                                            </span>
                                        </div>

                                        {/* Model count badge */}
                                        <span className="text-[10px] font-semibold text-gray-300">
                                            {brand.models.length} {brand.models.length === 1 ? 'model' : brand.models.length < 5 ? 'modely' : 'modelů'}
                                        </span>

                                        {/* Expand chevron */}
                                        <ChevronDown
                                            size={12}
                                            className={`
                                                absolute bottom-1.5 text-gray-300 transition-transform duration-300
                                                ${isExpanded ? 'rotate-180 text-gray-500' : 'group-hover:text-gray-400'}
                                            `}
                                        />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Expanded Models Panel — renders below the segment grid */}
                        {expandedBrand && brandsInSegment.some(b => b.make === expandedBrand) && (() => {
                            const brand = brandsInSegment.find(b => b.make === expandedBrand)!;
                            return (
                                <div className="mt-4 animate-expand-down">
                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                        {/* Panel Header */}
                                        <div className="p-5 pb-4 border-b border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center brand-logo-circle overflow-hidden relative"
                                                    /* eslint-disable-next-line */
                                                    style={{ '--brand-color': brand.accentColor } as React.CSSProperties}
                                                >
                                                    <BrandIcon
                                                        component={brand.logoComponent}
                                                        accentColor={brand.accentColor}
                                                        className="w-full h-full p-1.5"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-lg">{brand.make}</h4>
                                                    <p className="text-sm text-gray-400">{brand.description}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setExpandedBrand(null)}
                                                className="text-gray-400 hover:text-gray-600 text-sm font-medium px-3 py-1 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Zavřít
                                            </button>
                                        </div>

                                        {/* Models List */}
                                        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                            {brand.models.map((model) => {
                                                const detailedCar = findDetailedCar(brand, model.name);
                                                const hasDetail = !!detailedCar;

                                                return (
                                                    <div
                                                        key={model.name}
                                                        onClick={() => hasDetail && detailedCar && onSelectCar(detailedCar)}
                                                        className={`
                                                                    flex items-center justify-between p-4 rounded-xl border
                                                                    transition-all duration-200
                                                                    ${hasDetail
                                                                ? 'border-gray-200 hover:border-gray-300 hover:shadow-md cursor-pointer group bg-white'
                                                                : 'border-gray-100 bg-gray-50/50 cursor-default'
                                                            }
                                                                `}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            {/* Model indicator */}
                                                            <div
                                                                className="w-2 h-2 rounded-full shrink-0"
                                                                /* eslint-disable-next-line */
                                                                style={{ backgroundColor: hasDetail ? brand.accentColor : '#d1d5db' }}
                                                            />
                                                            <div className="min-w-0">
                                                                <span className={`font-semibold block truncate ${hasDetail ? 'text-gray-900' : 'text-gray-500'}`}>
                                                                    {model.name}
                                                                </span>
                                                                {model.badge && (
                                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full mt-0.5">
                                                                        <Sparkles size={9} />
                                                                        {model.badge}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {hasDetail ? (
                                                            <ArrowRight
                                                                size={16}
                                                                className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all shrink-0"
                                                            />
                                                        ) : (
                                                            <span className="text-[9px] text-gray-300 font-medium shrink-0 whitespace-nowrap">
                                                                brzy
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })
                                            }
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                );
            })}
        </div>
    );
};

