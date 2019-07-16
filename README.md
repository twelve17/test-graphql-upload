# test-graphql-upload

A small project to explore the [graphql-upload](https://github.com/jaydenseric/graphql-upload) mechanics in action.

It runs two servers:

1. An [Apollo GraphQL server](https://github.com/apollographql/apollo-server) configured with a single mutation that accepts two `Upload` types, named `file1`, and `file2`.
2. An [express](http://expressjs.com/) server configured with a single route, `POST /upload`, that accepts a multipart form file upload (via [formidable](https://github.com/felixge/node-formidable)).

The mutation in #1 uploads each file, via a [`request-promise-native` client](https://github.com/request/request-promise-native), to #2.

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
