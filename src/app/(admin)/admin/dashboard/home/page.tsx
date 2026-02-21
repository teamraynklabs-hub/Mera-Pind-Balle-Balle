'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, Save, Plus, Trash2, Upload, Loader } from 'lucide-react';
import Link from 'next/link';

interface Hero {
  title: string;
  subtitle: string;
  image: string;
  primaryCTA: { label: string; link: string };
  secondaryCTA: { label: string; link: string };
}

interface Initiative {
  title: string;
  description: string;
}

interface Product {
  title: string;
  description: string;
  image: string;
}

interface Impact {
  label: string;
  value: string;
}

interface CTA {
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

interface DashboardFormData {
  hero: Hero;
  initiatives: Initiative[];
  popularProducts: Product[];
  impact: Impact[];
  cta: CTA;
  footer: any;
  isActive: boolean;
}

const INITIAL_DATA: DashboardFormData = {
  hero: {
    title: '',
    subtitle: '',
    image: '',
    primaryCTA: { label: '', link: '' },
    secondaryCTA: { label: '', link: '' }
  },
  initiatives: [{ title: '', description: '' }],
  popularProducts: [{ title: '', description: '', image: '' }],
  impact: [{ label: '', value: '' }],
  cta: { title: '', description: '', buttonText: '', link: '' },
  footer: {},
  isActive: true
};

export default function HomepageManagerPage() {
  const [formData, setFormData] = useState<DashboardFormData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoadingData(true);
        const response = await axios.get('/api/dashboard');
        if (response.data.data) {
          setFormData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    path: string
  ) => {
    const { value } = e.target;
    const keys = path.split('.');

    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleArrayChange = (
    value: string,
    arrayPath: string,
    index: number,
    field: string
  ) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split('.');
      let current = newData;

      for (const key of keys) {
        current = current[key];
      }

      current[index][field] = value;
      return newData;
    });
  };

  const addArrayItem = (arrayPath: string, template: object) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split('.');
      let current = newData;

      for (const key of keys) {
        current = current[key];
      }

      current.push(JSON.parse(JSON.stringify(template)));
      return newData;
    });
  };

  const removeArrayItem = (arrayPath: string, index: number) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = arrayPath.split('.');
      let current = newData;

      for (const key of keys) {
        current = current[key];
      }

      current.splice(index, 1);
      return newData;
    });
  };
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    path: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append("file", file);

      const uploadResponse = await axios.post("/api/upload", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = uploadResponse.data.url;

      setFormData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        const keys = path.split(".");
        let current: any = newData;

        for (let i = 0; i < keys.length - 1; i++) {
          const key = keys[i];

          // handle array index properly
          if (!isNaN(Number(key))) {
            current = current[Number(key)];
          } else {
            current = current[key];
          }
        }

        const lastKey = keys[keys.length - 1];
        current[lastKey] = imageUrl;

        return newData;
      });

      setSuccess("Image uploaded successfully");
      setTimeout(() => setSuccess(null), 3000);

    } catch (err) {
      console.error(err);
      setError("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      const response = await axios.post('/api/admin/dashboard', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccess('Homepage updated successfully!');
        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update homepage';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Homepage Manager</h1>
          <p className="text-muted-foreground mt-1">Manage all home page content and data</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white rounded-lg font-medium transition"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="border rounded-lg bg-card">
        <div className="flex border-b">
          {['hero', 'initiatives', 'products', 'impact', 'cta'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors ${activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Hero Section */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.hero.title}
                  onChange={e => handleInputChange(e, 'hero.title')}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hero title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <textarea
                  value={formData.hero.subtitle}
                  onChange={e => handleInputChange(e, 'hero.subtitle')}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter hero subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hero Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.hero.image}
                    onChange={e => handleInputChange(e, 'hero.image')}
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="/hero.png"
                  />
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => handleFileUpload(e, 'hero.image')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <h3 className="font-semibold mb-3">Primary CTA</h3>
                  <input
                    type="text"
                    value={formData.hero.primaryCTA.label}
                    onChange={e => handleInputChange(e, 'hero.primaryCTA.label')}
                    className="w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={formData.hero.primaryCTA.link}
                    onChange={e => handleInputChange(e, 'hero.primaryCTA.link')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Link"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Secondary CTA</h3>
                  <input
                    type="text"
                    value={formData.hero.secondaryCTA.label}
                    onChange={e => handleInputChange(e, 'hero.secondaryCTA.label')}
                    className="w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Label"
                  />
                  <input
                    type="text"
                    value={formData.hero.secondaryCTA.link}
                    onChange={e => handleInputChange(e, 'hero.secondaryCTA.link')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Link"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Initiatives */}
          {activeTab === 'initiatives' && (
            <div className="space-y-4">
              {formData.initiatives.map((initiative, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">Initiative {index + 1}</h3>
                    {formData.initiatives.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('initiatives', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={initiative.title}
                    onChange={e => handleArrayChange(e.target.value, 'initiatives', index, 'title')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Title"
                  />

                  <textarea
                    value={initiative.description}
                    onChange={e => handleArrayChange(e.target.value, 'initiatives', index, 'description')}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayItem('initiatives', { title: '', description: '' })}
                className="w-full py-2 border-2 border-dashed rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Initiative
              </button>
            </div>
          )}

          {/* Products */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {formData.popularProducts.map((product, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <h3 className="font-semibold">Product {index + 1}</h3>
                    {formData.popularProducts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('popularProducts', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    value={product.title}
                    onChange={e => handleArrayChange(e.target.value, 'popularProducts', index, 'title')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Title"
                  />

                  <textarea
                    value={product.description}
                    onChange={e => handleArrayChange(e.target.value, 'popularProducts', index, 'description')}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description"
                  />

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={product.image}
                      onChange={e => handleArrayChange(e.target.value, 'popularProducts', index, 'image')}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Image URL"
                    />
                    <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, `popularProducts.${index}.image`)
                        }
                      />

                    </label>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayItem('popularProducts', { title: '', description: '', image: '' })}
                className="w-full py-2 border-2 border-dashed rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
          )}

          {/* Impact */}
          {activeTab === 'impact' && (
            <div className="space-y-4">
              {formData.impact.map((stat, index) => (
                <div key={index} className="p-4 border rounded-lg grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={stat.label}
                    onChange={e => handleArrayChange(e.target.value, 'impact', index, 'label')}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Label"
                  />

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={stat.value}
                      onChange={e => handleArrayChange(e.target.value, 'impact', index, 'value')}
                      className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Value"
                    />
                    {formData.impact.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('impact', index)}
                        className="px-3 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addArrayItem('impact', { label: '', value: '' })}
                className="w-full py-2 border-2 border-dashed rounded-lg text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Statistic
              </button>
            </div>
          )}

          {/* CTA */}
          {activeTab === 'cta' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.cta.title}
                  onChange={e => handleInputChange(e, 'cta.title')}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.cta.description}
                  onChange={e => handleInputChange(e, 'cta.description')}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button Text</label>
                  <input
                    type="text"
                    value={formData.cta.buttonText}
                    onChange={e => handleInputChange(e, 'cta.buttonText')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Button text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Button Link</label>
                  <input
                    type="text"
                    value={formData.cta.link}
                    onChange={e => handleInputChange(e, 'cta.link')}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Button link"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white rounded-lg font-medium transition"
            >
              {loading ? 'Saving...' : 'Save All Changes'}
            </button>
            <button
              type="button"
              onClick={() => setFormData(INITIAL_DATA)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}