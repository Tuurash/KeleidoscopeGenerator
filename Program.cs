var builder = WebApplication.CreateBuilder(args);


builder.Services.AddRazorPages();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.MapRazorPages();



//Asynchronous
await app.RunAsync();
