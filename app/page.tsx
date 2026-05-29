'use client'
import { useState } from 'react'

export default function Home() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setResult(null)
    }
  }

  const analyze = async () => {
    if (!image) return
    setLoading(true)
    const formData = new FormData()
    formData.append('image', image)
    const res = await fetch('/api/analyze', { method: 'POST', body: formData })
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const nutrients = result ? [
    { label: 'Calories', value: result.calories, unit: 'kcal', color: '#FF6B6B' },
    { label: 'Total Fat', value: result.total_fat, unit: '', color: '#FFB347' },
    { label: 'Carbohydrates', value: result.carbohydrates, unit: '', color: '#4FC3F7' },
    { label: 'Protein', value: result.protein, unit: '', color: '#81C784' },
    { label: 'Sugars', value: result.sugars, unit: '', color: '#CE93D8' },
  ] : []

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Nutrition Label Scanner</h1>
          <p className="text-gray-500 text-sm mt-1">EyePop.ai</p>
        </div>

        {/* Input Row */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-3">Upload a Nutrition Label</p>
          <div className="flex gap-3">
            <label className="flex-1 cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-2 text-center text-sm text-gray-500 hover:border-blue-400 transition">
                {image ? image.name : 'Choose Image'}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            <button
              onClick={analyze}
              disabled={!image || loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </div>

        {/* Main Content - Image + Nutrition Side by Side */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          
          {/* Image Panel */}
          <div className="bg-white rounded-xl shadow p-4 flex items-center justify-center min-h-80">
            {preview ? (
              <img src={preview} alt="Label" className="w-full h-full object-contain rounded" />
            ) : (
              <div className="text-gray-300 text-center">
                <div className="text-5xl mb-2">🖼</div>
                <p className="text-sm">Image preview</p>
              </div>
            )}
          </div>

          {/* Nutrition Info Panel */}
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              Nutrition Info
            </h2>
            <div className="flex flex-col gap-2">
              {result ? nutrients.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg px-4 py-3"
                  style={{ backgroundColor: item.color + '20', borderLeft: `4px solid ${item.color}` }}
                >
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-bold text-gray-900">
                    {item.value ?? '—'} {item.unit}
                  </span>
                </div>
              )) : (
                ['Calories', 'Total Fat', 'Carbohydrates', 'Protein', 'Sugars'].map((label) => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-lg px-4 py-3 bg-gray-50 border-l-4 border-gray-200"
                  >
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-sm text-gray-300">—</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Raw JSON Output */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">Raw JSON Output</p>
          <pre className="text-xs text-gray-600 bg-gray-50 rounded p-3 overflow-auto min-h-16">
            {result ? JSON.stringify(result, null, 2) : '// Results will appear here'}
          </pre>
        </div>

      </div>
    </main>
  )
}