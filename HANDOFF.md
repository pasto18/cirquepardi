# Cirque Pardi - traspaso del diseño de Figma a HTML

Figma: https://www.figma.com/design/yCeFK6To6N4ABs2ywGd31i/Untitled (archivo "Cirque Pardi - Web").
Diseño de escritorio a 1440px. Es un esqueleto: sin imágenes, solo cajas grises "Image". Tokens en `tokens.css`.

## Objetivo y decisiones
- Web de la compañía de circo Cirque Pardi. Referencia de contenido: https://www.cirquepardi.com
- Textos ahora en castellano; más adelante hay que volver al francés (preparar i18n ES/FR).
- Solo estas páginas: Home, Espectáculos, plantilla de espectáculo (una página por espectáculo), Agenda, Noticias, Contacto.
- Home: en la parte principal solo el texto "Cirque Pardi" en grande (estilo display), sin nada más.
- Todos los botones y enlaces deben navegar.
- Backend futuro muy sencillo (panel de administración): crear/editar/eliminar espectáculos, subir fotos, añadir fechas de agenda, gestionar noticias. Los datos deben vivir fuera del HTML (JSON/API).

## Componentes compartidos
- **Cabecera:** logo "CIRQUE PARDI!" (rojo accent, h3) a la izquierda, enlaces a la derecha: Espectáculos, Agenda, Noticias, Contacto. Fondo blanco, borde inferior 1px. Padding 64px horizontal, 16px vertical.
- **Pie:** fondo surface. 3 columnas: dirección (2564 route de Labastide, 31450 BAZIEGE, France + frase de la compañía), navegación, newsletter (campo email + botón). Línea legal: SIRET 534 440 946 00026 · APE 9001Z · Licencias 21-000384 / 21-000385 / 21-000386 · Avisos legales.
- **Botón primario:** píldora rojo accent, texto blanco, "Reservar". **Secundario:** píldora con borde rojo 1.5px, texto rojo.
- **Tarjeta de espectáculo:** imagen 260px alto, título h3, meta pequeña gris, descripción, botón secundario "Más información". 3 por fila, hueco 40px.
- **Tarjeta de noticia:** fondo surface, radio 8, padding 24; fecha, título h3, extracto, enlace "Leer más →".
- **Fila de agenda:** fecha en rojo h3 (260px), bloque título del espectáculo en mayúsculas + lugar en gris, botón "Reservar" a la derecha (enlace a la taquilla https://billetterie.festik.net/cirquepardi/). Borde inferior 1px.
- **Campo de formulario:** etiqueta pequeña + caja con borde, radio 4. Variante textarea de 160px.

## Páginas
1. **Home:** cabecera, sección principal (fondo surface, 720px alto, "Cirque Pardi" centrado), pie.
2. **Espectáculos:** h1, texto de introducción, h2 "En cartel y próximamente", cuadrícula 3x2: Low Cost Paradise, Bleu électrique, Flux, Smala Cabaret, Borderland, Rouge Nord.
3. **Espectáculo (plantilla):** h1 título, frase de gancho, meta (duración · formato · público · año), botones Reservar / Ver las fechas, imagen grande 520px, columnas: Sinopsis + Disciplinas | ficha técnica (tarjeta 420px), Reparto y equipo, Próximas fechas (2 filas de agenda). Páginas ya rellenas: Low Cost Paradise (datos reales) y Bleu électrique (provisional).
4. **Agenda:** h1, introducción, bloques por año (2027, 2026, 2025) con filas de agenda.
5. **Noticias:** h1, introducción, cuadrícula 3x2 de tarjetas de noticia (3 reales + 3 provisionales).
6. **Contacto:** h1, introducción, columna izquierda con grupos de contacto (Low Cost Paradise, Flux, Producción y administración, Régie técnica, Dirección), columna derecha formulario (Nombre, Email, Asunto, Mensaje, Enviar).

## Contenido real copiado de cirquepardi.com (en francés)
- Low Cost Paradise: "Messieurs Dame, bienvenue au paradis des oubliés…"; 1h30 bajo carpa, todos los públicos, creación colectiva 2019, ojo exterior Garniouze. Sinopsis: circo contemporáneo con pista circular, orquesta y clown; la vida como plató de cine eterno entre sombra y luz, ficción y realidad. Disciplinas: trapecio fijo, trapecio balanza, danza, bicicleta acrobática, cable, portés acrobáticos, payaso, malabares. Reparto: Carola Aramburu, Elske van Gelder, Julien Mandier, Maël Tebibi, Marta Torrents, Eva Ordoñez, Timothé Loustalot Gares, Maël Tortel; música Antoine Bocquet; producción y técnica Anthony Caruana, Malika Louadoudi, Laura Cardona.
- Otros espectáculos: Smala Cabaret (cabaret 50 min, 2022), Borderland (75 min bajo carpa, 2014), Rouge Nord (ballet mecánico en espacio público, 45 min, 2018), Cabaready y Cabaret Pardi! (2013). Nuevas creaciones: Bleu électrique (2026), Flux y Chiennes (2027).
- Agenda de ejemplo: Low Cost Paradise 1-5 oct 2025 (La Glissade, Aurignac 31) y 20-26 dic 2025 (Tarragona, España); Bleu électrique 2026 (CNAREP Pronomade(s), Encausse-les-Thermes 31); Flux residencia (Cirk'Eole, Montigny-lès-Metz 57); Ay-Roop en Rennes.
- Noticias: 24 nov 2025 (últimas funciones en Tarragona), 6 sep 2025 (fin de Low Cost Paradise en Francia), 18 dic 2024 (nueva etapa creativa).
- Contactos: Laura Cardona (producción, Low Cost Paradise), Maël Tortel (contacto artístico), Lucile Malapert (dirección de producción, Flux), Julie Darramon (régie générale), Malika Louadoudi (administración), Michel Golzio (presidente), Eve Gerbenne (secretaria), Anthony Caruana (régisseur général). Teléfonos: no copiados, poner marcador.
