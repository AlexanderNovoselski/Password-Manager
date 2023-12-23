using usbRemotePass.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<ISecurityService, SecurityService>();
builder.Services.AddScoped<IFileService, FileService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddControllersWithViews();
builder.Services.AddAuthorization();

var app = builder.Build();
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Password}/{action=SavePassword}/{id?}");

app.Run("http://localhost:5000");
