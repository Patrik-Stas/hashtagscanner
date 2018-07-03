# HashTag daemon   
This automation will scan tags used on Instgram. It will start of list of prefixes, for example `[prague, food]` and using Instagram search API it will take a look at list of tag suggestions. So we will get something like `[prague5, prague2017, pragueIsAwesome]` for the `prague` keyword. After that, we will repeate the process for each of these to find out even more specific hashtags.

In database we will store:
```
{
    "tag": "prague"
    "scantime": "foo",
    "usecount": 4201337
}
```


# Use case
The db will be utilized by frontend app for tag reccomendation. Let's say you are someone drawing webtoons on instagram about relationships. You'll feed few general keywords to the app, maybe: relationship, cartoon, drawing, cute, funny, love. Second thing you'll put in is size of your instagram account / some sort of average engagement / average number of likes. Based off that you will get recomended list of tags prefixed by the keywords you specified. Additionally combinations of keywords could be explored.

In case the app gets requests, we can save up those unknown tags as prefixes to be scanned.

Requirement on DB is that I need to be able to quickly retrieve be any of the attributes 
- most commonly, the query will go along lines of "find 5 random records prefixed with `prague` having between `500000` - `200000` uses"

Simply indexing everything should be absolutely sufficient for starter.


#Tag discovery
Here's a thing. 
- For prefix `a` you'll get returned nothing from instagram API. 
- For prefix `my` you get `myjob` but not get `myjoy`, and nothing from `myj*` except for `myjob`. 
That'se because there's so many words prefixed with `my`, only `myjob` makes it out of `myjob`. Once we get deeper, 
to longer prefixes, like `myjob`, there's not as many hastags anymore - yet, we'll still miss some. For example `myjob` gets us `myjobdoesntsuck` but will not get us `myjobdoesnotsuck`.

Hence, it would make sense start of from set of roottags covering first two or three letter combinations `jo`, `ak`, `pre`. From this we get back some pretty major, widely used hashtags. 
Then we can expand our prefixes, but extracting prefixes from the found hashtags. So if we get `myjobisawesome`, we can try to explore its prefix `myjobi`. The question how deep we should keep doing this. The question is which of the tags should we use to extract a prefix. 

It makes sense to do minimal expansion on prefix based on hashtags having certain number of usages. 

We search `myjob` and get `[ myjobisgood:140000, myjobbis:300 ]`, it doesn't make sense it scan prefix `myjobb`, because obviously the the best hashtag prefixed `myjobb` is `myjobbis` with only 300 usages. 

But it makes sense to scan `myjobi`, because `myjobisgood` likely shadowed many tags prefixed with `myjobi`.

## New Prefix selection
How do we decide which prefixes should be added for future scanning?
Let `X` be set of tags returned from a query `q` for prefix `p` of length `l`. The size of `X` is `100`. Let `T` be threshold for prefix discovery. 

```
    Xt = set(select from X where use_count > T) // select tags with use count above threshold
    new_prefixes = create_new_prefixes(Xt) // create prefixes of length l+1
    // store these prefixes to some scanning queue
```

## Prefix selection for scanning
How do we decide which tag to scan next? Having initial root collection of prefixes to scan, like `ab`, `ba`, `pe`, etc. I would like to run scanner in style of BFS. First run through all these root prefixes, receive the most popular tags for these prefixes. 

Once this is done, and we scanned through all root prefixes, we need to generate new ones. We could simply start of by ordering discovered tags by usage, ignore tags below certain usage threshold. 

Given we started of 2 letter root prefixes and scanned them all, we will now generate 3 letter prefixes. Let's think about counts

```
1 letter prefixes - 27 
2 letter prefixes - 2^27 = 720 
3 letter prefixes - 2^3 = 20K
```

This is a lot of prefixes in theory - each prefix will represent one query for instagram API. However, using the prefix selection algorithm above, number of them really being scanned is reduced significantly.

Out of 720 2 letter prefixes, let's assume that there is 100 commonly used only - the three letter prefixe will hence be generated only out of 100 prefixes generate satisfying our threshold condition. That will reduce number of scanner 3 letter prefixes by magnite, resulting in abou 2K 3letter prefixes.

Naturally, out of these 2000 prefixes, many of them won't have words with enough usages to qualify as prefix for further generated 4 letter prefiexes.
 
## Hashtag rediscovery
We need to account for situations that we discover the same tag again, due to nature of prefix expansion algorithm. No special handling required, simply update number of tag uses.


#Tag database
The datastructure holding tags should be as simple ass possible, so that it's easy to enhance prefix scanning algorithm easily.

We need to make distinction between hashtags and prefixes. 

## Prefixes - "what to search"
Datastructure / DB collection storing prefixes used for tag search. We should remember when was a prefix scanned the last time, maybe length of the prefix (so we could easily an efficiently select / sort prefixes by length).
 
## HashTags - "what was found"
Datastructure / DB Collection storing hashtags and their use counts.  

## Special areas of interested
If we are interested to discover area of specific tags, say we quickly need to find out more about 60 tags related to drawings. We can simply add these words are unscanned prefixes and run scanner through them. We however need to assure that in this case, the scanner will be running only through these prefixes and new prefixes emerged out of them - not just fallback into whatever prefixes we already had in database.

To solve this, we can have set of root prefixes and can tell scanner which prefix category it should be using. Therefore duplicate prefixes can appear, accross 2 categories. We could have:

- root prefixes of latin alphabet
- root prefixes of love related words 

THe latin alphabet can eventually be expanded to prefixes which already exist in the love related prefix collection. To avoid inefficiencies, we could by default ignore categories and ignore found duplicities.

   