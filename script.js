// 聊天功能
document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chatToggle');
    const chatContainer = document.getElementById('chatContainer');
    const closeChat = document.getElementById('closeChat');
    const messageInput = document.getElementById('messageInput');
    const sendMessage = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');

    // 切换聊天窗口
    chatToggle.addEventListener('click', () => {
        chatContainer.style.display = chatContainer.style.display === 'none' ? 'flex' : 'none';
    });

    closeChat.addEventListener('click', () => {
        chatContainer.style.display = 'none';
    });

    // 发送消息
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 处理发送消息
    function handleSendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            addMessage(message, true);
            messageInput.value = '';
            
            // 模拟AI回复
            setTimeout(() => {
                addMessage('这是一个模拟的AI回复消息。');
            }, 1000);
        }
    }

    sendMessage.addEventListener('click', handleSendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    });

    // 初始化数据可视化
    initDataVisualization();
    initDataCarousel();
});

function initDataVisualization() {
    const dataGrid = document.querySelector('.data-grid');
    
    // 示例数据
    const ecoData = [
        {
            title: '珊瑚覆盖率',
            value: '45%',
            trend: 'decreasing',
            color: 'var(--coral-orange)',
            description: '过去一年的变化趋势'
        },
        {
            title: '水温变化',
            value: '26°C',
            trend: 'stable',
            color: 'var(--deep-blue)',
            description: '当前海水温度'
        },
        {
            title: '生物多样性指数',
            value: '7.8',
            trend: 'increasing',
            color: 'var(--plankton-green)',
            description: '物种丰富度评估'
        }
    ];

    // 创建数据卡片
    ecoData.forEach(data => {
        const card = document.createElement('div');
        card.className = 'data-card';
        card.style.borderColor = data.color;
        
        card.innerHTML = `
            <h3>${data.title}</h3>
            <div class="data-value" style="color: ${data.color}">${data.value}</div>
            <div class="trend ${data.trend}">
                <span class="trend-icon"></span>
                <span class="trend-text">${data.description}</span>
            </div>
        `;
        
        dataGrid.appendChild(card);
    });
}

// 照片轮播功能
const carousel = document.getElementById('carousel');
const carouselImages = [
    {
        src: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=1200&h=800&fit=crop',
        fallback: 'images/coral-1.jpg',
        alt: '珊瑚礁生态系统'
    },
    {
        src: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=1200&h=800&fit=crop',
        fallback: 'images/coral-2.jpg',
        alt: '海洋生物多样性'
    },
    {
        src: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1200&h=800&fit=crop',
        fallback: 'images/coral-3.jpg',
        alt: '珊瑚礁保护'
    }
];

// 在现有代码后添加数据轮播功能
const dataCarouselImages = [
    {
        src: 'images/data/coral-coverage-map.jpg',
        fallback: 'images/data/placeholder-chart.jpg',
        caption: '全球珊瑚礁覆盖率分布图'
    },
    {
        src: 'images/data/temperature-trend.jpg',
        fallback: 'images/data/placeholder-chart.jpg',
        caption: '近十年水温变化趋势分析'
    },
    {
        src: 'images/data/biodiversity-analysis.jpg',
        fallback: 'images/data/placeholder-chart.jpg',
        caption: '珊瑚礁生物多样性指数分析'
    },
    {
        src: 'images/data/coral-health-chart.jpg',
        fallback: 'images/data/placeholder-chart.jpg',
        caption: '珊瑚礁健康状况评估'
    }
];

// 通用轮播类
class Carousel {
    constructor(options) {
        this.container = options.container;
        this.items = options.items;
        this.interval = options.interval || 5000;
        this.indicators = options.indicators;
        this.type = options.type || 'image'; // 'image' 或 'data'
        
        this.currentIndex = 0;
        this.isAnimating = false;
        this.preloadedImages = new Map();
        this.autoplayInterval = null;
        
        this.init();
    }

    async init() {
        await this.preloadImages();
        this.renderSlides();
        this.setupEventListeners();
        this.startAutoplay();
    }

    async preloadImages() {
        for (const item of this.items) {
            if (!this.preloadedImages.has(item.src)) {
                try {
                    const img = new Image();
                    await new Promise((resolve, reject) => {
                        img.onload = () => resolve(img);
                        img.onerror = () => {
                            // 尝试加载备用图片
                            img.src = item.fallback;
                            resolve(img);
                        };
                        img.src = item.src;
                    });
                    this.preloadedImages.set(item.src, img);
                } catch (error) {
                    console.error('图片加载失败:', item.src);
                    // 使用占位图
                    const placeholder = new Image();
                    placeholder.src = this.type === 'data' 
                        ? 'images/data/placeholder-chart.jpg' 
                        : 'images/placeholder-coral.jpg';
                    this.preloadedImages.set(item.src, placeholder);
                }
            }
        }
    }

