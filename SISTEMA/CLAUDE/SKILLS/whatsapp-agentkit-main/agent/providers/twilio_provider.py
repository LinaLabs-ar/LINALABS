"""
Twilio WhatsApp Provider
Integración con Twilio para mensajes de WhatsApp
"""

import os
import logging
from typing import Optional, Dict, Any
import httpx

logger = logging.getLogger(__name__)


class TwilioProvider:
    """Proveedor de WhatsApp via Twilio"""

    def __init__(self):
        self.account_sid = os.getenv("TWILIO_ACCOUNT_SID")
        self.auth_token = os.getenv("TWILIO_AUTH_TOKEN")
        self.phone_number = os.getenv("TWILIO_PHONE_NUMBER")
        self.base_url = f"https://api.twilio.com/2010-04-01"

        if not all([self.account_sid, self.auth_token, self.phone_number]):
            raise ValueError(
                "Credenciales de Twilio incompletas. "
                "Verifica TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER"
            )

    async def send_message(self, to_number: str, message: str) -> bool:
        """
        Envía un mensaje de WhatsApp via Twilio

        Args:
            to_number: Número destino (con código de país, ej: +5491112345678)
            message: Texto del mensaje

        Returns:
            True si se envió exitosamente, False si falló
        """

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/Accounts/{self.account_sid}/Messages.json",
                    auth=(self.account_sid, self.auth_token),
                    data={
                        "From": f"whatsapp:{self.phone_number}",
                        "To": f"whatsapp:{to_number}",
                        "Body": message,
                    },
                    timeout=30.0
                )

                return response.status_code == 201

        except Exception as e:
            logger.error(f"Error enviando mensaje via Twilio: {str(e)}")
            return False

    async def send_media(
        self,
        phone: str,
        media_url: str,
        media_type: str,
        caption: Optional[str] = None
    ) -> bool:
        """
        Envía un archivo multimedia (imagen, video, documento) via Twilio WhatsApp API.

        Soporta envío de media usando URLs públicas HTTPS. La URL debe apuntar a un
        archivo accesible sin autenticación. Twilio descargará el archivo de esa URL.

        Args:
            phone: Número de teléfono del destinatario. Puede incluir o no el prefijo
                   "whatsapp:" — se normaliza automáticamente.
                   Ej: "+5491112345678" o "whatsapp:+5491112345678"
            media_url: URL HTTPS pública del archivo multimedia. DEBE ser HTTPS por seguridad.
                       Ej: "https://example.com/image.jpg"
            media_type: Tipo MIME del archivo. Ejemplos válidos:
                       - Imágenes: "image/jpeg", "image/png", "image/webp"
                       - Documentos: "application/pdf", "text/plain", "application/msword"
                       - Videos: "video/mp4", "video/3gpp"
                       - Audio: "audio/aac", "audio/mp4", "audio/mpeg"
            caption: Texto opcional que acompaña a la media (solo para imágenes y videos).
                    Ignorado si media_type es documento o audio.
                    Ej: "Mira esta imagen"

        Returns:
            bool: True si el mensaje se envió exitosamente (status 201), False si falló.

        Raises:
            Ninguna excepción directa — los errores se registran y se retorna False.

        Ejemplos:
            # Enviar imagen con caption
            await provider.send_media(
                phone="+5491112345678",
                media_url="https://cdn.example.com/foto.jpg",
                media_type="image/jpeg",
                caption="Mira esta foto"
            )

            # Enviar documento sin caption
            await provider.send_media(
                phone="whatsapp:+5491112345678",
                media_url="https://example.com/contrato.pdf",
                media_type="application/pdf"
            )

            # Enviar video con caption
            await provider.send_media(
                phone="+5491112345678",
                media_url="https://videos.example.com/demo.mp4",
                media_type="video/mp4",
                caption="Demostración de producto"
            )
        """

        # Validar que la URL sea HTTPS
        if not media_url.startswith("https://"):
            logger.warning(
                f"URL de media rechazada (no HTTPS): {media_url}. "
                "Las URLs deben ser HTTPS por seguridad."
            )
            return False

        # Normalizar número de teléfono — remover prefijo "whatsapp:" si está presente
        phone = phone.replace("whatsapp:", "").strip()

        try:
            # Construir datos del formulario para la API de Twilio
            data = {
                "From": f"whatsapp:{self.phone_number}",
                "To": f"whatsapp:{phone}",
                "MediaUrl": media_url,
            }

            # Agregar caption solo si se proporciona y si el tipo de media lo soporta
            # Los tipos que soportan caption en WhatsApp son: image/* y video/*
            if caption and (media_type.startswith("image/") or media_type.startswith("video/")):
                data["Caption"] = caption
                logger.debug(f"Caption agregado a media: {caption}")

            # Realizar la solicitud POST a Twilio API
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/Accounts/{self.account_sid}/Messages.json",
                    auth=(self.account_sid, self.auth_token),
                    data=data,
                    timeout=30.0
                )

                # Twilio retorna 201 Created si el mensaje se envió exitosamente
                if response.status_code == 201:
                    logger.info(
                        f"Media enviada exitosamente a {phone} "
                        f"(tipo: {media_type}, tamaño: desconocido desde URL)"
                    )
                    return True
                else:
                    # Registrar detalles del error para debugging
                    logger.error(
                        f"Error al enviar media via Twilio. "
                        f"Status: {response.status_code}, "
                        f"Response: {response.text}"
                    )
                    return False

        except Exception as e:
            logger.error(f"Excepción al enviar media via Twilio: {str(e)}")
            return False

    async def parse_webhook(self, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Parsea un webhook de Twilio (texto y media).

        Extrae información básica del mensaje (remitente, destinatario, cuerpo)
        y procesa adjuntos multimedia si están presentes. Para cada archivo multimedia,
        se obtiene la URL y tipo de contenido, con fallback a 'application/octet-stream'
        si el tipo no es especificado.

        Args:
            data: Diccionario con datos POST del webhook de Twilio.
                  Debe contener al menos "From" y "Body".

        Returns:
            Diccionario con estructura:
            {
                "from": str,           # Número de teléfono del remitente (sin "whatsapp:")
                "to": str,             # Número de teléfono del destinatario (sin "whatsapp:")
                "body": str,           # Texto del mensaje
                "media": [...]         # Lista de media (opcional, solo si NumMedia > 0)
            }
            Retorna None si faltan campos requeridos (From o Body).
        """

        # Validar campos requeridos
        if "From" not in data or "Body" not in data:
            logger.warning("Webhook incompleto: falta 'From' o 'Body'")
            return None

        result: Dict[str, Any] = {
            "from": data.get("From", "").replace("whatsapp:", ""),
            "to": data.get("To", "").replace("whatsapp:", ""),
            "body": data.get("Body", ""),
        }

        # Procesar media si está presente
        try:
            num_media = int(data.get("NumMedia", 0))
        except (ValueError, TypeError):
            logger.warning(f"NumMedia inválido: {data.get('NumMedia')}")
            num_media = 0

        if num_media > 0:
            media: list[Dict[str, str]] = []
            for i in range(num_media):
                url_key = f"MediaUrl{i}"
                type_key = f"MediaContentType{i}"
                if url_key in data:
                    media_type = data.get(type_key, "application/octet-stream")
                    media.append({
                        "url": data[url_key],
                        "type": media_type
                    })
                    logger.debug(f"Media procesado: {url_key} (tipo: {media_type})")
            if media:
                result["media"] = media

        return result
