## Usage

### Install Deps

```
npm i
```

### Configure Upload Files

Put two jpg files of your choosing, they must live in the top folder of the project, and be called `file1.jpg` and `file2.jpg`. Symlinks are ok:

```
$ ls -l
total 7696
-rw-r--r--@   1 meh   staff  2616780 Jul 13 18:29 file1.jpg
lrwxr-xr-x    1 meh   staff        9 Jul 16 12:21 file2.jpg -> file1.jpg
```

### Run Servers

```
npm run start
```

Set alternate upload server timeout (in ms, [defaults to 120000](https://nodejs.org/api/http.html#http_server_settimeout_msecs_callback))

```
UPLOAD_SERVER_TIMEOUT=1 npm run start
```

### Run GraphQL Mutation Script (requires curl)

This will run a mutation that includes uploading of the two files.

```
./bin/upload-files.sh
```
