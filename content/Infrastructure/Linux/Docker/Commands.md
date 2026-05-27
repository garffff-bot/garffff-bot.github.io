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

If in a docker container, try these:

```bash
curl host.docker.internal -v 
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0* Host host.docker.internal:80 was resolved.
* IPv6: fdc4:f303:9324::254
* IPv4: 192.168.65.254
```

Scan all IPs and look for a `verion`. There maybe a CVE related to that version

Port to try

```bash
2375
2376
```

Examples: 

```bash
curl http://172.17.0.1:2375/version
curl http://172.17.0.1:2376/version
```

