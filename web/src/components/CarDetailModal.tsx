import React, { useState, useEffect } from 'react';
import { X, Check, Battery, Zap, ShieldCheck, Calendar, Gauge, Power, ExternalLink, Edit3, Tag, Save, Plus, Trash2, Calculator } from 'lucide-react';
import type { Car, ExternalLink as CarLink } from '../types';
import { ScrollytellingCalculatorWrapper } from './ScrollytellingCalculator';

interface CarDetailModalProps {
    // ... (rest is same, but I need to target specific lines for button fixes too, so I'll do multiple replacements or one big one if they are close. They are scattered.)
    // Let's do imports first.

    car: Car | null;
    onClose: () => void;
    onUpdate?: (carId: string, data: Partial<Car>) => Promise<void>;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({ car, onClose, onUpdate }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'notes' | 'analysis' | 'calculator'>('info');
    const [notes, setNotes] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState('');
    const [links, setLinks] = useState<CarLink[]>([]);
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [newLinkLabel, setNewLinkLabel] = useState('');

    useEffect(() => {
        if (car) {
            setNotes(car.notes || '');
            setTags(car.tags || []);
            setLinks(car.externalLinks || []);
            setActiveTab('info');
        }
    }, [car]);

    if (!car) return null;

    // Helper for updating
    const handleSave = async () => {
        if (car.id && onUpdate) {
            await onUpdate(car.id, {
                notes,
                tags,
                externalLinks: links
            });
        }
    };

    const addTag = () => {
        if (newTag.trim() && !tags.includes(newTag.trim())) {
            setTags([...tags, newTag.trim()]);
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const addLink = () => {
        if (newLinkUrl.trim()) {
            setLinks([...links, {
                url: newLinkUrl,
                label: newLinkLabel || newLinkUrl,
                type: 'other'
            }]);
            setNewLinkUrl('');
            setNewLinkLabel('');
        }
    };

    const removeLink = (urlToRemove: string) => {
        setLinks(links.filter(l => l.url !== urlToRemove));
    };

    // Helper for formatting currency
    const formatPrice = (price: number | undefined) => {
        return (price || 0).toLocaleString('cs-CZ') + ' Kč';
    };

    // Calculate profit color
    const profit = car.arbitrage_profit || 0;
    const isProfitPositive = profit > 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-6xl h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative cursor-default"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Close Button */}
                <button
                    onClick={onClose}
                    title="Zavřít"
                    className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Mobile/Tablet Tabs Header - Visible only on small screens or inside main content? 
                    Actually let's put tabs inside the left column or as a main header.
                    Let's make the left column the main content area with tabs.
                */}

                {/* Left Column: Image & Tabs Content */}
                <div className="md:w-2/3 h-full flex flex-col bg-gray-50">

                    {/* Hero / Image Section - Only visible in 'info' tab? Or always sticky top? 
                        Let's keep it always visible but maybe smaller in other tabs? 
                        For simplicity, let's keep the image header always visible but scrollable with content 
                        OR fixed at top. Let's make it scrollable as part of content for now, 
                        BUT we need tabs navigation.
                    */}

                    {/* Tabs Navigation Bar */}
                    <div className="bg-white border-b border-gray-200 px-6 flex items-center gap-6 sticky top-0 z-20">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'info' ? 'border-carvago-primary text-carvago-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                        >
                            Informace
                        </button>
                        <button
                            onClick={() => setActiveTab('notes')}
                            className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'notes' ? 'border-carvago-primary text-carvago-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                        >
                            <Edit3 size={16} /> Poznámky & Štítky
                        </button>
                        <button
                            onClick={() => setActiveTab('analysis')}
                            className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'analysis' ? 'border-carvago-primary text-carvago-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                        >
                            <Zap size={16} /> Analýza
                        </button>
                        <button
                            onClick={() => setActiveTab('calculator')}
                            className={`py-4 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'calculator' ? 'border-carvago-primary text-carvago-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
                        >
                            <Calculator size={16} /> Kalkulace
                        </button>
                    </div>

                    <div className="flex-grow overflow-y-auto custom-scrollbar relative">
                        {activeTab === 'info' && (
                            <>
                                {/* Header Area: Compact Image & Title */}
                                {car.image ? (
                                    <div className="w-full h-56 bg-gray-200 relative shrink-0 group">
                                        <img src={car.image} alt={car.model} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                        <div className="absolute bottom-4 left-6 text-white text-shadow-sm">
                                            <h1 className="text-3xl font-bold mb-1 leading-tight">{car.model}</h1>
                                            <div className="flex gap-4 text-sm font-medium opacity-90">
                                                <span className="flex items-center gap-1"><Calendar size={14} /> {car.year}</span>
                                                <span className="flex items-center gap-1"><Gauge size={14} /> {car.mileage?.toLocaleString()} km</span>
                                                <span className="flex items-center gap-1"><Power size={14} /> {car.power_kw ? `${car.power_kw} kW` : ''}</span>
                                            </div>
                                        </div>
                                        {(car.expert_score || 0) >= 90 && (
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-green-700 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-sm">
                                                <ShieldCheck size={14} />
                                                AUDIT: PŘIJATO
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-40 bg-slate-900 relative overflow-hidden shrink-0 flex items-center px-8">
                                        <div className="relative z-10 text-white">
                                            <h1 className="text-3xl font-bold mb-2">{car.model}</h1>
                                            <div className="flex gap-4 text-slate-300 text-sm">
                                                <span>{car.year}</span>
                                                <span>{car.mileage?.toLocaleString()} km</span>
                                                <span>{car.power_kw} kW</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="p-6 space-y-6">
                                    {/* Specifications Grid — Compact */}
                                    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                                            {/* SoH */}
                                            <div className={`text-center ${(car.soh || 100) >= 90 ? 'text-green-600' : 'text-orange-500'}`}>
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">SoH Baterie</p>
                                                <p className="font-bold text-lg flex items-center justify-center gap-1">
                                                    <Battery size={16} /> {car.soh || '?'}%
                                                </p>
                                            </div>
                                            {/* Nájezd */}
                                            <div className="text-center text-gray-900">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Nájezd</p>
                                                <p className="font-bold text-lg">{car.mileage ? (car.mileage / 1000).toFixed(0) + 'k' : '?'} km</p>
                                            </div>
                                            {/* Dojezd */}
                                            <div className="text-center text-gray-900">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Dojezd WLTP</p>
                                                <p className="font-bold text-lg">{car.range_wltp || '?'} km</p>
                                            </div>
                                            {/* Rok */}
                                            <div className="text-center text-gray-900">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Rok</p>
                                                <p className="font-bold text-lg">{car.year || '?'}</p>
                                            </div>
                                            {/* Výkon */}
                                            <div className="text-center text-gray-900">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Výkon</p>
                                                <p className="font-bold text-lg">{car.power_kw || '?'} kW</p>
                                            </div>
                                            {/* Lokace */}
                                            <div className="text-center text-gray-900">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Lokace</p>
                                                <p className="font-bold text-lg truncate px-1">{car.location || 'EU'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2-Column Grid for Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Left: Warnings & Features */}
                                        <div className="space-y-6">
                                            {(car.warnings && car.warnings.length > 0) ? (
                                                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                                                    <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2 text-sm">
                                                        <ShieldCheck size={16} /> Upozornění Technika ({car.warnings.length})
                                                    </h4>
                                                    <ul className="space-y-1">
                                                        {car.warnings.slice(0, 3).map((w: string, i: number) => (
                                                            <li key={i} className="text-xs text-orange-700 leading-tight">• {w}</li>
                                                        ))}
                                                        {car.warnings.length > 3 && (
                                                            <li className="text-xs text-orange-600 italic font-medium pt-1">...a další {car.warnings.length - 3} upozornění v tabu Analýza</li>
                                                        )}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg flex items-center gap-3">
                                                    <ShieldCheck size={20} className="text-green-600" />
                                                    <div>
                                                        <h4 className="font-bold text-green-800 text-sm">Bez varování</h4>
                                                        <p className="text-xs text-green-600">Technik nenašel žádné kritické problémy.</p>
                                                    </div>
                                                </div>
                                            )}

                                            {car.features && (
                                                <div>
                                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Výbava</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {car.features.slice(0, 8).map((f: string, i: number) => (
                                                            <span key={i} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-xs font-medium border border-gray-200">
                                                                {f}
                                                            </span>
                                                        ))}
                                                        {car.features.length > 8 && (
                                                            <span className="text-xs text-gray-400 self-center pl-1">+{car.features.length - 8} dalších</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: User Notes & Tags */}
                                        <div className="space-y-6">
                                            {notes ? (
                                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                                    <h3 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                                                        <Edit3 size={14} /> Vaše poznámka
                                                    </h3>
                                                    <p className="text-yellow-900 text-sm whitespace-pre-line line-clamp-4">{notes}</p>
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 border-dashed text-center">
                                                    <p className="text-gray-400 text-xs mb-2">Zatím žádné poznámky</p>
                                                    <button onClick={() => setActiveTab('notes')} className="text-carvago-primary text-sm font-bold hover:underline">Přidat poznámku</button>
                                                </div>
                                            )}

                                            {tags.length > 0 && (
                                                <div>
                                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Štítky</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {tags.map((tag, i) => (
                                                            <span key={i} className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium border border-blue-100 flex items-center gap-1">
                                                                <Tag size={10} /> {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'notes' && (
                            <div className="p-8 space-y-8">
                                {/* Notes Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Edit3 size={20} className="text-carvago-primary" /> Osobní poznámky
                                    </h3>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        className="w-full h-40 p-4 border border-gray-300 rounded-xl focus:border-carvago-primary focus:ring-1 focus:ring-carvago-primary transition-colors bg-white shadow-sm resize-none"
                                        placeholder="Zde si napište své postřehy, nápady nebo otázky k tomuto autu..."
                                    />
                                </div>

                                {/* Tags Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Tag size={20} className="text-carvago-primary" /> Štítky
                                    </h3>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            value={newTag}
                                            onChange={(e) => setNewTag(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:border-carvago-primary focus:ring-1 focus:ring-carvago-primary"
                                            placeholder="Přidat štítek (např. #favorit, #tepelko)..."
                                        />
                                        <button
                                            onClick={addTag}
                                            title="Přidat štítek"
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 rounded-xl font-bold transition-colors"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, i) => (
                                            <span key={i} className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-bold border border-blue-100 flex items-center gap-2 animate-in fade-in zoom-in">
                                                {tag}
                                                <button onClick={() => removeTag(tag)} title="Odstranit štítek" className="hover:text-blue-900"><X size={14} /></button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* External Links Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <ExternalLink size={20} className="text-carvago-primary" /> Uložené odkazy
                                    </h3>
                                    <div className="space-y-3 mb-4">
                                        {links.map((link, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <a href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline font-medium truncate">
                                                    <ExternalLink size={14} /> {link.label}
                                                </a>
                                                <button onClick={() => removeLink(link.url)} title="Odstranit odkaz" className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2 flex-col sm:flex-row">
                                        <input
                                            type="text"
                                            value={newLinkLabel}
                                            onChange={(e) => setNewLinkLabel(e.target.value)}
                                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:border-carvago-primary focus:ring-1 focus:ring-carvago-primary text-sm"
                                            placeholder="Popis (např. Videorecenze)"
                                        />
                                        <input
                                            type="text"
                                            value={newLinkUrl}
                                            onChange={(e) => setNewLinkUrl(e.target.value)}
                                            className="flex-[2] p-3 border border-gray-300 rounded-xl focus:border-carvago-primary focus:ring-1 focus:ring-carvago-primary text-sm"
                                            placeholder="URL adresa (https://...)"
                                        />
                                        <button
                                            onClick={addLink}
                                            title="Přidat odkaz"
                                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl font-bold transition-colors"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100">
                                    <button
                                        onClick={handleSave}
                                        className="w-full bg-carvago-primary hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Save size={20} /> Uložit změny
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'analysis' && (
                            <div className="p-8 space-y-8">
                                {/* Verdict Section */}
                                <div className={`rounded-2xl p-6 shadow-sm ${car.audit_verdict?.includes('KOUPIT') ? 'verdict-buy' :
                                    car.audit_verdict?.includes('RUCE') ? 'verdict-avoid' : 'verdict-caution'
                                    }`}>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Zap size={24} className="text-yellow-500 fill-yellow-500" /> Expertní Verdikt
                                    </h3>

                                    <div className="flex flex-col md:flex-row gap-8 items-center">
                                        {/* Score Circle */}
                                        <div className={`relative w-32 h-32 flex-shrink-0 rounded-full ${(car.expert_score || 0) >= 70 ? 'score-pulse-green' : ''}`}>
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/50" />
                                                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent"
                                                    strokeDasharray={351.86}
                                                    strokeDashoffset={351.86 - (351.86 * (car.expert_score || 0)) / 100}
                                                    className={`${(car.expert_score || 0) >= 80 ? 'text-green-500' : (car.expert_score || 0) >= 50 ? 'text-orange-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl font-black text-gray-900">{car.expert_score || 0}</span>
                                                <span className="text-xs text-gray-500 uppercase font-bold">Bodů</span>
                                            </div>
                                        </div>

                                        {/* Verdict Text */}
                                        <div className="flex-1 text-center md:text-left">
                                            <div className={`text-2xl font-black uppercase tracking-tight mb-2 ${(car.audit_verdict?.includes('KOUPIT') ? 'text-green-700' : car.audit_verdict?.includes('RUCE') ? 'text-red-700' : 'text-orange-700')}`}>
                                                {car.audit_verdict || "ČEKÁM NA ANALÝZU..."}
                                            </div>
                                            <p className="text-gray-600">
                                                {car.audit_verdict?.includes('KOUPIT')
                                                    ? "Toto vozidlo vykazuje vynikající parametry a doporučujeme jej k nákupu."
                                                    : "Doporučujeme zvýšenou opatrnost nebo vyjednání lepší ceny."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Arguments / Pros & Cons */}
                                {(car.audit_reasons && car.audit_reasons.length > 0) && (
                                    <div>
                                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <ShieldCheck size={20} className="text-carvago-primary" /> Klíčová zjištění
                                        </h4>
                                        <ul className="space-y-3">
                                            {car.audit_reasons.map((reason, i) => (
                                                <li key={i} className="stagger-item flex gap-3 bg-white/80 backdrop-blur p-3 rounded-lg border border-gray-100 hover-lift">
                                                    <div className="mt-1 flex-shrink-0">
                                                        {reason.includes('VERDIKT') ? <Zap size={16} className="text-yellow-600" /> : <div className="w-1.5 h-1.5 rounded-full bg-carvago-primary mt-2" />}
                                                    </div>
                                                    <span className="text-gray-700">{reason.replace('VERDIKT AI:', '').replace('AI:', '')}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Negotiation Tip */}
                                {car.negotiation_draft && (
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                            <Tag size={18} /> Tip pro vyjednávání
                                        </h4>
                                        <p className="text-blue-800 text-sm italic">
                                            "{car.negotiation_draft.split('Tip pro vyjednávání:')[1] || car.negotiation_draft}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        {activeTab === 'calculator' && (
                            <div className="h-full flex flex-col">
                                <div className="p-6 bg-slate-50 border-b border-gray-100">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Calculator size={24} className="text-carvago-primary" />
                                        Finanční Kalkulace & TCO
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Spočítejte si reálné náklady na vlastnictví a návratnost oproti spalováku.
                                    </p>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                                    <ScrollytellingCalculatorWrapper car={car} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Sticky Financial Panel */}
                <div className="md:w-1/3 bg-white border-l border-gray-100 p-8 flex flex-col h-full shadow-[0_0_40px_rgba(0,0,0,0.05)] z-20">
                    <div className="mb-auto">
                        <p className="text-sm text-gray-500 mb-1" title="Cena zahrnuje dovoz, STK a přihlášení (+15 000 Kč)">
                            Cena s dovozem (vč. poplatků)
                        </p>
                        <div className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                            {formatPrice(car.real_price_czk)}
                        </div>
                        <p className="text-sm text-green-600 font-medium mb-8 flex items-center gap-1">
                            <Check size={14} strokeWidth={3} />
                            Včetně prověrky Carvago
                        </p>

                        <div className="space-y-4 border-t border-b border-gray-100 py-6 mb-6">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Nákupní cena (EUR)</span>
                                <span className="font-mono text-gray-900">{car.price_eur?.toLocaleString()} €</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Marže / Zisk</span>
                                <span className={`font-mono font-bold ${isProfitPositive ? 'text-carvago-primary' : 'text-red-500'}`}>
                                    {isProfitPositive ? '+' : ''}{formatPrice(profit)}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Zap className="text-carvago-primary mt-1" size={20} />
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">Carvago TIP</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Expertní skóre kvality: <span className="font-bold text-gray-900">{car.expert_score}/100</span> bodů.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => car.url && window.open(car.url, '_blank')}
                        className="w-full bg-carvago-primary hover:bg-orange-600 text-white font-bold py-4 rounded-lg shadow-lg shadow-orange-500/20 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-lg flex items-center justify-center gap-2"
                        disabled={!car.url}
                        title={car.url ? "Otevřít inzerát v novém okně" : "URL není k dispozici"}
                    >
                        {car.url ? 'Zobrazit původní inzerát' : 'Inzerát nedostupný'} <ExternalLink size={20} />
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 font-bold py-3 rounded-lg transition-all text-sm"
                    >
                        Zpět na přehled
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Nezávazná rezervace na 24 hodin
                    </p>
                </div>
            </div>
        </div>
    );
};
