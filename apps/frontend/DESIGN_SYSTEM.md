# Sistema de Diseño: Interfaz Institucional Limpia

Guía oficial del sistema de diseño para el frontend de **Sistema Nacional de Aranceles**.

---

## 🚫 Regla Estricta: Prohibición de Mención de Requisitos y Módulos

En la interfaz de usuario visible **nunca se deben mostrar**:
- Códigos de requerimientos funcionales (`RF-001`, `RF-002`, `RF-003`, `RF-008`, `RF-009`, `RF-010`, etc.).
- Identificadores de módulos internos (`Módulo 01`, `Módulo de Autenticación`, etc.).
- Textos de demostración técnica.

La interfaz debe mantener siempre una imagen limpia, seria y de nivel de producción profesional.

---

## 🎨 Paleta de Colores

| Elemento | Variable / Hex | Descripción |
| :--- | :--- | :--- |
| **Fondo Base** | `--bg-page: #f1f5f9` | Gris slate suave de lienzo |
| **Tarjeta** | `--card-bg: #ffffff` | Blanco puro con borde `#e2e8f0` |
| **Azul Primario** | `--accent-blue: #2563eb` | Acciones principales y foco |
| **Texto Principal** | `#1e293b` | Títulos y cuerpo de texto |
| **Texto Secundario** | `#64748b` | Subtítulos y etiquetas |

---

## 📦 Clases de Utilidad CSS (`index.css`)

### 1. `.clean-card`
Usado para tarjetas y paneles institucionales.
```css
.clean-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
}
```

### 2. `.clean-input`
Usado para campos de texto.
```css
.clean-input {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
}
```

### 3. `.clean-button-primary`
Botón de acción principal institucional.
```css
.clean-button-primary {
  background-color: #2563eb;
  color: #ffffff;
}
```

---

## 🧩 Componentes Disponibles (`src/components/`)

- **`SkeuomorphicPanel.jsx`**: Tarjeta contenedora principal con branding institucional.
- **`RecessedInput.jsx`**: Campo de texto limpio con icono y conmutador de visibilidad.
- **`SoftButton.jsx`**: Botones de acción institucional (`primary`, `secondary`).
- **`LoginForm.jsx`**: Formulario de inicio de sesión.
- **`RecoveryForm.jsx`**: Flujo de recuperación de contraseña.
- **`DashboardContextPanel.jsx`**: Tablero de control de contexto (roles, equipos, origen de identidad).
- **`RoleBadgePlate.jsx`**: Placas indicadoras de asignación de rol.
- **`RotaryDialSelector.jsx`**: Selector de aislamiento de datos por equipo/cliente.
- **`IdentitySourceBadge.jsx`**: Indicador de mapeo del sistema anfitrión vs local.
