curl http://localhost:4000/graphql \
  -F operations='{ "query": "mutation($file1: Upload!, $file2: Upload!) { uploadFiles(file1:$file1, file2:$file2) }", "variables": { "file1": null, "file2": null } }' \
  -F map='{ "0": ["variables.file1"], "1": ["variables.file2"] }' \
  -F 0=@file1.jpg \
  -F 1=@file2.jpg
