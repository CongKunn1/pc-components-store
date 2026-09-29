using System.Text.Json;
using PcStore.Api.Models;

namespace PcStore.Api.Data;

// JSON-file backed store (no database server needed).
// Thread-safe via lock; data lives in Data/products.json next to the app.
public class ProductStore
{
    private static readonly JsonSerializerOptions JsonOpts = new() { WriteIndented = true };
    private readonly string _filePath;
    private readonly object _lock = new();
    private List<Product> _products = new();

    public ProductStore(IWebHostEnvironment env)
    {
        var dir = Path.Combine(env.ContentRootPath, "Data");
        Directory.CreateDirectory(dir);
        _filePath = Path.Combine(dir, "products.json");
        LoadOrSeed();
    }

    public List<Product> GetAll()
    {
        lock (_lock) return _products.Select(Clone).ToList();
    }

    public Product? GetById(int id)
    {
        lock (_lock)
        {
            var p = _products.FirstOrDefault(x => x.Id == id);
            return p == null ? null : Clone(p);
        }
    }

    public Product Add(Product input)
    {
        lock (_lock)
        {
            var nextId = _products.Count == 0 ? 1 : _products.Max(x => x.Id) + 1;
            var p = Clone(input);
            p.Id = nextId;
            _products.Add(p);
            Persist();
            return Clone(p);
        }
    }

    public Product? Update(int id, Product input)
    {
        lock (_lock)
        {
            var p = _products.FirstOrDefault(x => x.Id == id);
            if (p == null) return null;
            p.Name = input.Name;
            p.Category = input.Category;
            p.Price = input.Price;
            p.Rating = input.Rating;
            p.Image = input.Image;
            p.Desc = input.Desc;
            p.ImageUrl = input.ImageUrl;
            p.DiscountPrice = input.DiscountPrice;
            p.Brand = input.Brand;
            p.Resolution = input.Resolution;
            p.RefreshRate = input.RefreshRate;
            p.RamGb = input.RamGb;
            p.InStock = input.InStock;
            p.Panel = input.Panel;
            Persist();
            return Clone(p);
        }
    }

    public bool Delete(int id)
    {
        lock (_lock)
        {
            var p = _products.FirstOrDefault(x => x.Id == id);
            if (p == null) return false;
            _products.Remove(p);
            Persist();
            return true;
        }
    }

    private void LoadOrSeed()
    {
        lock (_lock)
        {
            try
            {
                if (File.Exists(_filePath))
                {
                    var json = File.ReadAllText(_filePath);
                    var list = JsonSerializer.Deserialize<List<Product>>(json);
                    if (list != null) { _products = list; return; }
                }
            }
            catch { /* corrupted file -> reseed */ }
            _products = SeedProducts();
            Persist();
        }
    }

    private void Persist()
    {
        File.WriteAllText(_filePath, JsonSerializer.Serialize(_products, JsonOpts));
    }

    private static Product Clone(Product p) => new()
    {
        Id = p.Id, Name = p.Name, Category = p.Category,
        Price = p.Price, Rating = p.Rating, Image = p.Image, Desc = p.Desc,
        ImageUrl = p.ImageUrl, DiscountPrice = p.DiscountPrice, Brand = p.Brand,
        Resolution = p.Resolution, RefreshRate = p.RefreshRate, RamGb = p.RamGb,
        InStock = p.InStock, Panel = p.Panel
    };

