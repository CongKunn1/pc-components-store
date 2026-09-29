using Google.Apis.Auth;

namespace PcStore.Api.Services;

// Validates Google ID tokens (from Gmail login on the frontend)
// and decides whether the signed-in email is a store admin.
public class GoogleAuthService
{
    private readonly string _clientId;
    private readonly HashSet<string> _adminEmails;

    public GoogleAuthService(IConfiguration config)
    {
        _clientId = config["Google:ClientId"] ?? string.Empty;
        _adminEmails = new HashSet<string>(
            config.GetSection("AdminEmails").Get<string[]>() ?? [],
            StringComparer.OrdinalIgnoreCase);
    }

    public bool IsConfigured =>
        !string.IsNullOrWhiteSpace(_clientId) && !_clientId.StartsWith("PASTE", StringComparison.Ordinal);

    public async Task<GoogleJsonWebSignature.Payload?> ValidateAsync(string? idToken)
    {
        if (!IsConfigured || string.IsNullOrWhiteSpace(idToken)) return null;
        try
        {
            return await GoogleJsonWebSignature.ValidateAsync(idToken,
                new GoogleJsonWebSignature.ValidationSettings { Audience = new[] { _clientId } });
        }
        catch
        {
            return null; // expired / forged / wrong audience
        }
    }

    public bool IsAdminEmail(string? email) =>
        !string.IsNullOrWhiteSpace(email) && _adminEmails.Contains(email);
}
