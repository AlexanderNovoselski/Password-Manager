using System.Security.Cryptography;
using System.Text;

namespace usbRemotePass.Services
{
    public class SecurityService : ISecurityService
    {
        public string EncryptString(string plainText, string key, string iv)
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

        public string DecryptString(string cipherText, byte[] key, byte[] iv)
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