---
trigger: always_on
---

# Guía y Reglas de Diseño: Interfaz Limpia Institucional (Clean Modern UI)

Este documento define las directrices del diseño de interfaz para el proyecto **Sistema Nacional de Aranceles**. Todas las vistas, pantallas y componentes deben seguir estrictamente estas reglas.

---

## 🎨 1. Principios Visuales y Paleta de Colores

- **Lienzo de Fondo**: `#f1f5f9` (Gris slate muy suave).
- **Tarjetas y Paneles**: `#ffffff` con bordes nítidos de 1px (`#e2e8f0`) y sin sombras recargadas (`shadow-sm` o sin sombra).
- **Azul Primario de Acción**: `#2563eb` (Azul corporativo institucional).
- **Campos de Texto**: `#f8fafc` con borde `#cbd5e1` que se ilumina a azul `#2563eb` al recibir foco.
- **Tipografía y Textos**:
  - Títulos principales: `#0f172a` / `#1e293b`
  - Subtítulos y etiquetas: `#64748b`

---

## 🚫 2. Regla Mandatoria: Sin Menciones de Requisitos ni Módulos

Queda **estrictamente prohibido** incluir en la interfaz visual de usuario cualquier referencia técnica, tales como:

1. **Requerimientos Funcionales**: Queda prohibido mostrar códigos o prefijos como `RF-001`, `RF-002`, `RF-003`, `RF-008`, `RF-009`, `RF-010`, etc.
2. **Módulos del Sistema**: Queda prohibido mostrar nombres internos o etiquetas como `Módulo 01`, `Módulo de Autenticación / Identidad`, `Demostración RF`, etc.
3. **Contadores de Pasos Técnicos**: Queda prohibido mostrar rótulos de prueba como `Paso 1 de 3 (RF-010)`.

---

## 🏛️ 3. Presentación Profesional e Institucional

Toda pantalla debe reflejar una aplicación real en producción con branding institucional limpio:
- **Título Oficial**: Sistema Nacional de Aranceles
- **Subtítulo**: Plataforma Institucional de Control Arancelario
- **Pie de Página Oficial**: `© 2026 FASITLAC • Todos los derechos reservados`
