# tileserver-gl — Argentina

Imagen Docker basada en [tileserver-gl](https://github.com/maptiler/tileserver-gl) que sirve el tileset vectorial `argentina.mbtiles` como tiles raster PNG.

## Prerequisitos

Copiar el archivo `argentina.mbtiles` a la raíz del repo antes de buildear:

```bash
cp /ruta/al/archivo/argentina.mbtiles .
```

> El archivo pesa ~871 MB y **no se versiona** en este repo (ver `.gitignore`).

---

## Build

```bash
docker build -t tileserver-gl-argentina .
```

La imagen final pesa aproximadamente 900 MB (base tileserver-gl + mbtiles embebido).

---

## Run local

```bash
docker run -d --name tileserver \
  -p 8080:8080 \
  tileserver-gl-argentina
```

---

## Verificar

```bash
curl http://localhost:8080/health
```

Abrir en browser:

```
http://localhost:8080/styles/basic-preview/256/15/11072/19748.png
```

---

## Endpoints

| Recurso | URL |
|---|---|
| Health | `http://localhost:8080/health` |
| Tile PNG | `http://localhost:8080/styles/basic-preview/256/{z}/{x}/{y}.png` |
| Vista previa | `http://localhost:8080/` |

---

## Push al ACR

```bash
docker tag tileserver-gl-argentina {ACR_FULL_NAME}/tileserver-gl-argentina:2026.06.17
docker push {ACR_FULL_NAME}/tileserver-gl-argentina:2026.06.17
```

---

## Configuración de la API consumidora

```yaml
TileApi__BaseUrl: "http://tileserver-gl-svc:8080"
TileApi__TilesetId: "basic-preview"
TileApi__Formato: "png"
TileApi__UrlTemplate: "{BaseUrl}/styles/{TilesetId}/256/{z}/{x}/{y}.{Formato}"
```
