using Microsoft.AspNetCore.Mvc;
using PcStore.Api.Services;

namespace PcStore.Api.Controllers;

public record GoogleLoginRequest(string IdToken);

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly GoogleAuthService _auth;

    public AuthController(GoogleAuthService auth)
    {
        _auth = auth;
    }

    // Verifies the Google ID token sent by the frontend and reports
    // who the user is + whether they are a store admin.
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest req)
    {
        if (!_auth.IsConfigured)
            return StatusCode(503, new { message = "Server chưa cấu hình Google Client ID." });

        var payload = await _auth.ValidateAsync(req.IdToken);
        if (payload == null)
            return Unauthorized(new { message = "Token Google không hợp lệ hoặc đã hết hạn." });

        return Ok(new
        {
            email = payload.Email,
            name = payload.Name,
            picture = payload.Picture,
            isAdmin = _auth.IsAdminEmail(payload.Email)
        });
    }
}
