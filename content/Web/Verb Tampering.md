
This command may tell us what HTTP Verbs are allowed to the website:

```bash
curl -i -X OPTIONS http://x.x.x.x/
```

We may see something like this:

```bash
Allow: POST,OPTIONS,HEAD,GET
```

Assuming GET/POST or being blocked, and we want to perform a GET on a request, changing the verb method from GET or HEAD may achieve the goal

```bash
curl -X HEAD http://x.x.x.x/
curl --head http://x.x.x.x/
```

| Verb      | Description                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------- |
| `GET`     | Retrieves data from the specified location                                                          |
| `POST`    | Submits data to the server, often resulting in a new resource being created                         |
| `HEAD`    | Identical to a GET request, but its response only contains the `headers`, without the response body |
| `PUT`     | Writes the request payload to the specified location                                                |
| `DELETE`  | Deletes the resource at the specified location                                                      |
| `OPTIONS` | Shows different options accepted by a web server, like accepted HTTP verbs                          |
| `PATCH`   | Apply partial modifications to the resource at the specified location                               |
