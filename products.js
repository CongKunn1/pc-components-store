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
{id:18,name:"Gigabyte B650 AORUS Elite",category:"mb",price:4290000,rating:4.6,image:"fa-desktop",desc:"Mainboard AM5, DDR5, PCIe 5.0, giá tốt"},
{id:19,name:"ASUS TUF Gaming VG249Q 23.8\" FHD 144Hz",category:"monitor",price:4290000,rating:4.7,image:"fa-tv",imageUrl:"https://picsum.photos/seed/pck19/400/300",brand:"asus",resolution:"1920x1080",refreshRate:144,desc:"Màn hình gaming 23.8 inch Full HD, 144Hz, 1ms"},
{id:20,name:"LG UltraGear 27GR75Q 27\" QHD 165Hz",category:"monitor",price:6990000,rating:4.8,image:"fa-tv",imageUrl:"https://picsum.photos/seed/pck20/400/300",brand:"lg",resolution:"2560x1440",refreshRate:165,desc:"Màn hình 27 inch 2K QHD, 165Hz, HDR10"},
{id:21,name:"Samsung Odyssey G5 32\" QHD 165Hz Cong",category:"monitor",price:8490000,discountPrice:7990000,rating:4.7,image:"fa-tv",imageUrl:"https://picsum.photos/seed/pck21/400/300",brand:"samsung",resolution:"2560x1440",refreshRate:165,desc:"Màn hình cong 32 inch 2K, 165Hz, độ cong 1000R"},
{id:22,name:"Dell UltraSharp U2723QE 27\" 4K",category:"monitor",price:14990000,rating:4.9,image:"fa-tv",imageUrl:"https://picsum.photos/seed/pck22/400/300",brand:"dell",resolution:"3840x2160",refreshRate:60,desc:"Màn hình đồ họa 27 inch 4K UHD, chuẩn màu 98% DCI-P3"},
{id:23,name:"MSI Optix MAG274QRF 27\" QHD 165Hz",category:"monitor",price:7490000,rating:4.6,image:"fa-tv",imageUrl:"https://picsum.photos/seed/pck23/400/300",brand:"msi",resolution:"2560x1440",refreshRate:165,desc:"Màn hình Rapid IPS 27 inch 2K, 165Hz, G-Sync"},
{id:24,name:"Gigabyte M28U 28\" 4K 144Hz",category:"monitor",price:13990000,discountPrice:12490000,rating:4.8,image:"fa-tv",imageUrl:"https://picsum.photos/seed/pck24/400/300",brand:"gigabyte",resolution:"3840x2160",refreshRate:144,desc:"Màn hình 28 inch 4K UHD, 144Hz, HDMI 2.1 cho console"},
{id:25,name:"ASUS VivoBook 15 i5/16GB/512GB",category:"laptop",price:16990000,rating:4.6,image:"fa-laptop",imageUrl:"https://picsum.photos/seed/pck25/400/300",brand:"asus",ramGb:16,desc:"Laptop văn phòng 15.6 inch, Core i5, RAM 16GB, SSD 512GB"},
{id:26,name:"Lenovo Legion 5 RTX 4060/16GB/1TB",category:"laptop",price:32990000,discountPrice:30990000,rating:4.8,image:"fa-laptop",imageUrl:"https://picsum.photos/seed/pck26/400/300",brand:"lenovo",ramGb:16,desc:"Laptop gaming RTX 4060, RAM 16GB, SSD 1TB, màn 144Hz"},
{id:27,name:"HP Pavilion 15 R7/16GB/512GB",category:"laptop",price:19490000,rating:4.5,image:"fa-laptop",imageUrl:"https://picsum.photos/seed/pck27/400/300",brand:"hp",ramGb:16,desc:"Laptop 15.6 inch Ryzen 7, RAM 16GB, pin 8 giờ"},
{id:28,name:"Dell XPS 13 i7/16GB/512GB",category:"laptop",price:39990000,rating:4.7,image:"fa-laptop",imageUrl:"https://picsum.photos/seed/pck28/400/300",brand:"dell",ramGb:16,desc:"Ultrabook cao cấp 13.4 inch, Core i7, vỏ nhôm nguyên khối"},
{id:29,name:"Acer Nitro 5 RTX 4050/8GB/512GB",category:"laptop",price:21990000,discountPrice:20490000,rating:4.6,image:"fa-laptop",imageUrl:"https://picsum.photos/seed/pck29/400/300",brand:"acer",ramGb:8,desc:"Laptop gaming quốc dân RTX 4050, tản nhiệt kép"},
{id:30,name:"MSI Katana 15 i7/32GB/1TB",category:"laptop",price:45990000,rating:4.7,image:"fa-laptop",imageUrl:"https://picsum.photos/seed/pck30/400/300",brand:"msi",ramGb:32,desc:"Laptop gaming i7, RAM 32GB, SSD 1TB, bàn phím RGB"}
];

var CATEGORY_NAMES = {cpu:'CPU',gpu:'GPU',ram:'RAM',storage:'Lưu trữ',psu:'Nguồn',mb:'Mainboard',monitor:'Màn hình',laptop:'Laptop'};
var CATEGORY_ICONS = {cpu:'fa-microchip',gpu:'fa-display',ram:'fa-memory',storage:'fa-hdd',psu:'fa-plug',mb:'fa-desktop',monitor:'fa-tv',laptop:'fa-laptop'};

// Top-level groups for the "Danh mục sản phẩm" menu.
var GROUPS = {
  components: { name: 'Linh kiện máy tính', cats: ['cpu','gpu','ram','storage','psu','mb'] },
  monitor: { name: 'Màn hình máy tính', cats: ['monitor'] },
  laptop: { name: 'Laptop', cats: ['laptop'] }
};

var BRAND_NAMES = {asus:'ASUS',lg:'LG',samsung:'Samsung',dell:'Dell',msi:'MSI',gigabyte:'Gigabyte',lenovo:'Lenovo',hp:'HP',acer:'Acer',logitech:'Logitech',razer:'Razer',rog:'ROG',corsair:'Corsair',hyperx:'HyperX',apple:'Apple'};

var RESOLUTION_NAMES = {'1920x1080':'Full HD','2560x1440':'2K QHD','3840x2160':'4K UHD'};

function getCategoryName(cat) {
  return CATEGORY_NAMES[cat] || cat;
}

function getBrandName(brand) {
  if (!brand) return '';
  var k = String(brand).toLowerCase();
  return BRAND_NAMES[k] || brand;
}

function getResolutionName(res) {
  if (!res) return '';
  return RESOLUTION_NAMES[res] || res;
}

function groupNameOf(cat) {
  for (var g in GROUPS) {
    if (GROUPS[g].cats.indexOf(cat) !== -1) return GROUPS[g].name;
  }
  return '';
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

// Compact VND: 200000000 -> "200 triệu", 15500000 -> "15.5 triệu".
function fmtCompact(n) {
  n = Number(n) || 0;
  if (n >= 1000000000) {
    var b = n / 1000000000;
    return (Math.round(b * 10) / 10) + ' tỷ';
  }
  if (n >= 1000000) {
    var m = n / 1000000;
    return (Math.round(m * 10) / 10) + ' triệu';
  }
  if (n >= 1000) return Math.round(n / 1000) + ' nghìn';
  return String(n);
}

// Distinct values of a field within a group (for dynamic filter options).
function distinctValues(products, groupKey, field) {
  var seen = {};
  var out = [];
  products.forEach(function (p) {
    if (GROUPS[groupKey].cats.indexOf(p.category) === -1) return;
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
