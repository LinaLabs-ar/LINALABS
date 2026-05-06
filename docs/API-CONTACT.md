# Contact API Documentation

## Current Implementation

Formulario de contacto utiliza `mailto:` links que abren el cliente de email del usuario.

### Endpoint

```
mailto:hello@linalabs.ar?subject=[Service Name]&body=[User Message]
```

**Parámetros:**
- `subject`: Nombre del servicio (auto-filled)
- `body`: Mensaje predefinido (opcional, user puede editar)

**Ejemplo:**
```html
<a href="mailto:hello@linalabs.ar?subject=Diseño Gráfico&body=Interesado en servicios de branding">
  Contáctanos
</a>
```

## Future: CMS Integration

Cuando la consola se integre con CMS (Contentful, Sanity), este endpoint manejará:

```
POST /api/contact
Content-Type: application/json

{
  "service": "diseño",
  "name": "John Doe",
  "email": "john@company.com",
  "message": "Interesado en servicios de branding",
  "phone": "+54 911 2345-6789"
}
```

Response:
```json
{
  "status": "success",
  "messageId": "msg_12345",
  "timestamp": "2026-05-05T14:30:00Z",
  "confirmationEmail": "sent"
}
```

## Database Schema (Future)

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY,
  service VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  status ENUM('new', 'responded', 'closed') DEFAULT 'new'
);
```

**Índices:**
- `created_at DESC` (por timestamp)
- `status` (para filtrado)
- `email` (para búsqueda)
