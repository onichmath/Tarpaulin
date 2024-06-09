#

# Command to run API tests

newman run -e tarpaulin_environment.postman_environment.json tarpaulin_api_tests.postman_collection.json
