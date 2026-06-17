# Stage 1: compile mbtileserver
FROM golang:1.23-alpine3.20 AS builder

WORKDIR /
RUN apk add --no-cache git build-base
COPY . .

RUN GOOS=linux go build -o /mbtileserver


# Stage 2: start from a smaller image
FROM alpine:3.20

WORKDIR /

# Link libs to get around issues using musl
RUN mkdir /lib64 && ln -s /lib/libc.musl-x86_64.so.1 /lib64/ld-linux-x86-64.so.2

# copy the executable to the empty container
COPY --from=builder /mbtileserver /mbtileserver

# carpeta por defecto para tiles
RUN mkdir -p /tilesets

# copia el tile por defecto (ajustá el nombre/ruta según tu repo)
COPY ./src/data/argentina.mbtiles /tilesets/argentina.mbtiles

# arranque por defecto usando esa carpeta
ENTRYPOINT ["/mbtileserver", "--tilesets", "/tilesets"]
