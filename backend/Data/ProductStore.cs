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
            p.Title = input.Title;
            p.Price = input.Price;
            p.DiscountPrice = input.DiscountPrice;
            p.Type = input.Type;
            p.Brand = input.Brand;
            p.ImageUrl = input.ImageUrl;
            p.ShopeeUrl = input.ShopeeUrl;
            p.Rating = input.Rating;
            p.InStock = input.InStock;
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
        Id = p.Id, Name = p.Name, Title = p.Title,
        Price = p.Price, DiscountPrice = p.DiscountPrice, Type = p.Type,
        Brand = p.Brand, ImageUrl = p.ImageUrl, ShopeeUrl = p.ShopeeUrl,
        Rating = p.Rating, InStock = p.InStock
    };

    private static List<Product> SeedProducts() => new()
    {
        // Do dien tu
        new() { Id = 1, Name = "Tai nghe Bluetooth Sony WH-1000XM4", Title = "Chống ồn chủ động, pin 30 giờ", Price = 5990000, DiscountPrice = 4990000, Type = "dien-tu", Brand = "sony", ImageUrl = "https://picsum.photos/seed/pck101/500/500", Rating = 4.8 },
        new() { Id = 2, Name = "Bàn phím cơ Logitech G Pro", Title = "Switch tactile, đèn RGB", Price = 2490000, Type = "dien-tu", Brand = "logitech", ImageUrl = "https://picsum.photos/seed/pck102/500/500", Rating = 4.7 },
        new() { Id = 3, Name = "Chuột gaming Razer DeathAdder", Title = "6400 DPI, siêu nhẹ 69g", Price = 1290000, DiscountPrice = 990000, Type = "dien-tu", Brand = "razer", ImageUrl = "https://picsum.photos/seed/pck103/500/500", Rating = 4.6 },
        new() { Id = 4, Name = "Loa Bluetooth JBL Flip 6", Title = "Chống nước IP67, pin 12 giờ", Price = 2990000, Type = "dien-tu", Brand = "jbl", ImageUrl = "https://picsum.photos/seed/pck104/500/500", Rating = 4.7 },
        new() { Id = 5, Name = "Sạc dự phòng Anker 20000mAh", Title = "Sạc nhanh 22.5W, 2 cổng", Price = 890000, Type = "dien-tu", Brand = "anker", ImageUrl = "https://picsum.photos/seed/pck105/500/500", Rating = 4.6 },
        new() { Id = 6, Name = "Đồng hồ thông minh Apple Watch SE", Title = "GPS, đo nhịp tim, chống nước", Price = 5990000, DiscountPrice = 5490000, Type = "dien-tu", Brand = "apple", ImageUrl = "https://picsum.photos/seed/pck106/500/500", Rating = 4.8 },
        // My pham
        new() { Id = 7, Name = "Serum Vitamin C La Roche", Title = "Sáng da, mờ thâm, 30ml", Price = 620000, Type = "my-pham", Brand = "laroche", ImageUrl = "https://picsum.photos/seed/pck107/500/500", Rating = 4.7 },
        new() { Id = 8, Name = "Kem dưỡng ẩm CeraVe", Title = "Cho da khô, hũ 454g", Price = 450000, DiscountPrice = 389000, Type = "my-pham", Brand = "cerave", ImageUrl = "https://picsum.photos/seed/pck108/500/500", Rating = 4.8 },
        new() { Id = 9, Name = "Sữa rửa mặt Innisfree Green Tea", Title = "Làm sạch dịu nhẹ, 150ml", Price = 280000, Type = "my-pham", Brand = "innisfree", ImageUrl = "https://picsum.photos/seed/pck109/500/500", Rating = 4.6 },
        new() { Id = 10, Name = "Kem chống nắng L'Oreal SPF50", Title = "Kiềm dầu, không nhờn rít, 50ml", Price = 350000, Type = "my-pham", Brand = "loreal", ImageUrl = "https://picsum.photos/seed/pck110/500/500", Rating = 4.5 },
        new() { Id = 11, Name = "Mặt nạ đất sét Kiehl's", Title = "Se khít lỗ chân lông, 125ml", Price = 890000, Type = "my-pham", Brand = "kiehls", ImageUrl = "https://picsum.photos/seed/pck111/500/500", Rating = 4.7 },
        // Gia dung
        new() { Id = 12, Name = "Nồi chiên không dầu Philips 6.2L", Title = "Chiên nướng không dầu mỡ", Price = 3290000, DiscountPrice = 2790000, Type = "gia-dung", Brand = "philips", ImageUrl = "https://picsum.photos/seed/pck112/500/500", Rating = 4.8 },
        new() { Id = 13, Name = "Máy xay sinh tố Panasonic", Title = "Cối thủy tinh 1.5L, 400W", Price = 1190000, Type = "gia-dung", Brand = "panasonic", ImageUrl = "https://picsum.photos/seed/pck113/500/500", Rating = 4.5 },
        new() { Id = 14, Name = "Robot hút bụi Xiaomi", Title = "Lực hút 4000Pa, lau nhà", Price = 4990000, Type = "gia-dung", Brand = "xiaomi", ImageUrl = "https://picsum.photos/seed/pck114/500/500", Rating = 4.6 },
        // Thoi trang
        new() { Id = 15, Name = "Áo thun cotton basic", Title = "100% cotton, nhiều màu", Price = 199000, Type = "thoi-trang", Brand = "pck", ImageUrl = "https://picsum.photos/seed/pck115/500/500", Rating = 4.4 },
        new() { Id = 16, Name = "Giày sneaker thể thao", Title = "Đế êm, thoáng khí", Price = 799000, DiscountPrice = 649000, Type = "thoi-trang", Brand = "pck", ImageUrl = "https://picsum.photos/seed/pck116/500/500", Rating = 4.6 },
    };
}
