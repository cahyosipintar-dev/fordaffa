// ==========================================
// DATA POLAROID SLIDE
// ==========================================
const polaroidData = [
    {
        src: "polaroid1.png",
        caption: ""
    },
    {
        src: "polaroid2.png",
        caption: ""
    },
    {
        src: "polaroid3.jpeg",
        caption: "Happy Birthday Daffa! 🥳"
    }
];

let currentPolaroidIndex = 0;
let currentHeroSlideIndex = 0;

// FUNGSI EFEK SUARA POP
function playPopSound() {
    const popSound = document.getElementById('popSound');
    if (popSound) {
        const tempSound = new Audio(popSound.src);
        tempSound.volume = 0.6;
        tempSound.play().catch(() => {});
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    // Partikel burst saat klik di layar
    document.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('.modal')) {
            createClickBurst(e.clientX, e.clientY);
        }
    });

    // 1. Sapaan Waktu Otomatis
    const timeGreeting = document.getElementById('timeGreeting');
    if (timeGreeting) {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 11) {
            timeGreeting.textContent = "Selamat Pagi";
        } else if (hour >= 11 && hour < 15) {
            timeGreeting.textContent = "Selamat Siang";
        } else if (hour >= 15 && hour < 18) {
            timeGreeting.textContent = "Selamat Sore";
        } else {
            timeGreeting.textContent = "Selamat Malam";
        }
    }

    // 2. Control Confetti Floating Button
    const confettiBtn = document.getElementById('confettiBtn');
    if (confettiBtn) {
        confettiBtn.addEventListener('click', () => {
            playPopSound();
            triggerConfetti();
        });
    }

    // 3. Hero Slider Setup
    initHeroDots();
    setInterval(() => moveHeroSlide(1), 4000);

    // ==========================================
    // 4. PERBAIKAN SCROLL REVEAL ANIMATION (WINDOW)
    // ==========================================
    const sections = document.querySelectorAll('.section');

    const checkReveal = () => {
        const triggerBottom = window.innerHeight * 0.88;
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < triggerBottom) {
                section.classList.add('active');
            }
        });
    };

    // Pasang listener pada window (bukan mobile-container)
    window.addEventListener('scroll', checkReveal, { passive: true });
    // Jalankan sekali saat halaman dimuat
    checkReveal();

    // 5. Countdown Timer (otomatis lanjut ke tahun berikutnya setiap tahun)
    function getNextBirthdayTimestamp() {
        const now = new Date();
        const currentYear = now.getFullYear();
        let target = new Date(`September 17, ${currentYear} 00:00:00`);

        // Kalau tanggal 17 September tahun ini sudah lewat, majukan ke tahun depan
        if (target.getTime() <= now.getTime()) {
            target = new Date(`September 17, ${currentYear + 1} 00:00:00`);
        }
        return target.getTime();
    }

    const nextBirthday = getNextBirthdayTimestamp();
    
    setInterval(() => {
        const now = new Date().getTime();
        const difference = nextBirthday - now;

        if (difference > 0) {
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            const secondsEl = document.getElementById('seconds');

            if (daysEl) daysEl.innerText = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
            if (hoursEl) hoursEl.innerText = String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            if (minutesEl) minutesEl.innerText = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            if (secondsEl) secondsEl.innerText = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');
        }
    }, 1000);

    // 6. Modal Wish
    const modal = document.getElementById('wishModal');
    const openWishBtn = document.getElementById('openWishBtn');
    const closeModal = document.getElementById('closeModal');

    if (openWishBtn && modal) {
        openWishBtn.addEventListener('click', () => {
            playPopSound();
            modal.style.display = 'flex';
            triggerConfetti();
        });
    }

    if (closeModal && modal) {
        closeModal.addEventListener('click', () => modal.style.display = 'none');
    }

    // 7. Web Share API
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            playPopSound();
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Selamat Ulang Tahun Daffa',
                        text: 'Yuk beri ucapan ulang tahun untuk Daffa!',
                        url: window.location.href,
                    });
                } catch (err) {
                    console.log('Share canceled');
                }
            } else {
                alert('Tautan disalin ke papan klip!');
                navigator.clipboard.writeText(window.location.href);
            }
        });
    }

    // Inisialisasi Polaroid Pertama
    updatePolaroid();
});

