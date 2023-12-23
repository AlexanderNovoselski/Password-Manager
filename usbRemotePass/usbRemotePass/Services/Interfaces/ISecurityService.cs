namespace usbRemotePass.Services
{
    public interface ISecurityService
    {
        string EncryptString(string plainText, string key, string iv);
        string DecryptString(string cipherText, byte[] key, byte[] iv);
    }
}