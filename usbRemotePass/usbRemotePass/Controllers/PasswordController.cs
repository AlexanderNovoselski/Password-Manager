


using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace usbRemotePass.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordController : Controller
    {
        private string Key = ""; // Change this to your actual key
        private string IV = ""; // Change this to your actual IV

        [HttpPost]
        [Route("save_password")]
        public IActionResult SavePassword([FromBody] JsonElement data)
        {
            try
            {
                if (!data.TryGetProperty("web", out var web) ||
            !data.TryGetProperty("name", out var name) ||
            !data.TryGetProperty("user", out var user) ||
            !data.TryGetProperty("password", out var password) ||
            !data.TryGetProperty("key", out var keyElement) ||
            !data.TryGetProperty("iv", out var ivElement))
                {
                    return BadRequest("Invalid data format");
                }

                Key = keyElement.GetString();
                IV = ivElement.GetString();
                // Create a password object from JSON properties
                var passwordObject = new
                {
                    Website = web.GetString(),
                    Name = name.GetString(),
                    User = user.GetString(),
                    Password = password.GetString()
                };

                // Serialize the password object to JSON
                string passwordJson = JsonSerializer.Serialize(passwordObject);

                // Encrypt the JSON using the pre-defined key and IV
                string encryptedInfo = EncryptString(passwordJson, Key, IV);

                string projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..\\..\\..\\..\\"));
                string directoryPath = Path.GetFullPath(projectDirectory);
                string filePath = Path.Combine(directoryPath, "passwords.txt");
                using (StreamWriter file = new StreamWriter(filePath, true))
                {
                    file.WriteLine(encryptedInfo);
                }
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
                // Check if key and IV properties are present in the JSON data
                if (!data.TryGetProperty("key", out var keyElement) ||
                    !data.TryGetProperty("iv", out var ivElement))
                {
                    return BadRequest("Key and IV are required");
                }

                string keyString = keyElement.GetString();
                string ivString = ivElement.GetString();

                // Convert the key and IV strings to byte arrays
                byte[] key = Convert.FromBase64String(keyString);
                byte[] iv = Convert.FromBase64String(ivString);

                // Specify the path to the passwords file
                string projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..\\..\\..\\..\\"));
                string directoryPath = Path.GetFullPath(projectDirectory);
                Console.WriteLine($"Directory Path: {directoryPath}");
                string filePath = Path.Combine(directoryPath, "passwords.txt");
                Console.WriteLine(filePath);
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound("Passwords file not found");
                }

                string[] lines = System.IO.File.ReadAllLines(filePath);
                List<object?> decryptedPasswords = new List<object?>();

                // Decrypt each line in the file
                foreach (string line in lines)
                {
                    string decrypted = DecryptString(line, key, iv);
                    object? passwordObject = JsonSerializer.Deserialize<object?>(decrypted);
                    decryptedPasswords.Add(passwordObject);
                }

                return Ok(decryptedPasswords);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }

        // Helper method to encrypt a string
        private string EncryptString(string plainText, string key, string iv)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Convert.FromBase64String(key);
                aesAlg.IV = Convert.FromBase64String(iv);
                aesAlg.Padding = PaddingMode.PKCS7;

                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                using (MemoryStream msEncrypt = new MemoryStream())
                using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                {
                    byte[] bytes = Encoding.UTF8.GetBytes(plainText);
                    csEncrypt.Write(bytes, 0, bytes.Length);
                    csEncrypt.FlushFinalBlock();
                    return Convert.ToBase64String(msEncrypt.ToArray());
                }
            }
        }

        // Helper method to decrypt a string
        private string DecryptString(string cipherText, byte[] key, byte[] iv)
        {
            try
            {
                using (Aes aesAlg = Aes.Create())
                {
                    aesAlg.Key = key;
                    aesAlg.IV = iv;
                    aesAlg.Padding = PaddingMode.PKCS7;

                    ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                    using (MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(cipherText)))
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                    {
                        string decryptedText = srDecrypt.ReadToEnd();
                        Console.WriteLine($"Decrypted Text: {decryptedText}");
                        return decryptedText;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Decryption Error: {ex}");
                throw;
            }
        }
    }
}
