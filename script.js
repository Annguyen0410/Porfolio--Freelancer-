/* ============================================================
   Huynh Thien An Nguyen — portfolio behaviour
   Theme, index overlay, scroll-spy spine, reveal, mailto form.
   ============================================================ */
(function () {
    'use strict';

    var root = document.documentElement;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. Colour mode ---------- */
    var themeToggle = document.getElementById('themeToggle');
    var themeLabel = document.getElementById('themeLabel');
    var stored = null;
    try { stored = localStorage.getItem('theme'); } catch (e) { stored = null; }
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored ? stored === 'dark' : prefersDark;

    function paintTheme() {
        if (isDark) {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        if (themeLabel) themeLabel.textContent = isDark ? 'Light' : 'Dark';
        if (themeToggle) themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }
    paintTheme();

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            isDark = !isDark;
            try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) { /* private mode */ }
            paintTheme();
        });
    }

    /* ---------- 2. Reading progress + topbar state ---------- */
    var bar = document.getElementById('progressBar');
    var topbar = document.querySelector('.topbar');
    var ticking = false;

    function onScroll() {
        var doc = document.documentElement;
        var max = doc.scrollHeight - window.innerHeight;
        var pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        if (bar) bar.style.width = (pct * 100).toFixed(2) + '%';
        if (topbar) topbar.classList.toggle('is-stuck', window.scrollY > 24);
        ticking = false;
    }
    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();

    /* ---------- 3. Index overlay ---------- */
    var overlay = document.getElementById('indexOverlay');
    var indexBtn = document.getElementById('indexBtn');
    var lastFocus = null;

    function openIndex() {
        if (!overlay) return;
        lastFocus = document.activeElement;
        overlay.hidden = false;
        window.requestAnimationFrame(function () { overlay.classList.add('is-open'); });
        document.body.classList.add('is-locked');
        indexBtn.setAttribute('aria-expanded', 'true');
        var links = overlay.querySelectorAll('.index-list a');
        links.forEach(function (a, i) {
            a.style.transitionDelay = reduceMotion ? '0s' : (60 + i * 35) + 'ms';
        });
        if (links[0]) links[0].focus();
    }

    function closeIndex() {
        if (!overlay || overlay.hidden) return;
        overlay.classList.remove('is-open');
        document.body.classList.remove('is-locked');
        indexBtn.setAttribute('aria-expanded', 'false');
        window.setTimeout(function () { overlay.hidden = true; }, 350);
        if (lastFocus) lastFocus.focus();
    }

    if (indexBtn && overlay) {
        indexBtn.addEventListener('click', function () {
            if (overlay.hidden) { openIndex(); } else { closeIndex(); }
        });
        overlay.addEventListener('click', function (e) {
            if (e.target.closest('.index-list a')) closeIndex();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeIndex();
        });
    }

    /* ---------- 4. Smooth in-page scrolling (respects fixed topbar) ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var id = this.getAttribute('href');
            if (!id || id === '#') return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            var top = target.getBoundingClientRect().top + window.scrollY - 66;
            window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
            history.replaceState(null, '', id);
        });
    });

    /* ---------- 5. Scroll-spy: chapter number in the spine ---------- */
    var ticker = document.getElementById('spineTicker');
    var chapters = Array.prototype.slice.call(document.querySelectorAll('[data-chapter]'));
    var indexItems = Array.prototype.slice.call(document.querySelectorAll('.index-list a'));

    if (chapters.length && 'IntersectionObserver' in window) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var no = entry.target.getAttribute('data-chapter');
                var title = entry.target.getAttribute('data-title') || '';
                if (ticker) ticker.textContent = '№ ' + no + ' · ' + title;
                indexItems.forEach(function (a) {
                    a.setAttribute('aria-current', a.getAttribute('data-index') === no ? 'true' : 'false');
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        chapters.forEach(function (c) { spy.observe(c); });
    }

    /* ---------- 6. Reveal on scroll ---------- */
    var revealables = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        var revealer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry, i) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                el.style.transitionDelay = Math.min(i * 70, 280) + 'ms';
                el.classList.add('is-in');
                revealer.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        revealables.forEach(function (el) { revealer.observe(el); });
    } else {
        revealables.forEach(function (el) { el.classList.add('is-in'); });
    }

    /* ---------- 7. Toast ---------- */
    var toast = document.getElementById('toast');
    var toastTimer = null;
    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('is-visible');
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(function () { toast.classList.remove('is-visible'); }, 6000);
    }

    /* ---------- 8. Contact form → prefilled email ---------- */
    var form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var fields = ['name', 'email', 'subject', 'message'];
            var values = {};
            var firstBad = null;

            fields.forEach(function (id) {
                var el = document.getElementById(id);
                var value = el ? el.value.trim() : '';
                values[id] = value;
                var valid = value !== '' && (id !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
                if (el) el.setAttribute('aria-invalid', valid ? 'false' : 'true');
                if (!valid && !firstBad) firstBad = el;
            });

            if (firstBad) {
                var message = firstBad.id === 'email' && values.email !== ''
                    ? 'That email address looks incomplete.'
                    : 'Please complete the highlighted field.';
                showToast(message);
                firstBad.focus();
                return;
            }

            var subject = 'Project enquiry — ' + values.subject;
            var body = 'Name: ' + values.name + '\n'
                + 'Email: ' + values.email + '\n'
                + 'Project type: ' + values.subject + '\n\n'
                + values.message + '\n';
            var href = 'mailto:annguyen030205@gmail.com'
                + '?subject=' + encodeURIComponent(subject)
                + '&body=' + encodeURIComponent(body);

            window.location.href = href;
            showToast('Opening your email app with the brief attached…');
        });
    }

    /* ---------- 9. Year ---------- */
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());
})();
