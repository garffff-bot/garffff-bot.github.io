| Name   | Difficulty | OS    | Target IP     | Link                                               |
| ------ | ---------- | ----- | ------------- | -------------------------------------------------- |
| Boxing | Medium     | Linux | 192.168.0.112 | https://hackmyvm.eu/machines/machine.php?vm=Boxing |
### ARP Scan

```bash
gareth@gareth:~/hackmyvm/boxing$ sudo arp-scan -l | grep b6
192.168.0.112	08:00:27:22:13:b6	PCS Systemtechnik GmbH
```

### Nmap Scan