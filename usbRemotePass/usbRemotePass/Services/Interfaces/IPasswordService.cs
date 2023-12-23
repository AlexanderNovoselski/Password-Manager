using System.Text.Json;

namespace usbRemotePass.Services
{
    public interface IPasswordService
    {
        void SavePassword(JsonElement data, string key, string iv);
        IEnumerable<object?> GetPasswords(string key, string iv);
    }
}