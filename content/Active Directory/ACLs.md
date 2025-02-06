There are two types of ACLs:

1. `Discretionary Access Control List` (`DACL`) - defines which security principals are granted or denied access to an object. DACLs are made up of ACEs that either allow or deny access. When someone attempts to access an object, the system will check the DACL for the level of access that is permitted. If a DACL does not exist for an object, all who attempt to access the object are granted full rights. If a DACL exists, but does not have any ACE entries specifying specific security settings, the system will deny access to all users, groups, or processes attempting to access it.
    
2. `System Access Control Lists` (`SACL`) - allow administrators to log access attempts made to secured objects.
### Enumeration

Using `Find-InterestingDomainAcl` gives us a ton of information, and it would be impossible to go through it all.

```bash
Import-Module .\PowerView.ps1
Find-InterestingDomainAcl
```

Try to break it down:

```bash
$sid = Convert-NameToSid <username>
Get-DomainObjectACL -Identity * | ? {$_.SecurityIdentifier -eq $sid}
```

Look for `ObjectAceType` (GUID). This is just numbers, 

```bash
Get-DomainObjectACL -Identity * | ? {$_.SecurityIdentifier -eq $sid}
```

but we can convert to text

```bash
Get-DomainObjectACL -ResolveGUIDs -Identity * | ? {$_.SecurityIdentifier -eq $sid}
```

The output below tells us that the user `wley` has `User-Force-Change-Password` control over the user `Dana Amundsen`. 

- The SecurityIdentifier `S-1-5-21-3842939050-3880317879-2865463114-1181` converts into `wley`:

```bash
AceQualifier           : AccessAllowed
ObjectDN               : CN=Dana Amundsen,OU=DevOps,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL
ActiveDirectoryRights  : ExtendedRight
ObjectAceType          : User-Force-Change-Password
ObjectSID              : S-1-5-21-3842939050-3880317879-2865463114-1176
InheritanceFlags       : ContainerInherit
BinaryLength           : 56
AceType                : AccessAllowedObject
ObjectAceFlags         : ObjectAceTypePresent
IsCallback             : False
PropagationFlags       : None
SecurityIdentifier     : S-1-5-21-3842939050-3880317879-2865463114-1181
AccessMask             : 256
AuditFlags             : None
IsInherited            : False
AceFlags               : ContainerInherit
InheritedObjectAceType : All
OpaqueLength           : 0
```

To find the user id of `Dana Amundsen`:

```bash
Get-ADUser -LDAPFilter "(distinguishedName=CN=Dana Amundsen,OU=DevOps,OU=IT,OU=HQ-NYC,OU=Employees,OU=Corp,DC=INLANEFREIGHT,DC=LOCAL)" -Properties sAMAccountName | Select-Object sAMAccountName
```

To find the ACL to a particular destination:

```bash
$sid = Convert-NameToSid forend
Get-DomainObjectACL -Identity "GPO Management" -ResolveGUIDs | ? {$_.SecurityIdentifier -eq $sid}
```

Note: Much easier to use Bloodhound then going through all this manually.

