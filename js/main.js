// Слайдер для фильмов
const sliders = document.querySelectorAll('.slider-wrapper');

if (sliders.length > 0) {

    sliders.forEach((wrapper) => {

        const itemsContainer =
            wrapper.querySelector('.genres') ||
            wrapper.querySelector('.films');

        const btnPrev = wrapper.querySelector('.but_prev');
        const btnNext = wrapper.querySelector('.but_next');

        if (!itemsContainer || !btnPrev || !btnNext) {
            return;
        }

        const itemSelector =
            itemsContainer.classList.contains('genres') ? '.genre' : '.film';

        const getScrollAmount = () => {

            const firstItem =
                itemsContainer.querySelector(itemSelector);

            if (!firstItem) { return 300; }

            const styles = window.getComputedStyle(itemsContainer);

            const gap = parseFloat(styles.columnGap || styles.gap) || 20;

            return firstItem.offsetWidth + gap;
        };

        btnNext.addEventListener('click', () => {

            itemsContainer.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });

        });

        btnPrev.addEventListener('click', () => {
            itemsContainer.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });

        const checkScroll = () => {

            if (itemsContainer.scrollLeft > 10) {
                wrapper.classList.add('is-scrolled');
            } else {
                wrapper.classList.remove('is-scrolled');
            }

            const maxScroll = itemsContainer.scrollWidth - itemsContainer.clientWidth;

            if (itemsContainer.scrollLeft >= maxScroll - 10) {
                wrapper.classList.add('at-end');
            } else {
                wrapper.classList.remove('at-end');
            }
        };

        itemsContainer.addEventListener('scroll', checkScroll);

        checkScroll();

    });

}

// Слайдер баннер
const bannerSlider = document.querySelector('.banner_block');
const bannerTrack = document.querySelector('#mainBannerTrack');

if (bannerSlider && bannerTrack) {

    const slides = Array.from(
        bannerTrack.querySelectorAll('.banner')
    );

    if (slides.length >= 3) {
        const DESKTOP_BREAKPOINT = 1024;
        let isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
        let current = isDesktop ? 1 : 0;

        let startX = 0;
        let isDragging = false;
        let autoPlay;

        function getStep() {
            const slide = slides[0];
            if (!slide) return 0;

            const gap = parseFloat(getComputedStyle(bannerTrack).gap) || 0;
            return slide.offsetWidth + gap;
        }

        function getBaseOffset() {
            return ((bannerSlider.clientWidth - slides[0].offsetWidth) / 2 - current * getStep());
        }

        function updateSlider(animate = true) {
            const step = getStep();

            bannerTrack.style.transition = animate ? 'transform 0.5s ease' : 'none';
            bannerTrack.style.transform = `translateX(${getBaseOffset()}px)`;
        }

        function nextSlide() {
            current++;
            if (current >= slides.length) current = 0;
            updateSlider();
        }

        function prevSlide() {
            current--;
            if (current < 0) current = slides.length - 1;
            updateSlider();
        }

        function startAutoPlay() {
            clearInterval(autoPlay);
            autoPlay = setInterval(nextSlide, 3000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlay);
        }

        bannerSlider.addEventListener('mouseenter', stopAutoPlay);

        bannerSlider.addEventListener('mouseleave', startAutoPlay);

        bannerSlider.addEventListener( 'touchstart', (event) => {
                startX = event.touches[0].clientX;
                isDragging = true;
                stopAutoPlay();
            },
            { passive: true }
        );

        bannerSlider.addEventListener('touchmove', (event) => {
                if (!isDragging) return;

                const currentX = event.touches[0].clientX;
                const diff = currentX - startX;

                bannerTrack.style.transition = 'none';
                bannerTrack.style.transform =
                    `translateX(${getBaseOffset() + diff}px)`;
            },
            { passive: true }
        );

        bannerSlider.addEventListener('touchend', (event) => {
                if (!isDragging) return;

                isDragging = false;

                const endX = event.changedTouches[0].clientX;
                const diff = endX - startX;

                if (Math.abs(diff) > 50) {
                    if (diff < 0) nextSlide();
                    else prevSlide();
                } else {
                    updateSlider();
                }

                startAutoPlay();
            }
        );


        updateSlider(false);
        startAutoPlay();

        slides.forEach((banner) => {
            const video = banner.querySelector('.banner_preview');
            if (!video) return;

            let hoverTimer = null;

            banner.addEventListener('mouseenter', () => {
                const activeSlide = slides[current];

                if (banner !== activeSlide) return;

                hoverTimer = setTimeout(() => {
                    banner.classList.add('preview-active');
                    video.currentTime = 0;
                    video.play().catch(() => { });
                }, 500);
            });

            banner.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimer);
                banner.classList.remove('preview-active');
                video.pause();
                video.currentTime = 0;
            });
        });
    }
}


