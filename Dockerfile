FROM maptiler/tileserver-gl:latest
COPY src/data/argentina.mbtiles /data/argentina.mbtiles
EXPOSE 8080
CMD ["--file=/data/argentina.mbtiles", "--port=8080"]
