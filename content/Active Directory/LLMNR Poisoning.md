
**LLMNR/NetBIOS lookups** are used by Windows when DNS fails to resolve a hostname. Because these requests are broadcast over the local network, a malicious host can intercept and respond to them. By running **Responder**, an attacker can capture Net-NTLMv2 password hashes through a Man-in-the-Middle (MitM) attack on the challenge/response messages that are part of the NTLM authentication protocol.

```bash
responder -I eth0
```

User goes to a share that does not exist:

![[Pasted image 20240810230946.png]]

NTLMv2 password is captured:

![[Pasted image 20240810231015.png]]

To crack

```bash
hashcat -m 5600 ntlmv2.hashcat /opt/rockyou.txt
```
