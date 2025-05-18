Smbpassword:

```
smbpasswd -r <remote_server_ip> -U <username>
```

Net RPC:

```
net rpc password <username> <newpassword> -U <adminuser%adminpassword> -I <remote_server_ip>
```
