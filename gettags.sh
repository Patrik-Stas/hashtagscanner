#!/bin/bash

HASHTAG_PREFIX=$1
PARAM_QUERY="query=%23$HASHTAG_PREFIX"
PARAM_RANK_TOKEN="rank_token=0.003273674012821415"
PARAM_CONTEXT="context=blended"

HEADER_COOKIE='mid=WYDgowAEAAEDfm7s7kDfIhnY0OxG; sessionid=IGSC45e4fdecfbbb5eb835e301e40b2dc241f92eb0bbaccc95be8b978b004041ff82%3AsMgMlUENDMYx4aqNHrbwLtoR12R0h6E1%3A%7B%22_auth_user_id%22%3A6458925113%2C%22_auth_user_backend%22%3A%22accounts.backends.CaseInsensitiveModelBackend%22%2C%22_auth_user_hash%22%3A%22%22%2C%22_token_ver%22%3A2%2C%22_token%22%3A%226458925113%3AMbTkRA959zHzW2kyBKvizRut05eofs26%3Ab7500f095faada832e814600608e7cdd2c3eb27b825b43a1923f2248bec3bd55%22%2C%22_platform%22%3A4%2C%22last_refreshed%22%3A1510946111.3530199528%7D; ig_or=landscape-primary; ig_vw=1435; ig_pr=2; ig_vh=760; fbm_124024574287414=base_domain=.instagram.com; fbsr_124024574287414=ZT7ehTff3utZvb6_bU14DESbrH0GcHqQrdD9ZUaHSjY.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUJBRzY2dVVnY19JSUg5bEZoeGF0Z3owMnN6aXdGXzlPZE41MDBqbVVCNWNPOFFKM1ZQZGdLeTJrRTkzZnJjM1h1b2dSU3EyVFJlZmFJbFFYZlIxRjYwUm44WWtJT3pPN3pYcEJrakQyZ1o2SXhSaUdidHNFYm56NkpKcGg1Yk1nRVpSd0ZyUUoyUl82UFFsam1FV1didl92T0ZtNlFGNXQ1eWoxdUZiVlpZdUVSWVh2LUpZZnpmZTNDbEZ2Q053NnNTQl9PTm1yVFJRd1VlQWhPVUJDVHgtM2U5YzlDYkJVbEFibDZFek9lM2pxamlYYlE3VVpIdVFURmxOLUI1MFlWTmZQQ1B0TVNqc0ZaQzRmVVUwZlpOZVc5cU85MlI4NFlQNGxqTEkwd3JHTDJBSmZuR2ZHT3pkaERZUG0xS3FudEtTcHRRVGdFVk9tVHBQMmtXVV9CUCIsImlzc3VlZF9hdCI6MTUxMTAwMTIzMiwidXNlcl9pZCI6IjE0MDM3Nzk3NTIifQ; csrftoken=ghFGuCey3AKFYJ7qXRePMuine5FafNK7; rur=ATN; ds_user_id=6458925113; urlgen="{\"time\": 1510927107\054 \"193.179.63.191\": 5588}:1eG0Rv:tsRMqRmsH53LiCOHQ0j0gkp7EEs"'
HEADER_ACCEPT_LANGUAGE='accept-language: en-GB,en;q=0.9,en-US;q=0.8,cs;q=0.7'
HEADER_REFERER='referer: https://www.instagram.com/explore/tags/prague/'


curl "https://www.instagram.com/web/search/topsearch/?$PARAM_QUERY"  \
-H "cookie: $HEADER_COOKIE" \
-H 'accept-encoding: gzip, deflate, br' \
-H "$HEADER_ACCEPT_LANGUAGE" \
-H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36' \
-H 'accept: */*' \
-H "$HEADER_REFERER" \
-H 'authority: www.instagram.com' \
-H 'x-requested-with: XMLHttpRequest' \
--compressed