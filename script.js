// Meme Generator Application

// Global variables
let canvas = null;
let ctx = null;
let currentImage = null;
let imageLoaded = false;
let textTop = { text: '', x: 0, y: 50, fontSize: 48, color: '#FFFFFF' };
let textBottom = { text: '', x: 0, y: 0, fontSize: 48, color: '#FFFFFF' };
let isDragging = false;
let dragTarget = null;

// Template images from assets folder
const templateImages = [
    'assets/IMG_20160228_170945.jpg',
    'assets/IMG_20160228_171002.jpg',
    'assets/IMG_20160228_171011.jpg'
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    canvas = document.getElementById('meme-canvas');
    ctx = canvas.getContext('2d');
    
    // Set initial canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // Load templates
    loadTemplates();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize text overlays
    initializeTextOverlays();
});

// Load template images into gallery
function loadTemplates() {
    const templateGrid = document.getElementById('template-grid');
    if (!templateGrid) return;
    
    templateImages.forEach((imagePath, index) => {
        const templateItem = document.createElement('div');
        templateItem.className = 'template-item';
        templateItem.dataset.imagePath = imagePath;
        
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = `Template ${index + 1}`;
        img.loading = 'lazy';
        
        img.onerror = () => {
            templateItem.style.display = 'none';
        };
        
        templateItem.appendChild(img);
        templateItem.addEventListener('click', () => {
            loadImage(imagePath);
            // Update active state
            document.querySelectorAll('.template-item').forEach(item => {
                item.classList.remove('active');
            });
            templateItem.classList.add('active');
        });
        
        templateGrid.appendChild(templateItem);
    });
}

// Initialize all event listeners
function initializeEventListeners() {
    // File input
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', (e) => {
        handleFileSelect(e);
        // Remove active state from templates when uploading
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
        });
    });
    
    // URL input
    const urlInput = document.getElementById('url-input');
    const loadUrlBtn = document.getElementById('load-url-btn');
    loadUrlBtn.addEventListener('click', handleUrlLoad);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUrlLoad();
        }
    });
    
    // Text inputs
    const textInputTop = document.getElementById('text-input-top');
    const textInputBottom = document.getElementById('text-input-bottom');
    textInputTop.addEventListener('input', (e) => {
        textTop.text = e.target.value;
        updateTextDisplay('top');
        drawMeme();
    });
    textInputBottom.addEventListener('input', (e) => {
        textBottom.text = e.target.value;
        updateTextDisplay('bottom');
        drawMeme();
    });
    
    // Font size sliders
    const fontSizeTop = document.getElementById('font-size-top');
    const fontSizeBottom = document.getElementById('font-size-bottom');
    const fontSizeTopValue = document.getElementById('font-size-top-value');
    const fontSizeBottomValue = document.getElementById('font-size-bottom-value');
    
    fontSizeTop.addEventListener('input', (e) => {
        const size = parseInt(e.target.value);
        textTop.fontSize = size;
        fontSizeTopValue.textContent = size + 'px';
        updateTextDisplay('top');
        drawMeme();
    });
    
    fontSizeBottom.addEventListener('input', (e) => {
        const size = parseInt(e.target.value);
        textBottom.fontSize = size;
        fontSizeBottomValue.textContent = size + 'px';
        updateTextDisplay('bottom');
        drawMeme();
    });
    
    // Color pickers
    const textColorTop = document.getElementById('text-color-top');
    const textColorBottom = document.getElementById('text-color-bottom');
    
    if (textColorTop) {
        textColorTop.addEventListener('input', (e) => {
            textTop.color = e.target.value;
            updateTextDisplay('top', true); // Skip color picker update to avoid loop
            drawMeme();
        });
        
        textColorTop.addEventListener('change', (e) => {
            textTop.color = e.target.value;
            updateTextDisplay('top', true);
            drawMeme();
        });
    }
    
    if (textColorBottom) {
        textColorBottom.addEventListener('input', (e) => {
            textBottom.color = e.target.value;
            updateTextDisplay('bottom', true); // Skip color picker update to avoid loop
            drawMeme();
        });
        
        textColorBottom.addEventListener('change', (e) => {
            textBottom.color = e.target.value;
            updateTextDisplay('bottom', true);
            drawMeme();
        });
    }
    
    // Download button
    const downloadBtn = document.getElementById('download-btn');
    downloadBtn.addEventListener('click', downloadMeme);
}

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            loadImage(event.target.result);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a valid image file.');
    }
}

// Handle URL load
function handleUrlLoad() {
    const urlInput = document.getElementById('url-input');
    const url = urlInput.value.trim();
    if (url) {
        loadImage(url);
        // Remove active state from templates when loading URL
        document.querySelectorAll('.template-item').forEach(item => {
            item.classList.remove('active');
        });
    } else {
        alert('Please enter a valid image URL.');
    }
}

