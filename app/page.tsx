'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiGithub, FiLinkedin, FiCopy } from 'react-icons/fi';
import { UserData, Gender } from './types';
import { POPULAR_MUNICIPALITIES } from '@/constants';
import { generateFiscalCode } from './services/generateCF';

export default function Home() {
  const [formData, setFormData] = useState<UserData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    gender: Gender.Male,
    birthPlaceCode: '',
    birthPlaceName: '',
  });

  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showManualCity, setShowManualCity] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const code = generateFiscalCode({
      ...formData,
      birthPlaceCode: formData.birthPlaceCode,
    });
    setGeneratedCode(code);
  };
  const code1 = generateFiscalCode({
    ...formData,
    birthPlaceCode: formData.birthPlaceCode,
  });

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'manual') {
      setShowManualCity(true);
      setFormData((prev) => ({ ...prev, birthPlaceCode: '' }));
    } else {
      setShowManualCity(false);
      setFormData((prev) => ({ ...prev, birthPlaceCode: value }));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-zinc-900 to-zinc-950 font-sans">
      <div className="bg-radial-[at_25%_25%] from-cyan-900/10 to-cyan-950/10 backdrop-filter-md border border-cyan-950/50 rounded-2xl px-6 pt-6 pb-12 shadow-cyan-950/50 shadow-xs relative overflow-hidden h-full">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-2 bg-teal-600 rounded-lg">
            {/* <FingerprintIcon className="w-6 h-6 text-indigo-400" /> */}
          </div>
          <h1 className="text-2xl font-bold text-white">
            Calcolo Codice Fiscale
          </h1>
        </div>

        <div className="h-full flex flex-row gap-16">
          <form
            onSubmit={handleCalculate}
            className="bg-teal-900 border border-teal-600 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col h-full">
            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-stone-300 flex items-center gap-2 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="Mario"
                  className="w-full bg-teal-950 border border-teal-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-50 placeholder-stone-300/75 transition-all"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-300 flex items-center gap-2 mb-1">
                  Cognome
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Rossi"
                  className="w-full bg-teal-950 border border-teal-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-50 placeholder-stone-300/75 transition-all"
                />
              </div>
            </div>

            {/* Date and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <label className="text-sm font-medium text-stone-300 flex items-center gap-2 mb-1">
                  Data di Nascita
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthDate: e.target.value })
                  }
                  className="w-full bg-teal-950 border border-teal-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white transition-all [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-300 flex items-center gap-2 mb-1">
                  Sesso
                </label>
                <div className="flex gap-4">
                  <label
                    className={`cursor-pointer rounded-lg p-3 flex items-center justify-center transition-all ${
                      formData.gender === Gender.Male
                        ? 'bg-teal-600 text-white w-[55%]'
                        : 'bg-teal-950 text-stone-400 w-[45%]'
                    }`}>
                    <input
                      type="radio"
                      name="gender"
                      value={Gender.Male}
                      checked={formData.gender === Gender.Male}
                      onChange={() =>
                        setFormData({ ...formData, gender: Gender.Male })
                      }
                      className="hidden"
                    />
                    <span className="font-semibold">Maschio</span>
                  </label>
                  <label
                    className={`cursor-pointer rounded-lg p-3 flex justify-center transition-all duration-300 ${
                      formData.gender === Gender.Female
                        ? 'bg-teal-600 text-white w-[55%]'
                        : 'bg-teal-950 text-stone-400 w-[45%]'
                    }`}>
                    <input
                      type="radio"
                      name="gender"
                      value={Gender.Female}
                      checked={formData.gender === Gender.Female}
                      onChange={() =>
                        setFormData({ ...formData, gender: Gender.Female })
                      }
                      className="hidden"
                    />
                    <span className="font-semibold">Femmina</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Place of Birth */}
            <div className="pt-4">
              <label className="text-sm font-medium text-stone-300 flex items-center gap-2">
                Comune di Nascita
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="md:col-span-3 pb-8">
                  <select
                    value={showManualCity ? 'manual' : formData.birthPlaceCode}
                    onChange={handleCityChange}
                    className="w-full bg-teal-950 border border-teal-800 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-stone-50 placeholder-stone-300/75 transition-all">
                    <option value="">Seleziona Comune...</option>
                    {POPULAR_MUNICIPALITIES.map((city) => (
                      <option
                        key={city.code}
                        value={city.code}
                        className="bg-teal-950">
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`w-full transition-colors duration-300 font-bold py-4 rounded-xl ${
                code1.length > 0
                  ? 'bg-teal-600 hover:bg-teal-500 cursor-pointer text-white'
                  : 'cursor-not-allowed bg-teal-950/90 text-stone-600'
              }`}>
              Calcola Codice Fiscale
            </button>
          </form>

          {/* Output Section */}
          <div className="flex flex-col">
            <div className="bg-teal-900 border border-teal-600 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">
              <h2 className="text-sm uppercase tracking-wider text-stone-100 font-semibold mb-2">
                Risultato
              </h2>

              <div className="relative">
                <p className="font-mono text-4xl md:text-3xl font-bold tracking-widest text-stone-100 transition-all duration-300">
                  {generatedCode || '----------------'}
                </p>
              </div>

              <div className="mt-8 flex">
                <button
                  onClick={handleCopy}
                  disabled={!generatedCode}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-medium transition-all ${
                    generatedCode
                      ? 'bg-teal-600 hover:bg-teal-500 text-white cursor-pointer'
                      : 'bg-teal-950/90 text-stone-600 cursor-not-allowed'
                  }`}>
                  <FiCopy
                    className={`text-xl ${
                      generatedCode ? 'text-white' : 'text-stone-600'
                    }`}
                  />
                  {copied ? 'Copiato!' : 'Copia Codice'}
                </button>
              </div>
            </div>
            <div className="flex flex-row gap-4 grow flex-1 items-end">
              <Link
                className="bg-teal-900 border border-teal-600 p-3 rounded-full group cursor-pointer"
                href="https://github.com/frxsav"
                title="github"
                target="_blank">
                <FiGithub className="text-4xl text-stone-100 transition-all duration-300 group-hover:scale-110" />
              </Link>
              <Link
                className="bg-teal-900 border border-teal-600 p-3 rounded-full group cursor-pointer"
                href="https://www.linkedin.com/in/formisano-francesco/"
                title="linkedin"
                target="_blank">
                <FiLinkedin className="text-4xl text-stone-100 transition-all duration-300 group-hover:scale-110 z-50" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
