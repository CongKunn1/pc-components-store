using System.ComponentModel.DataAnnotations;

namespace PcStore.Api.Models;

// General-store product: name, title, price, type, photo and Shopee link.
public class Product
{
    public int Id { get; set; }

    // Tên sản phẩm
    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    // Title / dòng mô tả ngắn hiển thị dưới tên
    [MaxLength(300)]
    public string Title { get; set; } = string.Empty;

    // Giá bán (VNĐ)
    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    // Giá khuyến mãi. Null/0 = không giảm.
    [Range(0, double.MaxValue)]
    public decimal? DiscountPrice { get; set; }

    // Loại sản phẩm (mã): dien-tu, my-pham, gia-dung, thoi-trang, ...
    [Required, MaxLength(50)]
    public string Type { get; set; } = "dien-tu";

    [MaxLength(100)]
    public string Brand { get; set; } = string.Empty;

    // Ảnh sản phẩm (URL). Trống = hiện icon.
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    // Link Shopee của sản phẩm. Trống = chưa cập nhật.
    [MaxLength(500)]
    public string ShopeeUrl { get; set; } = string.Empty;

    [Range(0, 5)]
    public double Rating { get; set; } = 4.5;

    public bool InStock { get; set; } = true;
}
