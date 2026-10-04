import React from 'react';

export default function LoginScreenWireframe() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <section style={{ maxWidth: '400px', width: '100%' }}>
        {/* Header */}
        <header>
          <h1>Sistema Nacional de Aranceles</h1>
          <h2>Plataforma Institucional de Control Arancelario</h2>
        </header>
        {/* Form */}
        <form>
          <div>
            <label htmlFor="email">Correo Institucional</label>
            <input type="email" id="email" name="email" />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" />
          </div>
          <div>
            <a href="#">Restablecer acceso</a>
          </div>
          <button type="submit">Ingresar al Sistema</button>
        </form>
        {/* Footer */}
        <footer style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem' }}>
          © 2026 FASITLAC • Todos los derechos reservados
        </footer>
      </section>
    </div>
  );
}
