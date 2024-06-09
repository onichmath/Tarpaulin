status() {
    printf "\n=====================================================\n"
    printf "%s\n" "$1"
    printf -- "-----------------------------------------------------\n"
}

status 'GET all courses return success'
curl http://localhost:8000/courses