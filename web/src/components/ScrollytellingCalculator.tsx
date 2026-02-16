import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tag, Truck, CircleDot, Wrench, AlertTriangle, Receipt, ChevronDown, Zap } from 'lucide-react';
import type { Car, CostBreakdown } from '../types';


// Animated number counter using requestAnimationFrame
const AnimatedPrice: React.FC<{ value: number; warning?: boolean; pulse: boolean }> = ({ value, warning, pulse }) => {
    const [display, setDisplay] = useState(0);
    const prevRef = useRef(0);
    const rafRef = useRef<number | undefined>(undefined);

    useEffect(() => {
        const from = prevRef.current;
        const to = value;
        const duration = 600;
        const start = performance.now();

        const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(from + (to - from) * eased));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                prevRef.current = to;
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [value]);

    return (
        <span
            className={`price-counter text-2xl ${warning ? 'text-orange-500' : 'text-emerald-600'} ${pulse ? 'price-pulse' : ''}`}
            key={value}
        >
            {display.toLocaleString('cs-CZ')} Kč
        </span>
    );
};

// SVG route illustration DE → CZ
const RouteIllustration: React.FC<{ active: boolean }> = ({ active }) => (
    <svg viewBox="0 0 200 60" className="w-full max-w-xs mx-auto mt-3" fill="none">
        {/* DE flag */}
        <rect x="4" y="18" width="24" height="5" fill="#000" rx="1" />
        <rect x="4" y="23" width="24" height="5" fill="#DD0000" rx="1" />
        <rect x="4" y="28" width="24" height="5" fill="#FFCC00" rx="1" />
        <text x="16" y="45" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="600">DE</text>
        {/* Route path */}
        <path
            d="M 35 25 C 70 10, 130 40, 165 25"
            stroke="#6366f1"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={`${active ? 'animate-route-draw opacity-100' : 'opacity-20'}`}
        />
        {/* Truck icon dot */}
        {active && (
            <circle cx="165" cy="25" r="4" fill="#6366f1">
                <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
        )}
        {/* CZ flag */}
        <rect x="172" y="18" width="24" height="8" fill="#fff" rx="1" />
        <rect x="172" y="26" width="24" height="7" fill="#D7141A" rx="1" />
        <polygon points="172,18 172,33 185,25.5" fill="#11457E" />
        <text x="184" y="45" textAnchor="middle" fill="#64748b" fontSize="8" fontWeight="600">CZ</text>
    </svg>
);