    renderSlides() {
        this.container.innerHTML = '';
        if (this.indicators) this.indicators.innerHTML = '';

        this.items.forEach((item, index) => {
            const slide = document.createElement('div');
            slide.className = `${this.type}-slide`;
            
            const img = this.preloadedImages.get(item.src).cloneNode(false);
            img.style.opacity = '0';
            img.alt = item.alt || `${this.type === 'data' ? '数据分析图' : '珊瑚礁图片'}${index + 1}`;
            img.setAttribute('loading', 'lazy');

            // 添加加载状态指示器
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-indicator';
            slide.appendChild(loadingIndicator);

            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(() => {
                            img.style.opacity = '1';
                            img.style.transition = 'opacity 0.3s ease';
                            loadingIndicator.style.display = 'none';
                        });
                        observer.unobserve(img);
                    }
                });
            });

            slide.appendChild(img);
            if (this.type === 'data' && item.caption) {
                slide.innerHTML += `<div class="${this.type}-slide-caption">${item.caption}</div>`;
            }
            this.container.appendChild(slide);
            observer.observe(img);

            if (this.indicators) {
                this.createIndicator(index);
            }
        });
    }

    createIndicator(index) {
        const indicator = document.createElement('div');
        indicator.className = `${this.type}-indicator ${index === 0 ? 'active' : ''}`;
        indicator.addEventListener('click', () => {
            if (!this.isAnimating) {
                this.currentIndex = index;
                this.updateCarousel();
            }
        });
        this.indicators.appendChild(indicator);
    }

    updateCarousel() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        requestAnimationFrame(() => {
            this.container.style.transform = `translate3d(-${this.currentIndex * 100}%, 0, 0)`;
            this.container.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            if (this.indicators) {
                const indicators = this.indicators.querySelectorAll(`.${this.type}-indicator`);
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === this.currentIndex);
                });
            }
        });

        setTimeout(() => this.isAnimating = false, 500);
    }

    handleSlideChange(direction) {
        if (this.isAnimating) return;
        
        this.currentIndex = direction === 'next'
            ? (this.currentIndex + 1) % this.items.length
            : (this.currentIndex - 1 + this.items.length) % this.items.length;

        this.updateCarousel();
    }

    setupEventListeners() {
        // 按钮事件
        const nextButton = this.container.parentElement.querySelector(`.${this.type}-carousel-button.next`);
        const prevButton = this.container.parentElement.querySelector(`.${this.type}-carousel-button.prev`);
        
        nextButton?.addEventListener('click', () => this.handleSlideChange('next'));
        prevButton?.addEventListener('click', () => this.handleSlideChange('prev'));

        // 触摸事件
        let touchStartX = 0;
        this.container.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });

        this.container.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                this.handleSlideChange(diff > 0 ? 'next' : 'prev');
            }
        }, { passive: true });

        // 页面可见性
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.stopAutoplay();
            } else {
                this.startAutoplay();
            }
        });
    }

    startAutoplay() {
        this.stopAutoplay();
        this.autoplayInterval = setInterval(() => {
            if (!document.hidden && !this.isAnimating) {
                this.handleSlideChange('next');
            }
        }, this.interval);
    }

    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// 初始化轮播
document.addEventListener('DOMContentLoaded', () => {
    // 初始化图片轮播
    new Carousel({
        container: document.getElementById('carousel'),
        items: carouselImages,
        interval: 5000,
        type: 'image'
    });

    // 初始化数据轮播
    new Carousel({
        container: document.getElementById('dataCarousel'),
        items: dataCarouselImages,
        interval: 6000,
        indicators: document.getElementById('dataCarouselIndicators'),
        type: 'data'
    });

    // 初始化其他功能
    initChatFeature();
    initDataVisualization();
});

