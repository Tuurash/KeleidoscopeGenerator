## KeleidoscopeGenerator — Live demo

[Live demo preview](https://tuurash.github.io/KeleidoscopeGenerator/)

Generate interactive, radial‑symmetry kaleidoscopic patterns by applying geometric transforms to shapes or images.

What is a keleidoscope?

A keleidoscope (kaleidoscope) is an optical pattern generator that forms symmetric, repeating visuals by reflecting and rotating elements around a center. This project reproduces that effect in the browser by programmatically repeating, rotating, and reflecting canvas shapes and image fragments.

![demo](https://img.youtube.com/vi/x8ftz7XAMMw/0.jpg)

Features
- Simple, interactive radial-symmetry visuals
- TypeScript rendering on HTML Canvas (`wwwroot/ts`)
- Served by an ASP.NET host (`KeleidoTS.csproj`, `Program.cs`)
- Configurable parameters for repeats, rotation, color and source image

How it works
- The ASP.NET app serves the UI and static assets; open the app or browse the GitHub Pages demo.
- Front-end code in `wwwroot/ts` (`app.ts`, `triangle.ts`, `rectangle.ts`) draws shapes onto a canvas and applies transforms (rotate, translate, reflect, repeat) to create the kaleidoscope effect.
- `tsconfig.json` configures the TypeScript build; static web assets are included in the .NET project.

Quick start
1. Build and run the server (requires .NET SDK):

```bash
dotnet build
dotnet run --project KeleidoTS.csproj
```

2. Open `https://localhost:5001` or the URL shown in the console.
3. Or view the static GitHub Pages demo: https://tuurash.github.io/KeleidoscopeGenerator/

Contributing
- Suggest improvements or open an issue; PRs are welcome for new shapes, UI controls, or performance tweaks.

License
- See repository for license information.

If you'd like, I can also open and summarize specific files such as `wwwroot/ts/app.ts` or run the app locally and show the canvas output.