// HERO SLIDER FUNCTIONS
function initHeroDots() {
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('heroDots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => setHeroSlide(idx));
        dotsContainer.appendChild(dot);
    });
}

function updateHeroSlider() {
    const slider = document.getElementById('heroSlider');
    const dots = document.querySelectorAll('.slider-dots .dot');

    if (slider) {
        slider.style.transform = `translateX(-${currentHeroSlideIndex * 100}%)`;
    }
    
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentHeroSlideIndex);
    });
}

function moveHeroSlide(direction) {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;
    currentHeroSlideIndex = (currentHeroSlideIndex + direction + slides.length) % slides.length;
    updateHeroSlider();
}

function setHeroSlide(index) {
    currentHeroSlideIndex = index;
    updateHeroSlider();
}

// SURPRISE POP-UP LOGIC
function triggerSurprisePop(messageText, imageSrc = null, showActionButtons = false) {
    playPopSound();
    const surpriseModal = document.getElementById('surpriseModal');
    const surpriseText = document.getElementById('surpriseText');
    
    if (surpriseModal && surpriseText) {
        let content = '';

        if (imageSrc) {
            content += `
                <div style="width: 100%; display: flex; justify-content: center; margin-bottom: 15px;">
                    <div style="background: #ffffff; padding: 10px 10px 15px 10px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.05); max-width: 260px; width: 100%;">
                        <img src="${imageSrc}" alt="Kejutan Menang" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px; display: block;">
                    </div>
                </div>
            `;
        }

        content += `<div style="font-size: 0.95rem; line-height: 1.5; color: #f3e5ab;">${messageText}</div>`;

        if (showActionButtons) {
            content += `
                <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: center;">
                    <button onclick="closeSurpriseModal()" style="padding: 10px 18px; border: 1px solid #ddd; background: #f5f5f5; color: #444; border-radius: 20px; font-weight: 600; cursor: pointer;">
                        🔄 Coba Lagi
                    </button>
                    <button onclick="closeSurpriseModal(); document.getElementById('wishesSection')?.scrollIntoView({behavior: 'smooth'});" style="padding: 10px 20px; border: none; background: linear-gradient(135deg, #d4af37, #f3e5ab); color: #222; border-radius: 20px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(212,175,55,0.4);">
                        ➡️ Lanjutkan
                    </button>
                </div>
            `;
        }

        surpriseText.innerHTML = content;
        surpriseModal.style.display = 'flex';
        triggerConfetti();
    }
}

function closeSurpriseModal() {
    const modal = document.getElementById('surpriseModal');
    if (modal) modal.style.display = 'none';
}

// EFEK BURST PARTIKEL KLIK
function createClickBurst(x, y) {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 15,
            spread: 50,
            origin: { x: x / window.innerWidth, y: y / window.innerHeight },
            colors: ['#d4af37', '#f3e5ab', '#ffffff']
        });
    }
}

// POLAROID NAVIGATION
function updatePolaroid() {
    if (polaroidData.length === 0) return;
    const data = polaroidData[currentPolaroidIndex];
    const polaroidImg = document.getElementById('polaroidImage');
    const polaroidCap = document.getElementById('polaroidCaption');
    if (polaroidImg) polaroidImg.src = data.src;
    if (polaroidCap) polaroidCap.innerText = data.caption || "";
}

function nextPolaroid() {
    playPopSound();
    currentPolaroidIndex = (currentPolaroidIndex + 1) % polaroidData.length;
    updatePolaroid();
}

function prevPolaroid() {
    playPopSound();
    currentPolaroidIndex = (currentPolaroidIndex - 1 + polaroidData.length) % polaroidData.length;
    updatePolaroid();
}

