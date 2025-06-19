
If we see the following error, we need a Kerberos TGT:

```bash
garffff@garfffff~$ ssh M.SchoolBus@frizzdc.frizz.htb
M.SchoolBus@frizzdc.frizz.htb: Permission denied (gssapi-with-mic,keyboard-interactive).
```

- **`gssapi-with-mic`** — Kerberos auth (requires a valid TGT/ticket)
- **`keyboard-interactive`** — usually prompts for a password, but here it failed (no prompt or wrong creds)

Use `kinit` to log into a Kerberos realm by verifying your password and caching a ticket used for future authentication to services.

```bash
garffff@garfffff~$ kinit f.frizzle@FRIZZ.HTB
kinit: Cannot find KDC for realm "FRIZZ.HTB" while getting initial credentials
```

Update `/etc/krb5.conf`

```bash
[libdefaults]
	default_realm = FRIZZ.HTB
	dns_lookup_kdc = false
	dns_lookup_realm = false
[realms]
	FRIZZ.HTB = {
		kdc = 10.129.234.195
		default_domain = frizz.htb
	}
[domain_realm]
	.frizz.htb = FRIZZ.HTB
	frizz.htb = FRIZZ.HTB
```

Run `kinit` again and then `ssh`:

```bash
garffff@garffff:~$ kinit f.frizzle@FRIZZ.HTB
Password for f.frizzle@FRIZZ.HTB: 

garffff@garffff:~$ ssh f.frizzle@frizzdc.frizz.htb

PowerShell 7.4.5
PS C:\Users\f.frizzle>
```

Or get a `TGT` (Still need the `krb5.conf` configured)

```bash
garffff@garffff:~$ getTGT.py 'frizz.htb/M.SchoolBus:!suBcig@MehTed!R'
garffff@garffff:~$ export KRB5CCNAME=M.SchoolBus.ccache
garffff@garffff:~$ ssh M.SchoolBus@frizzdc.frizz.htb
```