// Fallback component for old records without cost_breakdown
const FallbackBreakdown: React.FC<{ car: Car }> = ({ car }) => {
    const priceCzk = car.price_czk || 0;
    const realPrice = car.real_price_czk || priceCzk;

    return (
        <div className="p-6 space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Zjednodušený přehled (starší záznam)</p>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Cena inzerátu</span>
                        <span className="font-bold">{priceCzk.toLocaleString('cs-CZ')} Kč</span>
                    </div>
                    {realPrice !== priceCzk && (
                        <div className="flex justify-between items-center border-t pt-2">
                            <span className="text-gray-600">Reálná cena (vč. dovozu)</span>
                            <span className="font-bold text-emerald-600">{realPrice.toLocaleString('cs-CZ')} Kč</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ScrollytellingCalculator: React.FC<{ breakdown: CostBreakdown }> = ({ breakdown }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set<string>());
    const [pulseKey, setPulseKey] = useState(0);

    // Build sections dynamically from breakdown
    const sections = React.useMemo(() => {
        const s: { id: string; label: string; amount: number; icon: React.ReactNode; note?: string; alwaysShow: boolean; visual?: React.ReactNode }[] = [];

        // 1. Base price
        s.push({
            id: 'base',
            label: 'Cena z inzerátu',
            amount: breakdown.base_czk,
            icon: <Tag className="w-6 h-6 text-indigo-500" />,
            note: `${breakdown.base_price_eur.toLocaleString('cs-CZ')} € × 25,2`,
            alwaysShow: true,
        });

        // 2. VAT adjustment (only if non-zero)
        if (Math.abs(breakdown.vat_adjustment_eur) > 1) {
            const vatCzk = Math.round(breakdown.vat_adjustment_eur * 25.2);
            s.push({
                id: 'vat',
                label: 'Korekce DPH',
                amount: vatCzk,
                icon: <Receipt className="w-6 h-6 text-violet-500" />,
                note: vatCzk < 0 ? 'Netto → CZ DPH 21% = úspora' : 'Přepočet DPH DE→CZ',
                alwaysShow: true,
            });
        }

        // 3. Logistics
        s.push({
            id: 'logistics',
            label: 'Doprava + STK + registrace',
            amount: breakdown.logistics_czk,
            icon: <Truck className="w-6 h-6 text-blue-500" />,
            note: 'Odtahová služba DE → CZ',
            alwaysShow: true,
            visual: 'route',
        });

        // 4. Tires (conditional)
        if (breakdown.tires_czk > 0) {
            s.push({
                id: 'tires',
                label: 'Pneumatiky',
                amount: breakdown.tires_czk,
                icon: <CircleDot className="w-6 h-6 text-amber-500" />,
                note: `Nájezd > 50k km → nové gumy`,
                alwaysShow: false,
            });
        }

        // 5. Service (conditional)
        if (breakdown.service_czk > 0) {
            s.push({
                id: 'service',
                label: 'Servis kapaliny',
                amount: breakdown.service_czk,
                icon: <Wrench className="w-6 h-6 text-red-500" />,
                note: 'Kia Niro — velký servis chladiva',
                alwaysShow: false,
            });
        }

        return s;
    }, [breakdown]);

    // Current total based on visible sections
    const currentTotal = React.useMemo(() => {
        let total = 0;
        for (const section of sections) {
            if (visibleSections.has(section.id)) {
                total += section.amount;
            }
        }
        return total;
    }, [visibleSections, sections]);

    // Has warnings?
    const hasWarnings = breakdown.warnings.length > 0;
    const showWarningHeader = hasWarnings && visibleSections.size === sections.length;

    // Intersection Observer
    const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
        setVisibleSections(prev => {
            const next = new Set(prev);
            let changed = false;
            entries.forEach(entry => {
                const id = (entry.target as HTMLElement).dataset.sectionId;
                if (id && entry.isIntersecting && !next.has(id)) {
                    next.add(id);
                    changed = true;
                }
            });
            if (changed) {
                setPulseKey(k => k + 1);
            }
            return changed ? next : prev;
        });
    }, []);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        const observer = new IntersectionObserver(observerCallback, {
            root: container,
            threshold: 0.4,
        });

        const sectionEls = container.querySelectorAll('[data-section-id]');
        sectionEls.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, [observerCallback, sections]);

    // Scroll to summary
    const scrollToSummary = () => {
        const el = scrollRef.current?.querySelector('#scrolly-summary');
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div ref={scrollRef} className="relative overflow-y-auto max-h-[60vh]">
            {/* Sticky Price Header */}
            <div className={`scrolly-sticky-header px-5 py-3 flex items-center justify-between ${showWarningHeader ? 'warning' : ''}`}>
                <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-gray-500">Reálná cena</span>
                </div>
                <AnimatedPrice value={currentTotal} warning={showWarningHeader} pulse={pulseKey > 1} />
            </div>

            {/* Skip to summary */}
            <div className="flex justify-center py-2">
                <button
                    onClick={scrollToSummary}
                    className="text-xs text-gray-400 hover:text-indigo-500 flex items-center gap-1 transition-colors"
                >
                    Přeskočit na souhrn <ChevronDown className="w-3 h-3" />
                </button>
            </div>

            {/* Scrollytelling Sections */}
            <div className="space-y-2 px-4 pb-4">
                {sections.map((section) => {
                    const isVisible = visibleSections.has(section.id);
                    return (
                        <div
                            key={section.id}
                            data-section-id={section.id}
                            className={`scrolly-section ${isVisible ? 'visible' : ''} min-h-[140px] flex flex-col justify-center`}
                        >
                            <div className={`rounded-2xl p-5 border transition-all duration-300 ${isVisible
                                ? 'bg-white border-gray-200 shadow-sm'
                                : 'bg-gray-50/50 border-gray-100'
                                }`}>
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-2">
                                    <div className={`p-2 rounded-xl transition-all ${isVisible ? 'bg-indigo-50' : 'bg-gray-100'
                                        } ${section.id === 'tires' && isVisible ? 'animate-inflate' : ''}`}>
                                        {section.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{section.label}</h4>
                                    </div>
                                    <div className={`text-right transition-all ${isVisible ? 'opacity-100' : 'opacity-30'}`}>
                                        <span className={`text-lg font-bold ${section.amount < 0 ? 'text-emerald-600' : 'text-gray-800'
                                            }`}>
                                            {section.amount >= 0 ? '+' : ''}{section.amount.toLocaleString('cs-CZ')} Kč
                                        </span>
                                    </div>
                                </div>

                                {/* Handwritten note */}
                                {section.note && isVisible && (
                                    <div className="ml-14 mt-1">
                                        <span className="handwritten-note">{section.note}</span>
                                    </div>
                                )}

                                {/* Route visual */}
                                {section.visual === 'route' && (
                                    <RouteIllustration active={isVisible} />
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Warnings section */}
                {hasWarnings && (
                    <div
                        data-section-id="warnings"
                        className={`scrolly-section ${visibleSections.has('warnings') || showWarningHeader ? 'visible' : ''} min-h-[100px] flex flex-col justify-center`}
                    >
                        <div className="space-y-2">
                            {breakdown.warnings.map((w, i) => (
                                <div key={i} className="warning-bubble flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                    <span className="text-sm text-orange-800 font-medium">{w.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Summary */}
                <div id="scrolly-summary" className="pt-4 pb-2">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Souhrn kalkulace</h4>
                        <div className="space-y-2">
                            {sections.map(s => (
                                <div key={s.id} className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">{s.label}</span>
                                    <span className={`font-semibold ${s.amount < 0 ? 'text-emerald-600' : 'text-gray-800'}`}>
                                        {s.amount >= 0 ? '+' : ''}{s.amount.toLocaleString('cs-CZ')} Kč
                                    </span>
                                </div>
                            ))}
                            <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                                <span className="font-bold text-gray-800">Celkem</span>
                                <span className="font-bold text-xl text-emerald-600">
                                    {breakdown.total_czk.toLocaleString('cs-CZ')} Kč
                                </span>
                            </div>
                        </div>

                        {/* Warnings in summary */}
                        {hasWarnings && (
                            <div className="mt-3 pt-3 border-t border-orange-200 space-y-1">
                                {breakdown.warnings.map((w, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-orange-600">
                                        <AlertTriangle className="w-3 h-3" />
                                        <span>{w.text}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Wrapper that handles fallback for old records
export const ScrollytellingCalculatorWrapper: React.FC<{ car: Car }> = ({ car }) => {
    if (!car.cost_breakdown) {
        return <FallbackBreakdown car={car} />;
    }
    return <ScrollytellingCalculator breakdown={car.cost_breakdown} />;
};
