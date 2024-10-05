
Find ADCS via the Domain Controller

```bash
nxc ldap <dc_ip> -u user@domain.local -p password -M adcs
```

Example:

```bash
garffff@garffff:~/GOAD/adcs/esc1$ nxc ldap 192.168.56.12 -u khal.drogo -p horse -M adcs
SMB         192.168.56.12   445    MEEREEN          [*] Windows Server 2016 Standard Evaluation 14393 x64 (name:MEEREEN) (domain:essos.local) (signing:True) (SMBv1:True)
LDAP        192.168.56.12   389    MEEREEN          [+] essos.local\khal.drogo:horse 
ADCS        192.168.56.12   389    MEEREEN          [*] Starting LDAP search with search filter '(objectClass=pKIEnrollmentService)'
ADCS        192.168.56.12   389    MEEREEN          Found PKI Enrollment Server: braavos.essos.local
ADCS        192.168.56.12   389    MEEREEN          Found CN: ESSOS-CA
```

Install Certipy:

```bash
pip3 install certipy-ad
```

Enumerate ADCS:

```bash
certipy find -u user@domain.local -p password [-vulnerable] -dc-ip <dc_ip>
```

Example:

```bash
garffff@garffff:~/GOAD/adcs/esc1$ certipy find -u khal.drogo@essos.local -p 'horse' -dc-ip 192.168.56.12
Certipy v4.8.2 - by Oliver Lyak (ly4k)

[*] Finding certificate templates
[*] Found 39 certificate templates
[*] Finding certificate authorities
[*] Found 1 certificate authority
[*] Found 17 enabled certificate templates
[*] Trying to get CA configuration for 'ESSOS-CA' via CSRA
[*] Got CA configuration for 'ESSOS-CA'
[*] Saved BloodHound data to '20241005173858_Certipy.zip'. Drag and drop the file into the BloodHound GUI from @ly4k
[*] Saved text output to '20241005173858_Certipy.txt'
[*] Saved JSON output to '20241005173858_Certipy.json'
```

**It is important to note that the ADCS IP address may differ from the domain contoller**
***GOAD:***
DC: 192.168.56.12 (MEEREEN)
ADCS: 192.168.56.23 (BRAAVOS)