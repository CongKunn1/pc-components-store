using System.ComponentModel.DataAnnotations;

namespace PcStore.Api.Models;

public class Product
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Category { get; set; } = "cpu";

    [Range(0, double.MaxValue)]
    public decimal Price { get; set; }

    [Range(0, 5)]
    public double Rating { get; set; } = 4.5;

    [MaxLength(100)]
    public string Image { get; set; } = "fa-box";

    [MaxLength(1000)]
    public string Desc { get; set; } = string.Empty;

    // Product photo (URL). Empty = show category icon instead.
    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    // Sale price. Null/0 = no discount (sell at Price).
    [Range(0, double.MaxValue)]
    public decimal? DiscountPrice { get; set; }

    [MaxLength(100)]
    public string Brand { get; set; } = string.Empty;

    // Monitor: e.g. "1920x1080". Empty when not applicable.
    [MaxLength(50)]
    public string Resolution { get; set; } = string.Empty;

    // Monitor refresh rate in Hz. Null when not applicable.
    [Range(0, 1000)]
    public int? RefreshRate { get; set; }

    // Laptop RAM in GB. Null when not applicable.
    [Range(0, 1024)]
    public int? RamGb { get; set; }

    // In stock or not. Default true.
    public bool InStock { get; set; } = true;

    // Monitor panel type: e.g. "IPS", "VA". Empty when not applicable.
    [MaxLength(50)]
    public string Panel { get; set; } = string.Empty;
}