//Рекоммендации
const recomItems = Array.from(document.querySelectorAll('.recom_item'));

if (recomItems.length >= 2) {

    let swapped = false;
    let swapTimer = null;

    function swapCards() {
        const first = recomItems[0];
        const second = recomItems[1];

        const firstRect = first.getBoundingClientRect();
        const secondRect = second.getBoundingClientRect();

        if (!swapped) {
            first.style.order = '2';
            second.style.order = '1';
        } else {
            first.style.order = '1';
            second.style.order = '2';
        }

        const firstRectAfter = first.getBoundingClientRect();
        const secondRectAfter = second.getBoundingClientRect();

        const firstDx = firstRect.left - firstRectAfter.left;
        const secondDx = secondRect.left - secondRectAfter.left;

        first.style.transition = 'none';
        second.style.transition = 'none';
        first.style.transform = `translateX(${firstDx}px)`;
        second.style.transform = `translateX(${secondDx}px)`;

        first.offsetHeight;
        second.offsetHeight;

        requestAnimationFrame(() => {
            first.style.transition = 'transform 0.8s ease';
            second.style.transition = 'transform 0.8s ease';
            first.style.transform = 'translateX(0)';
            second.style.transform = 'translateX(0)';
        });

        swapped = !swapped;
    }

    function startSwapTimer() {
        clearInterval(swapTimer);
        swapTimer = setInterval(swapCards, 5000);
    }

    const recoms = document.querySelector('.recoms');
    if (recoms) {
        recoms.addEventListener('mouseenter', () => clearInterval(swapTimer));
        recoms.addEventListener('mouseleave', () => startSwapTimer());
    }

    startSwapTimer();
}

// Бургер
const burger = document.querySelector('.burger');

const menu = document.querySelector('.header_menu');

const menuLinks = document.querySelectorAll('.header_menu a');


if (burger && menu) {
    function closeMenu() {
        burger.classList.remove('active');
        menu.classList.remove('open');
        document.body.classList.remove('menu-open');
    }


    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        menu.classList.toggle('open');

        document.body.classList.toggle('menu-open');
    }
    );


    menuLinks.forEach((link) => {
        link.addEventListener('click', closeMenu);

    });

}

// Оценка
const stars =
    document.querySelectorAll('.star');

const starsContainer =
    document.querySelector('.stars');


if (stars.length > 0 && starsContainer) {

    let selectedRating = 0;

    stars.forEach((star, index) => {

        star.addEventListener(
            'mouseenter',
            () => {

                const rating = index + 1;

                stars.forEach((item, i) => {

                    item.classList.toggle(
                        'active',
                        i < rating
                    );

                });

            }
        );

        star.addEventListener(
            'click',
            () => {

                selectedRating = index + 1;

                stars.forEach((item, i) => {

                    item.classList.toggle(
                        'active',
                        i < selectedRating
                    );

                    item.classList.remove(
                        'selected'
                    );

                    if (i < selectedRating) {

                        setTimeout(() => {

                            item.classList.add(
                                'selected'
                            );

                        }, i * 60);

                    }

                });

            }
        );

    });


    starsContainer.addEventListener(
        'mouseleave',
        () => {

            stars.forEach((star, index) => {

                star.classList.toggle(
                    'active',
                    index < selectedRating
                );

            });

        }
    );

}

// Поиск
const search = document.querySelector('.search_header');

const searchBtn = document.querySelector('.search_btn');

const searchInput = document.querySelector('.search_input');


