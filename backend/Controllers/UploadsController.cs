using Microsoft.AspNetCore.Mvc;
using PcStore.Api.Services;

namespace PcStore.Api.Controllers;

// Admin-only image upload. Files land in wwwroot/uploads and are served
// statically, e.g. GET /uploads/abc123.jpg
[ApiController]
[Route("api/uploads")]
public class UploadsController : ControllerBase
{
    private static readonly HashSet<string> AllowedExts = new(StringComparer.OrdinalIgnoreCase)
        { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
    private const long MaxBytes = 5 * 1024 * 1024;

    private readonly GoogleAuthService _auth;
    private readonly IWebHostEnvironment _env;

    public UploadsController(GoogleAuthService auth, IWebHostEnvironment env)
    {
        _auth = auth;
        _env = env;
    }

    [HttpPost("image")]
    [RequestSizeLimit(6 * 1024 * 1024)]
    public async Task<IActionResult> UploadImage([FromForm] IFormFile? file)
    {
        Request.Headers.TryGetValue("X-Id-Token", out var token);
        var payload = await _auth.ValidateAsync(token.ToString());
        if (payload == null || !_auth.IsAdminEmail(payload.Email))
            return Unauthorized(new { message = "Cần đăng nhập Gmail admin để thực hiện." });

        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Chưa chọn file ảnh." });
        if (file.Length > MaxBytes)
            return BadRequest(new { message = "Ảnh tối đa 5MB." });

        var ext = Path.GetExtension(file.FileName);
        if (string.IsNullOrEmpty(ext) || !AllowedExts.Contains(ext))
            return BadRequest(new { message = "Chỉ nhận file JPG, PNG, WEBP, GIF." });

        var dir = Path.Combine(_env.WebRootPath, "uploads");
        Directory.CreateDirectory(dir);
        var fileName = Guid.NewGuid().ToString("N") + ext.ToLowerInvariant();
        await using (var stream = System.IO.File.Create(Path.Combine(dir, fileName)))
        {
            await file.CopyToAsync(stream);
        }
        return Ok(new { url = "/uploads/" + fileName });
    }
}
