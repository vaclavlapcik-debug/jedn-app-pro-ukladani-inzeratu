import React, { useState } from 'react';
import { X, Youtube, ExternalLink as ExtLinkIcon, Calculator, ShieldCheck, Info, Plus, Trash2, Zap } from 'lucide-react';
import type { CarStaticData } from '../data/cars_static';
import { BazaarLinks } from '../utils/linkGenerators';
import { extractYoutubeId, getYoutubeThumbnail } from '../utils/videoUtils';

interface Props {
    car: CarStaticData;
    onClose: () => void;
    onAnalyze?: (url: string) => void;
}

export const CatalogDetailModal: React.FC<Props> = ({ car, onClose, onAnalyze }) => {
    const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'finance' | 'insurance'>('info');
    const [importUrl, setImportUrl] = useState("");

    // Calculator State
    const [loanAmount, setLoanAmount] = useState(car.priceFrom * 0.8); // Default 80% LTV
    const [years, setYears] = useState(5);

    const calculateMonthly = (rate: number) => {
        const r = rate / 100 / 12;
        const n = years * 12;
        return (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    };

    // Search Form State
    const [searchParams, setSearchParams] = useState<{
        priceFrom?: number;
        priceTo?: number;
        yearFrom?: number;
        mileageTo?: number;
    }>({
        priceFrom: undefined,
        priceTo: undefined,
        yearFrom: undefined,
        mileageTo: undefined
    });

    const [playingVideo, setPlayingVideo] = useState<string | null>(null);

    // User Videos State
    const [userVideos, setUserVideos] = useState<{ url: string, title: string }[]>([]);
    const [newVideoUrl, setNewVideoUrl] = useState('');

    React.useEffect(() => {
        const saved = localStorage.getItem(`custom_videos_${car.id}`);
        if (saved) {
            try {
                setUserVideos(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse user videos', e);
            }
        } else {
            setUserVideos([]);
        }
    }, [car.id]);

    const handleAddVideo = () => {
        if (!newVideoUrl.trim()) return;

        const videoId = extractYoutubeId(newVideoUrl);
        if (!videoId) {
            alert('Prosím zadejte platný odkaz na YouTube video.');
            return;
        }

        // Check for duplicates
        if (userVideos.some(v => v.url === newVideoUrl) || car.youtubeReviews.some(v => v.url === newVideoUrl)) {
            alert('Toto video již bylo přidáno.');
            return;
        }

        const newVideo = { url: newVideoUrl, title: 'Uživatelské video' };
        const updated = [...userVideos, newVideo];
        setUserVideos(updated);
        localStorage.setItem(`custom_videos_${car.id}`, JSON.stringify(updated));
        setNewVideoUrl('');
    };

    const handleRemoveVideo = (urlToRemove: string) => {
        const updated = userVideos.filter(v => v.url !== urlToRemove);
        setUserVideos(updated);
        localStorage.setItem(`custom_videos_${car.id}`, JSON.stringify(updated));
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="bg-gray-900 text-white p-6 relative flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold">{car.make} {car.model}</h2>
                        <p className="text-gray-400">{car.variant} • {car.battery} kWh • {car.rangeWLTP} km WLTP</p>
                    </div>
                    <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors text-white" title="Zavřít" aria-label="Zavřít">
                        <X size={24} />
                    </button>

                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 h-full w-1/3 opacity-20 pointer-events-none">
                        <img src={car.image} className="w-full h-full object-cover mask-image-linear-gradient" alt="" />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 shrink-0 overflow-x-auto">
                    {[
                        { id: 'info', label: 'Přehled', icon: Info },
                        { id: 'reviews', label: 'Videa', icon: Youtube },
                        { id: 'finance', label: 'Financování', icon: Calculator },
                        { id: 'insurance', label: 'Pojištění', icon: ShieldCheck },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === tab.id
                                ? 'border-carvago-primary text-carvago-primary bg-orange-50/50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50">

                    {/* INFO TAB */}
                    {activeTab === 'info' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <img src={car.image} alt={car.model} className="rounded-xl shadow-sm object-cover h-64 w-full" />
                                <div className="space-y-4">

                                    {/* Direct Analysis Input */}
                                    {onAnalyze && (
                                        <div className="bg-white p-4 rounded-xl border border-orange-200 shadow-sm space-y-3 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-100 to-transparent rounded-bl-full -mr-8 -mt-8"></div>
                                            <h3 className="font-bold text-gray-900 flex items-center gap-2 relative z-10">
                                                <Zap className="text-carvago-primary fill-carvago-primary" size={18} />
                                                Máte vybráno? Analyzovat inzerát
                                            </h3>
                                            <div className="flex gap-2 relative z-10">
                                                <input
                                                    type="text"
                                                    placeholder="Vložte URL inzerátu..."
                                                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-carvago-primary/50"
                                                    value={importUrl}
                                                    onChange={(e) => setImportUrl(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && importUrl && onAnalyze) onAnalyze(importUrl);
                                                    }}
                                                />
                                                <button
                                                    onClick={() => importUrl && onAnalyze && onAnalyze(importUrl)}
                                                    disabled={!importUrl}
                                                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Analyzovat
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <h3 className="font-bold text-lg text-gray-900 pt-2">Kde koupit tento vůz?</h3>


                                    {/* Search Configuration Form */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3 mb-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label htmlFor="priceFrom" className="block text-xs font-bold text-gray-500 mb-1">Cena od (Kč)</label>
                                                <input
                                                    id="priceFrom"
                                                    type="number"
                                                    placeholder="Neomezeno"
                                                    value={searchParams.priceFrom || ''}
                                                    onChange={e => setSearchParams({ ...searchParams, priceFrom: e.target.value ? Number(e.target.value) : undefined })}
                                                    className="w-full p-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-carvago-primary/50"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="priceTo" className="block text-xs font-bold text-gray-500 mb-1">Cena do (Kč)</label>
                                                <input
                                                    id="priceTo"
                                                    type="number"
                                                    placeholder="Neomezeno"
                                                    value={searchParams.priceTo || ''}
                                                    onChange={e => setSearchParams({ ...searchParams, priceTo: e.target.value ? Number(e.target.value) : undefined })}
                                                    className="w-full p-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-carvago-primary/50"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="yearFrom" className="block text-xs font-bold text-gray-500 mb-1">Rok výroby od</label>
                                                <input
                                                    id="yearFrom"
                                                    type="number"
                                                    placeholder="Neomezeno"
                                                    value={searchParams.yearFrom || ''}
                                                    onChange={e => setSearchParams({ ...searchParams, yearFrom: e.target.value ? Number(e.target.value) : undefined })}
                                                    className="w-full p-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-carvago-primary/50"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="mileageTo" className="block text-xs font-bold text-gray-500 mb-1">Max nájezd (km)</label>
                                                <input
                                                    id="mileageTo"
                                                    type="number"
                                                    placeholder="Neomezeno"
                                                    value={searchParams.mileageTo || ''}
                                                    onChange={e => setSearchParams({ ...searchParams, mileageTo: e.target.value ? Number(e.target.value) : undefined })}
                                                    className="w-full p-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-carvago-primary/50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {BazaarLinks.map((bazaar) => (
                                            <a
                                                key={bazaar.name}
                                                href={bazaar.generateUrl(car, searchParams)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="stagger-item flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-carvago-primary hover:shadow-md hover-lift transition-all group"
                                            >
                                                <span className="font-bold text-gray-700">{bazaar.name}</span>
                                                <ExtLinkIcon size={16} className="text-gray-400 group-hover:text-carvago-primary transition-colors" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* REVIEWS TAB */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-6">
                            {/* Add Video Form */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex gap-2">
                                <input
                                    type="text"
                                    value={newVideoUrl}
                                    onChange={(e) => setNewVideoUrl(e.target.value)}
                                    placeholder="Vložte odkaz na YouTube video..."
                                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-carvago-primary/50 text-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddVideo()}
                                />
                                <button
                                    onClick={handleAddVideo}
                                    className="bg-carvago-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-colors flex items-center gap-2"
                                >
                                    <Plus size={20} />
                                    Přidat
                                </button>
                            </div>

                            <div className="grid gap-6">
                                {[...car.youtubeReviews, ...userVideos.map(v => ({ ...v, thumbnail: '', channel: 'Uživatel', isUser: true }))].length > 0 ? (
                                    [...car.youtubeReviews, ...userVideos.map(v => ({ ...v, thumbnail: '', channel: 'Uživatel', isUser: true }))].map((review, i) => {
                                        const isSearchLink = review.url.includes('/results?search_query=');
                                        const videoId = !isSearchLink ? extractYoutubeId(review.url) : null;
                                        const isPlaying = playingVideo === (videoId || review.url);
                                        const thumbnailUrl = review.thumbnail || (videoId ? getYoutubeThumbnail(videoId) : car.image);
                                        const isUserVideo = (review as any).isUser;

                                        return (
                                            <div key={i} className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm relative group/card">
                                                {isUserVideo && (
                                                    <button
                                                        onClick={() => handleRemoveVideo(review.url)}
                                                        className="absolute top-2 right-2 z-10 p-2 bg-white/90 text-gray-400 hover:text-red-500 rounded-full shadow-sm opacity-0 group-hover/card:opacity-100 transition-opacity"
                                                        title="Odstranit video"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}

                                                <div
                                                    className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden group cursor-pointer"
                                                    onClick={() => {
                                                        if (isSearchLink) {
                                                            window.open(review.url, '_blank');
                                                        } else if (videoId) {
                                                            setPlayingVideo(videoId);
                                                        }
                                                    }}
                                                >
                                                    {isPlaying && videoId ? (
                                                        <iframe
                                                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                                                            title={review.title}
                                                            className="absolute inset-0 w-full h-full"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        />
                                                    ) : (
                                                        <>
                                                            <img
                                                                src={thumbnailUrl}
                                                                alt={review.title}
                                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).src = car.image;
                                                                }}
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                                                                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                                    {isSearchLink ? (
                                                                        <ExtLinkIcon className="text-gray-900 ml-1" size={32} />
                                                                    ) : (
                                                                        <Youtube className="text-red-600 fill-current ml-1" size={32} />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                                                            <a href={review.url} target="_blank" rel="noreferrer">
                                                                {review.title}
                                                            </a>
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mt-1">{review.channel} {isUserVideo && '(Moje)'}</p>
                                                    </div>
                                                    <a href={review.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-red-600 p-2" title="Otevřít na YouTube">
                                                        <ExtLinkIcon size={20} />
                                                    </a>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500 mb-4">Pro tento model zatím nemáme vložená videa a recenze.</p>
                                        <a
                                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${car.make} ${car.model} review cz`)}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors"
                                        >
                                            <Youtube size={20} />
                                            Hledat na YouTube
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* FINANCE TAB */}
                    {activeTab === 'finance' && (
                        <div className="space-y-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Calculator className="text-carvago-primary" /> Kalkulačka splátek
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label htmlFor="loanAmount" className="block text-sm font-bold text-gray-700 mb-2">Výše úvěru (Kč)</label>
                                        <input
                                            id="loanAmount"
                                            type="number"
                                            value={loanAmount}
                                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-carvago-primary/20 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="years" className="block text-sm font-bold text-gray-700 mb-2">Doba splácení (roky): {years}</label>
                                        <input
                                            id="years"
                                            type="range"
                                            min="1"
                                            max="8"
                                            value={years}
                                            onChange={(e) => setYears(Number(e.target.value))}
                                            className="w-full accent-carvago-primary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {car.financing.map((bank, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div>
                                                <div className="font-bold text-gray-900">{bank.name}</div>
                                                <div className="text-sm text-gray-500">Úrok od <span className="font-bold text-green-600">{bank.rate}%</span> p.a.</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-xl text-gray-900">{Math.round(calculateMonthly(bank.rate)).toLocaleString()} Kč</div>
                                                <div className="text-xs text-gray-400">měsíčně</div>
                                            </div>
                                            <a href={bank.link} target="_blank" rel="noreferrer" className="ml-4 px-4 py-2 bg-white border border-gray-300 hover:border-carvago-primary text-gray-700 rounded-lg text-sm font-bold transition-all">
                                                Sjednat
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INSURANCE TAB */}
                    {activeTab === 'insurance' && (
                        <div className="grid gap-4">
                            {car.insurance.map((ins, i) => (
                                <div key={i} className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{ins.provider}</h4>
                                            <p className="text-sm text-gray-500">{ins.description}</p>
                                        </div>
                                    </div>
                                    <a href={ins.link} target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all">
                                        Spočítat cenu
                                    </a>
                                </div>
                            ))}
                            <div className="text-center text-gray-400 text-sm mt-4">
                                Zobrazujeme pouze ověřené partnery s nejlepším plněním pro elektromobily.
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};
