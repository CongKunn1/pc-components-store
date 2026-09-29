// Shared product data layer - used by index.html and admin.html
// Products are persisted in localStorage so the admin dashboard can manage them.
var PRODUCTS_KEY = 'pc_parts_products_v1';

var DEFAULT_PRODUCTS = [
{id:1,name:"AMD Ryzen 9 7950X",category:"cpu",price:15990000,rating:4.8,image:"fa-microchip",desc:"CPU 16 lõi, 32 luồng, hiệu năng vượt trội cho gaming và multitasking"},
{id:2,name:"Intel Core i9-14900K",category:"cpu",price:18990000,rating:4.7,image:"fa-microchip",desc:"CPU 24 lõi, 32 luồng, xung nhịp lên đến 6.0GHz"},
{id:3,name:"AMD Ryzen 7 7800X3D",category:"cpu",price:11990000,rating:4.9,image:"fa-microchip",desc:"CPU 8 lõi với 3D V-Cache, tối ưu cho gaming"},
{id:4,name:"NVIDIA RTX 4090",category:"gpu",price:49990000,rating:4.9,image:"fa-display",desc:"GPU hàng đầu, 24GB GDDR6X, ray tracing toàn diện"},
{id:5,name:"NVIDIA RTX 4070 Ti Super",category:"gpu",price:15990000,rating:4.8,image:"fa-display",desc:"16GB GDDR6X, ray tracing thế hệ mới"},
{id:6,name:"AMD Radeon RX 7900 XTX",category:"gpu",price:21990000,rating:4.7,image:"fa-display",desc:"24GB GDDR6, hiệu năng tối đa cho 4K gaming"},
{id:7,name:"Corsair Vengeance DDR5 32GB",category:"ram",price:3290000,rating:4.6,image:"fa-memory",desc:"DDR5 6000MHz, CL30, bộ nhớ 32GB (2x16GB)"},
{id:8,name:"G.Skill Trident Z5 64GB",category:"ram",price:5990000,rating:4.8,image:"fa-memory",desc:"DDR5 6400MHz, RGB, 64GB (2x32GB)"},
{id:9,name:"Samsung 990 Pro 2TB",category:"storage",price:4290000,rating:4.9,image:"fa-hdd",desc:"SSD NVMe PCIe 4.0, tốc độ đọc lên đến 7450MB/s"},
{id:10,name:"WD Black SN850X 4TB",category:"storage",price:7990000,rating:4.7,image:"fa-hdd",desc:"SSD NVMe PCIe 4.0, 4TB, tốc độ đọc 7300MB/s"},
{id:11,name:"Crucial MX500 1TB",category:"storage",price:1590000,rating:4.5,image:"fa-hdd",desc:"SSD SATA 550MB/s, 1TB, bền bỉ và đáng tin cậy"},
{id:12,name:"Seagate Barracuda 4TB HDD",category:"storage",price:2190000,rating:4.4,image:"fa-hdd",desc:"Ổ cứng HDD 4TB, 7200RPM, lưu trữ dữ liệu lớn"},
{id:13,name:"Corsair RM1000x",category:"psu",price:3490000,rating:4.8,image:"fa-plug",desc:"Nguồn 1000W, 80 PLUS Gold, mô-đun hoàn toàn"},
{id:14,name:"EVGA SuperNOVA 850W",category:"psu",price:2490000,rating:4.7,image:"fa-plug",desc:"Nguồn 850W, 80 PLUS Gold, bảo hành 10 năm"},
{id:15,name:"Seasonic Focus GX-750",category:"psu",price:1990000,rating:4.6,image:"fa-plug",desc:"Nguồn 750W, 80 PLUS Gold, êm ái"},
{id:16,name:"ASUS ROG Strix B650E-E",category:"mb",price:5990000,rating:4.8,image:"fa-desktop",desc:"Mainboard AM5, DDR5, WiFi 6E, PCIe 5.0"},
{id:17,name:"MSI Z790 ACE",category:"mb",price:7990000,rating:4.7,image:"fa-desktop",desc:"Mainboard LGA1700, DDR5, PCIe 5.0, WiFi 6E"},
{id:18,name:"Gigabyte B650 AORUS Elite",category:"mb",price:4290000,rating:4.6,image:"fa-desktop",desc:"Mainboard AM5, DDR5, PCIe 5.0, giá tốt"}
];

var CATEGORY_NAMES = {cpu:'CPU',gpu:'GPU',ram:'RAM',storage:'Lưu trữ',psu:'Nguồn',mb:'Mainboard'};
var CATEGORY_ICONS = {cpu:'fa-microchip',gpu:'fa-display',ram:'fa-memory',storage:'fa-hdd',psu:'fa-plug',mb:'fa-desktop'};

function getCategoryName(cat) {
  return CATEGORY_NAMES[cat] || cat;
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
