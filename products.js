// Shared product data layer - used by index.html and admin.html
// Products are persisted in localStorage so the admin dashboard can manage them.
var PRODUCTS_KEY = 'pc_parts_products_v2';

var DEFAULT_PRODUCTS = [
{id:1,name:"Tai nghe Bluetooth Sony WH-1000XM4",title:"Chống ồn chủ động, pin 30 giờ",price:5990000,discountPrice:4990000,type:"dien-tu",brand:"sony",imageUrl:"https://picsum.photos/seed/pck101/500/500",rating:4.8,inStock:true},
{id:2,name:"Bàn phím cơ Logitech G Pro",title:"Switch tactile, đèn RGB",price:2490000,type:"dien-tu",brand:"logitech",imageUrl:"https://picsum.photos/seed/pck102/500/500",rating:4.7,inStock:true},
{id:3,name:"Chuột gaming Razer DeathAdder",title:"6400 DPI, siêu nhẹ 69g",price:1290000,discountPrice:990000,type:"dien-tu",brand:"razer",imageUrl:"https://picsum.photos/seed/pck103/500/500",rating:4.6,inStock:true},
{id:4,name:"Loa Bluetooth JBL Flip 6",title:"Chống nước IP67, pin 12 giờ",price:2990000,type:"dien-tu",brand:"jbl",imageUrl:"https://picsum.photos/seed/pck104/500/500",rating:4.7,inStock:true},
{id:5,name:"Sạc dự phòng Anker 20000mAh",title:"Sạc nhanh 22.5W, 2 cổng",price:890000,type:"dien-tu",brand:"anker",imageUrl:"https://picsum.photos/seed/pck105/500/500",rating:4.6,inStock:true},
{id:6,name:"Đồng hồ thông minh Apple Watch SE",title:"GPS, đo nhịp tim, chống nước",price:5990000,discountPrice:5490000,type:"dien-tu",brand:"apple",imageUrl:"https://picsum.photos/seed/pck106/500/500",rating:4.8,inStock:true},
{id:7,name:"Serum Vitamin C La Roche",title:"Sáng da, mờ thâm, 30ml",price:620000,type:"my-pham",brand:"laroche",imageUrl:"https://picsum.photos/seed/pck107/500/500",rating:4.7,inStock:true},
{id:8,name:"Kem dưỡng ẩm CeraVe",title:"Cho da khô, hũ 454g",price:450000,discountPrice:389000,type:"my-pham",brand:"cerave",imageUrl:"https://picsum.photos/seed/pck108/500/500",rating:4.8,inStock:true},
{id:9,name:"Sữa rửa mặt Innisfree Green Tea",title:"Làm sạch dịu nhẹ, 150ml",price:280000,type:"my-pham",brand:"innisfree",imageUrl:"https://picsum.photos/seed/pck109/500/500",rating:4.6,inStock:true},
{id:10,name:"Kem chống nắng L'Oreal SPF50",title:"Kiềm dầu, không nhờn rít, 50ml",price:350000,type:"my-pham",brand:"loreal",imageUrl:"https://picsum.photos/seed/pck110/500/500",rating:4.5,inStock:true},
{id:11,name:"Mặt nạ đất sét Kiehl's",title:"Se khít lỗ chân lông, 125ml",price:890000,type:"my-pham",brand:"kiehls",imageUrl:"https://picsum.photos/seed/pck111/500/500",rating:4.7,inStock:true},
{id:12,name:"Nồi chiên không dầu Philips 6.2L",title:"Chiên nướng không dầu mỡ",price:3290000,discountPrice:2790000,type:"gia-dung",brand:"philips",imageUrl:"https://picsum.photos/seed/pck112/500/500",rating:4.8,inStock:true},
{id:13,name:"Máy xay sinh tố Panasonic",title:"Cối thủy tinh 1.5L, 400W",price:1190000,type:"gia-dung",brand:"panasonic",imageUrl:"https://picsum.photos/seed/pck113/500/500",rating:4.5,inStock:true},
{id:14,name:"Robot hút bụi Xiaomi",title:"Lực hút 4000Pa, lau nhà",price:4990000,type:"gia-dung",brand:"xiaomi",imageUrl:"https://picsum.photos/seed/pck114/500/500",rating:4.6,inStock:true},
{id:15,name:"Áo thun cotton basic",title:"100% cotton, nhiều màu",price:199000,type:"thoi-trang",brand:"pck",imageUrl:"https://picsum.photos/seed/pck115/500/500",rating:4.4,inStock:true},
{id:16,name:"Giày sneaker thể thao",title:"Đế êm, thoáng khí",price:799000,discountPrice:649000,type:"thoi-trang",brand:"pck",imageUrl:"https://picsum.photos/seed/pck116/500/500",rating:4.6,inStock:true}
];

