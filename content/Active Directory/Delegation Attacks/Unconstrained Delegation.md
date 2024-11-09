**Unconstrained Delegation** is a configuration in Active Directory environments where a service account can impersonate users to access other services. It works by allowing the service to obtain and use the Kerberos tickets (TGTs—Ticket Granting Tickets) of users who authenticate to it, enabling potential unauthorised access to network resources.


Use the following Bloodhound query:

```bash
MATCH (c {unconstraineddelegation:true}) return c
```

![[Pasted image 20241109150926.png]]

or 

```bash
findDelegation.py NORTH.SEVENKINGDOMS.LOCAL/arya.stark:Needle -target-domain north.sevenkingdoms.local
```

- sansa.stark@north.sevenkingdoms.local:345ertdfg
![[Pasted image 20241109151143.png]]

The attack

From a compromised windows machine:

