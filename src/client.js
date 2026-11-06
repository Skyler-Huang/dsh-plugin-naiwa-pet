window.__ModuleLoader__.load({
  id: 'dsh-plugin-naiwa-pet',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const {
      useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback,
    } = React;

    const ASSET = __NAIWA_ASSET__;
    const CSS = __NAIWA_CSS__;

    const RATIO = 643 / 1202;
    const SIZES = Object.freeze({ s: 260, m: 330, l: 410 });
    const SIZE_LABEL = Object.freeze({ s: 'size.s', m: 'size.m', l: 'size.l' });
    const SKINS = Object.freeze(['classic', 'cool', 'night', 'scholar', 'chef', 'wizard']);
    const SKIN_LABEL = Object.freeze({
      classic: 'skin.classic',
      cool: 'skin.cool',
      night: 'skin.night',
      scholar: 'skin.scholar',
      chef: 'skin.chef',
      wizard: 'skin.wizard',
    });
    const NOTE_KEY = Object.freeze({
      classic: 'note.classic',
      cool: 'note.cool',
      night: 'note.night',
      scholar: 'note.scholar',
      chef: 'note.chef',
      wizard: 'note.wizard',
    });
    const BUBBLE_KEY = Object.freeze({
      idle: 'status.idle',
      working: 'status.working',
      waiting: 'status.waiting',
      celebrate: 'status.celebrate',
      sleeping: 'status.sleeping',
      happy: 'status.happy',
      eating: 'status.eating',
    });
    const STORAGE_KEY = 'dsh-plugin-naiwa-pet:v1';

    const MESSAGES = Object.freeze({
      en: Object.freeze({
        'status.idle': 'Right here with you.',
        'status.greeting': 'Right here. Right-click to dress up, poke me!',
        'status.working': 'Working hard',
        'status.waiting': 'A question needs you.',
        'status.celebrate': 'Done! Nice work.',
        'status.sleeping': 'Just a tiny nap…',
        'status.happy': 'Hehe, that tickles.',
        'status.eating': 'Nom nom, tasty!',
        'status.wake': 'I’m up! Let’s go.',
        'aria.pet': '{status} Click to interact; right-click for the menu; use arrow keys to move.',
        'menu.title': 'Naiwa · desk buddy',
        'menu.subtitle': 'A tiny frog for the long haul.',
        'menu.skin': 'Look',
        'menu.size': 'Size',
        'menu.motion': 'Animations',
        'menu.nap': 'Auto nap',
        'menu.feed': 'Feed a snack',
        'menu.reset': 'Reset spot',
        'menu.hide': 'Tuck away',
        'menu.close': 'Close',
        'menu.now': 'Right now',
        'size.s': 'Small',
        'size.m': 'Medium',
        'size.l': 'Large',
        'skin.classic': 'Classic',
        'skin.cool': 'Shades',
        'skin.night': 'Nightcap',
        'skin.scholar': 'Scholar',
        'skin.chef': 'Chef',
        'skin.wizard': 'Wizard',
        'note.classic': 'Soft, warm, and classic.',
        'note.cool': 'Shades on. Nobody bothers me.',
        'note.night': 'Cap on. Officially off duty.',
        'note.scholar': 'Today we learn something.',
        'note.chef': 'Want a little snack?',
        'note.wizard': 'One spell to banish the bugs.',
        'restore': 'Bring Naiwa back',
        'restore.aria': 'Bring the Naiwa desk pet back',
      }),
      zh: Object.freeze({
        'status.idle': '我在这儿陪你。',
        'status.greeting': '我在这儿。右键换装，戳我试试！',
        'status.working': '认真打工中',
        'status.waiting': '有个问题等你拍板。',
        'status.celebrate': '搞定啦，给你鼓掌！',
        'status.sleeping': '眯一小会儿…',
        'status.happy': '嘿嘿，好痒。',
        'status.eating': '啊呜，好吃！',
        'status.wake': '醒啦，继续陪你。',
        'aria.pet': '{status} 点击互动；右键打开菜单；方向键移动。',
        'menu.title': '奶蛙 · 工位搭子',
        'menu.subtitle': '换件衣服，继续陪你。',
        'menu.skin': '形象',
        'menu.size': '大小',
        'menu.motion': '动效',
        'menu.nap': '自动打盹',
        'menu.feed': '喂一口',
        'menu.reset': '归位',
        'menu.hide': '收起',
        'menu.close': '关闭',
        'menu.now': '当前状态',
        'size.s': '小',
        'size.m': '中',
        'size.l': '大',
        'skin.classic': '原味',
        'skin.cool': '墨镜',
        'skin.night': '睡帽',
        'skin.scholar': '学霸',
        'skin.chef': '厨师',
        'skin.wizard': '魔法',
        'note.classic': '软乎乎，原汁原味。',
        'note.cool': '墨镜一戴，谁都不爱。',
        'note.night': '帽子戴好，准备摸鱼。',
        'note.scholar': '今天也要好好学习。',
        'note.chef': '给你做点好吃的？',
        'note.wizard': '变个魔法，把 bug 变没。',
        'restore': '唤回奶蛙',
        'restore.aria': '唤回奶蛙桌宠',
      }),
    });

    function normalizeLang(value) {
      return typeof value === 'string' && /^zh(?:$|[-_])/i.test(value.trim()) ? 'zh' : 'en';
    }

    function makeT(lang) {
      const dictionary = MESSAGES[normalizeLang(lang)] || MESSAGES.en;
      return (key, values) => {
        const message = dictionary[key] ?? MESSAGES.en[key] ?? key;
        return message.replace(/\{(\w+)\}/g, (match, name) => (
          values && Object.hasOwn(values, name) ? String(values[name]) : match
        ));
      };
    }

    function readPrefs() {
      let raw;
      try { raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null'); } catch { raw = null; }
      const source = raw && typeof raw === 'object' ? raw : {};
      const finite = value => typeof value === 'number' && Number.isFinite(value);
      return {
        size: Object.hasOwn(SIZES, source.size) ? source.size : 'm',
        skin: SKINS.includes(source.skin) ? source.skin : 'classic',
        motion: source.motion !== false,
        nap: source.nap !== false,
        hidden: source.hidden === true,
        x: finite(source.x) ? source.x : null,
        y: finite(source.y) ? source.y : null,
      };
    }

    function writePrefs(prefs) {
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch { /* local storage is optional */ }
    }

    function widthFor(height) {
      return Math.max(1, Math.round(height * RATIO));
    }

    function clampPos(point, height, width, viewportWidth, viewportHeight) {
      const margin = 12;
      const maxX = Math.max(margin, viewportWidth - width - margin);
      const maxY = Math.max(margin, viewportHeight - height - margin);
      return {
        x: Math.min(maxX, Math.max(margin, point.x)),
        y: Math.min(maxY, Math.max(margin, point.y)),
      };
    }

    function defaultPos(height, width) {
      // Leave room for the shipped whale pet at the bottom-right corner; the
      // frog stands beside it instead of covering it on first run.
      return clampPos({
        x: window.innerWidth - width - 206,
        y: window.innerHeight - height - 88,
      }, height, width, window.innerWidth, window.innerHeight);
    }

    function summarize(statuses) {
      let running = false;
      let pending = false;
      let count = 0;
      try {
        statuses?.forEach?.(status => {
          if (status?.running === true) { running = true; count += 1; }
          if (status?.pendingInteraction != null) pending = true;
        });
      } catch { /* a withheld status map simply means "idle" */ }
      return { running, pending, count };
    }

    function makeParticles(kind) {
      if (kind === 'hearts') {
        return [
          { kind: 'heart', x: -42, delay: 0, drift: -24, rot: -20 },
          { kind: 'heart', x: -18, delay: 0.08, drift: -11, rot: -8 },
          { kind: 'heart', x: 8, delay: 0.02, drift: 5, rot: 9 },
          { kind: 'heart', x: 34, delay: 0.12, drift: 21, rot: 17 },
          { kind: 'spark', x: -32, delay: 0.18, drift: -13, rot: 42 },
          { kind: 'spark', x: 27, delay: 0.2, drift: 15, rot: 70 },
        ];
      }
      if (kind === 'food') {
        return [
          { kind: 'crumb', x: -24, delay: 0, drift: -12, rot: 0 },
          { kind: 'crumb', x: -9, delay: 0.1, drift: -4, rot: 0 },
          { kind: 'crumb', x: 7, delay: 0.05, drift: 4, rot: 0 },
          { kind: 'crumb', x: 24, delay: 0.14, drift: 12, rot: 0 },
          { kind: 'spark', x: 12, delay: 0.2, drift: 8, rot: 50 },
        ];
      }
      const colors = ['#e5a62d', '#ef738c', '#68a7f2', '#56b985', '#a78bfa', '#f0a94a'];
      return Array.from({ length: 14 }, (_, index) => ({
        kind: 'confetti',
        x: -62 + index * 10,
        delay: (index % 7) * 0.045,
        drift: -28 + (index * 19) % 56,
        rot: 120 + index * 47,
        color: colors[index % colors.length],
      }));
    }

    function useLanguage(locale) {
      const read = useCallback(() => {
        try {
          const active = locale?.getLocale?.().active;
          return normalizeLang(active || navigator.language);
        } catch { return normalizeLang(navigator.language); }
      }, [locale]);
      const [lang, setLang] = useState(read);
      useEffect(() => {
        if (typeof locale?.subscribe !== 'function') return undefined;
        const update = () => setLang(read());
        const stop = locale.subscribe(update);
        update();
        return stop;
      }, [locale, read]);
      return lang;
    }

    /* ------------------------------------------------------------------ */
    /* Artwork layers                                                      */
    /* ------------------------------------------------------------------ */

    const ART_PROPS = {
      viewBox: '0 0 643 1202',
      preserveAspectRatio: 'none',
      'aria-hidden': 'true',
      focusable: 'false',
    };

    function FaceOverlay({ expression }) {
      if (!expression || expression === 'neutral') return null;
      const patches = [];
      const closed = ['blink', 'sleep', 'happy', 'eating'].includes(expression);
      if (closed) {
        patches.push(h('ellipse', { key: 'eye-main', cx: 279, cy: 158, rx: 43, ry: 46, fill: 'url(#naiwa-face-skin)', filter: 'url(#naiwa-face-blur)', opacity: 0.985 }));
        patches.push(h('ellipse', { key: 'eye-side', cx: 188, cy: 156, rx: 23, ry: 32, fill: 'url(#naiwa-face-skin)', filter: 'url(#naiwa-face-blur)', opacity: 0.975 }));
      }
      if (expression === 'happy' || expression === 'eating') {
        patches.push(h('ellipse', { key: 'mouth-cover', cx: 228, cy: 186, rx: 28, ry: 12, fill: 'url(#naiwa-face-skin)', filter: 'url(#naiwa-face-blur)', opacity: 0.99 }));
      }

      const content = [
        h('defs', { key: 'defs' },
          h('radialGradient', { id: 'naiwa-face-skin', cx: '42%', cy: '30%', r: '80%' },
            h('stop', { offset: '0%', stopColor: '#f8d47f' }),
            h('stop', { offset: '56%', stopColor: '#eec25f' }),
            h('stop', { offset: '100%', stopColor: '#e3aa42' }),
          ),
          h('filter', { id: 'naiwa-face-blur', x: '-35%', y: '-35%', width: '170%', height: '170%' },
            h('feGaussianBlur', { stdDeviation: '1.7' }),
          ),
        ),
        ...patches,
      ];

      if (expression === 'blink') {
        content.push(h('path', { key: 'lid-main', d: 'M 251 158 Q 279 169 307 157', fill: 'none', stroke: '#4b401f', strokeWidth: 3.4, strokeLinecap: 'round' }));
        content.push(h('path', { key: 'lid-side', d: 'M 181 158 Q 189 164 197 158', fill: 'none', stroke: '#4b401f', strokeWidth: 2.8, strokeLinecap: 'round' }));
      }
      if (expression === 'sleep') {
        content.push(h('path', { key: 'sleep-main', d: 'M 251 157 Q 279 172 307 157', fill: 'none', stroke: '#4b401f', strokeWidth: 3.4, strokeLinecap: 'round' }));
        content.push(h('path', { key: 'sleep-side', d: 'M 181 157 Q 189 163 197 157', fill: 'none', stroke: '#4b401f', strokeWidth: 2.8, strokeLinecap: 'round' }));
        content.push(h('ellipse', { key: 'sleep-blush', cx: 248, cy: 198, rx: 21, ry: 9, fill: '#f28d86', opacity: 0.28, filter: 'url(#naiwa-face-blur)' }));
      }
      if (expression === 'happy' || expression === 'eating') {
        content.push(h('path', { key: 'happy-main', d: 'M 252 162 Q 279 139 307 161', fill: 'none', stroke: '#4b401f', strokeWidth: 3.6, strokeLinecap: 'round' }));
        content.push(h('path', { key: 'happy-side', d: 'M 181 159 Q 189 149 197 158', fill: 'none', stroke: '#4b401f', strokeWidth: 2.9, strokeLinecap: 'round' }));
        content.push(h('ellipse', { key: 'blush-a', cx: 250, cy: 199, rx: 22, ry: 9, fill: '#f28d86', opacity: 0.34, filter: 'url(#naiwa-face-blur)' }));
        content.push(h('ellipse', { key: 'blush-b', cx: 337, cy: 181, rx: 15, ry: 7, fill: '#f28d86', opacity: 0.26, filter: 'url(#naiwa-face-blur)' }));
        content.push(h('path', { key: 'mouth', d: 'M 204 184 Q 224 213 249 183 Q 228 223 204 184 Z', fill: '#5b3a27' }));
        content.push(h('ellipse', { key: 'tongue', cx: 227, cy: 201, rx: 9, ry: 5, fill: '#e9858f' }));
        if (expression === 'eating') {
          content.push(h('circle', { key: 'crumb-a', cx: 254, cy: 208, r: 3, fill: '#c98b3e' }));
          content.push(h('circle', { key: 'crumb-b', cx: 244, cy: 214, r: 2, fill: '#b67b32' }));
        }
      }
      if (expression === 'worried') {
        content.push(h('path', { key: 'brow-main', d: 'M 247 130 Q 269 121 292 131', fill: 'none', stroke: '#5d4d27', strokeWidth: 3.2, strokeLinecap: 'round' }));
        content.push(h('path', { key: 'brow-side', d: 'M 176 136 Q 189 129 202 134', fill: 'none', stroke: '#5d4d27', strokeWidth: 2.6, strokeLinecap: 'round' }));
        content.push(h('path', { key: 'sweat', d: 'M 332 116 C 341 129 342 138 332 143 C 322 138 323 128 332 116 Z', fill: '#8cc8f2', stroke: '#5a9dc9', strokeWidth: 1.2 }));
      }
      if (expression === 'focused') {
        content.push(h('path', { key: 'focus-main', d: 'M 249 132 Q 270 137 292 130', fill: 'none', stroke: '#5d4d27', strokeWidth: 3.2, strokeLinecap: 'round' }));
        content.push(h('path', { key: 'focus-side', d: 'M 175 132 Q 188 126 202 132', fill: 'none', stroke: '#5d4d27', strokeWidth: 2.6, strokeLinecap: 'round' }));
        content.push(h('path', { key: 'focus-mark', d: 'M 344 118 L 354 128 M 354 118 L 344 128', fill: 'none', stroke: '#8a7c55', strokeWidth: 2.2, strokeLinecap: 'round', opacity: 0.55 }));
      }

      return h('svg', { ...ART_PROPS, className: 'naiwa-face' }, content);
    }

    function Accessory({ skin }) {
      if (skin === 'classic') return null;
      const defs = h('defs', { key: 'defs' },
        h('linearGradient', { id: 'naiwa-lens', x1: '0', y1: '0', x2: '0', y2: '1' },
          h('stop', { offset: '0%', stopColor: '#2d3037' }),
          h('stop', { offset: '100%', stopColor: '#080a0d' }),
        ),
        h('linearGradient', { id: 'naiwa-cap', x1: '0', y1: '0', x2: '0', y2: '1' },
          h('stop', { offset: '0%', stopColor: '#666bc9' }),
          h('stop', { offset: '100%', stopColor: '#33356f' }),
        ),
        h('linearGradient', { id: 'naiwa-wizard', x1: '0', y1: '0', x2: '0', y2: '1' },
          h('stop', { offset: '0%', stopColor: '#5b438f' }),
          h('stop', { offset: '100%', stopColor: '#33265c' }),
        ),
        h('linearGradient', { id: 'naiwa-hat-white', x1: '0', y1: '0', x2: '0', y2: '1' },
          h('stop', { offset: '0%', stopColor: '#fffdf7' }),
          h('stop', { offset: '100%', stopColor: '#eee6d4' }),
        ),
        h('linearGradient', { id: 'naiwa-gold', x1: '0', y1: '0', x2: '0', y2: '1' },
          h('stop', { offset: '0%', stopColor: '#f7d681' }),
          h('stop', { offset: '100%', stopColor: '#c9952f' }),
        ),
      );

      let art = [];
      if (skin === 'cool') {
        art = [
          h('g', { key: 'shades', transform: 'rotate(-7 277 152)' },
            h('rect', { x: 230, y: 118, width: 95, height: 63, rx: 30, fill: 'url(#naiwa-lens)', stroke: '#17140e', strokeWidth: 4 }),
            h('rect', { x: 158, y: 128, width: 58, height: 53, rx: 25, fill: 'url(#naiwa-lens)', stroke: '#17140e', strokeWidth: 4 }),
            h('path', { d: 'M 216 149 Q 223 145 230 147', fill: 'none', stroke: '#d4a747', strokeWidth: 5, strokeLinecap: 'round' }),
            h('path', { d: 'M 324 146 Q 350 142 367 158', fill: 'none', stroke: '#d4a747', strokeWidth: 4, strokeLinecap: 'round' }),
            h('path', { d: 'M 244 134 Q 260 128 276 134', fill: 'none', stroke: '#ffffff', strokeWidth: 5, strokeLinecap: 'round', opacity: 0.46 }),
            h('path', { d: 'M 168 142 Q 178 137 188 140', fill: 'none', stroke: '#ffffff', strokeWidth: 4, strokeLinecap: 'round', opacity: 0.38 }),
          ),
          h('path', { key: 'chain', d: 'M 224 300 Q 278 328 338 297', fill: 'none', stroke: 'url(#naiwa-gold)', strokeWidth: 3.4, strokeLinecap: 'round', strokeDasharray: '2 6', opacity: 0.9 }),
          h('circle', { key: 'pendant', cx: 282, cy: 325, r: 7, fill: 'url(#naiwa-gold)', stroke: '#9d6e1d', strokeWidth: 1.5 }),
        ];
      }
      if (skin === 'night') {
        art = [
          h('ellipse', { key: 'brim', cx: 284, cy: 102, rx: 105, ry: 27, fill: '#3d3f7d', transform: 'rotate(-4 284 102)' }),
          h('path', { key: 'cap', d: 'M 192 99 Q 205 39 280 19 Q 350 4 371 54 Q 381 84 334 97 Q 311 104 301 109 Z', fill: 'url(#naiwa-cap)' }),
          h('path', { key: 'tail', d: 'M 348 34 Q 392 24 406 53 Q 414 74 393 84 Q 378 90 367 82 Q 382 73 380 61 Q 376 45 348 34 Z', fill: 'url(#naiwa-cap)' }),
          h('path', { key: 'trim', d: 'M 194 95 Q 284 119 377 91', fill: 'none', stroke: '#fff6df', strokeWidth: 16, strokeLinecap: 'round' }),
          h('circle', { key: 'pom', cx: 393, cy: 84, r: 16, fill: '#fff6df' }),
          h('circle', { key: 'pom-shade', cx: 399, cy: 90, r: 8, fill: '#e8ddc5', opacity: 0.7 }),
          h('path', { key: 'star-a', d: 'M 242 55 l 4 9 9 4 -9 4 -4 9 -4 -9 -9 -4 9 -4 Z', fill: '#f6d886', opacity: 0.9 }),
          h('path', { key: 'star-b', d: 'M 318 43 l 3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z', fill: '#f6d886', opacity: 0.8 }),
        ];
      }
      if (skin === 'scholar') {
        art = [
          h('g', { key: 'glasses' },
            h('circle', { cx: 277, cy: 152, r: 45, fill: '#cfe5ff', fillOpacity: 0.13, stroke: '#4a3820', strokeWidth: 3.4 }),
            h('circle', { cx: 191, cy: 156, r: 33, fill: '#cfe5ff', fillOpacity: 0.13, stroke: '#4a3820', strokeWidth: 3.2 }),
            h('path', { d: 'M 232 150 Q 238 147 245 150', fill: 'none', stroke: '#4a3820', strokeWidth: 3.2 }),
            h('path', { d: 'M 322 147 Q 340 143 357 142', fill: 'none', stroke: '#4a3820', strokeWidth: 2.8 }),
            h('path', { d: 'M 258 132 Q 269 127 280 132', fill: 'none', stroke: '#ffffff', strokeWidth: 3, strokeLinecap: 'round', opacity: 0.65 }),
            h('path', { d: 'M 177 145 Q 183 140 190 143', fill: 'none', stroke: '#ffffff', strokeWidth: 2.4, strokeLinecap: 'round', opacity: 0.55 }),
          ),
          h('g', { key: 'book', transform: 'rotate(-3 320 786)' },
            h('path', { d: 'M 202 766 Q 264 742 319 763 L 319 866 Q 264 845 202 868 Z', fill: '#fff7e0', stroke: '#a77a32', strokeWidth: 3 }),
            h('path', { d: 'M 319 763 Q 374 742 438 766 L 438 868 Q 374 845 319 866 Z', fill: '#fffbef', stroke: '#a77a32', strokeWidth: 3 }),
            h('path', { d: 'M 319 763 L 319 866', fill: 'none', stroke: '#a77a32', strokeWidth: 3 }),
            h('path', { d: 'M 220 788 Q 262 773 301 787 M 220 810 Q 262 795 301 809 M 220 832 Q 262 817 301 831', fill: 'none', stroke: '#cfb17a', strokeWidth: 2.4, strokeLinecap: 'round' }),
            h('path', { d: 'M 338 787 Q 376 773 419 788 M 338 809 Q 376 795 419 810 M 338 831 Q 376 817 419 832', fill: 'none', stroke: '#cfb17a', strokeWidth: 2.4, strokeLinecap: 'round' }),
            h('path', { d: 'M 313 748 L 313 806 L 326 796 L 339 806 L 339 748 Z', fill: '#d9544d', opacity: 0.95 }),
          ),
        ];
      }
      if (skin === 'chef') {
        art = [
          h('g', { key: 'hat' },
            h('circle', { cx: 239, cy: 67, r: 42, fill: 'url(#naiwa-hat-white)' }),
            h('circle', { cx: 292, cy: 52, r: 50, fill: 'url(#naiwa-hat-white)' }),
            h('circle', { cx: 347, cy: 68, r: 40, fill: 'url(#naiwa-hat-white)' }),
            h('circle', { cx: 296, cy: 90, r: 45, fill: 'url(#naiwa-hat-white)' }),
            h('rect', { x: 220, y: 92, width: 154, height: 31, rx: 12, fill: '#fffdf7', stroke: '#ded3bd', strokeWidth: 2 }),
            h('path', { d: 'M 254 100 L 254 118 M 292 100 L 292 118 M 330 100 L 330 118', stroke: '#e4dac6', strokeWidth: 2.4, strokeLinecap: 'round' }),
            h('path', { d: 'M 208 67 Q 219 43 239 42 M 337 43 Q 364 48 371 72', fill: 'none', stroke: '#ffffff', strokeWidth: 3, strokeLinecap: 'round', opacity: 0.65 }),
          ),
          h('path', { key: 'scarf', d: 'M 221 299 Q 300 330 379 297 L 371 327 Q 300 358 229 327 Z', fill: '#d9534f' }),
          h('circle', { key: 'knot', cx: 300, cy: 326, r: 11, fill: '#c74642' }),
          h('path', { key: 'tail-a', d: 'M 296 335 Q 287 352 277 361 L 291 365 Q 302 350 305 336 Z', fill: '#c74642' }),
          h('path', { key: 'tail-b', d: 'M 305 335 Q 316 351 327 358 L 313 364 Q 302 350 299 336 Z', fill: '#b93e3a' }),
        ];
      }
      if (skin === 'wizard') {
        art = [
          h('ellipse', { key: 'brim', cx: 285, cy: 112, rx: 106, ry: 25, fill: '#3b2b69', transform: 'rotate(-3 285 112)' }),
          h('path', { key: 'hat', d: 'M 205 108 Q 240 51 290 6 Q 336 51 366 108 Z', fill: 'url(#naiwa-wizard)' }),
          h('path', { key: 'band', d: 'M 209 98 Q 285 118 362 98 L 359 112 Q 285 132 212 112 Z', fill: 'url(#naiwa-gold)' }),
          h('path', { key: 'tip', d: 'M 288 8 Q 316 -1 326 17 Q 335 34 320 39 Q 331 25 318 17 Q 306 10 288 8 Z', fill: '#4a367d' }),
          h('path', { key: 'star-a', d: 'M 256 62 l 4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4 Z', fill: '#f6d886' }),
          h('path', { key: 'star-b', d: 'M 318 76 l 3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z', fill: '#f6d886', opacity: 0.8 }),
          h('path', { key: 'spark-a', d: 'M 176 68 l 2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z', fill: '#f6d886', opacity: 0.85 }),
          h('path', { key: 'spark-b', d: 'M 391 54 l 2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z', fill: '#f6d886', opacity: 0.7 }),
        ];
      }

      return h('svg', { ...ART_PROPS, className: 'naiwa-accessory' }, [defs, ...art]);
    }

    function SkinGlyph({ skin }) {
      const props = {
        width: 21,
        height: 21,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': 'true',
        focusable: 'false',
      };
      if (skin === 'classic') {
        return h('svg', props,
          h('path', { d: 'M4.5 13.2c0-4.2 3.3-7.2 7.5-7.2s7.5 3 7.5 7.2c0 3.2-2.7 5.3-7.5 5.3s-7.5-2.1-7.5-5.3Z' }),
          h('circle', { cx: 9.2, cy: 11.2, r: 1.15, fill: 'currentColor', stroke: 'none' }),
          h('circle', { cx: 14.8, cy: 10.8, r: 1.15, fill: 'currentColor', stroke: 'none' }),
          h('path', { d: 'M10.2 15.2h3.6' }),
        );
      }
      if (skin === 'cool') {
        return h('svg', props,
          h('rect', { x: 3, y: 8, width: 8, height: 6, rx: 2.6 }),
          h('rect', { x: 13, y: 8, width: 8, height: 6, rx: 2.6 }),
          h('path', { d: 'M11 10.5h2M3 9.4 1.8 8.2M21 9.4l1.2-1.2' }),
        );
      }
      if (skin === 'night') {
        return h('svg', props,
          h('path', { d: 'M4 13.4c1.1-5 4.3-8 8.4-8 2.8 0 4.8 1.5 4.2 3.6-.5 1.8-3.2 2.1-5 1.4 1.3 2.2 3.3 3.5 5.7 3.7' }),
          h('path', { d: 'M4.4 13.4c4.2 2.2 11.1 2.3 15.2 0' }),
          h('circle', { cx: 18.2, cy: 6.2, r: 2.1 }),
        );
      }
      if (skin === 'scholar') {
        return h('svg', props,
          h('path', { d: 'M3 6.5c2.4-1.1 5.1-1.1 7.5 0v12c-2.4-1.1-5.1-1.1-7.5 0Z' }),
          h('path', { d: 'M21 6.5c-2.4-1.1-5.1-1.1-7.5 0v12c2.4-1.1 5.1-1.1 7.5 0Z' }),
          h('path', { d: 'M10.5 6.5v12' }),
        );
      }
      if (skin === 'chef') {
        return h('svg', props,
          h('path', { d: 'M5.5 12.5c-2.2-.8-2.6-3.8-.5-4.9.4-2.9 4-4.2 6.2-2.2 2.4-2.1 6.2-.5 6.2 2.4 2.2.8 2.1 3.9-.1 4.7Z' }),
          h('path', { d: 'M5.5 12.5v5.8h13v-5.8M9 15.2v3.1M15 15.2v3.1' }),
        );
      }
      return h('svg', props,
        h('path', { d: 'M3.5 12.4 12 3l8.5 9.4Z' }),
        h('path', { d: 'M12 3c1.8 2.5 2.4 5.2 1.8 8.2' }),
        h('path', { d: 'M18.7 9.3l.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7Z' }),
        h('path', { d: 'M4.2 15.2h15.6' }),
      );
    }

    function CloseGlyph() {
      return h('svg', { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', 'aria-hidden': 'true' },
        h('path', { d: 'M6 6l12 12M18 6 6 18' }));
    }

    function CookieGlyph() {
      return h('svg', { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', 'aria-hidden': 'true' },
        h('path', { d: 'M20.3 12.4A8.4 8.4 0 1 1 11.6 3.6a3.3 3.3 0 0 0 4.4 4.3 3.3 3.3 0 0 0 4.3 4.5Z' }),
        h('circle', { cx: 9, cy: 11, r: 1, fill: 'currentColor', stroke: 'none' }),
        h('circle', { cx: 12.5, cy: 15, r: 1, fill: 'currentColor', stroke: 'none' }),
        h('circle', { cx: 7.5, cy: 15.5, r: 0.9, fill: 'currentColor', stroke: 'none' }));
    }

    function ToggleRow({ label, checked, onClick }) {
      return h('div', { className: 'naiwa-toggle' },
        h('span', null, label),
        h('button', {
          className: 'naiwa-switch',
          type: 'button',
          role: 'switch',
          'aria-checked': checked ? 'true' : 'false',
          'aria-label': label,
          onClick,
        }));
    }

    /* ------------------------------------------------------------------ */
    /* Pet                                                                 */
    /* ------------------------------------------------------------------ */

    function PetView({ locale, signals }) {
      const lang = useLanguage(locale);
      const t = useMemo(() => makeT(lang), [lang]);
      const [prefs, setPrefs] = useState(readPrefs);
      const [pos, setPos] = useState(() => {
        const height = SIZES[prefs.size];
        const width = widthFor(height);
        const start = prefs.x != null && prefs.y != null
          ? { x: prefs.x, y: prefs.y }
          : defaultPos(height, width);
        return clampPos(start, height, width, window.innerWidth, window.innerHeight);
      });
      const posRef = useRef(pos);
      const [viewport, setViewport] = useState({ w: window.innerWidth, h: window.innerHeight });
      const [menu, setMenu] = useState(false);
      const [panelPos, setPanelPos] = useState(null);
      const [sessionMood, setSessionMood] = useState('idle');
      const [interaction, setInteraction] = useState(null);
      const [celebrating, setCelebrating] = useState(false);
      const [sleeping, setSleeping] = useState(false);
      const [notice, setNotice] = useState(null);
      const [hover, setHover] = useState(false);
      const [greeting, setGreeting] = useState(true);
      const [blink, setBlink] = useState(false);
      const [burst, setBurst] = useState(null);
      const [dragging, setDragging] = useState(false);
      const [reduced, setReduced] = useState(false);
      const [pageHidden, setPageHidden] = useState(false);

      const petRef = useRef(null);
      const panelRef = useRef(null);
      const artRef = useRef(null);
      const dragRef = useRef(null);
      const timers = useRef(new Map());
      const lastActivity = useRef(Date.now());

      const height = SIZES[prefs.size];
      const width = widthFor(height);
      const motion = prefs.motion && !reduced && !pageHidden;
      const mood = interaction
        || (celebrating ? 'celebrate' : sessionMood !== 'idle' ? sessionMood : sleeping ? 'sleeping' : 'idle');
      const face = (() => {
        if (mood === 'sleeping') return 'sleep';
        if (mood === 'celebrate' || mood === 'happy') return 'happy';
        if (mood === 'eating') return 'eating';
        if (mood === 'waiting') return 'worried';
        if (mood === 'working') return 'focused';
        if (blink) return 'blink';
        return 'neutral';
      })();
      const badge = mood === 'working' ? 'working'
        : mood === 'waiting' ? 'waiting'
          : mood === 'celebrate' ? 'done'
            : mood === 'sleeping' ? 'sleep' : null;
      const bubbleKey = BUBBLE_KEY[mood] || BUBBLE_KEY.idle;
      const statusLabel = t(bubbleKey);
      const bubbleText = notice
        ? t(notice)
        : greeting && mood === 'idle' ? t('status.greeting') : statusLabel;
      const showBubble = !prefs.hidden && !menu && (mood !== 'idle' || hover || greeting || Boolean(notice));
      const bubbleSide = pos.x < 250 ? 'right' : 'left';
      const particles = useMemo(() => (burst ? makeParticles(burst.kind) : []), [burst]);
      const ariaLabel = t('aria.pet', { status: statusLabel });

      const save = useCallback(patch => {
        setPrefs(previous => {
          const next = { ...previous, ...patch };
          writePrefs(next);
          return next;
        });
      }, []);

      const applyPosition = useCallback((next, commit) => {
        posRef.current = next;
        const node = petRef.current;
        if (node) {
          node.style.left = `${next.x}px`;
          node.style.top = `${next.y}px`;
        }
        if (commit) setPos(next);
      }, []);

      function later(key, callback, delay) {
        const previous = timers.current.get(key);
        if (previous) clearTimeout(previous);
        const id = setTimeout(() => {
          timers.current.delete(key);
          callback();
        }, delay);
        timers.current.set(key, id);
      }

      function clearLater(key) {
        const id = timers.current.get(key);
        if (id) {
          clearTimeout(id);
          timers.current.delete(key);
        }
      }

      function fireBurst(kind) {
        setBurst({ kind, id: `${Date.now()}-${Math.random()}` });
        later('burst', () => setBurst(null), 1900);
      }

      function showNotice(key, delay = 3000) {
        setNotice(key);
        later('notice', () => setNotice(null), delay);
      }

      function interact(kind, delay) {
        setSleeping(false);
        setInteraction(kind);
        lastActivity.current = Date.now();
        later('interaction', () => setInteraction(null), delay);
      }

      function poke() {
        const wasSleeping = mood === 'sleeping';
        interact('happy', 2400);
        fireBurst('hearts');
        if (wasSleeping) showNotice('status.wake', 2800);
        else setNotice(null);
      }

      function feed() {
        closeMenu();
        interact('eating', 3400);
        fireBurst('food');
        setNotice(null);
      }

      function chooseSkin(skin) {
        save({ skin });
        showNotice(NOTE_KEY[skin], 3000);
        interact('happy', 1600);
        fireBurst('hearts');
      }

      function chooseSize(size) {
        save({ size });
      }

      function resetPosition() {
        const next = defaultPos(height, width);
        applyPosition(next, true);
        save({ x: null, y: null });
        lastActivity.current = Date.now();
      }

      function hidePet() {
        setMenu(false);
        setPanelPos(null);
        setHover(false);
        save({ hidden: true });
      }

      function restorePet() {
        save({ hidden: false });
        setGreeting(true);
        later('greeting', () => setGreeting(false), 7000);
        later('restore', () => {
          interact('happy', 1800);
          fireBurst('hearts');
        }, 80);
      }

      function openMenu() {
        setMenu(true);
        setPanelPos(null);
        lastActivity.current = Date.now();
      }

      function closeMenu() {
        setMenu(false);
        setPanelPos(null);
      }

      function nudge(dx, dy) {
        const next = clampPos({
          x: posRef.current.x + dx,
          y: posRef.current.y + dy,
        }, height, width, viewport.w, viewport.h);
        applyPosition(next, true);
        save({ x: next.x, y: next.y });
        lastActivity.current = Date.now();
        setSleeping(false);
      }

      function onPointerDown(event) {
        if (event.button !== 0 || event.ctrlKey) return;
        if (menu) closeMenu();
        event.preventDefault();
        try { event.currentTarget.focus({ preventScroll: true }); } catch { /* focus is optional */ }
        dragRef.current = {
          id: event.pointerId,
          sx: event.clientX,
          sy: event.clientY,
          x: posRef.current.x,
          y: posRef.current.y,
          moved: false,
        };
        try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* older browser */ }
        lastActivity.current = Date.now();
      }

      function onPointerMove(event) {
        const drag = dragRef.current;
        if (!drag || drag.id !== event.pointerId) return;
        const dx = event.clientX - drag.sx;
        const dy = event.clientY - drag.sy;
        if (!drag.moved && Math.hypot(dx, dy) > 5) {
          drag.moved = true;
          setDragging(true);
          setInteraction(null);
          clearLater('interaction');
          setSleeping(false);
        }
        if (!drag.moved) return;
        event.preventDefault();
        const next = clampPos({ x: drag.x + dx, y: drag.y + dy }, height, width, viewport.w, viewport.h);
        applyPosition(next, true);
        lastActivity.current = Date.now();
      }

      function finishDrag(event, cancelled) {
        const drag = dragRef.current;
        if (!drag || drag.id !== event.pointerId) return;
        dragRef.current = null;
        try { event.currentTarget.releasePointerCapture(event.pointerId); } catch { /* already released */ }
        if (!drag.moved) {
          if (!cancelled) poke();
          return;
        }
        const next = posRef.current;
        setDragging(false);
        setPos(next);
        save({ x: next.x, y: next.y });
      }

      function onLostPointerCapture() {
        const drag = dragRef.current;
        if (!drag) return;
        dragRef.current = null;
        const next = posRef.current;
        setDragging(false);
        setPos(next);
        if (drag.moved) save({ x: next.x, y: next.y });
      }

      function onKeyDown(event) {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
          event.preventDefault();
          poke();
          return;
        }
        if (event.key === 'ContextMenu' || (event.shiftKey && event.key === 'F10')) {
          event.preventDefault();
          openMenu();
          return;
        }
        const step = event.shiftKey ? 24 : 8;
        const dx = event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0;
        const dy = event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0;
        if (dx || dy) {
          event.preventDefault();
          nudge(dx, dy);
        }
      }

      function onContextMenu(event) {
        event.preventDefault();
        event.stopPropagation();
        if (menu) closeMenu();
        else openMenu();
      }

      useEffect(() => () => {
        for (const id of timers.current.values()) clearTimeout(id);
        timers.current.clear();
      }, []);

      useEffect(() => {
        const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
      }, []);

      useEffect(() => {
        const next = clampPos(posRef.current, height, width, viewport.w, viewport.h);
        if (next.x !== posRef.current.x || next.y !== posRef.current.y) {
          applyPosition(next, true);
          save({ x: next.x, y: next.y });
        }
      }, [height, width, viewport.w, viewport.h, applyPosition, save]);

      useEffect(() => {
        try {
          const media = window.matchMedia('(prefers-reduced-motion: reduce)');
          const update = () => setReduced(media.matches);
          update();
          media.addEventListener?.('change', update);
          return () => media.removeEventListener?.('change', update);
        } catch { return undefined; }
      }, []);

      useEffect(() => {
        const update = () => setPageHidden(Boolean(document.hidden));
        document.addEventListener('visibilitychange', update);
        update();
        return () => document.removeEventListener('visibilitychange', update);
      }, []);

      useEffect(() => {
        later('greeting', () => setGreeting(false), 9000);
        return () => clearLater('greeting');
        // This timer is owned by the mount, not by later preference changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const prevRunning = useRef(Boolean(signals.running));
      useEffect(() => {
        const previous = prevRunning.current;
        prevRunning.current = Boolean(signals.running);
        if (signals.pending) {
          setSessionMood('waiting');
          setCelebrating(false);
          setSleeping(false);
          lastActivity.current = Date.now();
          return;
        }
        if (signals.running) {
          setSessionMood('working');
          setCelebrating(false);
          setSleeping(false);
          lastActivity.current = Date.now();
          return;
        }
        setSessionMood('idle');
        lastActivity.current = Date.now();
        if (previous) {
          setCelebrating(true);
          setNotice(null);
          fireBurst('confetti');
          later('celebrate', () => setCelebrating(false), 4800);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [signals.running, signals.pending]);

      useEffect(() => {
        if (!prefs.nap) {
          setSleeping(false);
          return undefined;
        }
        const id = window.setInterval(() => {
          if (document.hidden) return;
          const quiet = !signals.running && !signals.pending && !interaction && !celebrating && !menu;
          if (quiet && Date.now() - lastActivity.current > 120000) setSleeping(true);
        }, 5000);
        return () => window.clearInterval(id);
      }, [prefs.nap, signals.running, signals.pending, interaction, celebrating, menu]);

      useEffect(() => {
        if (!motion || mood === 'sleeping' || menu) {
          setBlink(false);
          return undefined;
        }
        let alive = true;
        let timer = 0;
        const schedule = () => {
          timer = window.setTimeout(() => {
            if (!alive) return;
            setBlink(true);
            timer = window.setTimeout(() => {
              if (!alive) return;
              setBlink(false);
              schedule();
            }, 150);
          }, 3200 + Math.random() * 4200);
        };
        schedule();
        return () => {
          alive = false;
          window.clearTimeout(timer);
        };
      }, [motion, mood, menu]);

      useEffect(() => {
        const node = artRef.current;
        if (!node || !motion || mood === 'sleeping' || prefs.hidden) return undefined;
        let frame = 0;
        let last = 0;
        const onMove = event => {
          const now = performance.now();
          if (now - last < 80) return;
          last = now;
          if (frame) cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => {
            frame = 0;
            const rect = node.getBoundingClientRect();
            if (!rect.width) return;
            const dx = event.clientX - (rect.left + rect.width / 2);
            const look = Math.max(-1, Math.min(1, dx / Math.max(240, window.innerWidth * 0.45)));
            node.style.setProperty('--look', look.toFixed(3));
          });
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => {
          window.removeEventListener('pointermove', onMove);
          if (frame) cancelAnimationFrame(frame);
          node.style.setProperty('--look', '0');
        };
      }, [motion, mood, prefs.hidden]);

      useLayoutEffect(() => {
        if (!menu) return;
        const panel = panelRef.current;
        const pet = petRef.current;
        if (!panel || !pet) return;
        const rect = pet.getBoundingClientRect();
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;
        let left = rect.left - panelWidth - 12;
        if (left < 12) {
          left = Math.min(viewport.w - panelWidth - 12, rect.left + rect.width / 2 - panelWidth / 2);
        }
        left = Math.max(12, Math.min(left, viewport.w - panelWidth - 12));
        const top = Math.max(12, Math.min(rect.bottom - panelHeight, viewport.h - panelHeight - 12));
        setPanelPos({ left, top });
      }, [menu, pos.x, pos.y, viewport.w, viewport.h, prefs.size]);

      useEffect(() => {
        if (!menu || !panelPos) return;
        const close = panelRef.current?.querySelector('.naiwa-close');
        try { close?.focus({ preventScroll: true }); } catch { /* focus is optional */ }
      }, [menu, panelPos]);

      useEffect(() => {
        if (!menu) return undefined;
        const onDown = event => {
          const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
          if (path.includes(panelRef.current) || path.includes(petRef.current)) return;
          closeMenu();
        };
        document.addEventListener('pointerdown', onDown, true);
        return () => document.removeEventListener('pointerdown', onDown, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [menu]);

      useEffect(() => {
        if (!menu) return undefined;
        const onKey = event => {
          if (event.key !== 'Escape') return;
          event.preventDefault();
          event.stopPropagation();
          closeMenu();
          const hit = petRef.current?.querySelector('.naiwa-hit');
          try { hit?.focus({ preventScroll: true }); } catch { /* focus is optional */ }
        };
        document.addEventListener('keydown', onKey, true);
        return () => document.removeEventListener('keydown', onKey, true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [menu]);

      useEffect(() => {
        const onStorage = event => {
          if (event.key !== STORAGE_KEY && event.key !== null) return;
          setPrefs(readPrefs());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
      }, []);

      const panelStyle = panelPos
        ? { left: `${panelPos.left}px`, top: `${panelPos.top}px`, visibility: 'visible' }
        : { left: '0px', top: '0px', visibility: 'hidden' };
      const rootStyle = { '--naiwa-avatar': `url("${ASSET}")` };

      const skinButtons = SKINS.map(skin => h('button', {
        key: skin,
        className: 'naiwa-skin',
        type: 'button',
        'aria-pressed': prefs.skin === skin ? 'true' : 'false',
        title: t(SKIN_LABEL[skin]),
        onClick: () => chooseSkin(skin),
      },
      h(SkinGlyph, { skin }),
      h('span', null, t(SKIN_LABEL[skin]))));

      const sizeButtons = ['s', 'm', 'l'].map(size => h('button', {
        key: size,
        type: 'button',
        'aria-pressed': prefs.size === size ? 'true' : 'false',
        onClick: () => chooseSize(size),
      }, t(SIZE_LABEL[size])));

      const particleNodes = particles.map((particle, index) => h('span', {
        key: `${burst?.id || 'burst'}-${index}`,
        className: 'naiwa-particle',
        'data-kind': particle.kind,
        style: {
          '--x': `${particle.x}px`,
          '--delay': `${particle.delay}s`,
          '--drift': `${particle.drift}px`,
          '--rot': `${particle.rot}deg`,
          '--c': particle.color || 'var(--naiwa-warm)',
        },
      }, particle.kind === 'heart' ? '♥' : particle.kind === 'spark' ? '✦' : null));

      const petNode = h('div', {
        key: 'pet',
        ref: petRef,
        className: 'naiwa-pet',
        style: { left: `${pos.x}px`, top: `${pos.y}px`, width: `${width}px`, height: `${height}px` },
        'data-mood': mood,
        'data-dragging': dragging ? 'true' : 'false',
      },
      h('div', { className: 'naiwa-shadow', 'aria-hidden': 'true' }),
      h('div', { className: 'naiwa-stage' },
        h('div', { className: 'naiwa-breathe' },
          h('span', { className: 'naiwa-tilt', ref: artRef },
            h('div', { className: 'naiwa-art' },
              h('img', { src: ASSET, alt: '', draggable: false }),
              h(FaceOverlay, { expression: face }),
              h(Accessory, { skin: prefs.skin }))))),
      h('div', {
        className: 'naiwa-bubble',
        'data-show': showBubble ? 'true' : 'false',
        'data-side': bubbleSide,
        'data-mood': mood,
        role: 'status',
        'aria-live': 'polite',
      },
      h('div', { className: 'naiwa-bubble-inner' },
        h('span', { className: 'naiwa-bubble-dot', 'aria-hidden': 'true' }),
        h('span', null,
          bubbleText,
          mood === 'working'
            ? h('span', { className: 'naiwa-dots', 'aria-hidden': 'true' }, h('i'), h('i'), h('i'))
            : null))),
      badge
        ? h('div', { className: 'naiwa-badge', 'data-kind': badge, 'aria-hidden': 'true' },
          badge === 'working'
            ? h('span', { className: 'naiwa-typing' }, h('i'), h('i'), h('i'))
            : badge === 'waiting' ? '!' : badge === 'done' ? '✓' : '☾')
        : null,
      mood === 'sleeping'
        ? h('div', { className: 'naiwa-zzz', 'aria-hidden': 'true' }, h('span', null, 'z'), h('span', null, 'z'), h('span', null, 'z'))
        : null,
      h('div', { className: 'naiwa-burst', 'aria-hidden': 'true' }, particleNodes),
      h('button', {
        className: 'naiwa-hit',
        type: 'button',
        'aria-label': ariaLabel,
        'aria-haspopup': 'dialog',
        'aria-expanded': menu ? 'true' : 'false',
        'aria-keyshortcuts': 'Enter Space ArrowUp ArrowDown ArrowLeft ArrowRight',
        onPointerDown,
        onPointerMove,
        onPointerUp: event => finishDrag(event, false),
        onPointerCancel: event => finishDrag(event, true),
        onLostPointerCapture,
        onKeyDown,
        onContextMenu,
        onPointerEnter: () => {
          setHover(true);
          lastActivity.current = Date.now();
        },
        onPointerLeave: () => setHover(false),
      }));

      const menuNode = menu
        ? h('section', {
          key: 'menu',
          ref: panelRef,
          className: 'naiwa-panel',
          role: 'dialog',
          'aria-label': t('menu.title'),
          style: panelStyle,
          onContextMenu: event => event.preventDefault(),
        },
        h('header', { className: 'naiwa-head' },
          h('div', { className: 'naiwa-avatar', 'aria-hidden': 'true' }),
          h('div', { className: 'naiwa-head-text' },
            h('div', { className: 'naiwa-title' }, t('menu.title')),
            h('div', { className: 'naiwa-subtitle' }, t('menu.subtitle'))),
          h('button', { className: 'naiwa-close', type: 'button', onClick: closeMenu, 'aria-label': t('menu.close') },
            h(CloseGlyph))),
        h('div', { className: 'naiwa-now', 'data-mood': mood },
          h('span', { className: 'naiwa-now-dot', 'aria-hidden': 'true' }),
          h('span', null, `${t('menu.now')} · ${statusLabel}`)),
        h('div', { className: 'naiwa-section' },
          h('div', { className: 'naiwa-label' }, t('menu.skin')),
          h('div', { className: 'naiwa-skins' }, skinButtons)),
        h('div', { className: 'naiwa-section' },
          h('div', { className: 'naiwa-label' }, t('menu.size')),
          h('div', { className: 'naiwa-seg', role: 'group', 'aria-label': t('menu.size') }, sizeButtons)),
        h('div', { className: 'naiwa-section naiwa-toggles' },
          h(ToggleRow, { label: t('menu.motion'), checked: prefs.motion, onClick: () => save({ motion: !prefs.motion }) }),
          h(ToggleRow, { label: t('menu.nap'), checked: prefs.nap, onClick: () => save({ nap: !prefs.nap }) })),
        h('div', { className: 'naiwa-section' },
          h('button', { className: 'naiwa-feed', type: 'button', onClick: feed },
            h(CookieGlyph),
            t('menu.feed')),
          h('div', { className: 'naiwa-links' },
            h('button', { className: 'naiwa-link', type: 'button', onClick: resetPosition }, t('menu.reset')),
            h('button', { className: 'naiwa-link', type: 'button', onClick: hidePet }, t('menu.hide')))))
        : null;

      const restoreNode = h('button', {
        className: 'naiwa-restore',
        type: 'button',
        onClick: restorePet,
        'aria-label': t('restore.aria'),
      },
      h('span', { className: 'naiwa-restore-avatar', 'aria-hidden': 'true' }),
      h('span', null, t('restore')),
      signals.running ? h('span', { className: 'naiwa-restore-dot', 'aria-hidden': 'true' }) : null);

      return h('div', {
        className: 'naiwa-root',
        style: rootStyle,
        'data-motion': motion ? 'true' : 'false',
      },
      h('style', null, CSS),
      prefs.hidden ? restoreNode : h(React.Fragment, null, petNode, menuNode));
    }

    function ConnectedPet({ locale, useSessionStatus, ...rest }) {
      const statuses = useSessionStatus(map => map);
      const signals = useMemo(() => summarize(statuses), [statuses]);
      return h(PetView, { ...rest, locale, signals });
    }

    function PlainPet({ locale, ...rest }) {
      return h(PetView, { ...rest, locale, signals: { running: false, pending: false, count: 0 } });
    }

    class PetBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { failed: false };
      }
      static getDerivedStateFromError() {
        return { failed: true };
      }
      render() {
        return this.state.failed ? this.props.fallback : this.props.children;
      }
    }

    function PetRoot(props) {
      const connected = typeof props.useSessionStatus === 'function';
      const content = connected
        ? h(ConnectedPet, props)
        : h(PlainPet, props);
      // If a future session-status contract changes shape, keep the pet usable
      // as a plain companion instead of blanking the overlay entry.
      return h(PetBoundary, { fallback: h(PlainPet, props) }, content);
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        const Entry = props => h(PetRoot, { ...props, locale: ctx.locale });
        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'naiwa-pet',
          order: 88,
        }, Entry));
      },
    };
  },
});
