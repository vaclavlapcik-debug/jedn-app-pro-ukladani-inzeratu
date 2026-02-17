import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, deleteDoc, doc, writeBatch, updateDoc } from 'firebase/firestore';
import type { Car } from './types';
import type { CarStaticData } from './data/cars_static';
import { CARS_DATA } from './data/cars_static';
import { CarCard } from './components/CarCard';
import { BrandGrid } from './components/BrandGrid';
import { CatalogDetailModal } from './components/CatalogDetailModal';
import { CarDetailModal } from './components/CarDetailModal';
import { LayoutGrid, Plus, Loader2, Zap, Trash2, Search, List, ArrowUpRight, Check, X, BookOpen, Warehouse } from 'lucide-react';
import firebaseConfig from './firebase-config';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [selectedCatalogCar, setSelectedCatalogCar] = useState<CarStaticData | null>(null);
  const [mainTab, setMainTab] = useState<'catalog' | 'garage'>('catalog'); // Main Tab Switcher

  // Garage View State
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterText, setFilterText] = useState("");
  const [sortOption, setSortOption] = useState<'date_desc' | 'price_asc' | 'price_desc' | 'mileage_asc' | 'score_desc'>('date_desc');

  // Analysis State (Garage)
  const [inputMode, setInputMode] = useState<'url' | 'text'>('url');
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      // Try to sort by timestamp desc
      let q;
      try {
        q = query(collection(db, "car_analysis_results"), orderBy("timestamp", "desc"));
      } catch (indexError) {
        console.warn("Timestamp index not found, fetching without ordering:", indexError);
        q = query(collection(db, "car_analysis_results"));
      }

      const querySnapshot = await getDocs(q);
      const carsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Map Firestore 'import_price_czk' to App 'price_czk' if missing
          price_czk: data.price_czk || data.import_price_czk || 0,
          // Ensure real_price_czk is available for CarCard
          real_price_czk: data.real_price_czk || (data.import_price_czk + (data.additional_costs || 0)) || 0,
          // Ensure timestamp is valid object (Firestore Timestamp)
          timestamp: data.timestamp
        };
      }) as Car[];
      setCars(carsData);
    } catch (error) {
      console.error("Error fetching cars:", error);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCar = async (id: string) => {
    if (!confirm('Opravdu chcete smazat tento inzerát?')) return;

    try {
      await deleteDoc(doc(db, "car_analysis_results", id));
      setNotification({ type: 'success', message: 'Inzerát byl smazán.' });
      fetchCars();
      setTimeout(() => setNotification(null), 3000);
      if (selectedCar?.id === id) setSelectedCar(null);
    } catch (e) {
      console.error(e);
      setNotification({ type: 'error', message: 'Chyba při mazání.' });
    }
  };

  const handleClearGarage = async () => {
    if (!confirm('POZOR: Opravdu chcete smazat VŠECHNY inzeráty v garáži? Tato akce je nevratná!')) return;

    setLoading(true);
    try {
      const q = query(collection(db, "car_analysis_results"));
      const snapshot = await getDocs(q);

      const batch = writeBatch(db);
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setNotification({ type: 'success', message: 'Celá garáž byla vyprázdněna.' });
      fetchCars();
      setTimeout(() => setNotification(null), 5000);
    } catch (e) {
      console.error(e);
      setNotification({ type: 'error', message: 'Chyba při hromadném mazání.' });
      setLoading(false);
    }
  };

  const handleAnalyze = async (overrideUrl?: string) => {
    setAnalyzing(true);
    try {
      let endpoint = 'http://localhost:8001/analyze-url';
      let body: any = {};

      const finalUrl = overrideUrl || urlInput;

      if (inputMode === 'url' || overrideUrl) {
        if (!finalUrl) return;
        body = { url: finalUrl, api_key: apiKey || null };
      } else {
        if (!textInput) return;
        endpoint = 'http://localhost:8001/analyze-text';
        body = { text: textInput, api_key: apiKey || null };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const result = await response.json();
      console.log("Analyze result:", result, response.status);

      if (response.ok) {
        setNotification({ type: 'success', message: `Úspěch! Model: ${result.model}, Zisk: ${result.profit} Kč` });
        setUrlInput("");
        setTextInput("");
        // Wait a bit for Firestore to propagate
        setTimeout(() => {
          fetchCars();
        }, 2000);
        setTimeout(() => setNotification(null), 5000);
      } else {
        const errorMessage = typeof result.detail === 'object'
          ? JSON.stringify(result.detail)
          : result.detail;
        console.error("Analyze error:", errorMessage);
        setNotification({ type: 'error', message: `Chyba: ${errorMessage}` });
        setTimeout(() => setNotification(null), 5000);
      }
    } catch (e) {
      setNotification({ type: 'error', message: "Nepodařilo se spojit se serverem. Běží 'python api.py'?" });
      setTimeout(() => setNotification(null), 5000);
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    fetchCars();

    // Check for ?import=URL
    const params = new URLSearchParams(window.location.search);
    const importUrl = params.get('import');
    if (importUrl) {
      setMainTab('garage');
      setInputMode('url');
      setUrlInput(importUrl);

      // Remove param from URL without reload
      window.history.replaceState({}, '', window.location.pathname);

      // Auto-trigger analysis
      setTimeout(() => {
        handleAnalyze(importUrl);
      }, 500);
    }
  }, []);
  // Update car data (Phase 2)
  const handleUpdateCar = async (carId: string, data: Partial<Car>) => {
    try {
      const carRef = doc(db, "car_analysis_results", carId);
      await updateDoc(carRef, data);

      // Update local state
      setCars(prev => prev.map(c => c.id === carId ? { ...c, ...data } : c));

      // Update selected car if it's the one being modified
      if (selectedCar && selectedCar.id === carId) {
        setSelectedCar(prev => prev ? { ...prev, ...data } : null);
      }

      // Show success notification
      setNotification({ type: 'success', message: 'Změny byly uloženy.' });
      setTimeout(() => setNotification(null), 3000);

    } catch (error) {
      console.error("Error updating car:", error);
      setNotification({ type: 'error', message: 'Chyba při ukládání změn.' });
    }
  };

  const uniqueCars = [...cars]
    .sort((a, b) => {
      const timeA = a.timestamp?.seconds || 0;
      const timeB = b.timestamp?.seconds || 0;
      return timeB - timeA;
    })
    .reduce((acc: any[], current) => {
      // Normalize URL: strip query params for matching
      const normalizeUrl = (u: string | null | undefined) => {
        if (!u) return '';
        try { return u.split('?')[0].toLowerCase(); } catch { return ''; }
      };

      const currentUrl = normalizeUrl(current.link) || normalizeUrl(current.url);

      // Try URL-based dedup first (if URL exists)
      if (currentUrl) {
        const duplicate = acc.find(item => {
          const itemUrl = normalizeUrl(item.link) || normalizeUrl(item.url);
          return itemUrl === currentUrl;
        });
        if (duplicate) return acc;
      }

      // Fallback: dedup by price_eur + mileage (same ad = same price + same km)
      const duplicate = acc.find(item =>
        item.price_eur === current.price_eur &&
        item.mileage === current.mileage &&
        item.price_eur > 0
      );
      if (duplicate) return acc;

      return acc.concat([current]);
    }, []);

  // Filter & Sort Logic
  const processedCars = uniqueCars
    .filter(car => {
      if (!filterText) return true;
      const searchLower = filterText.toLowerCase();
      return (
        car.model?.toLowerCase().includes(searchLower) ||
        car.make?.toLowerCase().includes(searchLower) ||
        car.location?.toLowerCase().includes(searchLower) ||
        car.notes?.toLowerCase().includes(searchLower) ||
        (car.tags && car.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
      );
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'price_asc':
          return (a.price_czk || 0) - (b.price_czk || 0);
        case 'price_desc':
          return (b.price_czk || 0) - (a.price_czk || 0);
        case 'mileage_asc':
          return (a.mileage || 0) - (b.mileage || 0);
        case 'score_desc':
          return (b.expert_score || 0) - (a.expert_score || 0);
        case 'date_desc':
        default:
          return (b.timestamp?.seconds || 0) - (a.timestamp?.seconds || 0);
      }
    });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Navbar */}
      <nav className="sticky-header border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none">EV EXPERT</h1>
              <p className="text-xs text-carvago-primary font-bold tracking-widest uppercase mt-1">Průvodce elektromobilitou</p>
            </div>

            {/* Main Navigation */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setMainTab('catalog')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${mainTab === 'catalog' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <BookOpen size={18} /> Katalog vozů
              </button>
              <button
                onClick={() => setMainTab('garage')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${mainTab === 'garage' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Warehouse size={18} /> Moje Garáž
                {uniqueCars.length > 0 && (
                  <span className="bg-carvago-primary text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center leading-none">
                    {uniqueCars.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            {/* Actions */}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 w-full">

        {notification && (
          <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl text-white font-bold shadow-2xl z-50 animate-fade-in flex items-center gap-3 ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {notification.type === 'success' ? <Check size={20} /> : <X size={20} />}
            {notification.message}
          </div>
        )}

        {/* CATALOG VIEW */}
        {mainTab === 'catalog' && (
          <div className="animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Vyberte si svůj elektromobil</h2>
              <p className="text-lg text-gray-500">
                Klikněte na značku a prohlédněte si dostupné modely. Srovnání cen, reálný dojezd a možnosti financování.
              </p>
            </div>

            <BrandGrid
              cars={CARS_DATA}
              onSelectCar={(c) => setSelectedCatalogCar(c)}
            />
          </div>
        )}

        {/* GARAGE VIEW (Legacy) */}
        {mainTab === 'garage' && (
          <div className="animate-fade-in">

            {/* Analysis Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 mb-10 overflow-hidden">
              <div className="p-6 pb-0">
                <h2 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Plus size={20} className="text-carvago-primary" /> Nová Analýza
                </h2>
                <p className="text-sm text-gray-500 mb-6">Vložte odkaz na inzerát nebo text pro okamžitou analýzu trhu.</p>

                {/* Mode Switcher */}
                <div className="flex gap-6 border-b border-gray-100 mb-6">
                  <button
                    onClick={() => setInputMode('url')}
                    className={`pb-3 text-sm font-bold transition-all border-b-2 ${inputMode === 'url' ? 'border-carvago-primary text-carvago-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                  >
                    Z URL Adresy
                  </button>
                  <button
                    onClick={() => setInputMode('text')}
                    className={`pb-3 text-sm font-bold transition-all border-b-2 ${inputMode === 'text' ? 'border-carvago-primary text-carvago-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                  >
                    Z Textu (Text-to-JSON)
                  </button>
                </div>
              </div>

              <div className="px-6 pb-6 bg-gray-50/50">
                {/* API Key Input */}
                <div className="flex justify-end mb-4 pt-4">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="API Key (volitelné)"
                    className="bg-white border border-gray-200 rounded px-3 py-1 text-xs text-gray-600 w-48 focus:border-gray-400 focus:outline-none placeholder-gray-300"
                  />
                </div>

                <div className="flex flex-col gap-4">
                  {inputMode === 'url' ? (
                    <div className="flex gap-3 relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={18} />
                      </div>
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://mobile.de/..."
                        className="flex-1 bg-white border border-gray-200 rounded-lg pl-12 pr-4 py-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-carvago-primary/20 focus:border-carvago-primary transition-all font-mono text-sm shadow-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !analyzing) handleAnalyze();
                        }}
                      />
                      <button
                        onClick={() => handleAnalyze()}
                        disabled={analyzing || !urlInput}
                        className="bg-carvago-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {analyzing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
                        {analyzing ? 'Analyzuji...' : 'Analyzovat'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Vložte text inzerátu..."
                        className="w-full h-32 bg-white border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-carvago-primary/20 focus:border-carvago-primary transition-all font-mono text-sm resize-none shadow-sm"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleAnalyze()}
                          disabled={analyzing || !textInput}
                          className="bg-carvago-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-orange-600 transition-all shadow-md shadow-orange-500/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {analyzing ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} fill="currentColor" />}
                          Analyzovat
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-gray-900">Uložené inzeráty</h3>
                <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-bold">{processedCars.length}</span>
              </div>

              <div className="flex flex-1 md:justify-end gap-3">
                {/* Search Input */}
                <div className="relative w-full md:w-64">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder="Hledat model, štítek..."
                    className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:border-carvago-primary focus:ring-1 focus:ring-carvago-primary"
                  />
                  {filterText && (
                    <button onClick={() => setFilterText('')} title="Vyčistit filtr" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Sort Select */}
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                  title="Řazení inzerátů"
                  aria-label="Řazení inzerátů"
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-carvago-primary focus:ring-1 focus:ring-carvago-primary cursor-pointer"
                >
                  <option value="date_desc">Nejnovější</option>
                  <option value="price_asc">Nejlevnější</option>
                  <option value="price_desc">Nejdražší</option>
                  <option value="mileage_asc">Nejméně najeto</option>
                  <option value="score_desc">Nejlepší expertní skóre</option>
                </select>

                {cars.length > 0 && (
                  <button
                    onClick={handleClearGarage}
                    className="text-gray-400 hover:text-red-500 px-3 py-2 rounded-md hover:bg-gray-50 transition-all font-medium text-sm flex items-center gap-2"
                  >
                    <Trash2 size={16} /> <span className="hidden md:inline">Smazat vše</span>
                  </button>
                )}
                <div className="bg-white p-1 rounded-lg border border-gray-200 flex items-center shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Mřížka"
                    className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    title="Tabulka"
                    className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {loading && !analyzing ? (
              <div className="text-center py-20">
                <Loader2 size={40} className="animate-spin text-gray-300 mx-auto" />
                <p className="text-gray-400 mt-4 font-medium">Načítám vaši garáž...</p>
              </div>
            ) : cars.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Garáž je prázdná</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  Přidejte první inzerát pomocí formuláře nahoře a začněte porovnávat.
                </p>
              </div>
            ) : (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {uniqueCars.map((car) => (
                    <CarCard
                      key={car.id}
                      data={car}
                      onDelete={handleDeleteCar}
                      onClick={(selected) => setSelectedCar(selected)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 font-bold text-gray-900">Vůz</th>
                        <th className="px-6 py-4 font-bold text-gray-900">Cena</th>
                        <th className="px-6 py-4 font-bold text-gray-900">Nájezd & Rok</th>
                        <th className="px-6 py-4 font-bold text-gray-900">Zisk</th>
                        <th className="px-6 py-4 font-bold text-gray-900">Expert Score</th>
                        <th className="px-6 py-4 font-bold text-gray-900 text-right">Akce</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {uniqueCars.map((car) => (
                        <tr
                          key={car.id}
                          onClick={() => setSelectedCar(car)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900 group-hover:text-carvago-primary transition-colors">{car.model}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[200px]">{car.link}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-mono">
                            {car.price_czk ? car.price_czk.toLocaleString('cs-CZ') + ' Kč' : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-900">{car.mileage?.toLocaleString('cs-CZ')} km</div>
                            <div className="text-xs text-gray-500">{car.year}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-bold ${car.arbitrage_profit > 0 ? 'text-green-600' : 'text-red-500'}`}>
                              {car.arbitrage_profit ? car.arbitrage_profit.toLocaleString('cs-CZ') + ' Kč' : '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-carvago-primary"
                                  style={{ width: `${Math.min(car.expert_score || 0, 100)}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold">{car.expert_score || 0}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(car.link, '_blank');
                              }}
                              className="text-gray-400 hover:text-carvago-primary p-2"
                              title="Otevřít původní inzerát"
                            >
                              <ArrowUpRight size={18} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCar(car.id);
                              }}
                              className="text-gray-400 hover:text-red-500 p-2"
                              title="Smazat"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>
        )}

      </main>

      {/* Detail Modals */}
      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onUpdate={handleUpdateCar}
        />
      )}

      {selectedCatalogCar && (
        <CatalogDetailModal
          car={selectedCatalogCar}
          onClose={() => setSelectedCatalogCar(null)}
          onAnalyze={(url) => {
            setSelectedCatalogCar(null);
            setMainTab('garage');
            setInputMode('url');
            setUrlInput(url);
            handleAnalyze(url);
          }}
        />
      )}

      <div className="fixed bottom-4 right-4 z-40 rounded-md bg-gray-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
        JEDN APP DEV
      </div>

    </div>
  );
}

export default App;