// 修改样式
const carouselStyles = `
.carousel-slide {
    position: absolute;
    width: 100%;
    height: 100%;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    will-change: transform;
}

.carousel-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: opacity;
}
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = carouselStyles;
document.head.appendChild(styleSheet);

// 修改数据轮播功能
function initDataCarousel() {
    const carousel = document.getElementById('dataCarousel');
    const indicators = document.getElementById('dataCarouselIndicators');
    let currentDataIndex = 0;
    let isAnimating = false;
    const preloadedImages = new Map();

    // 预加载数据图片
    async function preloadDataImages() {
        for (const item of dataCarouselImages) {
            if (!preloadedImages.has(item.src)) {
                try {
                    const img = new Image();
                    const loadPromise = new Promise((resolve, reject) => {
                        img.onload = () => resolve(img);
                        img.onerror = reject;
                    });
                    img.src = item.src;
                    await loadPromise;
                    preloadedImages.set(item.src, img);
                } catch (error) {
                    console.error('数据图片加载失败:', item.src);
                }
            }
        }
    }

    // 优化的轮播更新函数
    function updateDataCarousel() {
        if (isAnimating) return;
        isAnimating = true;

        requestAnimationFrame(() => {
            carousel.style.transform = `translate3d(-${currentDataIndex * 100}%, 0, 0)`;
            carousel.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // 更新指示器状态
            document.querySelectorAll('.data-indicator').forEach((indicator, index) => {
                indicator.classList.toggle('active', index === currentDataIndex);
            });
        });

        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    // 初始化数据轮播
    async function initializeDataCarousel() {
        try {
            await preloadDataImages();
            carousel.innerHTML = ''; // 清空现有内容
            indicators.innerHTML = ''; // 清空指示器

            dataCarouselImages.forEach((image, index) => {
                // 创建轮播项
                const slide = document.createElement('div');
                slide.className = 'data-slide';
                
                const img = preloadedImages.get(image.src).cloneNode(false);
                img.style.opacity = '0';
                img.alt = `数据分析图${index + 1}`;

                // 使用 IntersectionObserver 懒加载
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            requestAnimationFrame(() => {
                                img.style.opacity = '1';
                                img.style.transition = 'opacity 0.3s ease';
                            });
                            observer.unobserve(img);
                        }
                    });
                });

                slide.appendChild(img);
                slide.innerHTML += `<div class="data-slide-caption">${image.caption}</div>`;
                carousel.appendChild(slide);
                observer.observe(img);

                // 创建指示器
                const indicator = document.createElement('div');
                indicator.className = `data-indicator ${index === 0 ? 'active' : ''}`;
                indicator.addEventListener('click', () => {
                    if (!isAnimating) {
                        currentDataIndex = index;
                        updateDataCarousel();
                    }
                });
                indicators.appendChild(indicator);
            });

            updateDataCarousel();
        } catch (error) {
            console.error('数据轮播初始化失败:', error);
        }
    }

    // 优化的事件处理
    function handleDataSlideChange(direction) {
        if (isAnimating) return;
        
        currentDataIndex = direction === 'next'
            ? (currentDataIndex + 1) % dataCarouselImages.length
            : (currentDataIndex - 1 + dataCarouselImages.length) % dataCarouselImages.length;

        updateDataCarousel();
    }

    // 事件监听
    document.querySelector('.data-carousel-button.next').addEventListener('click', () => {
        handleDataSlideChange('next');
    });

    document.querySelector('.data-carousel-button.prev').addEventListener('click', () => {
        handleDataSlideChange('prev');
    });

    // 优化的自动轮播
    let autoplayInterval;
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (!document.hidden && !isAnimating) {
                handleDataSlideChange('next');
            }
        }, 6000);
    }

    // 页面可见性变化处理
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(autoplayInterval);
        } else {
            startAutoplay();
        }
    });

    // 触摸事件支持
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) { // 最小滑动距离
            handleDataSlideChange(diff > 0 ? 'next' : 'prev');
        }
    }, { passive: true });

    // 初始化
    initializeDataCarousel();
    startAutoplay();
}

// 添加加载状态指示器样式
const additionalStyles = `
.loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: var(--coral-orange);
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

.carousel-slide, .data-slide {
    position: relative;
    background: var(--light-blue);
}

.carousel-slide img, .data-slide img {
    position: relative;
    z-index: 1;
    background: var(--white);
}
`;

// 更新样式
const styleSheet = document.createElement('style');
styleSheet.textContent = carouselStyles + additionalStyles;
document.head.appendChild(styleSheet);

// 导航栏响应式菜单
document.querySelector('.menu-toggle').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
});

// AI聊天助手功能
const chatToggle = document.getElementById('chatToggle');
const chatContainer = document.getElementById('chatContainer');
const closeChat = document.getElementById('closeChat');
const messageInput = document.getElementById('messageInput');
const sendMessage = document.getElementById('sendMessage');
const chatMessages = document.getElementById('chatMessages');

chatToggle.addEventListener('click', () => {
    chatContainer.style.display = chatContainer.style.display === 'flex' ? 'none' : 'flex';
});

closeChat.addEventListener('click', () => {
    chatContainer.style.display = 'none';
});

// 发送消息功能
sendMessage.addEventListener('click', sendUserMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendUserMessage();
    }
});

function sendUserMessage() {
    const message = messageInput.value.trim();
    if (!message) return;

    // 添加用户消息
    addMessage('user', message);
    messageInput.value = '';

    // 模拟AI响应
    setTimeout(() => {
        addMessage('ai', '感谢您的提问！我们的工作人员会尽快回复您。');
    }, 1000);
}

function addMessage(type, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 数据可视化示例数据
const sampleData = [
    { title: '珊瑚覆盖率', value: '45%', trend: '↓', color: '#FF5722' },
    { title: '水温', value: '26°C', trend: '↑', color: '#2196F3' },
    { title: 'pH值', value: '8.1', trend: '→', color: '#4CAF50' },
    { title: '物种多样性', value: '高', trend: '↓', color: '#FFC107' }
];

// 创建数据卡片
function createDataCards() {
    const dataGrid = document.querySelector('.data-grid');
    sampleData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'data-card';
        card.innerHTML = `
            <h3>${item.title}</h3>
            <div class="data-value" style="color: ${item.color}">${item.value}</div>
            <div class="trend">${item.trend}</div>
        `;
        dataGrid.appendChild(card);
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    createDataCards();
}); 