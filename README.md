# id_skills 🚀

Un entorno de desarrollo interactivo y panel de control premium para gestionar, instalar y depurar **Agent Skills** (habilidades de agentes de IA) y **Especialistas de OpenCode / Claude Code**.

---

## ✨ Características Principales

*   🎨 **Diseño Visual Premium**: Interfaz moderna rediseñada con la paleta *Dark Developer / Builder* inspirada en las pautas de la skill **brandkit** (fondos obsidiana profundos, acentos violeta eléctricos y bordes minimalistas).
*   📦 **Instalación Inteligente de Skills**: Sistema de instalación de dos niveles que utiliza el CLI oficial de `skills` (`npx skills add`) y un mecanismo de respaldo inteligente que escanea repositorios de GitHub mediante su árbol de archivos para resolver discrepancias en nombres de carpetas.
*   💻 **Terminal Interactivo (Playground)**: Ejecuta y depura agentes en tiempo real a través de Server-Sent Events (SSE) con retroalimentación en streaming directamente en el panel.
*   🌐 **UX Sincronizada**: Persistencia de selección de idioma (Español/Inglés) entre múltiples modales de manera persistente utilizando `localStorage`.
*   📊 **Estadísticas en Tiempo Real**: Panel de control con visualización rápida de cantidad de skills locales, agentes disponibles, frameworks detectados y modos activos.

---

## 🛠️ Estructura del Proyecto

```bash
id_skills/
├── skill-dashboard/     # Código fuente del panel de control
│   ├── frontend/        # React + Vite (Tailwind CSS v4)
│   └── backend/         # Node.js + Express (Servicios de escaneo y terminal SSE)
└── README.md            # Este archivo
```

---

## 🚀 Inicio Rápido

### Requisitos Previos

Asegúrate de tener instalados:
*   [Node.js](https://nodejs.org/) (v18 o superior)
*   [Git](https://git-scm.com/)

### Instrucciones de Ejecución

El proyecto incluye un script de PowerShell para levantar ambos servidores simultáneamente:

1. Abre una terminal de PowerShell en la carpeta `skill-dashboard`.
2. Ejecuta el script de inicio:
   ```powershell
   ./start.ps1
   ```
3. El frontend estará disponible en `http://localhost:5173` y el backend en `http://localhost:3001`.

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