var TYPE_NAMES = {
  'dien-tu': 'Đồ điện tử',
  'my-pham': 'Mỹ phẩm',
  'gia-dung': 'Gia dụng',
  'thoi-trang': 'Thời trang'
};

var BRAND_NAMES = {sony:'Sony',logitech:'Logitech',razer:'Razer',jbl:'JBL',anker:'Anker',apple:'Apple',laroche:'La Roche',cerave:'CeraVe',innisfree:'Innisfree',loreal:"L'Oreal",kiehls:"Kiehl's",philips:'Philips',panasonic:'Panasonic',xiaomi:'Xiaomi',pck:'PCKongKun',asus:'ASUS',lg:'LG',samsung:'Samsung',dell:'Dell',msi:'MSI',gigabyte:'Gigabyte',lenovo:'Lenovo',hp:'HP',acer:'Acer',rog:'ROG',corsair:'Corsair',hyperx:'HyperX'};

function getTypeName(type) {
  if (!type) return '';
  if (TYPE_NAMES[type]) return TYPE_NAMES[type];
  return String(type).replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
}

function getBrandName(brand) {
  if (!brand) return '';
  var k = String(brand).toLowerCase();
  return BRAND_NAMES[k] || brand;
}

// Effective selling price (discount applied when valid).
function effPrice(p) {
  var d = Number(p.discountPrice || 0);
  if (d > 0 && d < Number(p.price)) return d;
  return Number(p.price);
}

function discountPct(p) {
  var d = Number(p.discountPrice || 0);
  var price = Number(p.price);
  if (!(d > 0 && d < price)) return 0;
  return Math.round((1 - d / price) * 100);
}

function inStock(p) {
  return p.inStock !== false;
}

