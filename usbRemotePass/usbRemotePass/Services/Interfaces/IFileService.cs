namespace usbRemotePass.Services
{
    public interface IFileService
    {
        void AppendToFile(string filePath, string content);
        string[] ReadAllLines(string filePath);
        bool FileExists(string filePath);
    }
}