// Load image from URL or data URL
function loadImage(src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
        currentImage = img;
        imageLoaded = true;
        
        // Calculate canvas size maintaining aspect ratio (max 800px width)
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Update text positions
        textTop.x = width / 2;
        textTop.y = 50;
        textBottom.x = width / 2;
        textBottom.y = height - 50;
        
        // Update overlay container size
        const overlayContainer = document.getElementById('text-overlay-container');
        overlayContainer.style.width = width + 'px';
        overlayContainer.style.height = height + 'px';
        
        // Update text overlay positions
        updateTextDisplay('top');
        updateTextDisplay('bottom');
        
        // Enable download button
        document.getElementById('download-btn').disabled = false;
        
        // Draw meme
        drawMeme();
    };
    
    img.onerror = () => {
        alert('Failed to load image. Please check the URL or try a different image.');
        imageLoaded = false;
    };
    
    img.src = src;
}

// Draw meme on canvas
function drawMeme() {
    if (!imageLoaded || !currentImage) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw image
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
    
    // Draw top text
    if (textTop.text) {
        drawText(textTop.text, textTop.x, textTop.y, textTop.fontSize, textTop.color);
    }
    
    // Draw bottom text
    if (textBottom.text) {
        drawText(textBottom.text, textBottom.x, textBottom.y, textBottom.fontSize, textBottom.color);
    }
}

// Draw text with customizable color fill and black stroke
function drawText(text, x, y, fontSize, fillColor = '#FFFFFF') {
    if (!text) return; // Don't draw if text is empty
    
    ctx.save();
    
    // Set font
    ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Set fill color first (before stroke)
    ctx.fillStyle = fillColor || '#FFFFFF';
    
    // Draw black stroke (outline) - multiple strokes for thickness
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = fontSize / 10;
    ctx.lineJoin = 'round';
    ctx.miterLimit = 2;
    
    // Draw multiple strokes for thicker border
    for (let i = 0; i < 3; i++) {
        ctx.strokeText(text, x, y);
    }
    
    // Draw fill with selected color
    ctx.fillText(text, x, y);
    
    ctx.restore();
}

// Initialize text overlays for dragging
function initializeTextOverlays() {
    const textTopOverlay = document.getElementById('text-top');
    const textBottomOverlay = document.getElementById('text-bottom');
    
    // Make overlays draggable
    makeDraggable(textTopOverlay, 'top');
    makeDraggable(textBottomOverlay, 'bottom');
}

// Make text overlay draggable
function makeDraggable(element, position) {
    const input = element.querySelector('input');
    
    element.addEventListener('mousedown', (e) => {
        if (e.target === input) return; // Don't drag when clicking input
        
        isDragging = true;
        dragTarget = position;
        
        // No need for drag offset since we're using center positioning
        
        element.style.cursor = 'grabbing';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDragging || dragTarget !== position) return;
        
        const containerRect = document.getElementById('text-overlay-container').getBoundingClientRect();
        const x = e.clientX - containerRect.left;
        const y = e.clientY - containerRect.top;
        
        // Update position
        if (position === 'top') {
            textTop.x = Math.max(0, Math.min(canvas.width, x));
            textTop.y = Math.max(0, Math.min(canvas.height, y));
        } else {
            textBottom.x = Math.max(0, Math.min(canvas.width, x));
            textBottom.y = Math.max(0, Math.min(canvas.height, y));
        }
        
        updateTextDisplay(position);
        drawMeme();
    });
    
    document.addEventListener('mouseup', () => {
        if (dragTarget === position) {
            isDragging = false;
            dragTarget = null;
            element.style.cursor = 'grab';
        }
    });
}

// Update text display overlay
function updateTextDisplay(position, skipColorPicker = false) {
    const overlay = document.getElementById(`text-${position}`);
    const textData = position === 'top' ? textTop : textBottom;
    const input = overlay ? overlay.querySelector('input') : null;
    
    if (overlay && imageLoaded) {
        // Use transform for better positioning
        overlay.style.transform = `translate(${textData.x}px, ${textData.y}px) translate(-50%, -50%)`;
        overlay.style.fontSize = textData.fontSize + 'px';
        
        // Update input color
        if (input) {
            input.style.color = textData.color;
        }
    }
    
    // Update color picker value (skip if called from color picker event)
    if (!skipColorPicker) {
        const colorPicker = document.getElementById(`text-color-${position}`);
        if (colorPicker && colorPicker.value !== textData.color) {
            colorPicker.value = textData.color;
        }
    }
}

// Download meme
function downloadMeme() {
    if (!imageLoaded) {
        alert('Please load an image first.');
        return;
    }
    
    // Create download link
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meme-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 'image/png');
}
