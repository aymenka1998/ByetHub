'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatCurrency, convertCurrency, getCurrencyByCountry, getLocaleByCountry, type CurrencyCode } from '@/lib/currency';
import { useCountry } from '@/context/CountryContext';
import { useTranslations } from 'next-intl';

interface BuildProduct {
  id: number;
  name: string;
  price: number;
  slug: string;
  imageUrl: string;
  categorySlug: string;
}

interface BuildStep {
  id: string;
  label: string;
  icon: string;
  categorySlug: string;
  required: boolean;
  description: string;
}

const BUILD_STEPS: BuildStep[] = [
  { id: 'cpu', label: 'Processeur (CPU)', icon: '⚡', categorySlug: 'processeurs', required: true, description: 'Le cerveau de votre PC' },
  { id: 'gpu', label: 'Carte Graphique (GPU)', icon: '🎮', categorySlug: 'cartes-graphiques', required: true, description: 'Cœur du rendu graphique' },
  { id: 'ram', label: 'Mémoire RAM', icon: '💾', categorySlug: 'ram', required: true, description: 'Vitesse et fluidité' },
  { id: 'storage', label: 'Stockage (SSD/HDD)', icon: '💿', categorySlug: 'stockage', required: true, description: 'Espace et rapidité de démarrage' },
  { id: 'case', label: 'Boîtier', icon: '📦', categorySlug: 'boitiers', required: false, description: 'Style et airflow' },
  { id: 'psu', label: 'Alimentation (PSU)', icon: '🔌', categorySlug: 'alimentations', required: false, description: 'Stabilité et sécurité' },
  { id: 'cooling', label: 'Refroidissement', icon: '❄️', categorySlug: 'refroidissement', required: false, description: 'Températures sous contrôle' },
];

interface PCBuilderProps {
  productsByCategory: Record<string, BuildProduct[]>;
}

