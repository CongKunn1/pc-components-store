using PcStore.Api.Data;
using PcStore.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSingleton<ProductStore>();
builder.Services.AddSingleton<GoogleAuthService>();

var frontendUrls = builder.Configuration.GetSection("FrontendUrls").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        if (frontendUrls.Length == 0)
            policy.AllowAnyOrigin(); // dev default; set FrontendUrls in production
        else
            policy.WithOrigins(frontendUrls);
        policy.AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors();
app.MapControllers();
app.MapGet("/api/health", () => Results.Ok(new { status = "ok", time = DateTime.UtcNow }));

app.Run();
