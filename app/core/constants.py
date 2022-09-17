SHOPIFY_CLIENT_ID = 'f158a0d96fe3f87d2746945b8e195d9d'
SHOPIFY_CLIENT_SECRET = '0fe5ff8fd9369754330db5cc1700819f'

get_access_token_url = "/admin/oauth/access_token"
get_all_products_url = "/admin/products.json"

API2CART_DOMAIN = 'https://api.api2cart.com'
VALIDATE_CART_API = '/v1.0/cart.validate.json'
CREATE_CART_API = '/v1.1/cart.create.json'
RETRIVE_PRODUCT_LIST_API = '/v1.0/product.list.json'
STORE_PRODUCT_COUNT = '/v1.0/product.count.json'
CATEGORY_INFO = '/v1.0/category.info.json'
API2CART_API_KEY = 'f238ce1dcd8ca6fd590c568941fe113f'
API2CART_SUCCESS = 'Connection Successful'
API2CART_FAILED = 'Connection Unsuccessful'
UPDATE_CREDS_SUCCESS = 'Updation Successful'
UPDATE_CREDS_FAILED = 'Updation Unsuccessful'

product_search = """{
    "from" : %d, "size" : %d,
    "query": {
        "bool": {
            "must": [{
                "multi_match": {
                    "query": "%s",
                    "fields": ["name.name_search","manufacturer.manufacturer_search","SKU","UPCType"],
                    "operator" : "and"
                }
            }]
        }
    },
    "suggest": {
        "text": "%s",
        "simple_phrase" : {
            "phrase" : {
                "field" : "name.name_phrsuggest_trigram",
                "size" : 3,
                "direct_generator" : [ {
                    "field" : "name.name_phrsuggest_trigram",
                    "suggest_mode" : "always",
                    "min_word_length" :  1
                } ],
                "collate": {
                    "query": {
                        "inline" : {
                            "match": {
                                "{{field_name}}" : "{{suggestion}}"
                            }
                        }
                    },
                    "params": {"field_name" : "name"},
                    "prune": true
                }
            }
        },
        "autocomplete": {
            "prefix": "%s",
            "completion": {
                "field": "name.name_suggest"
            }
        }
    }
}"""

product_search_by_category = """{
    "from" : %d, "size" : %d,
    "query": {
        "bool": {
            "must": [{
                "multi_match": {
                    "query": "%s",
                    "fields": ["category.category_search"],
                    "operator" : "and"
                }
            }]
        }
    }
}"""

product_search_by_manufacturer = """{
    "from" : %d, "size" : %d,
    "query": {
        "bool": {
            "must": [{
                "multi_match": {
                    "query": "%s",
                    "fields": ["manufacturer.manufacturer_search"],
                    "operator" : "and"
                }
            }]
        }
    }
}"""

product_search_by_price_range = """{
    "from" : %d, "size" : %d,
    "query": {
        "range" : {
            "price" : {
                "gte" : %d,
                "lte" : %d
            }
        }
    }
}"""

product_search_by_category_and_manufacturer = """{
    "size":0,
    "aggs" : {
        "category" : {
            "terms" : { "field" : "category.category_raw"}
        },
        "manufacturer" : {
            "terms" : { "field" : "manufacturer.manufacturer_raw",
            "size":50
            }
        }
    }
}"""
