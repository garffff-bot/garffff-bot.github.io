Bloodhound:

![[Pasted image 20260315113835.png]]

CLI:

```bash
*Evil-WinRM* PS C:\Users\Administrator\Documents> get-dnsserverzone

ZoneName                            ZoneType        IsAutoCreated   IsDsIntegrated  IsReverseLookupZone  IsSigned
--------                            --------        -------------   --------------  -------------------  --------
_msdcs.m3c.local                    Primary         False           True            False                False
0.in-addr.arpa                      Primary         True            False           True                 False
127.in-addr.arpa                    Primary         True            False           True                 False
255.in-addr.arpa                    Primary         True            False           True                 False
core.cyber.local                    Forwarder       False           True            False
cyber.local                         Forwarder       False           True            False
m3c.local                           Primary         False           True            False                False
TrustAnchors                        Primary         False           True            False                False

```

Find IP of cyber.local :

```bash
*Evil-WinRM* PS C:\Users\Administrator\Documents> dnscmd /zoneinfo cyber.local

Zone query result:

Zone info:
	ptr                   = 00000259E2DA72F0
	zone name             = cyber.local
	zone type             = 4
	shutdown              = 0
	paused                = 0
	update                = 0
	DS integrated         = 1
	read only zone        = 0
	in DS loading queue   = 0
	currently DS loading  = 0
	data file             = (null)
	using WINS            = 0
	using Nbstat          = 0
	aging                 = 0
	  refresh interval    = 0
	  no refresh          = 0
	  scavenge available  = 0
	Zone Masters
	Ptr          = 00000259E2DA7770
	MaxCount     = 1
	AddrCount    = 1
		Master[0] => af=2, salen=16, [sub=0, flag=00000000] p=13568, addr=10.9.10.10

	Zone Secondaries 	NULL IP Array.
	secure secs           = 3
	directory partition   = AD-Forest     flags 00000019
	zone DN               = DC=cyber.local,cn=MicrosoftDNS,DC=ForestDnsZones,DC=m3c,DC=local
	forwarder timeout  = 3
	forwarder slave    = 1
Command completed successfully.
```

Look at Master[0] (10.9.10.10)

```

*Evil-WinRM* PS C:\Users\Administrator\Documents> ping 10.9.10.10

Pinging 10.9.10.10 with 32 bytes of data:
Reply from 10.9.10.10: bytes=32 time<1ms TTL=127
Reply from 10.9.10.10: bytes=32 time<1ms TTL=127
Reply from 10.9.10.10: bytes=32 time<1ms TTL=127
Reply from 10.9.10.10: bytes=32 time<1ms TTL=127

```

Next domain core.cyber.local:

```bash
*Evil-WinRM* PS C:\Users\Administrator\Documents> dnscmd /zoneinfo core.cyber.local

Zone query result:

Zone info:
	ptr                   = 0000015761E47320
	zone name             = core.cyber.local
	zone type             = 4
	shutdown              = 0
	paused                = 0
	update                = 0
	DS integrated         = 1
	read only zone        = 0
	in DS loading queue   = 0
	currently DS loading  = 0
	data file             = (null)
	using WINS            = 0
	using Nbstat          = 0
	aging                 = 0
	  refresh interval    = 0
	  no refresh          = 0
	  scavenge available  = 0
	Zone Masters
	Ptr          = 0000015761E477A0
	MaxCount     = 1
	AddrCount    = 1
		Master[0] => af=2, salen=16, [sub=0, flag=00000000] p=13568, addr=10.9.15.10

	Zone Secondaries 	NULL IP Array.
	secure secs           = 3
	directory partition   = AD-Forest     flags 00000019
	zone DN               = DC=core.cyber.local,cn=MicrosoftDNS,DC=ForestDnsZones,DC=m3c,DC=local
	forwarder timeout  = 5
	forwarder slave    = 0
Command completed successfully.
```

Summary:

```bash
get-dnsserverzone
dnscmd /zoneinfo cyber.local
dnscmd /zoneinfo core.cyber.local
```