// LIGHTBOX
function openLightbox(src) {
    playPopSound();
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (lightbox && lightboxImg) {
        lightboxImg.src = src;
        lightbox.style.display = 'flex';
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.style.display = 'none';
}

// LAUNCH CONFETTI
function triggerConfetti() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#d4af37', '#f3e5ab', '#ffffff', '#e0d0b0']
        });
    }
}

// FUNGSI MENIUP LILIN
function blowOutCandle() {
    const flame = document.getElementById('candleFlame');
    const smoke = document.getElementById('candleSmoke');
    
    if (flame && flame.style.display !== 'none') {
        flame.style.display = 'none';
        if (smoke) {
            smoke.style.display = 'block';
        }
        triggerConfetti();
        triggerSurprisePop(' <b>Selamat!</b> Lilin berhasil ditiup! Semoga semua doa dan harapanmu dikabulkan. ');
    }
}

// LOGIKA MINI GAME TANGKAP HADIAH (30 SKOR & 40 DETIK)
let score = 0;
let timeLeft = 40;
let gameInterval = null;
let spawnInterval = null;
let basketPosition = 50;
let isGameRunning = false;

function startMiniGame() {
    if (isGameRunning) return;
    playPopSound();
    
    score = 0;
    timeLeft = 40;
    isGameRunning = true;
    document.getElementById('gameScore').innerText = score;
    document.getElementById('gameTimer').innerText = timeLeft;
    document.getElementById('startGameBtn').style.display = 'none';

    const board = document.getElementById('gameBoard');
    const basket = document.getElementById('gameBasket');

    const handleMove = (e) => {
        if (!isGameRunning) return;
        const rect = board.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let x = clientX - rect.left;
        let percentage = (x / rect.width) * 100;
        percentage = Math.max(5, Math.min(95, percentage));
        basketPosition = percentage;
        basket.style.left = `${basketPosition}%`;
    };

    board.addEventListener('mousemove', handleMove);
    board.addEventListener('touchmove', handleMove, { passive: true });

    gameInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('gameTimer').innerText = timeLeft;

        if (timeLeft <= 0) {
            endMiniGame(false);
        }
    }, 1000);

    spawnInterval = setInterval(() => {
        if (isGameRunning) spawnGiftItem();
    }, 400); 
}

function spawnGiftItem() {
    const board = document.getElementById('gameBoard');
    if (!board) return;

    const gift = document.createElement('div');
    gift.classList.add('falling-gift');
    gift.innerText = '🎁';
    
    const randomX = Math.floor(Math.random() * 85) + 5;
    gift.style.left = `${randomX}%`;
    gift.style.top = '0px';

    board.appendChild(gift);

    let topPos = 0;
    const fallSpeed = 3 + Math.random() * 2;

    const fallInterval = setInterval(() => {
        if (!isGameRunning) {
            clearInterval(fallInterval);
            gift.remove();
            return;
        }

        topPos += fallSpeed;
        gift.style.top = `${topPos}px`;

        const boardHeight = board.offsetHeight;

        if (topPos >= boardHeight - 40 && topPos <= boardHeight - 10) {
            const giftLeft = parseFloat(gift.style.left);
            if (Math.abs(giftLeft - basketPosition) < 15) {
                score++;
                playPopSound();
                document.getElementById('gameScore').innerText = score;
                clearInterval(fallInterval);
                gift.remove();

                if (score >= 30) {
                    endMiniGame(true);
                }
            }
        }

        if (topPos > boardHeight) {
            clearInterval(fallInterval);
            gift.remove();
        }
    }, 20);
}

