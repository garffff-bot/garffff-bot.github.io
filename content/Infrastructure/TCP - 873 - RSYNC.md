Enumeration:

First `backups` is the share name, the second a comment.

```bash
rsync 10.10.102.240::
backups        	backups
```

Connect with no credentials:

```bash
rsync -av --list-only rsync://10.10.102.240/backups
receiving incremental file list
drwxr-xr-x          4,096 2024/05/02 14:26:31 .
-rw-r--r--    376,289,280 2024/05/02 14:26:19 jenkins.tar.gz

sent 24 bytes  received 82 bytes  212.00 bytes/sec
total size is 376,289,280  speedup is 3,549,898.87
```

Connect with credentials

```bash
rsync -av --list-only rsync://<user>@<ip address>/<share>
Password:<password>
```

Copy file:

```bash
rsync -av rsync://10.10.102.240/backups/jenkins.tar.gz .
```