export default function PCBuilder({ productsByCategory }: PCBuilderProps) {
  const { addItem } = useCart();
  const { country } = useCountry();
  const currency = getCurrencyByCountry(country) as CurrencyCode;
  const currencyLocale = getLocaleByCountry(country);

  const [activeStep, setActiveStep] = useState<string>('cpu');
  const [selectedComponents, setSelectedComponents] = useState<Record<string, BuildProduct>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);

  const formatPrice = (amount: number) =>
    formatCurrency(convertCurrency(amount, 'DZD', currency), currency, currencyLocale);

  const totalPrice = useMemo(
    () => Object.values(selectedComponents).reduce((sum, p) => sum + p.price, 0),
    [selectedComponents]
  );

  const currentStep = BUILD_STEPS.find(s => s.id === activeStep)!;
  const currentProducts = (productsByCategory[currentStep?.categorySlug] || []).filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = BUILD_STEPS.filter(s => selectedComponents[s.id]).length;
  const requiredCount = BUILD_STEPS.filter(s => s.required).length;
  const requiredCompleted = BUILD_STEPS.filter(s => s.required && selectedComponents[s.id]).length;
  const canCheckout = requiredCompleted >= requiredCount;

  const selectComponent = (product: BuildProduct) => {
    setSelectedComponents(prev =>
      prev[activeStep]?.id === product.id
        ? (() => { const n = { ...prev }; delete n[activeStep]; return n; })()
        : { ...prev, [activeStep]: product }
    );
    const idx = BUILD_STEPS.findIndex(s => s.id === activeStep);
    if (idx < BUILD_STEPS.length - 1) {
      setTimeout(() => setActiveStep(BUILD_STEPS[idx + 1].id), 300);
    }
  };

  const handleAddAllToCart = () => {
    Object.values(selectedComponents).forEach(product => {
      addItem({
        id: product.id,
        quantity: 1,
        name: product.name,
        price: product.price,
        image: product.imageUrl,
      });
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  const resetBuild = () => {
    setSelectedComponents({});
    setActiveStep('cpu');
    setSearchQuery('');
    setAddedToCart(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #060B18 0%, #0a1628 50%, #060B18 100%)' }}>
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#112130_1px,transparent_1px),linear-gradient(to_bottom,#112130_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="relative max-w-[1400px] mx-auto px-6 pt-10 pb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono px-4 py-2 rounded-full mb-4 tracking-widest">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            BYTEHUB PC BUILDER — SYSTÈME ACTIF
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
            Construisez Votre
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> PC Idéal</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Sélectionnez vos composants étape par étape — notre système vérifie la compatibilité en temps réel.
          </p>
          {/* Progress bar */}
          <div className="mt-8 max-w-lg mx-auto">
            <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
              <span>{completedCount} / {BUILD_STEPS.length} composants</span>
              <span className="text-cyan-400">{Math.round((completedCount / BUILD_STEPS.length) * 100)}% complet</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(completedCount / BUILD_STEPS.length) * 100}%`,
                  background: 'linear-gradient(90deg, #06b6d4, #3b82f6)'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

          {/* ── Left: Steps + Summary ── */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            {/* Step selector */}
            <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">Étapes de Construction</h2>
              <div className="flex flex-col gap-2">
                {BUILD_STEPS.map((step, idx) => {
                  const selected = selectedComponents[step.id];
                  const isActive = activeStep === step.id;
                  return (
                    <button
                      key={step.id}
                      onClick={() => { setActiveStep(step.id); setSearchQuery(''); }}
                      className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all group w-full ${
                        isActive
                          ? 'bg-cyan-500/10 border border-cyan-500/30'
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition-all ${
                        selected ? 'bg-cyan-500/20 border border-cyan-500/40' :
                        isActive ? 'bg-white/10 border border-white/20' :
                        'bg-white/5 border border-white/10'
                      }`}>
                        {selected ? '✓' : step.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold truncate ${selected ? 'text-cyan-400' : isActive ? 'text-white' : 'text-gray-400'}`}>
                          {step.label}
                        </div>
                        {selected ? (
                          <div className="text-[10px] text-gray-500 truncate">{selected.name}</div>
                        ) : (
                          <div className="text-[10px] text-gray-600">{step.required ? 'Requis' : 'Optionnel'}</div>
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-gray-600 flex-shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Box */}
            <div className="rounded-2xl p-5 sticky top-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="text-xs font-mono text-gray-500 tracking-widest mb-4 uppercase">Résumé du Build</h2>
              {Object.keys(selectedComponents).length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-4">Aucun composant sélectionné</p>
              ) : (
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
                  {BUILD_STEPS.filter(s => selectedComponents[s.id]).map(step => (
                    <div key={step.id} className="flex justify-between items-center gap-2">
                      <span className="text-xs text-gray-400 truncate">{step.icon} {selectedComponents[step.id].name}</span>
                      <span className="text-xs text-cyan-400 font-mono flex-shrink-0">{formatPrice(selectedComponents[step.id].price)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t border-white/10 pt-4 mb-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-400">Total estimé</span>
                  <span className="text-xl font-black text-white">{formatPrice(totalPrice)}</span>
                </div>
                {totalPrice > 0 && (
                  <div className="text-[10px] text-gray-600 text-right mt-0.5">+ 500 DA livraison</div>
                )}
              </div>

              {canCheckout ? (
                <button
                  onClick={handleAddAllToCart}
                  className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                    addedToCart
                      ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                      : 'text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)]'
                  }`}
                  style={addedToCart ? {} : { background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
                >
                  {addedToCart ? '✓ Ajouté au Panier!' : `🛒 Commander ce Build`}
                </button>
              ) : (
                <div className="w-full py-3 rounded-xl text-center text-xs text-gray-600 border border-white/5">
                  {requiredCompleted}/{requiredCount} composants requis
                </div>
              )}
              {Object.keys(selectedComponents).length > 0 && (
                <button
                  onClick={resetBuild}
                  className="w-full mt-2 py-2 text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                  Réinitialiser le Build
                </button>
              )}
            </div>
          </div>

          {/* ── Right: Product Selection ── */}
          <div className="xl:col-span-9">
            {/* Step header */}
            <div className="rounded-2xl p-6 mb-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl">
                    {currentStep.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{currentStep.label}</h2>
                    <p className="text-sm text-gray-500">{currentStep.description}</p>
                  </div>
                </div>
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 border border-white/10 transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Currently selected for this step */}
              {selectedComponents[activeStep] && (
                <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                  <span className="text-cyan-400 text-xs font-mono">✓ SÉLECTIONNÉ :</span>
                  <span className="text-sm text-white font-medium">{selectedComponents[activeStep].name}</span>
                  <span className="ml-auto text-cyan-400 font-bold text-sm">{formatPrice(selectedComponents[activeStep].price)}</span>
                  <button
                    onClick={() => setSelectedComponents(prev => { const n = { ...prev }; delete n[activeStep]; return n; })}
                    className="text-gray-600 hover:text-red-400 transition-colors text-xs ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Products grid */}
            {currentProducts.length === 0 ? (
              <div className="rounded-2xl p-16 text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-500 font-semibold">Aucun composant trouvé</p>
                <p className="text-gray-700 text-sm mt-1">
                  {searchQuery ? `Aucun résultat pour "${searchQuery}"` : `Pas de produits dans cette catégorie pour le moment.`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProducts.map(product => {
                  const isSelected = selectedComponents[activeStep]?.id === product.id;
                  return (
                    <button
                      key={product.id}
                      onClick={() => selectComponent(product)}
                      className={`group relative rounded-2xl p-0 text-left transition-all duration-300 overflow-hidden w-full ${
                        isSelected
                          ? 'ring-2 ring-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]'
                          : 'hover:ring-1 hover:ring-white/20 hover:-translate-y-1 hover:shadow-xl'
                      }`}
                      style={{ background: isSelected ? 'rgba(6,182,212,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${isSelected ? 'rgba(6,182,212,0.3)' : 'rgba(255,255,255,0.08)'}` }}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          ✓
                        </div>
                      )}

                      {/* Image */}
                      <div className="relative h-40 bg-[#0a1120] overflow-hidden">
                        <Image
                          src={product.imageUrl || '/placeholder.jpg'}
                          alt={product.name}
                          fill
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                          sizes="300px"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#060B18]/60 to-transparent" />
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-white line-clamp-2 mb-2 group-hover:text-cyan-300 transition-colors leading-snug">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className={`text-lg font-black ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                            {formatPrice(product.price)}
                          </span>
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                            isSelected
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : 'bg-white/5 text-gray-500 border border-white/10 group-hover:border-white/20'
                          }`}>
                            {isSelected ? 'Sélectionné' : 'Choisir'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step navigation */}
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={() => {
                  const idx = BUILD_STEPS.findIndex(s => s.id === activeStep);
                  if (idx > 0) setActiveStep(BUILD_STEPS[idx - 1].id);
                }}
                disabled={activeStep === BUILD_STEPS[0].id}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Précédent
              </button>
              <span className="text-xs text-gray-600 font-mono">
                Étape {BUILD_STEPS.findIndex(s => s.id === activeStep) + 1} / {BUILD_STEPS.length}
              </span>
              <button
                onClick={() => {
                  const idx = BUILD_STEPS.findIndex(s => s.id === activeStep);
                  if (idx < BUILD_STEPS.length - 1) setActiveStep(BUILD_STEPS[idx + 1].id);
                }}
                disabled={activeStep === BUILD_STEPS[BUILD_STEPS.length - 1].id}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white border border-white/10 hover:border-cyan-500/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Suivant →
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
