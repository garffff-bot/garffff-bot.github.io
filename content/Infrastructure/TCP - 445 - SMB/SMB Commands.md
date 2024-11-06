### View Shares

```bash
smbmap -H <ip>
smbmap -H <ip> -u <user> -p '<LM_hash>:<NTLMv2_hash>' -d domain 
smbmap -H <ip> -u <user> -p '<password>' -d domain 
nxc smb <ip> -i <user> -P/-H <password><HTLMv2_hash> --shares
```

### Access Shares

```bash
smbclient //<ip>/<share_name> -U '<domain>\<username>%<password>'
smbclient //<ip>/<share_name> -U '<domain>\<username>' --pw-nt-hash <NTLMv2_hash>
```


