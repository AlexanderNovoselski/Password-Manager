using Microsoft.AspNetCore.Mvc;
using System;
using System.Text.Json;
using usbRemotePass.Services;

namespace usbRemotePass.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordController : Controller
    {
        private readonly IPasswordService _passwordService;
        private readonly ISecurityService _securityService;
        private readonly IFileService _fileService; // Add this

        public PasswordController(IPasswordService passwordService, ISecurityService securityService, IFileService fileService) // Add IFileService to constructor
        {
            _passwordService = passwordService ?? throw new ArgumentNullException(nameof(passwordService));
            _securityService = securityService ?? throw new ArgumentNullException(nameof(securityService));
            _fileService = fileService ?? throw new ArgumentNullException(nameof(fileService)); // Initialize IFileService
        }

        [HttpPost]
        [Route("save_password")]
        public IActionResult SavePassword([FromBody] JsonElement data)
        {
            try
            {
                // Assuming you have "key" and "iv" properties in the JSON data
                string key = data.GetProperty("key").GetString();
                string iv = data.GetProperty("iv").GetString();

                _passwordService.SavePassword(data, key, iv);
                return Ok("Password saved successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("get_passwords")]
        public IActionResult GetPasswords([FromBody] JsonElement data)
        {
            try
            {
                if (!data.TryGetProperty("key", out var keyElement) ||
                    !data.TryGetProperty("iv", out var ivElement))
                {
                    return BadRequest("Key and IV are required");
                }

                string key = keyElement.GetString();
                string iv = ivElement.GetString();

                var passwords = _passwordService.GetPasswords(key, iv);
                return Ok(passwords);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }
    }
}
