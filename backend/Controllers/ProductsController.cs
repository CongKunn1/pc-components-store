using Microsoft.AspNetCore.Mvc;
using PcStore.Api.Data;
using PcStore.Api.Models;
using PcStore.Api.Services;

namespace PcStore.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly ProductStore _store;
    private readonly GoogleAuthService _auth;

    public ProductsController(ProductStore store, GoogleAuthService auth)
    {
        _store = store;
        _auth = auth;
    }

    // Public: anyone can view the catalog.
    [HttpGet]
    public ActionResult<IEnumerable<Product>> GetAll() => Ok(_store.GetAll());

    // Public: product detail.
    [HttpGet("{id:int}")]
    public ActionResult<Product> GetById(int id)
    {
        var p = _store.GetById(id);
        return p == null ? NotFound(new { message = "Không tìm thấy sản phẩm." }) : Ok(p);
    }

    // Admin only: add a new product.
    [HttpPost]
    public async Task<ActionResult<Product>> Create([FromBody] Product input)
    {
        var forbidden = await RequireAdminAsync();
        if (forbidden != null) return forbidden;
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var created = _store.Add(input);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    // Admin only: edit a product.
    [HttpPut("{id:int}")]
    public async Task<ActionResult<Product>> Update(int id, [FromBody] Product input)
    {
        var forbidden = await RequireAdminAsync();
        if (forbidden != null) return forbidden;
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var updated = _store.Update(id, input);
        return updated == null ? NotFound(new { message = "Không tìm thấy sản phẩm." }) : Ok(updated);
    }

    // Admin only: delete a product.
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var forbidden = await RequireAdminAsync();
        if (forbidden != null) return forbidden;
        return _store.Delete(id) ? NoContent() : NotFound(new { message = "Không tìm thấy sản phẩm." });
    }

    // Write endpoints require a valid Google ID token (header X-Id-Token)
    // belonging to a whitelisted admin Gmail.
    private async Task<ObjectResult?> RequireAdminAsync()
    {
        Request.Headers.TryGetValue("X-Id-Token", out var token);
        var payload = await _auth.ValidateAsync(token.ToString());
        if (payload == null || !_auth.IsAdminEmail(payload.Email))
            return Unauthorized(new { message = "Cần đăng nhập Gmail admin để thực hiện." });
        return null;
    }
}
