'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { db, id } from '@/lib/instantdb'
import { Navbar } from '@/components/Navbar'

const templateImages = [
  '/assets/IMG_20160228_170945.jpg',
  '/assets/IMG_20160228_171002.jpg',
  '/assets/IMG_20160228_171011.jpg',
]

interface TextData {
  text: string
  x: number
  y: number
  fontSize: number
  color: string
}

export default function Home() {
  const { user } = db.useAuth()
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentImage, setCurrentImage] = useState<HTMLImageElement | null>(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [textTop, setTextTop] = useState<TextData>({
    text: '',
    x: 0,
    y: 50,
    fontSize: 48,
    color: '#FFFFFF',
  })
  const [textBottom, setTextBottom] = useState<TextData>({
    text: '',
    x: 0,
    y: 0,
    fontSize: 48,
    color: '#FFFFFF',
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragTarget, setDragTarget] = useState<'top' | 'bottom' | null>(null)
  const [activeTemplate, setActiveTemplate] = useState<number | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = 800
    canvas.height = 600
  }, [])

  useEffect(() => {
    if (imageLoaded && currentImage) {
      drawMeme()
    }
  }, [imageLoaded, currentImage, textTop, textBottom])

  const loadImage = (src: string) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      setCurrentImage(img)
      setImageLoaded(true)

      const canvas = canvasRef.current
      if (!canvas) return

      const maxWidth = 800
      const maxHeight = 600
      let width = img.width
      let height = img.height

      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height

      setTextTop((prev) => ({ ...prev, x: width / 2, y: 50 }))
      setTextBottom((prev) => ({ ...prev, x: width / 2, y: height - 50 }))
    }

    img.onerror = () => {
      alert('Failed to load image. Please check the URL or try a different image.')
      setImageLoaded(false)
    }

    img.src = src
  }

  const drawMeme = () => {
    const canvas = canvasRef.current
    if (!canvas || !imageLoaded || !currentImage) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height)

    if (textTop.text) {
      drawText(ctx, textTop.text, textTop.x, textTop.y, textTop.fontSize, textTop.color)
    }

    if (textBottom.text) {
      drawText(ctx, textBottom.text, textBottom.x, textBottom.y, textBottom.fontSize, textBottom.color)
    }
  }

  const drawText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fillColor: string
  ) => {
    if (!text) return

    ctx.save()
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = fillColor || '#FFFFFF'
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = fontSize / 10
    ctx.lineJoin = 'round'
    ctx.miterLimit = 2

    for (let i = 0; i < 3; i++) {
      ctx.strokeText(text, x, y)
    }

    ctx.fillText(text, x, y)
    ctx.restore()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        loadImage(event.target?.result as string)
        setActiveTemplate(null)
      }
      reader.readAsDataURL(file)
    } else {
      alert('Please select a valid image file.')
    }
  }

  const handleUrlLoad = () => {
    if (urlInput.trim()) {
      loadImage(urlInput.trim())
      setActiveTemplate(null)
    } else {
      alert('Please enter a valid image URL.')
    }
  }

  const handleMouseDown = (position: 'top' | 'bottom', e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return
    setIsDragging(true)
    setDragTarget(position)
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragTarget || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const canvas = canvasRef.current
    if (!canvas) return

    const x = e.clientX - containerRect.left
    const y = e.clientY - containerRect.top

    const clampedX = Math.max(0, Math.min(canvas.width, x))
    const clampedY = Math.max(0, Math.min(canvas.height, y))

    if (dragTarget === 'top') {
      setTextTop((prev) => ({ ...prev, x: clampedX, y: clampedY }))
    } else {
      setTextBottom((prev) => ({ ...prev, x: clampedX, y: clampedY }))
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragTarget(null)
  }

  const handlePostToFeed = async () => {
    if (!user) {
      alert('Please log in to post memes to the feed.')
      return
    }

    const canvas = canvasRef.current
    if (!canvas || !imageLoaded) {
      alert('Please create a meme first.')
      return
    }

    setPosting(true)
    try {
      const imageData = canvas.toDataURL('image/png')

      // Check if imageData is too large (Instant DB has limits)
      const sizeInMB = (imageData.length * 3) / 4 / 1024 / 1024
      if (sizeInMB > 5) {
        alert('Image is too large. Please use a smaller image or reduce dimensions.')
        setPosting(false)
        return
      }

      const memeId = id()
      await db.transact(
        db.tx.memes[memeId].update({
          imageData,
          topText: textTop.text,
          bottomText: textBottom.text,
          createdAt: Date.now(),
          userId: user.id,
          upvoteCount: 0,
        })
      )

      alert('Meme posted successfully! Redirecting to feed...')
      
      // Redirect to feed after successful post
      setTimeout(() => {
        router.push('/feed')
      }, 1000)
    } catch (error) {
      console.error('Error posting meme:', error)
      alert('Failed to post meme. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas || !imageLoaded) {
      alert('Please load an image first.')
      return
    }

    canvas.toBlob((blob) => {
      if (!blob) return
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `meme-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  const canvas = canvasRef.current
  const canvasWidth = canvas?.width || 800
  const canvasHeight = canvas?.height || 600

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <header className="text-center text-white mb-8">
          <h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg">🎭 Meme Generator</h1>
          <p className="text-xl opacity-90">Create hilarious memes in seconds!</p>
        </header>

        <main className="bg-white rounded-xl p-8 shadow-2xl">
          {/* Image Selection Section */}
          <section className="mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Select Your Image</h2>

            {/* Template Gallery */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose a Template:</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                {templateImages.map((imagePath, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      loadImage(imagePath)
                      setActiveTemplate(index)
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-4 transition-all ${
                      activeTemplate === index
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-gray-200 hover:border-primary hover:shadow-md'
                    }`}
                  >
                    <img
                      src={imagePath}
                      alt={`Template ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center my-6 text-gray-500 font-semibold">
              <div className="flex-1 border-t-2 border-gray-300"></div>
              <span className="px-4">OR</span>
              <div className="flex-1 border-t-2 border-gray-300"></div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-3">
                <label htmlFor="file-input" className="font-semibold text-gray-800">
                  Upload Image:
                </label>
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label htmlFor="url-input" className="font-semibold text-gray-800">
                  Or Enter Image URL:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    id="url-input"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleUrlLoad()}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <button
                    onClick={handleUrlLoad}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors font-semibold"
                  >
                    Load
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Canvas Container */}
          <section className="flex justify-center py-6 mb-10">
            <div
              ref={containerRef}
              className="relative inline-block border-4 border-gray-300 rounded-xl bg-gray-100 shadow-xl"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas ref={canvasRef} className="block rounded-lg max-w-full h-auto" />
              {imageLoaded && (
                <div
                  className="absolute top-0 left-0 pointer-events-none"
                  style={{ width: canvasWidth, height: canvasHeight }}
                >
                  <div
                    className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
                    style={{
                      transform: `translate(${textTop.x}px, ${textTop.y}px) translate(-50%, -50%)`,
                      fontSize: `${textTop.fontSize}px`,
                    }}
                    onMouseDown={(e) => handleMouseDown('top', e)}
                  >
                    <input
                      type="text"
                      value={textTop.text}
                      onChange={(e) => setTextTop((prev) => ({ ...prev, text: e.target.value }))}
                      placeholder="Top text"
                      maxLength={100}
                      className="bg-transparent border-2 border-primary/50 hover:border-primary rounded-md px-3 py-2 text-center min-w-[200px] font-bold focus:border-primary focus:ring-2 focus:ring-primary/30"
                      style={{
                        color: 'transparent',
                        caretColor: '#6366f1',
                      }}
                    />
                  </div>
                  <div
                    className="absolute pointer-events-auto cursor-grab active:cursor-grabbing"
                    style={{
                      transform: `translate(${textBottom.x}px, ${textBottom.y}px) translate(-50%, -50%)`,
                      fontSize: `${textBottom.fontSize}px`,
                    }}
                    onMouseDown={(e) => handleMouseDown('bottom', e)}
                  >
                    <input
                      type="text"
                      value={textBottom.text}
                      onChange={(e) =>
                        setTextBottom((prev) => ({ ...prev, text: e.target.value }))
                      }
                      placeholder="Bottom text"
                      maxLength={100}
                      className="bg-transparent border-2 border-primary/50 hover:border-primary rounded-md px-3 py-2 text-center min-w-[200px] font-bold focus:border-primary focus:ring-2 focus:ring-primary/30"
                      style={{
                        color: 'transparent',
                        caretColor: '#6366f1',
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Text Controls */}
          <section className="bg-gray-50 rounded-xl p-6 mb-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Text Controls</h2>
            <div className="grid grid-cols-2 gap-8">
              {/* Top Text Controls */}
              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Top Text</h3>
                <div className="flex items-center gap-4 mb-3">
                  <label htmlFor="font-size-top" className="font-semibold text-gray-800 min-w-[100px]">
                    Font Size:
                  </label>
                  <input
                    type="range"
                    id="font-size-top"
                    min="20"
                    max="100"
                    value={textTop.fontSize}
                    onChange={(e) =>
                      setTextTop((prev) => ({ ...prev, fontSize: parseInt(e.target.value) }))
                    }
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="font-semibold text-primary min-w-[50px] text-right">
                    {textTop.fontSize}px
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <label htmlFor="text-color-top" className="font-semibold text-gray-800 min-w-[100px]">
                    Text Color:
                  </label>
                  <input
                    type="color"
                    id="text-color-top"
                    value={textTop.color}
                    onChange={(e) =>
                      setTextTop((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="w-16 h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                <p className="text-sm text-gray-500 italic mt-3">Drag the text above to position it</p>
              </div>

              {/* Bottom Text Controls */}
              <div className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Bottom Text</h3>
                <div className="flex items-center gap-4 mb-3">
                  <label htmlFor="font-size-bottom" className="font-semibold text-gray-800 min-w-[100px]">
                    Font Size:
                  </label>
                  <input
                    type="range"
                    id="font-size-bottom"
                    min="20"
                    max="100"
                    value={textBottom.fontSize}
                    onChange={(e) =>
                      setTextBottom((prev) => ({ ...prev, fontSize: parseInt(e.target.value) }))
                    }
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="font-semibold text-primary min-w-[50px] text-right">
                    {textBottom.fontSize}px
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <label htmlFor="text-color-bottom" className="font-semibold text-gray-800 min-w-[100px]">
                    Text Color:
                  </label>
                  <input
                    type="color"
                    id="text-color-bottom"
                    value={textBottom.color}
                    onChange={(e) =>
                      setTextBottom((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="w-16 h-10 border-2 border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>
                <p className="text-sm text-gray-500 italic mt-3">Drag the text above to position it</p>
              </div>
            </div>
          </section>

          {/* Download & Post Section */}
          <section className="text-center space-y-4">
            <button
              onClick={handleDownload}
              disabled={!imageLoaded}
              className="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-xl font-bold uppercase tracking-wide shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              Download Meme
            </button>
            <div>
              <button
                onClick={handlePostToFeed}
                disabled={!imageLoaded || posting}
                className="px-10 py-4 bg-green-600 text-white rounded-full text-xl font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-lg"
              >
                {posting ? 'Posting...' : 'Post to Feed'}
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