if (search && searchBtn && searchInput) {

    searchBtn.addEventListener('click', () => {

        search.classList.toggle('active');

        if (search.classList.contains('active')) {

            setTimeout(() => {
                searchInput.focus();
            }, 200);

        } else {
            searchInput.value = '';
        }

    }
    );

}


// Избранное, буду смотреть 
const filmIcons = document.querySelectorAll('.icons_film');

if (filmIcons.length > 0) {
    filmIcons.forEach((icons) => {
        icons.addEventListener('click', (event) => {
            const form = event.target.closest('form');
            if (!form) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();

            const input = form.querySelector(
                'input[name="favorite"], input[name="watchLater"]'
            );

            if (!input) {
                return;
            }

            form.classList.toggle('active');

        });

    });

}
// Вкладки
const tabs = document.querySelectorAll('.profile_nav a[data-tab]');
const contents = document.querySelectorAll('.tab_content');

if (tabs.length > 0 && contents.length > 0) {
    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();

            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(item => item.classList.remove('active'));

            tab.classList.add('active');
            const contentId = tab.getAttribute('data-tab');
            const content = document.getElementById(contentId);

            if (content) {
                content.classList.add('active');
            }
        });
    });
}

// МОДАЛКИ
document.addEventListener('DOMContentLoaded', () => {
    const deleteBtns = document.querySelectorAll('.delete-btn');
    const modalDel = document.querySelector('.modalDel');
    const closeBtns = document.querySelectorAll('.modalDel .close_message');
    const confirmBtn = document.querySelector('.modalDel .confirm-delete');

    let currentDeleteId = null; 
    if (!modalDel || deleteBtns.length === 0) return;

    deleteBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            currentDeleteId = btn.getAttribute('data-id');

            // const titleElement = document.getElementById('delete-film-title');
            // titleElement.textContent = `"Фильм с ID: ${currentDeleteId}"`;

            modalDel.style.display = 'block'; 
            document.body.classList.add('modal-open');
        });
    });

    function closeModalDel() {
        modalDel.style.display = 'none'; 
        document.body.classList.remove('modal-open');
        currentDeleteId = null;
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeModalDel);
    });

    confirmBtn.addEventListener('click', () => {
        if (!currentDeleteId) return;

        console.log(`Отправка запроса на удаление фильма с ID: ${currentDeleteId}`);
        /*
        fetch(`/api/delete-film/${currentDeleteId}`, { method: 'DELETE' })
            .then(res => {
                if (res.ok) {
                    alert('Удалено!');
                    // Удаляем карточку из DOM без перезагрузки страницы
                }
            });
        */
        closeModalDel();
    });

    window.addEventListener('click', (e) => {
        if (e.target === modalDel) {
            closeModalDel();
        }
    });
});

const loginBtn = document.querySelector('.loginBtn');

const registrationModal = document.querySelector('.registrationModal');

const loginModal = document.querySelector('.loginModal');

const marketModal = document.querySelector('.modal_market');


function isUserAuthorized() {
    return localStorage.getItem('authorized') === 'false';
}

function isAnyModalOpen() {

    return (
        registrationModal?.classList.contains('active') ||
        loginModal?.classList.contains('active') ||
        marketModal?.classList.contains('active')
    );

}


function openRegistration() {

    closeAllModals();

    if (!registrationModal) {
        return;
    }

    registrationModal.classList.add('active');

    document.body.classList.add('modal-open');
}

function openLogin() {

    closeAllModals();

    if (!loginModal) {
        return;
    }

    loginModal.classList.add('active');

    document.body.classList.add('modal-open');
}


function openMarket() {
    if (isUserAuthorized()) {
        return;
    }

    if (isAnyModalOpen()) {
        return;
    }

    if (!marketModal) {
        return;
    }

    marketModal.classList.add('active');

    document.body.classList.add('modal-open');
}

function closeAllModals() {

    registrationModal?.classList.remove('active');
    loginModal?.classList.remove('active');
    marketModal?.classList.remove('active');

    document.body.classList.remove('modal-open');
}

if (loginBtn) {

    loginBtn.addEventListener('click', () => {

        if (isUserAuthorized()) {

            window.location.href = 'profile.html';

            return;
        }

        openRegistration();

    });

}

