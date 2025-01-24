- **SOA (Start of Authority):** Contains information about the domain and the zone.
- **NS (Name Server):** Specifies authoritative DNS servers for the domain.
- **MX (Mail Exchange):** Specifies mail servers responsible for receiving email.
- **A (Address):** Maps a domain to an IPv4 address.
- **AAAA (IPv6 Address):** Maps a domain to an IPv6 address.
- **CNAME (Canonical Name):** Alias of one domain to another.
- **PTR (Pointer):** Used for reverse DNS lookups.
- **TXT (Text):** Holds text information, often used for various purposes like DMARC policies.
- **HINFO (Host Information):** Describes the type of CPU and operating system used by a host.
- **SRV (Service):** Specifies the location of services in the domain.

### Zone Transfer

Performs a DNS zone transfer for the specified domain from the primary DNS server, allowing the requester to obtain a copy of the entire DNS zone data for analysis or synchronisation purpose

```bash
dig axfr domain.com @primary_dns_server
```

### Queries and Responses

Command: `nslookup` or `dig`

`nslookup example.com`

or

```bash
dig example.com
```

### SOA (Start of Authority)

 ```bash
 dig example.com SOA
```

### NS (Name Server)

```bash
dig example.com NS
```

### MX (Mail Exchange)

```bash
dig example.com MX
```

### A (Address)

```bash
dig example.com A
```

### AAAA (IPv6 Address)

```bash
dig example.com AAAA
```
 
### CNAME (Canonical Name)

```bash
dig example.com CNAME
```
 
### PTR (Pointer)

 Replace `192.168.1.1` with the actual IP address.
 
```bash
dig -x 192.168.1.1
```
  
### TXT (including use in DMARC policies)

DMARC (Domain-based Message Authentication, Reporting, and Conformance) records can be retrieved similarly
  
```bash
dig example.com TXT
```

### HINFO (Host Information)

```bash
dig example.com HINFO
```
 
### Any

This will query all available DNS records

```bash
dig example.com ANY
```
 
 ### **SRV (Service):*
 
 Replace `_service._protocol.example.com` with the actual SRV record
 
```bash
dig _service._protocol.example.com SRV
```

### Subdomain Enumeration

```bash
dnsenum --enum inlanefreight.com -f /opt/SecLists/Discovery/DNS/subdomains-top1million-110000.txt

```

```bash
subfinder -d inlanefreight.com -v
```

```bash
python3 subbrute.py inlanefreight.htb -s ./names.txt -r ./resolvers.txt
```