function endMiniGame(isWin) {
    isGameRunning = false;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);

    document.querySelectorAll('.falling-gift').forEach(item => item.remove());

    const startBtn = document.getElementById('startGameBtn');
    startBtn.style.display = 'block';
    startBtn.innerText = '🔄 Main Lagi';

    if (isWin) {
        triggerConfetti();
        triggerSurprisePop(
            " <b>SELAMAT! KAMU MENANG!</b> <br><br>" +
            "Semoga di usia yang baru ini semua impian besarmu tercapai, diberikan kesehatan, keberkahan rezeki, dan kelancaran dalam setiap langkah perjuanganmu Daffa!",
            "kejutan-bola.jpeg",
            true
        );
    } else {
        triggerSurprisePop("Waktu habis! Coba lagi untuk menangkap 30 hadiah dan membuka kejutannya!");
    }
}

// FUNGSI COPY TEXT
function copyGreetingText() {
    playPopSound();
    const textarea = document.getElementById('customGreeting');
    if (textarea && textarea.value.trim() !== '') {
        navigator.clipboard.writeText(textarea.value);
        triggerSurprisePop("📋 Ucapan berhasil disalin ke clipboard!");
    } else {
        alert("Letuskan balon terlebih dahulu!");
    }
}

// FUNGSI KIRIM PESAN LANGSUNG KE WHATSAPP
function sendToWhatsApp(phoneNumber) {
    playPopSound();
    const textarea = document.getElementById('customGreeting');
    const textUcapan = textarea ? textarea.value.trim() : "";

    if (!textUcapan) {
        alert("Silakan letuskan salah satu balon atau tulis ucapan terlebih dahulu!");
        return;
    }

    const encodedText = encodeURIComponent(textUcapan);
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    triggerConfetti();
    const waWindow = window.open(waUrl, '_blank');
    if (waWindow) waWindow.opener = null;
}

// TEMPLATE KALIMAT UCAPAN
const balloonTemplates = {
    'Cahyo orang pintar': [
        "Fix Cahyo emang definisi otak encer! Kamu tuh selalu punya sudut pandang unik yang gak kepikiran orang lain. Respek dari Daffa!",
        "Otak kamu emang beda level sih, Yo. Cara mikir kamu tuh selalu genius banget, asli keren parah!",
        "Bisa-bisanya kamu kepikiran sampai ke sana, Yo. Emang pinter banget sih kamu, aku aja gak kepikiran -Daffa."
    ],
    'Cahyo orang ganteng': [
        "Muka kamu emang gak bisa bohong sih, Yo. Gantengnya santai tapi kelihatan berkelas banget.",
        "Cahyo mah definisi gantengnya gak neko-neko tapi bikin orang nengok dua kali. Keren lah kamu, Yo!",
        "Bisa-bisanya kamu gak effort tapi gantengnya dapet banget. Memang beda kamu, Yo!"
    ],
    'Cahyo orang baik': [
       "Hati kamu emang baik banget sih, Yo. Santai tapi selalu bisa bikin orang sekitar nyaman. Respek!",
       "Gak cuma keren, tapi kamu emang beneran orang baik, Yo. Jarang-jarang ada yang sepeduli ini.Salam hangat, Daffa",
       "Jarang banget nemu orang yang sebaik dan se-positif kamu, Yo. Asli bikin betah temenan sama kamu!"
    ],
    'Cahyo tidak sombong': [
        "Pinter sama keren sih iya, tapi yang paling jempolan tuh kamu tetep low profile dan gak sombong sama sekali. Mantap, Yo!",
        "Gak pernah pamer, gak pernah tinggi hati. Sikap kamu yang merendah ini yang bikin kamu keren banget, Yo.Salam hangat, Daffa"
    ]
};

// LOGIKA MELETUSKAN BALON
function popWishBalloon(balloonIndex, category) {
    const balloon = document.querySelector(`.balloon-${balloonIndex}`);
    const textarea = document.getElementById('customGreeting');
    const hint = document.getElementById('balloonHint');

    if (!balloon || balloon.classList.contains('popped')) return;

    balloon.classList.add('popped');
    playPopSound();

    const categoryList = balloonTemplates[category];
    const selectedWish = categoryList[Math.floor(Math.random() * categoryList.length)];

    if (textarea) {
        textarea.value = selectedWish;
    }

    if (hint) {
        hint.innerText = " POP! Pesan berhasil dibuka. Klik balon lain jika ingin mengganti ucapan!";
    }

    triggerConfetti();
    triggerSurprisePop(` <b>POP! Balon Meletus!</b> Doa tema <b>${category.toUpperCase()}</b> siap dikirimkan.`);
}

