import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, X } from 'lucide-react';

export function ServicesAdmin() {
  const [services, setServices] = useState<any[]>([]);

  const fetchServices = async () => {
    const { data } = await supabase.from('services').select('*').order('order_index', { ascending: true });
    if (data) setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const addService = async () => {
    const newSvc = { 
      number: '00', 
      name: 'New Service', 
      slug: 'new-service',
      description: 'Desc', 
      detailed_content: '',
      features: [],
      process_steps: [],
      order_index: services.length 
    };
    await supabase.from('services').insert([newSvc]);
    fetchServices();
  };

  const updateService = async (id: string, field: string, value: any) => {
    await supabase.from('services').update({ [field]: value }).eq('id', id);
    fetchServices();
  };

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const deleteService = async (id: string) => {
    await supabase.from('services').delete().eq('id', id);
    setConfirmDeleteId(null);
    fetchServices();
  };

  // Helper functions for array fields
  const addFeature = (id: string, features: string[]) => {
    const newFeatures = [...(features || []), "New feature"];
    updateService(id, 'features', newFeatures);
  };

  const removeFeature = (id: string, features: string[], index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    updateService(id, 'features', newFeatures);
  };

  const updateFeature = (id: string, features: string[], index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    updateService(id, 'features', newFeatures);
  };

  const addProcessStep = (id: string, processSteps: any[]) => {
    const newSteps = [...(processSteps || []), { title: "New Step", description: "Step description" }];
    updateService(id, 'process_steps', newSteps);
  };

  const removeProcessStep = (id: string, processSteps: any[], index: number) => {
    const newSteps = processSteps.filter((_, i) => i !== index);
    updateService(id, 'process_steps', newSteps);
  };

  const updateProcessStep = (id: string, processSteps: any[], index: number, field: string, value: string) => {
    const newSteps = [...processSteps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    updateService(id, 'process_steps', newSteps);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Services</h2>
        <button onClick={addService} className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm">Add Service</button>
      </div>
      <div className="space-y-8">
        {services.map(s => (
          <div key={s.id} className="border p-5 rounded-md space-y-4 bg-gray-50">
            <div className="flex justify-between items-start border-b pb-4">
              <div className="flex gap-4 flex-1 mr-4">
                <input className="border p-2 w-16 text-center font-bold" value={s.number} onChange={e => updateService(s.id, 'number', e.target.value)} placeholder="01" />
                <div className="flex-1 space-y-2">
                  <input className="border p-2 w-full font-semibold" value={s.name} onChange={e => updateService(s.id, 'name', e.target.value)} placeholder="Service Name" />
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Slug:</span>
                    <input className="border p-1 flex-1 text-xs" value={s.slug || ''} onChange={e => updateService(s.id, 'slug', e.target.value)} placeholder="service-slug" />
                  </div>
                </div>
              </div>
              {confirmDeleteId === s.id ? (
                <div className="flex items-center gap-1 bg-red-100 p-1.5 rounded border border-red-200">
                  <span className="text-xs text-red-700 font-bold px-1">Delete?</span>
                  <button onClick={() => deleteService(s.id)} className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold">Yes</button>
                  <button onClick={() => setConfirmDeleteId(null)} className="px-2.5 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-xs">No</button>
                </div>
              ) : (
                <button onClick={() => setConfirmDeleteId(s.id)} className="text-red-600 px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm font-medium">Delete</button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Short Description (Homepage)</label>
                <textarea className="border p-2 w-full text-sm" rows={2} value={s.description} onChange={e => updateService(s.id, 'description', e.target.value)} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Detailed Content (Service Page Overview)</label>
                <textarea className="border p-2 w-full text-sm" rows={4} value={s.detailed_content || ''} onChange={e => updateService(s.id, 'detailed_content', e.target.value)} placeholder="Full detailed description of the service..." />
              </div>

              {/* Features List */}
              <div className="border border-gray-200 p-4 rounded bg-white">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Features / What's Included</label>
                  <button onClick={() => addFeature(s.id, s.features)} className="text-xs flex items-center gap-1 text-indigo-600 font-medium">
                    <Plus className="w-3 h-3" /> Add Feature
                  </button>
                </div>
                <div className="space-y-2">
                  {(s.features || []).map((feature: string, idx: number) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input 
                        className="border p-1.5 flex-1 text-sm rounded" 
                        value={feature} 
                        onChange={e => updateFeature(s.id, s.features, idx, e.target.value)} 
                      />
                      <button onClick={() => removeFeature(s.id, s.features, idx)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {(!s.features || s.features.length === 0) && <p className="text-xs text-gray-400 italic">No features added yet.</p>}
                </div>
              </div>

              {/* Process Steps */}
              <div className="border border-gray-200 p-4 rounded bg-white">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-sm font-semibold text-gray-700">Process Steps</label>
                  <button onClick={() => addProcessStep(s.id, s.process_steps)} className="text-xs flex items-center gap-1 text-indigo-600 font-medium">
                    <Plus className="w-3 h-3" /> Add Step
                  </button>
                </div>
                <div className="space-y-3">
                  {(s.process_steps || []).map((step: any, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start border-l-2 border-indigo-200 pl-3">
                      <div className="text-xs font-bold text-gray-400 mt-2">{idx + 1}.</div>
                      <div className="flex-1 space-y-2">
                        <input 
                          className="border p-1.5 w-full text-sm font-medium rounded" 
                          value={step.title} 
                          placeholder="Step Title"
                          onChange={e => updateProcessStep(s.id, s.process_steps, idx, 'title', e.target.value)} 
                        />
                        <textarea 
                          className="border p-1.5 w-full text-xs rounded" 
                          rows={2} 
                          value={step.description} 
                          placeholder="Step Description"
                          onChange={e => updateProcessStep(s.id, s.process_steps, idx, 'description', e.target.value)} 
                        />
                      </div>
                      <button onClick={() => removeProcessStep(s.id, s.process_steps, idx)} className="text-red-400 hover:text-red-600 mt-2"><X className="w-4 h-4" /></button>
                    </div>
                  ))}
                  {(!s.process_steps || s.process_steps.length === 0) && <p className="text-xs text-gray-400 italic">No process steps added yet.</p>}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 text-sm text-gray-500 items-center justify-end pt-2">
               Order: <input type="number" className="border p-1 w-16 text-center" value={s.order_index} onChange={e => updateService(s.id, 'order_index', parseInt(e.target.value))} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
