import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { RecoveryReport, ReportStatus } from '../types';
import { ImageUploader } from '../components/ImageUploader';
import { Wrench, CheckCircle2, ShieldCheck, Camera, Send, Home, Zap, Droplets } from 'lucide-react';

interface PostDisasterRecoveryViewProps {
  setCurrentTab: (tab: string) => void;
}

export const PostDisasterRecoveryView: React.FC<PostDisasterRecoveryViewProps> = () => {
  const { recoveryReports, addRecoveryReport, currentUser } = useApp();

  const [category, setCategory] = useState<
    'House Damage' | 'Road Damage' | 'Electricity Issue' | 'Water Issue' | 'Infrastructure'
  >('House Damage');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address || !description) return;

    addRecoveryReport({
      citizenName: currentUser.name || 'Citizen',
      category,
      address,
      description,
      photoUrl: photoUrl || undefined,
    });

    setSubmitted(true);
    setAddress('');
    setDescription('');
    setPhotoUrl('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div>
        <span className="text-xs font-bold text-teal-700 uppercase tracking-widest bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
          RECONSTRUCTION & RECOVERY
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1 font-['Outfit']">
          Post-Disaster Recovery & Damage Assessment
        </h1>
        <p className="text-xs text-slate-500">
          Report structural house damage, power grid failure, water pipe leaks, or broken roads for recovery assistance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form */}
        <div className="lg:col-span-5">
          <div className="card-3d bg-white rounded-3xl border border-slate-200 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-slate-900 text-teal-400 rounded-xl">
                <Wrench className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Report Damage Item</h3>
            </div>

            {submitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Damage report logged into recovery database.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Damage Category
                </label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 font-bold bg-slate-50 focus:outline-none"
                >
                  <option value="House Damage">🏠 House Damage</option>
                  <option value="Road Damage">🛣️ Road Damage</option>
                  <option value="Electricity Issue">⚡ Electricity Outage</option>
                  <option value="Water Issue">💧 Water Supply Disruption</option>
                  <option value="Infrastructure">🏗️ Public Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Exact Location / Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Survey 44, Karve Nagar, Block C"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-800 block mb-1">
                  Description of Structural Damage
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Roof tin collapsed under tree fall, wiring damaged..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <ImageUploader
                value={photoUrl}
                onChange={setPhotoUrl}
                label="Damage Photo Evidence"
              />

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-teal-300 font-extrabold text-xs rounded-2xl shadow-md btn-3d flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" /> SUBMIT DAMAGE REPORT
              </button>
            </form>
          </div>
        </div>

        {/* Right List with Workflow Timeline */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-extrabold text-slate-900 text-lg font-['Outfit']">
            Recovery Reports Directory
          </h3>

          <div className="space-y-4">
            {recoveryReports.map((rec) => (
              <div
                key={rec.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                      {rec.category.toUpperCase()}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base mt-1">
                      {rec.citizenName} — {rec.address}
                    </h4>
                  </div>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                      rec.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {rec.status}
                  </span>
                </div>

                <p className="text-xs text-slate-600">{rec.description}</p>

                {rec.photoUrl && (
                  <div className="rounded-2xl overflow-hidden max-h-48 border border-slate-200">
                    <img src={rec.photoUrl} alt="Damage Evidence" className="w-full h-40 object-cover" />
                  </div>
                )}

                {/* Workflow Stepper Visualization */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">
                    RECOVERY STAGE WORKFLOW:
                  </div>
                  <div className="flex items-center justify-between text-xs font-bold pt-1">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        rec.status === 'PENDING' ? 'bg-amber-500 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      REPORTED
                    </span>
                    <span>→</span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        rec.status === 'VERIFIED' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      VERIFIED
                    </span>
                    <span>→</span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        rec.status === 'ASSIGNED' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      ASSIGNED
                    </span>
                    <span>→</span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        rec.status === 'IN_PROGRESS' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      IN_PROGRESS
                    </span>
                    <span>→</span>
                    <span
                      className={`px-2 py-0.5 rounded ${
                        rec.status === 'RESOLVED' ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      RESOLVED
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
