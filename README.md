# 🌸 Velvet Sakura — Frontend

SPA en **React + Vite** para *Velvet Sakura*, una web de tarot inspirada en Cardcaptor Sakura. Permite elegir entre el mazo Sakura y el mazo Clow, formular una pregunta, revelar una tirada de tres cartas y recibir una interpretación mágica generada por IA — todo con un tema visual claro/oscuro que cambia según el mazo elegido.

---

## ✨ Características

- **Intro animada** la primera vez que se visita la web, explicando la mecánica del tarot.
- **Registro y login** con verificación de cuenta por email y recuperación de contraseña por código.
- **Selector de mazo** (Sakura / Clow) con carrusel 3D de cartas y cambio de tema automático.
- **Preguntas al tarot**, con opción de tirada libre sin pregunta.
- **Interpretación con IA**, mostrada en un modal con fondo decorativo propio.
- **Sistema de progreso**: barra de experiencia, nivel, créditos ("Plumas de Yue") y logros, visibles en el perfil.
- **Historial de lecturas** paginado, con reproducción de cada tirada guardada.
- **Reproductor de música** flotante: repetir una canción en bucle, hilo musical completo, o silencio.
- **Efecto de sonido** al barajar las cartas.
- **Gestión de perfil**: cambio de nombre, galería de avatares, y eliminación de cuenta con doble confirmación.
- **Tema Sakura/Clow** con paleta, decoraciones (pétalos / círculo astral) y estilos de botones adaptados automáticamente.
- **Diseño responsive**, con paginación y navegación adaptadas a móvil.

---

## 🛠️ Stack técnico

| Categoría | Tecnología |
|---|---|
| Framework | React 19 |
| Bundler | Vite |
| Enrutado | React Router |
| Estilos | CSS Modules + variables CSS por tema |
| Peticiones HTTP | Axios |
| Fechas | date-fns |
| Testing | Vitest + React Testing Library |

---

## 📁 Estructura del proyecto

```
src/
├── assets/              # Imágenes, audio, loading screen
├── components/
│   ├── atoms/             # Componentes mínimos (Button, Modal, PasswordInput...)
│   ├── molecules/           # Composiciones (ReadingCard, AvatarGallery, UserMenu...)
│   └── organisms/             # Bloques completos (Header, BoardCards, TarotDeck...)
├── constants/                 # Catálogo de avatares y banda sonora
├── context/                    # Providers de Auth, Theme, Toast, Audio
├── hooks/                        # useAuth, useTheme, useToast, useAudioPlayer
├── layout/                        # Layout general y RootProviders
├── pages/                          # Páginas (Home, Register, Profile, Loading...)
├── router/                          # Configuración de rutas + PrivateRoute
├── services/                         # Clientes de API (apiAccount, apiReading...)
└── utils/                             # Utilidades (validación de JWT)
```

---

## ⚙️ Configuración

El backend debe estar corriendo en `http://localhost:3000` (o ajusta la `baseURL` en `src/services/httpClient.js`).

---

## 🚀 Puesta en marcha

```bash
npm install
npm run dev
```

La app arranca en `http://localhost:5173`.

---

## 🧪 Testing

```bash
npm run test
```

Cobertura incluida:
- **Componentes**: `Button`, `Modal`, `Toast`, `ToastContainer`, `CheckButton`, `EditButton`, `PasswordInput`, `ScrollToTopHistory`, `ThemeDecoration`,`AchievmentsList`,`AvatarGallery`,`Deck`,`DeleteButton`,`DropButton`,`InterpretationModalBackground`,`MusicPlayer`,`ProgressBar`,`ReadingCard`,`ToastContainer`,`UserMenu`,`BoardCards`,`DataForm`,`DeckSelect`,`Header`,`HistoryCards`,`LoadingScreen`,`LoginForm`,`RegisterForm`,`SavedReading`,`TarotDeck`,
- **Formularios**: `LogForm`, `RegForm`, `ForgotPassword`
- **Páginas**: `DeckSelect`, `AskQuestion`, `Profile`,`ConfirmDeleteAccount`,`DataResults`,`ForgotPassword`,`History`,`Home`,`Intro`,`Loading`,`ProfileReading`,`Register`,`ResetPassword`,`Start`,`TarotResults`,`VerifyAccount`
- **Hooks**: `useAuth`, `useToast`, `useTheme`,`useAudioPlayer`
- **Servicios**: `api`,`apiAccount`,`apiInterpretation`,`apiProgress`, `apiReading`,`apiSakura`,`apiSave`,`httpClient`

---

## 🔐 Rutas protegidas

Las páginas que requieren sesión activa (`/readings`, `/history`, `/profile-settings`, etc.) están agrupadas bajo `PrivateRoute`, que redirige a `/home` si no hay usuario autenticado o el token JWT ha caducado. Cualquier respuesta `401`/`403` del backend cierra la sesión automáticamente vía el interceptor de `httpClient`.

---

## 🎨 Temas

La paleta completa vive en variables CSS (`index.css`), con dos variantes:

- `:root` — tema **Sakura** (claro, tonos pastel rosa/dorado).
- `[data-theme="clow"]` — tema **Clow** (oscuro, tonos violeta/morado).

El atributo `data-theme` se aplica al `<html>` dinámicamente según el mazo elegido en cada tirada.

## Autora
Jennifer Cros

## Versión
Velvet Sakura V 8.0.1