    private static List<Product> SeedProducts() => new()
    {
        new() { Id = 1, Name = "AMD Ryzen 9 7950X", Category = "cpu", Price = 15990000, Rating = 4.8, Image = "fa-microchip", Desc = "CPU 16 lõi, 32 luồng, hiệu năng vượt trội cho gaming và multitasking" },
        new() { Id = 2, Name = "Intel Core i9-14900K", Category = "cpu", Price = 18990000, Rating = 4.7, Image = "fa-microchip", Desc = "CPU 24 lõi, 32 luồng, xung nhịp lên đến 6.0GHz" },
        new() { Id = 3, Name = "AMD Ryzen 7 7800X3D", Category = "cpu", Price = 11990000, Rating = 4.9, Image = "fa-microchip", Desc = "CPU 8 lõi với 3D V-Cache, tối ưu cho gaming" },
        new() { Id = 4, Name = "NVIDIA RTX 4090", Category = "gpu", Price = 49990000, Rating = 4.9, Image = "fa-display", Desc = "GPU hàng đầu, 24GB GDDR6X, ray tracing toàn diện" },
        new() { Id = 5, Name = "NVIDIA RTX 4070 Ti Super", Category = "gpu", Price = 15990000, Rating = 4.8, Image = "fa-display", Desc = "16GB GDDR6X, ray tracing thế hệ mới" },
        new() { Id = 6, Name = "AMD Radeon RX 7900 XTX", Category = "gpu", Price = 21990000, Rating = 4.7, Image = "fa-display", Desc = "24GB GDDR6, hiệu năng tối đa cho 4K gaming" },
        new() { Id = 7, Name = "Corsair Vengeance DDR5 32GB", Category = "ram", Price = 3290000, Rating = 4.6, Image = "fa-memory", Desc = "DDR5 6000MHz, CL30, bộ nhớ 32GB (2x16GB)" },
        new() { Id = 8, Name = "G.Skill Trident Z5 64GB", Category = "ram", Price = 5990000, Rating = 4.8, Image = "fa-memory", Desc = "DDR5 6400MHz, RGB, 64GB (2x32GB)" },
        new() { Id = 9, Name = "Samsung 990 Pro 2TB", Category = "storage", Price = 4290000, Rating = 4.9, Image = "fa-hdd", Desc = "SSD NVMe PCIe 4.0, tốc độ đọc lên đến 7450MB/s" },
        new() { Id = 10, Name = "WD Black SN850X 4TB", Category = "storage", Price = 7990000, Rating = 4.7, Image = "fa-hdd", Desc = "SSD NVMe PCIe 4.0, 4TB, tốc độ đọc 7300MB/s" },
        new() { Id = 11, Name = "Crucial MX500 1TB", Category = "storage", Price = 1590000, Rating = 4.5, Image = "fa-hdd", Desc = "SSD SATA 550MB/s, 1TB, bền bỉ và đáng tin cậy" },
        new() { Id = 12, Name = "Seagate Barracuda 4TB HDD", Category = "storage", Price = 2190000, Rating = 4.4, Image = "fa-hdd", Desc = "Ổ cứng HDD 4TB, 7200RPM, lưu trữ dữ liệu lớn" },
        new() { Id = 13, Name = "Corsair RM1000x", Category = "psu", Price = 3490000, Rating = 4.8, Image = "fa-plug", Desc = "Nguồn 1000W, 80 PLUS Gold, mô-đun hoàn toàn" },
        new() { Id = 14, Name = "EVGA SuperNOVA 850W", Category = "psu", Price = 2490000, Rating = 4.7, Image = "fa-plug", Desc = "Nguồn 850W, 80 PLUS Gold, bảo hành 10 năm" },
        new() { Id = 15, Name = "Seasonic Focus GX-750", Category = "psu", Price = 1990000, Rating = 4.6, Image = "fa-plug", Desc = "Nguồn 750W, 80 PLUS Gold, êm ái" },
        new() { Id = 16, Name = "ASUS ROG Strix B650E-E", Category = "mb", Price = 5990000, Rating = 4.8, Image = "fa-desktop", Desc = "Mainboard AM5, DDR5, WiFi 6E, PCIe 5.0" },
        new() { Id = 17, Name = "MSI Z790 ACE", Category = "mb", Price = 7990000, Rating = 4.7, Image = "fa-desktop", Desc = "Mainboard LGA1700, DDR5, PCIe 5.0, WiFi 6E" },
        new() { Id = 18, Name = "Gigabyte B650 AORUS Elite", Category = "mb", Price = 4290000, Rating = 4.6, Image = "fa-desktop", Desc = "Mainboard AM5, DDR5, PCIe 5.0, giá tốt" },
        // Monitors
        new() { Id = 19, Name = "ASUS TUF Gaming VG249Q 23.8\" FHD 144Hz", Category = "monitor", Price = 4290000, Rating = 4.7, Image = "fa-tv", ImageUrl = "https://picsum.photos/seed/pck19/400/300", Brand = "asus", Resolution = "1920x1080", RefreshRate = 144, Desc = "Màn hình gaming 23.8 inch Full HD, 144Hz, 1ms", Panel = "IPS" },
        new() { Id = 20, Name = "LG UltraGear 27GR75Q 27\" QHD 165Hz", Category = "monitor", Price = 6990000, Rating = 4.8, Image = "fa-tv", ImageUrl = "https://picsum.photos/seed/pck20/400/300", Brand = "lg", Resolution = "2560x1440", RefreshRate = 165, Desc = "Màn hình 27 inch 2K QHD, 165Hz, HDR10", Panel = "IPS" },
        new() { Id = 21, Name = "Samsung Odyssey G5 32\" QHD 165Hz Cong", Category = "monitor", Price = 8490000, DiscountPrice = 7990000, Rating = 4.7, Image = "fa-tv", ImageUrl = "https://picsum.photos/seed/pck21/400/300", Brand = "samsung", Resolution = "2560x1440", RefreshRate = 165, Desc = "Màn hình cong 32 inch 2K, 165Hz, độ cong 1000R", Panel = "VA" },
        new() { Id = 22, Name = "Dell UltraSharp U2723QE 27\" 4K", Category = "monitor", Price = 14990000, Rating = 4.9, Image = "fa-tv", ImageUrl = "https://picsum.photos/seed/pck22/400/300", Brand = "dell", Resolution = "3840x2160", RefreshRate = 60, Desc = "Màn hình đồ họa 27 inch 4K UHD, chuẩn màu 98% DCI-P3", Panel = "IPS" },
        new() { Id = 23, Name = "MSI Optix MAG274QRF 27\" QHD 165Hz", Category = "monitor", Price = 7490000, Rating = 4.6, Image = "fa-tv", ImageUrl = "https://picsum.photos/seed/pck23/400/300", Brand = "msi", Resolution = "2560x1440", RefreshRate = 165, Desc = "Màn hình Rapid IPS 27 inch 2K, 165Hz, G-Sync", Panel = "IPS" },
        new() { Id = 24, Name = "Gigabyte M28U 28\" 4K 144Hz", Category = "monitor", Price = 13990000, DiscountPrice = 12490000, Rating = 4.8, Image = "fa-tv", ImageUrl = "https://picsum.photos/seed/pck24/400/300", Brand = "gigabyte", Resolution = "3840x2160", RefreshRate = 144, Desc = "Màn hình 28 inch 4K UHD, 144Hz, HDMI 2.1 cho console", Panel = "IPS" },
        // Laptops
        new() { Id = 25, Name = "ASUS VivoBook 15 i5/16GB/512GB", Category = "laptop", Price = 16990000, Rating = 4.6, Image = "fa-laptop", ImageUrl = "https://picsum.photos/seed/pck25/400/300", Brand = "asus", RamGb = 16, Desc = "Laptop văn phòng 15.6 inch, Core i5, RAM 16GB, SSD 512GB" },
        new() { Id = 26, Name = "Lenovo Legion 5 RTX 4060/16GB/1TB", Category = "laptop", Price = 32990000, DiscountPrice = 30990000, Rating = 4.8, Image = "fa-laptop", ImageUrl = "https://picsum.photos/seed/pck26/400/300", Brand = "lenovo", RamGb = 16, Desc = "Laptop gaming RTX 4060, RAM 16GB, SSD 1TB, màn 144Hz" },
        new() { Id = 27, Name = "HP Pavilion 15 R7/16GB/512GB", Category = "laptop", Price = 19490000, Rating = 4.5, Image = "fa-laptop", ImageUrl = "https://picsum.photos/seed/pck27/400/300", Brand = "hp", RamGb = 16, Desc = "Laptop 15.6 inch Ryzen 7, RAM 16GB, pin 8 giờ" },
        new() { Id = 28, Name = "Dell XPS 13 i7/16GB/512GB", Category = "laptop", Price = 39990000, Rating = 4.7, Image = "fa-laptop", ImageUrl = "https://picsum.photos/seed/pck28/400/300", Brand = "dell", RamGb = 16, Desc = "Ultrabook cao cấp 13.4 inch, Core i7, vỏ nhôm nguyên khối" },
        new() { Id = 29, Name = "Acer Nitro 5 RTX 4050/8GB/512GB", Category = "laptop", Price = 21990000, DiscountPrice = 20490000, Rating = 4.6, Image = "fa-laptop", ImageUrl = "https://picsum.photos/seed/pck29/400/300", Brand = "acer", RamGb = 8, Desc = "Laptop gaming quốc dân RTX 4050, tản nhiệt kép" },
        new() { Id = 30, Name = "MSI Katana 15 i7/32GB/1TB", Category = "laptop", Price = 45990000, Rating = 4.7, Image = "fa-laptop", ImageUrl = "https://picsum.photos/seed/pck30/400/300", Brand = "msi", RamGb = 32, Desc = "Laptop gaming i7, RAM 32GB, SSD 1TB, bàn phím RGB" },
    };
}
