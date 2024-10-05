
Find via Domain Controller

```bash
nxc ldap <dc_ip> -u user@domain.local -p password -M adcs
```

Once IP has been found for the ADCS, enumerate:

```bash
certipy find -u user@domain.local -p password [-vulnerable] -dc-ip <adcs_ip>
```