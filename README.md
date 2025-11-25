# Interactive Resume - Jhulian Ramírez

Una hoja de vida interactiva, multiidioma (Español/Inglés) y estilizada, desarrollada con React, TypeScript y diseño premium.

## ✨ Características

- 🌐 **Multiidioma**: Soporte completo para Español e Inglés
- 🎨 **Diseño Premium**: Glassmorphism, gradientes vibrantes y animaciones fluidas
- 📱 **Responsive**: Optimizado para móvil, tablet y desktop
- ⚡ **Alto Rendimiento**: Build con Vite y React 18
- 🚀 **Animaciones**: Framer Motion para experiencia dinámica
- 🔥 **Firebase Ready**: Listo para desplegar en Firebase Hosting

## 🛠️ Stack Tecnológico

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: CSS Modules con CSS Variables
- **Animations**: Framer Motion
- **i18n**: react-i18next
- **Hosting**: Firebase Hosting

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔥 Deploy a Firebase Hosting

### Método 1: Despliegue Manual

1. **Instalar Firebase CLI globalmente** (si no lo tienes):
```bash
npm install -g firebase-tools
```

2. **Login a Firebase**:
```bash
firebase login
```

3. **Inicializar Firebase** (solo la primera vez):
```bash
firebase init hosting
```
   - Selecciona un proyecto existente o crea uno nuevo
   - Usa `dist` como directorio público
   - Configura como single-page app: **Yes**
   - No sobrescribir index.html: **No**

4. **Build y Deploy**:
```bash
npm run build
firebase deploy
```

### Método 2: Deploy con un solo comando

Una vez configurado, puedes usar:
```bash
npm run build && firebase deploy
```

### Método 3: GitHub Actions (CI/CD)

Puedes configurar GitHub Actions para deploy automático:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase Hosting

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

## 📁 Estructura del Proyecto

```
HV/
├── src/
│   ├── assets/          # Imágenes y recursos
│   ├── components/      # Componentes React
│   │   ├── Hero.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── i18n/           # Configuración de internacionalización
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── es.json
│   │       └── en.json
│   ├── styles/         # Estilos globales
│   │   └── index.css
│   ├── App.tsx
│   └── main.tsx
├── public/             # Archivos estáticos
├── firebase.json       # Configuración de Firebase
└── package.json
```

## 🎨 Personalización

### Cambiar Colores
Edita las variables CSS en `src/styles/index.css`:

```css
:root {
  --color-accent-primary: #00d4ff;
  --color-accent-secondary: #7c3aed;
  /* ... más variables */
}
```

### Actualizar Contenido
Edita los archivos de traducción:
- Español: `src/i18n/locales/es.json`
- Inglés: `src/i18n/locales/en.json`

### Cambiar Foto de Perfil
Reemplaza `src/assets/profile.jpeg` con tu foto.

## 🌐 Ver en Producción

Una vez desplegado, tu sitio estará disponible en:
```
https://your-project-id.web.app
```
o
```
https://your-project-id.firebaseapp.com
```

## 📝 Notas

- El sitio está optimizado para SEO con meta tags apropiados
- Incluye Google Fonts (Inter y Outfit) para tipografía premium
- Todas las animaciones están optimizadas para 60fps
- El código es TypeScript-first para mejor mantenibilidad

## 🤝 Contacto

**Jhulian Ramírez**
- 📧 Email: ramirezjhulian7@gmail.com
- 💼 LinkedIn: [linkedin.com/in/jhulianramirez](https://www.linkedin.com/in/jhulianramirez/)
- 📱 Phone: +57 321 884 5427
- 📍 La Ceja, Antioquia, Colombia

---

Desarrollado con ❤️ usando React + TypeScript + Vite
