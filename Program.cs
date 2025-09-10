var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();

// Configure base path for GitHub Pages
if (builder.Environment.IsProduction())
{
    var githubRepo = builder.Configuration["GithubRepository"] ?? "KeleidoscopeGenerator";
    builder.Services.Configure<StaticFileOptions>(options =>
    {
        options.OnPrepareResponse = ctx =>
        {
            ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=31536000");
        };
    });
}

var app = builder.Build();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.MapRazorPages();

//Asynchronous
await app.RunAsync();