const closeButtons =
    document.querySelectorAll('.closeBtn');


closeButtons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        closeAllModals();
    });
});


const closeMarket =
    document.querySelector('.close_market');

if (closeMarket) {

    closeMarket.addEventListener('click', () => {

        closeAllModals();

    });

}

const registrationToLogin =
    document.querySelector('.registrationModal .buts_reg a');


if (registrationToLogin) {

    registrationToLogin.addEventListener(
        'click',
        (event) => {
            event.preventDefault();
            openLogin();

        }
    );

}

const loginToRegistration =
    document.querySelector('.loginModal .buts_reg a');


if (loginToRegistration) {

    loginToRegistration.addEventListener(
        'click',
        (event) => {

            event.preventDefault();

            openRegistration();

        }
    );

}

setTimeout(() => {

    openMarket();

}, 4000);


function toggleActive(label) {
    label.classList.toggle('active');
}

//Модалка ограничение
document.addEventListener('DOMContentLoaded', function () {

    const modal = document.querySelector('.modalMessage');
    if (!modal) return;

    const watchButtons = document.querySelectorAll('.watch-btn');
    const closeButtons = document.querySelectorAll('.close_message');

    watchButtons.forEach(function (button) {

        button.addEventListener('click', function (event) {

            const requiresSubscription =
                button.dataset.subscription === 'true';

            if (requiresSubscription) {

                event.preventDefault();

                modal.style.display = 'block';
                document.body.classList.add('modal-open');

            }

        });

    });

    closeButtons.forEach(function (button) {

        button.addEventListener('click', function () {
            document.body.classList.remove('modal-open');
            modal.style.display = 'none';
        });

    });


    document.addEventListener('click', function (event) {

        if (
            modal.style.display === 'block' &&
            event.target === modal
        ) {
            document.body.classList.remove('modal-open');
            modal.style.display = 'none';
        }

    });


    document.addEventListener('keydown', function (event) {

        if (event.key === 'Escape') {
            document.body.classList.remove('modal-open');
            modal.style.display = 'none';
        }

    });

});

// ДЕТСКИЙ РЕЖИМ
const kidsModeButton = document.querySelector('.kid_link');
const kidsModeIcon = kidsModeButton?.querySelector('img');

function isKidsMode() {
    return localStorage.getItem('kidsMode') === 'true';
}

function enableKidsMode() {
    localStorage.setItem('kidsMode', 'true');

    document.body.classList.add('kids-mode');

    if (kidsModeButton) {
        kidsModeButton.setAttribute('aria-pressed', 'true');
    }

    if (kidsModeIcon) {
        kidsModeIcon.src = 'images/icons/on.svg';
        kidsModeIcon.alt = 'Детский режим включён';
    }
}

function disableKidsMode() {
    localStorage.setItem('kidsMode', 'false');

    document.body.classList.remove('kids-mode');

    if (kidsModeButton) {
        kidsModeButton.setAttribute('aria-pressed', 'false');
    }

    if (kidsModeIcon) {
        kidsModeIcon.src = 'images/icons/off.svg';
        kidsModeIcon.alt = 'Детский режим выключен';
    }
}

function updateKidsModeUI() {
    if (isKidsMode()) {

        if (kidsModeButton) {
            kidsModeButton.setAttribute('aria-pressed', 'true');
        }

        if (kidsModeIcon) {
            kidsModeIcon.src = 'images/icons/on.svg';
            kidsModeIcon.alt = 'Детский режим включён';
        }
    } else {
        document.body.classList.remove('kids-mode');

        if (kidsModeButton) {
            kidsModeButton.setAttribute('aria-pressed', 'false');
        }

        if (kidsModeIcon) {
            kidsModeIcon.src = 'images/icons/off.svg';
            kidsModeIcon.alt = 'Детский режим выключен';
        }
    }
}

if (kidsModeButton) {
    kidsModeButton.addEventListener('click', () => {
        if (isKidsMode()) {
            disableKidsMode();
        } else {
            enableKidsMode();
        }
    });
}

updateKidsModeUI();

