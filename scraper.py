#!/usr/bin/env python

import requests
import argparse
import json
import pyjq
import time 
from pymongo import MongoClient

def get_tag_counts(cookie, prefix):
	# PARAM_RANK_TOKEN="rank_token=0.003273674012821415"
	# PARAM_CONTEXT="context=blended"
	url="https://www.instagram.com/web/search/topsearch/?query=%23{prefix}".format(prefix=prefix)
	headers = {'cookie' : cookie,
			   'accept-encoding': 'gzip, deflate, br',
	          'accept-language': 'en-GB,en;q=0.9,en-US;q=0.8,cs;q=0.7',
	          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36',
	          'accept': '*/*',
	          'referer': 'https://www.instagram.com/explore/tags/prague/',
	          'authority': 'www.instagram.com',
	          'x-requested-with': 'XMLHttpRequest'}

	r = requests.get(url, headers = headers)
	tags = pyjq.first('[.hashtags[].hashtag | {name:.name, count:.media_count}]', r.json())
	return sorted(tags, key=lambda x: x["count"])

def scan_prefix(prefix, persist_function, cookie_header, depth, width=100000):
	###### // ----------  TODO: decide when to call persist_function() 
   time.sleep(5)
   tag_counts = get_tag_counts(cookie_header, prefix)[0:width]
   # print("SCANNED:{prefix}; found tags:{tags_found}, depth left:{depth}".format(prefix=prefix, tags_found=len(tag_counts) ,depth=depth))
   subtag_counts = []
   if (depth>0):
	   for tag_count in tag_counts:
	      persist_function(tag_count)
	      tag   = tag_count["name"]
	      count = tag_count["count"]
	      subtag_counts += scan_prefix(prefix=tag, persist_function=persist_function, cookie_header=cookie_header, depth=depth-1, width=width)
   else:
      print("Reached final depth, stopping this scan branch.")
   result = tag_counts+ subtag_counts
   return result

def prepare_parser():
    parser = argparse.ArgumentParser(description='Scanned tag prefix')
    parser.add_argument('--prefix',
                        help='Prefix of scanned tag.',
                        required=True)
    parser.add_argument('--cookieFile',
                        help='Path to file with Cookie header content',
                        required=True)
    return parser

def get_tags_from_db(db):
    return [ doc for doc in db.hashtag.find() ]

def persist_result_screen(tag_count):
	print("Persistance for:{tag_count}".format(tag_count=tag_count))

def persist_function_factory(db):
	def save_to_db(tag_count):
		print("Saving to DB:{tag_count}".format(tag_count=tag_count))
		db.hashtag.insert_one(tag_count)
	return save_to_db


words_to_scan=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","r","s","t","q","u","v","w","x","y","z"]
korean_words_to_scan=["것" ,"하다" ,"있다" ,"수" ,"하다" ,"나" ,"없다" ,"않다" ,"사람" ,"우리" ,"그" ,"거" ,"년" ,"한" 
,"말" ,"일" ,"이" ,"씨" ,"일" ,"안" ,"더" ,"집" ,"저" ,"속" ,"데" ,"앞" ,"중" ,"잘" ,"원" ,"명" ,"개" ,"다" ,"좀" ,"너" ,"눈" ,
"뭐" ,"점" ,"곳" ,"안" ,"위" ,"번" ,"돈" ,"날" ,"후" ,"몸" ,"왜" ,"물" ,"길" ,"뿐" ,"손" ,"몇" ,"삶" ,"시" ,"못" ,"책" ,"힘" ,"쪽" ,
"및" ,"글" ,"밖" ,"즉" ,"밤" ,"채" ,"아" ,"분" ,"곧" ,"방" ,"끝" ,"간" ,"듯" ,"입" ,"뭐" ,"줄" ,"밥" ,"네" ,"남" ,"적" ,"터" ,"술" ,
"맛" ,"꼭" ,"세" ,"차" ,"각" ,"바" ,"시" ,"옆" ,"어" ,"예" ,"저" ,"배" ,"내" ,"산" ,"새" ,"문" ,"꽃" ,"분" ,"불" ,"대" ,"옷" ,"전" ,
"꿈" ,"발" ,"살" ,"비" ,"법" ,"예" ,"달" ,"참" ,"잠" ,"면" ,"밑" ,"군" ,"팀" ,"첫" ,"약" ,"지" ,"쌀" ,"형" ,"늘" ,"전" ,"해" ,"회" ,
"말" ,"셈" ,"값" ,"만" ,"빛" ,"야" ,"선" ,"반" ,"귀" ,"놈" ,"배" ,"술" ,"자" ,"잔" ,"외" ,"수" ,"배" ,"층" ,"장" ,"반" ,"편" ,"팔" ,
"차" ,"세" ,"봄" ,"공" ,"과" ,"미" ,"숲" ,"한" ,"이" ,"골" ,"새" ,"응" ,"달" ,"키"]


# ----------------------------------------------- SCRIPT -----------------------------------
depth_to_scan=1
width_to_scan=100000

args = vars(prepare_parser().parse_args())
prefix = args['prefix']
cookie_file = args['cookieFile']

# cookie data load
myfile =  open (cookie_file, "r");
cookie_data = myfile.read()

# mongo connection
client = MongoClient("mongodb://localhost:27017")
db = client["HASHTAG"]

tags_counts=scan_prefix(prefix, persist_function=persist_function_factory(db), cookie_header=cookie_data, depth=depth_to_scan, width=width_to_scan)

# tags = get_tags_from_db(db)
# for tag in tags:
# 	print(tag)


# print(json.dumps(tags_pyjqed))





