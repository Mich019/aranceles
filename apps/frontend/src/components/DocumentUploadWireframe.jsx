import React from 'react';

export default function DocumentUploadWireframe() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Barra de Navegación Superior */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', borderBottom: '1px solid #ccc' }}>
        {/* Lado izquierdo: Título */}
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Sistema Nacional de Aranceles</h1>

        {/* Lado derecho: Usuario + Cerrar Sesión */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Diego Ramírez — <strong>Administrador</strong></span>
          <button type="button">Cerrar Sesión</button>
        </div>
      </header>

      {/* Área Principal */}
      <main style={{ flex: 1, maxWidth: '720px', width: '100%', margin: '0 auto', padding: '2rem 1rem' }}>

        {/* Sección 1: Encabezado de vista */}
        <section>
          <h2>Ingesta de Documentos</h2>
          <p>
            Cargue los archivos arancelarios para su procesamiento e incorporación al sistema.
            Los documentos serán validados automáticamente antes de su registro.
          </p>
        </section>

        {/* Sección 2: Dropzone de Carga */}
        <section style={{ marginTop: '2rem' }}>
          <div
            role="region"
            aria-label="Zona de carga de archivos"
            style={{
              border: '2px dashed #999',
              borderRadius: '8px',
              padding: '3rem 2rem',
              textAlign: 'center',
            }}
          >
            {/* Placeholder de icono de archivo */}
            <div style={{ fontSize: '3rem', lineHeight: 1 }}>&#128196;</div>

            {/* Texto de instrucción principal */}
            <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>
              Arrastre y suelte sus archivos aquí
            </p>

            {/* Botón explícito */}
            <button type="button" style={{ marginTop: '1rem' }}>
              Seleccionar archivo desde el equipo
            </button>

            {/* Texto secundario: extensiones permitidas */}
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
              Formatos permitidos: .pdf, .xlsx, .csv, .xml — Tamaño máximo: 25 MB
            </p>
          </div>
        </section>

        {/* Sección 3: Estado de Carga (Componente Simulado) */}
        <section style={{ marginTop: '2rem' }}>
          <h3>Archivos en cola</h3>

          {/* Fila de archivo simulada */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #ddd' }}>
            {/* Icono de archivo */}
            <span style={{ fontSize: '1.5rem' }}>&#128196;</span>

            {/* Nombre del archivo */}
            <span style={{ flex: 1 }}>arancel_importaciones_2026.pdf</span>

            {/* Peso */}
            <span>3.2 MB</span>

            {/* Barra de progreso */}
            <progress value="65" max="100" style={{ width: '120px' }}>65%</progress>

            {/* Botón cancelar / eliminar */}
            <button type="button">✕</button>
          </div>
        </section>

      </main>

      {/* Pie de página */}
      <footer style={{ textAlign: 'center', padding: '1rem', fontSize: '0.85rem' }}>
        © 2026 FASITLAC • Todos los derechos reservados
      </footer>
    </div>
  );
}
