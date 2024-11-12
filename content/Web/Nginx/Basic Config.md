### Configuration file

This file will set up a web server on port 7777 and expose the `/root` directory:

```bash
daemon off;
worker_processes 2;
user root;

events {
    use epoll;
    worker_connections 128;
}

http {
    server_tokens off;

    server {
        server_name localhost;
        listen 127.0.0.1:7777;

        error_page 500 502 503 504 /50x.html;

        location / {
            root /root;
            autoindex on;  # Optional: Enables directory listing
        }

        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
```

### Run

Execute the configuration file:

```bash
sudo nginx -c /tmp/config.conf
```
