namespace usbRemotePass.Services
{
    public class FileService : IFileService
    {
        public void AppendToFile(string filePath, string content)
        {
            using (StreamWriter file = new StreamWriter(filePath, true))
            {
                file.WriteLine(content);
            }
        }

        public string[] ReadAllLines(string filePath)
        {
            return File.ReadAllLines(filePath);
        }

        public bool FileExists(string filePath)
        {
            return File.Exists(filePath);
        }
    }
}