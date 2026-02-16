import React from 'react';
import { Zap, Trash2 } from 'lucide-react';
import type { Car } from '../types';

export interface CarProps {
    data: Car;
    onDelete: (id: string) => void;
    onClick: (car: Car) => void;
}

export const CarCard: React.FC<CarProps> = ({ data, onDelete, onClick }) => {
    // Defaults
    const profit = data.arbitrage_profit || 0;

    // Profit Color Logic (Darker for light mode)
    let profitColor = 'text-gray-400';
    if (profit >= 40000) profitColor = 'text-green-600';
    else if (profit > 0) profitColor = 'text-carvago-primary';
    else profitColor = 'text-red-600';

    return (
        <div
            onClick={() => onClick(data)}
            className="bg-white border border-gray-100 rounded-xl p-0 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer relative overflow-hidden"
        >
            {/* Top Image Placeholder */}
            {data.image ? (
                <div className="h-40 bg-gray-200 relative">
                    <img src={data.image} alt={data.model} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold shadow-sm text-gray-700">
                        {data.year}
                    </div>
                </div>
            ) : (
                <div className="h-40 bg-gradient-to-br from-slate-900 to-slate-800 relative p-4 flex flex-col justify-end overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                        <span className="text-9xl">🚗</span>
                    </div>
                    <div className="relative z-10 text-white">
                        <div className="bg-white/10 backdrop-blur w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 border border-white/10">
                            {data.year}
                        </div>
                        <h4 className="font-bold text-lg leading-tight truncate opacity-90">{data.model || 'Neznámý model'}</h4>
                    </div>
                </div>
            )}

            {(data.expert_score || 0) >= 90 && (
                <div className="absolute top-40 -mt-3 left-3 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1 shadow-sm z-20">
                    <Zap size={10} fill="currentColor" /> EXPERT CHOICE
                </div>
            )}

            <div className="p-5">
                {/* Header */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 truncate group-hover:text-carvago-primary transition-colors">
                        {data.model || 'Neznámý model'}
                    </h3>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                        <span>{data.mileage ? data.mileage.toLocaleString() : 0} km</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className={`font-mono font-medium ${(data.soh || 0) < 90 ? 'text-red-500' : 'text-green-600'}`}>
                            SOH {data.soh || '?'}%
                        </span>
                    </p>
                </div>

                {/* Price Block */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mb-4">
                    <p className="text-xs text-gray-500 mb-0.5 uppercase tracking-wide">Cena s dovozem</p>
                    <p className="font-bold text-xl text-gray-900">
                        {data.real_price_czk ? data.real_price_czk.toLocaleString() : 0} Kč
                    </p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200/50">
                        <span className="text-xs text-gray-400">Očekávaný zisk</span>
                        <span className={`text-sm font-mono font-bold ${profitColor}`}>
                            {profit > 0 ? '+' : ''}{profit.toLocaleString()} Kč
                        </span>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-between items-center pt-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            data.id && onDelete(data.id);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                        title="Odstranit"
                    >
                        <Trash2 size={16} />
                    </button>
                    <span className="text-xs text-carvago-primary font-medium group-hover:underline">
                        Zobrazit detail &rarr;
                    </span>
                </div>
            </div>
        </div>
    );
};
