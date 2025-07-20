List containers:

```bash
docker ps -a
```

Remove a stopped container:

```bash
sudo docker rm 0456c56697be
```

View unused containers:

```bash
docker ps -a --filter "status=exited"
```

List images:

```bash
sudo docker image ls
```

Remove an image:

```bash
sudo docker rmi d00cee8215ed
```


