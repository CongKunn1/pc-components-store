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
}
