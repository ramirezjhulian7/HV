# Interactive Resume — Jhulian Ramírez

Hoja de vida interactiva y bilingüe (Español/Inglés), con exportación a PDF.
En producción: **https://jhulian-resume.web.app**

## ✨ Características

- 🌐 **Bilingüe ES/EN** — todo el contenido vive en los archivos de traducción; el
  cambio de idioma es instantáneo y no recarga la página.
- 📄 **Exportación a PDF** — genera el CV con primitivas vectoriales de jsPDF, no
  con una captura de pantalla, así que el texto queda seleccionable y el archivo
  es liviano.
- 🎨 **Sistema de glassmorphism** — una sola fuente de luz y tres niveles de
  superficie (chrome / card / inline). Ver [DEPLOYMENT.md](DEPLOYMENT.md#design-system-notes).
- 🚀 **Animaciones con propósito** — entradas escalonadas con tope de duración y
  un riel de línea de tiempo guiado por el scroll.
- ♿ **Accesibilidad** — respeta `prefers-reduced-motion`,
  `prefers-reduced-transparency` y `forced-colors`, con degradación para
  navegadores sin `backdrop-filter`.
- 📱 **Responsive** — probado a 390px de ancho.

## 🛠️ Stack

| | |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Estilos | CSS Modules + CSS Custom Properties |
| Animación | Framer Motion 12 |
| Fondo | tsParticles |
| i18n | react-i18next |
| PDF | jsPDF |
| Hosting | Firebase Hosting |

**Requiere Node `^20.19.0 || >=22.12.0`** (lo exige Vite 7).

## 📦 Instalación

```bash
npm install      # instalar dependencias
npm run dev      # desarrollo
npm run build    # tsc -b && vite build
npm run preview  # servir el build
npm run lint     # eslint
```

## 🔥 Deploy

`firebase-tools` ya está como devDependency, así que no hace falta instalarlo
globalmente:

```bash
npx firebase login          # solo la primera vez
rm -rf dist && npm run build
npx firebase deploy --only hosting
```

El proyecto (`jhulian-resume`) y el hosting ya están configurados en
[.firebaserc](.firebaserc) y [firebase.json](firebase.json) — **no** hace falta
`firebase init`.

Los detalles del despliegue, cómo verificarlo y las trampas conocidas están en
**[DEPLOYMENT.md](DEPLOYMENT.md)**.

<details>
<summary>Ejemplo de CI con GitHub Actions</summary>

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase Hosting

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'   # Vite 7 no corre en Node 18
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: jhulian-resume
```

</details>

## 📁 Estructura

```
src/
├── assets/profile.jpeg
├── components/
│   ├── Hero.tsx                 # foto, titular, perfil, datos de contacto
│   ├── Skills.tsx               # 10 categorías de habilidades
│   ├── Experience.tsx           # línea de tiempo laboral
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ExportPDF.tsx            # genera el PDF con jsPDF
│   ├── LanguageSwitcher.tsx
│   ├── ParticlesBackground.tsx
│   ├── ScrollToTop.tsx
│   └── SectionDivider.tsx
├── i18n/
│   ├── config.ts
│   └── locales/{es,en}.json     # TODO el contenido del CV
├── motion/tokens.ts             # eases, duraciones, tope de stagger
├── styles/index.css             # tokens + primitivas .glass globales
├── types.ts
└── App.tsx
```

Cada componente tiene su `.module.css` al lado.

## 🎨 Personalización

**Contenido del CV** — todo está en `src/i18n/locales/es.json` y `en.json`:
perfil, experiencia y habilidades. Los dos archivos deben mantenerse en paralelo;
el PDF lee exactamente las mismas claves que la web, así que no hay que
actualizar nada por separado.

**Colores y superficies** — variables en `src/styles/index.css`:

```css
:root {
  --color-accent-primary: #00d4ff;
  --color-accent-secondary: #7c3aed;
  --gradient-text-primary: ...;  /* usar este cuando el degradado sea TEXTO */
}
```

> `--gradient-primary` termina en `#7c3aed`, que queda por debajo de 3:1 sobre
> estos fondos. Sirve para rellenos (rieles, marcadores, botones), pero para
> texto hay que usar `--gradient-text-primary`.

**Foto** — reemplazar `src/assets/profile.jpeg`.

## 📝 Notas de mantenimiento

- Las **certificaciones no se muestran** en el sitio ni en el PDF, por decisión
  de contenido. Sirven solo para respaldar las habilidades listadas.
- En elementos con props de Framer Motion, **`transform` lo maneja Framer**,
  nunca una transición CSS: si ambos lo escriben, el CSS pierde contra el estilo
  inline y la transición se reinterpola en cada frame.
- Las píldoras (`glass--inline`) no llevan `backdrop-filter` a propósito: una
  píldora sobre una tarjeta de vidrio ya no tiene nada que desenfocar.
- `html2canvas` sigue siendo una dependencia transitiva, pero **no** está en la
  ruta de exportación del PDF. No conviene cambiarse a él: no implementa
  `backdrop-filter`.

## 🤝 Contacto

**Jhulian Ramírez** — Arquitecto Senior de Software

- 📧 [ramirezjhulian7@gmail.com](mailto:ramirezjhulian7@gmail.com)
- 💼 [linkedin.com/in/jhulianramirez](https://www.linkedin.com/in/jhulianramirez/)
- 📍 La Ceja, Antioquia, Colombia
