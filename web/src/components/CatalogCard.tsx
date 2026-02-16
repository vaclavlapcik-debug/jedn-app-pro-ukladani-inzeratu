import React from 'react';
import { Battery, Zap, ArrowRight } from 'lucide-react';
import type { CarStaticData } from '../data/cars_static';

export interface CatalogCardProps {
    data: CarStaticData;
    onClick: (car: CarStaticData) => void;
}

export const CatalogCard: React.FC<CatalogCardProps> = ({ data, onClick }) => {
    return (
        <div
            onClick={() => onClick(data)}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
        >
            {/* Image Section */}
            <div className="h-48 bg-gray-100 relative overflow-hidden">
                <img
                    src={data.image}
                    alt={data.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold shadow-sm text-gray-700">
                    od {data.priceFrom.toLocaleString()} Kč
                </div>
            </div>

            <div className="p-5">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-carvago-primary transition-colors">
                        {data.make} {data.model}
                    </h3>
                    <p className="text-sm text-gray-500">{data.variant}</p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                        <Battery size={18} className="text-carvago-primary" />
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Baterie</p>
                            <p className="font-bold text-sm text-gray-900">{data.battery} kWh</p>
                        </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                        <Zap size={18} className="text-blue-500" />
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-bold">Dojezd</p>
                            <p className="font-bold text-sm text-gray-900">{data.rangeWLTP} km</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-carvago-primary font-medium text-sm pt-2 border-t border-gray-100">
                    <span>Prohlédnout model</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </div>
    );
};