// Resolve a product image URL for display:
// - http(s)/data URLs are used as-is
// - "/uploads/x.jpg" from the API is resolved against the API base
function imgSrc(url) {
  if (!url) return '';
  if (/^https?:\/\//i.test(url) || url.indexOf('data:') === 0) return url;
  if (url.charAt(0) === '/') return apiBase() + url;
  return url;
}

// Price brackets for the collection filter bar (VND).
var PRICE_BRACKETS = [
  { id: 'p1', label: 'Dưới 5 triệu', min: 0, max: 5000000 },
  { id: 'p2', label: '5 – 10 triệu', min: 5000000, max: 10000000 },
  { id: 'p3', label: '10 – 20 triệu', min: 10000000, max: 20000000 },
  { id: 'p4', label: '20 – 30 triệu', min: 20000000, max: 30000000 },
  { id: 'p5', label: '30 – 50 triệu', min: 30000000, max: 50000000 },
  { id: 'p6', label: 'Trên 50 triệu', min: 50000000, max: Infinity }
];

// Distinct values of a field (for dynamic filter options).
function distinctValues(products, field) {
  var seen = {};
  var out = [];
  products.forEach(function (p) {
    var v = p[field];
    if (v === undefined || v === null || v === '') return;
    var k = String(v);
    if (!seen[k]) { seen[k] = 1; out.push(v); }
  });
  out.sort(function (a, b) {
    var na = Number(a), nb = Number(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    return String(a).localeCompare(String(b));
  });
  return out;
}

function distinctTypes(products) {
  var seen = {};
  var out = [];
  products.forEach(function (p) {
    var t = p.type || '';
    if (!t || seen[t]) return;
    seen[t] = 1;
    out.push(t);
  });
  out.sort();
  return out;
}

function loadProducts() {
  try {
    var raw = localStorage.getItem(PRODUCTS_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) { /* corrupted storage -> fall back to defaults */ }
  return DEFAULT_PRODUCTS.slice();
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function resetProducts() {
  localStorage.removeItem(PRODUCTS_KEY);
  return loadProducts();
}

function nextProductId(products) {
  var max = 0;
  products.forEach(function (p) { if (p.id > max) max = p.id; });
  return max + 1;
}

// ---------- API layer (dual-mode: .NET API when reachable, else localStorage) ----------
function apiBase() {
  var cfg = (typeof window !== 'undefined' && window.APP_CONFIG) || {};
  return (cfg.API_BASE_URL || '').replace(/\/$/, '');
}

function apiFetch(path, options) {
  var controller = new AbortController();
  var timer = setTimeout(function () { controller.abort(); }, 8000);
  var opts = options || {};
  opts.signal = controller.signal;
  opts.headers = Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {});
  return fetch(apiBase() + path, opts).then(function (res) {
    clearTimeout(timer);
    return res;
  }, function (err) {
    clearTimeout(timer);
    throw err;
  });
}

// Load products: try the .NET API first, cache a copy in localStorage,
// fall back to localStorage/defaults when the API is unreachable.
function loadProductsAsync() {
  return apiFetch('/api/products').then(function (res) {
    if (!res.ok) throw new Error('api ' + res.status);
    return res.json();
  }).then(function (data) {
    if (Array.isArray(data)) {
      try { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(data)); } catch (e) {}
      return data;
    }
    return loadProducts();
  }).catch(function () {
    return loadProducts();
  });
}

// Authenticated API call (admin writes). idToken = Google ID token.
function apiRequest(method, path, body, idToken) {
  var opts = { method: method, headers: { 'X-Id-Token': idToken || '' } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  return apiFetch(path, opts).then(function (res) {
    if (res.status === 204) return null;
    return res.json().then(function (data) {
      if (!res.ok) {
        var err = new Error((data && data.message) || ('HTTP ' + res.status));
        err.status = res.status;
        throw err;
      }
      return data;
    });
  });
}

function googleLoginApi(idToken) {
  return apiFetch('/api/auth/google', {
    method: 'POST',
    body: JSON.stringify({ idToken: idToken })
  }).then(function (res) {
    return res.json().then(function (data) {
      if (!res.ok) {
        var err = new Error((data && data.message) || ('HTTP ' + res.status));
        err.status = res.status;
        throw err;
      }
      return data;
    });
  });
}

// ---------- Theme (light / dark) ----------
var THEME_KEY = 'pck_theme';

function getTheme() {
  try {
    var t = localStorage.getItem(THEME_KEY);
    if (t === 'dark' || t === 'light') return t;
    if (typeof window !== 'undefined' && window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch (e) {}
  return 'light';
}

function applyTheme(t) {
  if (t !== 'dark' && t !== 'light') t = 'light';
  try {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', t);
      var btns = document.querySelectorAll ? document.querySelectorAll('.theme-btn') : [];
      for (var i = 0; i < btns.length; i++) {
        btns[i].classList.remove('spinning');
        void btns[i].offsetWidth;
        btns[i].classList.add('spinning');
      }
    }
    if (typeof localStorage !== 'undefined') localStorage.setItem(THEME_KEY, t);
  } catch (e) {}
  starBurst();
}

function toggleTheme() {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

// ---------- Shooting-star cursor trail ----------
var CursorFX = (function () {
  var canvas = null, ctx = null, parts = [];
  var running = false, lastX = -9999, lastY = -9999, lastT = 0;
  var MAX = 130;
  var nextMeteor = -1;
  var COLORS_LIGHT = ['#ff8c42', '#ff6b4a', '#e05b3a', '#ffb03a'];
  var COLORS_DARK = ['#ffd97a', '#ffb37e', '#fff3d6', '#ff9d7e'];

  function palette() {
    try {
      if (typeof document !== 'undefined' && document.documentElement &&
          document.documentElement.getAttribute('data-theme') === 'dark') return COLORS_DARK;
    } catch (e) {}
    return COLORS_LIGHT;
  }

  function canInit() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    if (!window.requestAnimationFrame) return false;
    try {
      if (window.matchMedia) {
        if (window.matchMedia('(pointer: coarse)').matches) return false;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      }
    } catch (e) {}
    return true;
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth || 800;
    canvas.height = window.innerHeight || 600;
  }

  function spawn(x, y, burst) {
    var n = burst ? 3 : 2;
    var pal = palette();
    for (var i = 0; i < n; i++) {
      if (parts.length >= MAX) parts.shift();
      var a = Math.random() * Math.PI * 2;
      var sp = burst ? 1 + Math.random() * 3 : 0.3 + Math.random() * 1.2;
      parts.push({
        x: x, y: y, px: x, py: y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.4,
        life: 1, decay: 0.02 + Math.random() * 0.03,
        size: 1.2 + Math.random() * 2.4,
        color: pal[(Math.random() * pal.length) | 0],
        tw: Math.random() * Math.PI * 2
      });
    }
  }

  function frame(t) {
    if (!running) return;
    if (typeof t === 'number' && t - nextMeteor > 4500) {
      nextMeteor = t;
      meteor();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      p.px = p.x; p.py = p.y;
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.03; p.vx *= 0.985;
      p.life -= p.decay;
      p.tw += 0.25;
      if (p.life <= 0) { parts.splice(i, 1); continue; }
      var tw = 0.55 + 0.45 * Math.sin(p.tw);
      var alpha = Math.max(0, p.life) * tw;
      ctx.shadowBlur = 10;
      ctx.shadowColor = p.color;
      ctx.strokeStyle = p.color;
      ctx.globalAlpha = alpha * 0.7;
      ctx.lineWidth = p.size * 0.7;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = alpha * 0.35;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 2.6, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = Math.min(1, alpha + 0.2);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.8, p.size * 0.45), 0, 6.2832); ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
    window.requestAnimationFrame(frame);
  }

  function now() {
    try {
      if (window.performance && window.performance.now) return window.performance.now();
    } catch (e) {}
    return Date.now();
  }

  function onMove(e) {
    var t = now();
    if (t - lastT < 18) return;
    lastT = t;
    var dx = e.clientX - lastX, dy = e.clientY - lastY;
    if (lastX > -9999 && dx * dx + dy * dy < 9) return;
    lastX = e.clientX; lastY = e.clientY;
    spawn(e.clientX, e.clientY, false);
  }

  function meteor() {
    var pal = palette();
    var w = (typeof window !== 'undefined' && window.innerWidth) || 800;
    var x = w * 0.15 + Math.random() * w * 0.75;
    var y = -30;
    for (var i = 0; i < 16; i++) {
      if (parts.length >= MAX) parts.shift();
      parts.push({
        x: x - i * 7, y: y + i * 3.5, px: x - i * 7, py: y + i * 3.5,
        vx: -2.5 - Math.random() * 2, vy: 1.2 + Math.random() * 1.2,
        life: 1, decay: 0.006 + Math.random() * 0.008,
        size: 1.4 + Math.random() * 1.6,
        color: pal[(Math.random() * pal.length) | 0],
        tw: Math.random() * Math.PI * 2
      });
    }
  }

  function init() {
    if (canvas || !canInit()) return false;
    canvas = document.createElement('canvas');
    if (!canvas) return false;
    canvas.id = 'cursor-fx';
    try {
      canvas.style.position = 'fixed';
      canvas.style.left = '0';
      canvas.style.top = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '9999';
      canvas.style.display = 'block';
    } catch (e) {}
    try { ctx = canvas.getContext('2d'); } catch (e2) { ctx = null; }
    if (!ctx) { canvas = null; return false; }
    if (document.body && document.body.appendChild) {
      try { document.body.appendChild(canvas); } catch (e3) { canvas = null; return false; }
    } else { canvas = null; return false; }
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('click', function (e) { spawn(e.clientX, e.clientY, true); });
    if (document.addEventListener) {
      document.addEventListener('visibilitychange', function () {
        running = !document.hidden;
        if (running) window.requestAnimationFrame(frame);
      });
    }
    running = true;
    window.requestAnimationFrame(frame);
    return true;
  }

  function burst(x, y) {
    if (!canvas || !ctx) return false;
    var cx = (typeof x === 'number') ? x : (window.innerWidth || 800) / 2;
    var cy = (typeof y === 'number') ? y : (window.innerHeight || 600) * 0.3;
    for (var i = 0; i < 9; i++) spawn(cx, cy, true);
    return true;
  }

  return { init: init, burst: burst, _count: function () { return parts.length; } };
})();

function starBurst() {
  try { CursorFX.burst(); } catch (e) {}
}

try {
  if (typeof window !== 'undefined') {
    window.__cursorState = function () {
      return { hasCanvas: !!(typeof document !== 'undefined' && document.getElementById && document.getElementById('cursor-fx')),
        parts: CursorFX._count() };
    };
  }
} catch (e) {}

if (typeof document !== 'undefined' && document.addEventListener) {
  if (document.readyState === 'loading' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', function () { CursorFX.init(); });
  } else {
    CursorFX.init();
  }
}
