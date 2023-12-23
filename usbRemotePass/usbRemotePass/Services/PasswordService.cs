
using System.Text.Json;

namespace usbRemotePass.Services
{
    public class PasswordService : IPasswordService
    {
        private readonly ISecurityService _securityService;
        private readonly IFileService _fileService;

        public PasswordService(ISecurityService securityService, IFileService fileService)
        {
            _securityService = securityService ?? throw new ArgumentNullException(nameof(securityService));
            _fileService = fileService ?? throw new ArgumentNullException(nameof(fileService));
        }

        public void SavePassword(JsonElement data, string key, string iv)
        {
            try
            {
                if (!data.TryGetProperty("web", out var web) ||
                    !data.TryGetProperty("name", out var name) ||
                    !data.TryGetProperty("user", out var user) ||
                    !data.TryGetProperty("password", out var password))
                {
                    throw new ArgumentException("Invalid data format");
                }

                key = key ?? throw new ArgumentNullException(nameof(key));
                iv = iv ?? throw new ArgumentNullException(nameof(iv));

                var passwordObject = new
                {
                    Website = web.GetString(),
                    Name = name.GetString(),
                    User = user.GetString(),
                    Password = password.GetString()
                };

                string passwordJson = JsonSerializer.Serialize(passwordObject);
                string encryptedInfo = _securityService.EncryptString(passwordJson, key, iv);

                string filePath = GetFilePath();

                _fileService.AppendToFile(filePath, encryptedInfo);
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred: {ex.Message}", ex);
            }
        }

        public IEnumerable<object?> GetPasswords(string key, string iv)
        {
            try
            {
                key = key ?? throw new ArgumentNullException(nameof(key));
                iv = iv ?? throw new ArgumentNullException(nameof(iv));

                string filePath = GetFilePath();

                if (!_fileService.FileExists(filePath))
                {
                    throw new FileNotFoundException("Passwords file not found", filePath);
                }

                string[] lines = _fileService.ReadAllLines(filePath);
                List<object?> decryptedPasswords = new List<object?>();

                foreach (string line in lines)
                {
                    try
                    {
                        string decrypted = _securityService.DecryptString(line, Convert.FromBase64String(key), Convert.FromBase64String(iv));
                        object? passwordObject = JsonSerializer.Deserialize<object?>(decrypted);
                        decryptedPasswords.Add(passwordObject);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Decryption failed: {ex.Message}");
                    }
                }

                return decryptedPasswords;
            }
            catch (Exception ex)
            {
                throw new ApplicationException($"An error occurred: {ex.Message}", ex);
            }
        }


        private string GetFilePath()
        {
            string projectDirectory = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..\\..\\..\\..\\"));
            string directoryPath = Path.GetFullPath(projectDirectory);
            return Path.Combine(directoryPath, "passwords.txt");
        }
    }

}