// START EXPERIENCE
function startExperience() {
    const loader = document.getElementById('loadingScreen');
    if (loader) {
        loader.classList.add('fade-out');
        setTimeout(() => {
            loader.style.display = 'none';
        }, 800);
    }
    
    const bgMusic = document.getElementById('bgMusic');
    if (bgMusic) {
        bgMusic.play().catch(() => {});
    }

    playPopSound();
    triggerConfetti();
}

// FUNGSI KEJUTAN PENUTUP & EXIT COUNTDOWN
let isCapsuleOpened = false;

function openTimeCapsule() {
    if (isCapsuleOpened) {
        triggerSurprisePop(
            " <b>Pesan Penutup:</b><br><br>" +
            "\".... Sekali lagi selamat bertambah usia, Daffa! Semoga momentum ini jadi awal yang bagus buat mengejar semua impian kamu. Tetep sehat dan sukses terus buat kamu sekeluarga daff!\" "
        );
        return;
    }

    isCapsuleOpened = true;
    playPopSound();
    triggerConfetti();

    const icon = document.getElementById('capsuleIcon');
    const title = document.getElementById('capsuleTitle');
    const sub = document.getElementById('capsuleSub');

    if (icon) icon.innerText = '📜';
    if (title) title.innerText = 'Kapsul Terbuka!';
    if (sub) sub.innerText = 'Klik kembali untuk membaca pesan rahasia.';

    triggerSurprisePop(
        " <b>KAPSUL WAKTU TERBUKA!</b> <br><br>" +
        "\".... Sekali lagi selamat bertambah usia, Daffa! Semoga momentum ini jadi awal yang bagus buat mengejar semua impian kamu. Tetep sehat dan sukses terus buat kamu sekeluarga daff!\" "
    );

    const surpriseModal = document.getElementById('surpriseModal');
    const closeBtn = surpriseModal ? surpriseModal.querySelector('.close-modal') : null;

    const handleMessageClose = () => {
        closeSurpriseModal();
        if (closeBtn) closeBtn.removeEventListener('click', handleMessageClose);
        setTimeout(startExitSequence, 500);
    };

    if (closeBtn) {
        closeBtn.onclick = handleMessageClose;
    }
}

// LOGIKA COUNTDOWN EXIT POPUP (5 DETIK)
function startExitSequence() {
    const exitModal = document.getElementById('exitModal');
    const exitCountdownEl = document.getElementById('exitCountdown');
    let timeLeftExit = 5;

    if (!exitModal || !exitCountdownEl) return;

    exitModal.style.display = 'flex';
    triggerConfetti();

    const countdownInterval = setInterval(() => {
        timeLeftExit--;
        exitCountdownEl.innerText = timeLeftExit;

        if (timeLeftExit <= 0) {
            clearInterval(countdownInterval);
            exitWebsite();
        }
    }, 1000);
}

function exitWebsite() {
    window.close();
    // Kebanyakan browser tidak mengizinkan JS menutup tab yang dibuka manual oleh user.
    // Jika penutupan otomatis gagal, tampilkan pesan penutup yang ramah alih-alih halaman kosong.
    setTimeout(() => {
        const icon = document.getElementById('exitIcon');
        const message = document.getElementById('exitMessage');
        const circle = document.getElementById('exitCountdownCircle');
        const subtext = document.getElementById('exitSubtext');

        if (icon) icon.innerText = '💛';
        if (message) message.style.display = 'none';
        if (circle) circle.style.display = 'none';
        if (subtext) subtext.innerText = 'Tab ini boleh ditutup manual ya, terima kasih sudah mampir!';
    }, 300);
}
